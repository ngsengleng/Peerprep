package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	hub := newHub()
	r := mux.NewRouter();
	go hub.run()
  r.HandleFunc("/ws/{roomId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		fmt.Println("roomId: ", vars["roomId"])
		serveWs(hub, w, r)
	})

	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}