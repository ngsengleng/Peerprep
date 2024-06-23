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
	chatHub := newHub()
	r := mux.NewRouter()
	go chatHub.run()

  r.HandleFunc("/chat/{roomId}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		cookie, err := r.Cookie("jwtTokenAuth")
		if err != nil {
			log.Printf("could not retrieve cookie")
		}
		if cookie == nil {
			log.Printf("no cookie was found, guest user") // do something about guest users?
		} else {
			if !ValidateJwtToken(cookie.Value) {
				fmt.Printf("invalid token")
				http.Error(w, "unauthorized or session expired", http.StatusUnauthorized)
				return
			}
		}
		serveWs(chatHub, w, r, vars["roomId"])
	})

	var addr = flag.String("addr", ":8081", "http service address")
	err := http.ListenAndServe(*addr, r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}