package main

import (
	"encoding/json"
	"fmt"
	"log"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[string]map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan ClientMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan ClientMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			if _, ok := h.clients[client.roomId]; !ok {
				h.clients[client.roomId] = make(map[*Client]bool)
			}
			h.clients[client.roomId][client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client.roomId]; ok {
				delete(h.clients[client.roomId], client)
				for other := range h.clients[client.roomId] {
					chatObj := ChatObject{
						Username: client.userId, 
						Text: fmt.Sprintf("%v has left", client.userId),
					}
					disconnectEvent := Event{EventName: "message", Data: chatObj}
					msgObj, err := json.Marshal(disconnectEvent)
					if err != nil {
						log.Printf("error while marshalling disconnect, %v", err)
						continue
					}
					other.send <- msgObj
				}
			}
			// empty room, should delete
			if len(h.clients[client.roomId]) == 0 {
				delete(h.clients, client.roomId)
			}
		case message := <-h.broadcast:
		log.Println(len(h.clients[message.client.roomId]))
			for client := range h.clients[message.client.roomId] {
				if client.isEqual(&message.client) {
					continue;
				}
				select {
				case client.send <- message.message:
				default:
					close(client.send)
					delete(h.clients[client.roomId], client)
				}
			}
		}
	}
}