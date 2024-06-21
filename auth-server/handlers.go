package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func LoginHandler(w http.ResponseWriter, r *http.Request, db Database) {
	var body LoginBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Printf("Error with decoding json in /login: %v", err)
		ErrorHandler(w, http.StatusBadRequest, BAD_JSON, err.Error())
		return
	}
	user := db.getUser(UserTableEntry{
		username: body.Username,
		password: body.Password,
	})
	if user == (UserTableEntry{}) {
		// log.Printf("login: user does not exist: %v", body.Username)
		json.NewEncoder(w).Encode(LoginResp{
			LoginSuccess: false, 
			ErrorCode: USER_DOES_NOT_EXIST,
		})
		return
	}
	if user.password != body.Password {
		// log.Printf("login: incorrect password: %v", body.Password)
		json.NewEncoder(w).Encode(LoginResp{
			LoginSuccess: false, 
			ErrorCode: INCORRECT_PASSWORD,
		})
		return
	}
	token, err := createToken(body.Username)
	if err != nil {
		log.Printf("login: error creating auth token: %v", err)
		ErrorHandler(w, http.StatusInternalServerError, UNKNOWN, err.Error())
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

func SignupHandler(w http.ResponseWriter, r *http.Request, db Database) {
	var body SignupBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		log.Printf("Error with decoding json in /signup: %v", err)
		ErrorHandler(w, http.StatusBadRequest, BAD_JSON, "bad json")
		return
	}
	token, err := createToken(body.Username)
	if err != nil {
		log.Printf("signup: error creating auth token: %v", err)
		ErrorHandler(w, http.StatusInternalServerError, UNKNOWN, "internal server error")
		return
	}
	statusCode, err := db.insertUser(UserTableEntry{
		username: body.Username,
		password: body.Password,
		token: token,
	})
	switch (statusCode) {
		case UNKNOWN:
		log.Printf("signup: unknown error when inserting user: %v", err)
		ErrorHandler(w, http.StatusInternalServerError, statusCode, err.Error())
		return
		case USER_EXISTS:
		// log.Printf("signup: user already exists: %v", err)
		json.NewEncoder(w).Encode(SignupResp{
			SignupSuccess: false, 
			ErrorCode: USER_EXISTS,
		})
		return
		default:
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

func ErrorHandler(w http.ResponseWriter, httpCode int, errorCode ErrorCode, errorMessage string) {
	respObj, err := json.Marshal(SignupErrorResp{ErrorCode: errorCode, ErrorMesage: errorMessage})
	if err != nil {
		log.Printf("error marshalling error resp: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Error(w, string(respObj), httpCode)
}