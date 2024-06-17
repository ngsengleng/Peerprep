package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	// websocket room to connect to
	roomId string

	// user identifier
	userId string
}

type ClientMessage struct {
	message []byte

	client Client
}

type ChatObject struct {
	Username string `json:"username"`
	Text string     `json:"text"`
}

type Event struct {
	EventName string  `json:"eventName"`
	Data ChatObject   `json:"data"`
}

func (c *Client) isEqual(other *Client) bool {
	return c.send == other.send;
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		messageType, message, err := c.conn.ReadMessage()
		switch messageType {
		case -1:
			log.Println("connection closed")
			return
		case websocket.BinaryMessage:
			log.Println("binary message received")
		case websocket.TextMessage:
			log.Println("text message received")
			if c.userId != "" {
				break
			}
			val := Event{}
			json.Unmarshal(message, &val)
			c.userId = val.Data.Username
			
		}

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error while reading: %v", err)
			}
			break
		}
		
		roomMessage := ClientMessage{message: message, client: *c}
		c.hub.broadcast <- roomMessage
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			
			if err != nil {
				log.Printf("error while writing: %v", err)
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request, roomId string) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("error while upgrading: %v", err)
		return
	}
	log.Println("successful connection on chat server")
	
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), roomId: roomId}
	client.hub.register <- client

	go client.writePump()
	go client.readPump()
}