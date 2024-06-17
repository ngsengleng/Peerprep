package main

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

func createToken(username string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{ 
        "username": username, 
        "exp": time.Now().Add(time.Hour * 24).Unix(), 
        })
		key := []byte(os.Getenv("JWT_KEY"))
    tokenString, err := token.SignedString(key)
    if err != nil {
    return "", err
    }

 return tokenString, nil
}