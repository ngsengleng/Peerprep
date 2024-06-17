package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type LoginBody struct {
	Username string  `json:"username"`
	Password string   `json:"password"`
}

type LoginResp struct {
	LoginSuccess bool `json:"loginSuccess"`
	Username string `json:"username"`
}

func main() {
		router := mux.NewRouter();
		
		router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
			var body LoginBody
			err := json.NewDecoder(r.Body).Decode(&body)
			if err != nil {
					log.Printf("Error with decoding json in /login: %v", err)
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
			}
			fmt.Println(body.Password)
			token, err := createToken(body.Username)
			if err != nil {
				log.Printf("error creating token: %v", err)
				http.Error(w, "login could not be processes", http.StatusInternalServerError)
				return
			}
			cookie := http.Cookie{
				Name: "jwtTokenAuth",
				Value: token,
				Secure: true,
				HttpOnly: true,
				SameSite: http.SameSiteStrictMode,
			}
			http.SetCookie(w, &cookie)
			json.NewEncoder(w).Encode(LoginResp{LoginSuccess: true, Username: body.Username})
		})

		c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:5173"},
        AllowCredentials: true,
    })

		err := http.ListenAndServe(":8082", c.Handler(router))
		if err != nil {
			log.Printf("Error while serving: %v", err)
		}
}