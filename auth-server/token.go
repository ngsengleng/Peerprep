package main

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type UserClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func CreateToken(username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
		UserClaims{
			Username: username,
			StandardClaims: jwt.StandardClaims{
				IssuedAt: time.Now().Unix(),
				ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // 24 hour expiry for token
			},
		},
	)
	key := []byte(os.Getenv("JWT_KEY"))
	tokenString, err := token.SignedString(key)
	if err != nil {
    return "", err
	}

 return tokenString, nil
}

func ValidToken(token string) bool {
	parsedAccessToken, err := jwt.ParseWithClaims(token, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_KEY")), nil
 	})
	if err != nil {
		log.Printf("error in validating jwt token: %v", err)
		return false
	}
	
	
	return parsedAccessToken.Claims.Valid() == nil
}