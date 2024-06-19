package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	godotenv.Load() // loads the env file
	router := mux.NewRouter()

	router.HandleFunc("/login", LoginHandler)

	router.HandleFunc("/signup", SignupHandler)

	dev_url := os.Getenv("DEV_ORIGIN")
	c := cors.New(cors.Options{
			AllowedOrigins: []string{dev_url},
			AllowCredentials: true,
	})

	err := http.ListenAndServe(":8082", c.Handler(router))
	if err != nil {
			log.Printf("Error while serving: %v", err)
	}
}