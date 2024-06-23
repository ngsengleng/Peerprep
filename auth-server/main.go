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
	connString := os.Getenv("DB_URL")
	db := newDatabaseConn(connString)
	if db == nil {
		log.Fatalf("Error: connection to db failed")
	}

	router := mux.NewRouter()

	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		LoginHandler(w, r, *db)
	})

	router.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		SignupHandler(w, r, *db)
	})

	dev_url := os.Getenv("DEV_ORIGIN")
	c := cors.New(cors.Options{
			AllowedOrigins: []string{dev_url},
			AllowCredentials: true,
	})

	err := http.ListenAndServe(":8082", c.Handler(router))
	if err != nil {
			log.Printf("Error while serving: %v", err)
	}
	defer db.conn.Close()
}