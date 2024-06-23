package main

import (
	"flag"
	"fmt"
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
		if cookie, _ := r.Cookie("jwtTokenAuth"); cookie == nil {
			fmt.Println("failed")
		} else {
			fmt.Println(cookie.Value)
		}
		serveWs(codeHub, w, r, vars["roomId"])
	})

	var addr = flag.String("addr", ":8080", "http service address")
	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}