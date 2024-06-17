package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)



func main() {
	flag.Parse()
	chatHub := newHub()
	r := mux.NewRouter()
	go chatHub.run()

  r.HandleFunc("/chat/{roomId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		serveWs(chatHub, w, r, vars["roomId"])
	})

	var addr = flag.String("addr", ":8081", "http service address")
	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}