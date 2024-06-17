package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)



func main() {
	flag.Parse()
	codeHub := newHub()
	r := mux.NewRouter()
	go codeHub.run()

  r.HandleFunc("/code/{roomId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		serveWs(codeHub, w, r, vars["roomId"])
	})

	var addr = flag.String("addr", ":8080", "http service address")
	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}