package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	hub := newHub()
	r := mux.NewRouter()
	go hub.run()
  r.HandleFunc("/{roomId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		serveWs(hub, w, r, vars["roomId"])
	})

	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}