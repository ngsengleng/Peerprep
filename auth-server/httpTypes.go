package main

type ErrorCode = int64
const (
	UNKNOWN ErrorCode = iota
	BAD_JSON
	USER_EXISTS
	USER_DOES_NOT_EXIST
	INCORRECT_PASSWORD
	TOKEN_EXPIRED
)

type LoginBody struct {
	Username string  `json:"username"`
	Password string   `json:"password"`
}

type LoginResp struct {
	LoginSuccess bool `json:"loginSuccess"`
	Username string `json:"username"`
	ErrorCode ErrorCode `json:"errorCode"`
}

type SignupBody struct {
	Username string  `json:"username"`
	Password string   `json:"password"`
}

type SignupResp struct {
	SignupSuccess bool `json:"signupSuccess"`
	Username string `json:"username"`
	ErrorCode ErrorCode `json:"errorCode"`
}

type ErrorResp struct {
	ErrorCode ErrorCode `json:"errorCode"`
	ErrorMesage string `json:"errorMessage"`
}

