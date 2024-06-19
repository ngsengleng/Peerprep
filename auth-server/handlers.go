package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type LoginBody struct {
	Username string  `json:"username"`
	Password string   `json:"password"`
}

type LoginResp struct {
	LoginSuccess bool `json:"loginSuccess"`
	Username string `json:"username"`
}

type SignupBody struct {
	Username string  `json:"username"`
	Password string   `json:"password"`
}

type SignupResp struct {
	SignupSuccess bool `json:"signupSuccess"`
	Username string `json:"username"`
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var body LoginBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
					log.Printf("Error with decoding json in /login: %v", err)
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
	}
	token, err := createToken(body.Username)
	if err != nil {
			log.Printf("error creating auth token: %v", err)
			http.Error(w, "login could not be processed", http.StatusInternalServerError)
			return
	}
	cookie := http.Cookie{
			Name: os.Getenv("JWT_COOKIE_KEY"),
			Value: token,
			Secure: true,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)
	json.NewEncoder(w).Encode(LoginResp{LoginSuccess: true, Username: body.Username})
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var body SignupBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
					log.Printf("Error with decoding json in /signup: %v", err)
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
	}
	token, err := createToken(body.Username)
	if err != nil {
			log.Printf("error creating auth token: %v", err)
			http.Error(w, "signup could not be processed", http.StatusInternalServerError)
			return
	}
	cookie := http.Cookie{
			Name: os.Getenv("JWT_COOKIE_KEY"),
			Value: token,
			Secure: true,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)
	json.NewEncoder(w).Encode(SignupResp{SignupSuccess: true, Username: body.Username})
}