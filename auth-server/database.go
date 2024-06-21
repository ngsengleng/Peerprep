package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserTableEntry struct {
	username string `db:"username"`
	password string `db:"password"`
	token string `db:"sessiontoken"`
}

type Database struct  {
	conn *pgxpool.Pool
}

func newDatabaseConn(connString string) *Database {
	conn, err := pgxpool.New(context.Background(), connString)
	
	if err != nil {
		log.Printf("Error occurred in database init: %v", err)
		return nil
	}

	return &Database{conn: conn}
}

func (db *Database) getUser(user UserTableEntry) UserTableEntry {
	query := "SELECT * FROM users WHERE username=$1"
	res := db.conn.QueryRow(context.Background(), query, user.username)
	row := UserTableEntry{}
	err := res.Scan(&row.username, &row.password, &row.token)
	if err == pgx.ErrNoRows {
		return row
	}
	if err != nil {
		log.Printf("error when querying users: %v", err)
		return UserTableEntry{}
	}
	return row
}

func (db *Database) insertUser(user UserTableEntry) (ErrorCode, error) {
	// TODO: encrypt password before inserting into db
	args := pgx.NamedArgs{
		"username": user.username,
		"password": user.password,
		"sessiontoken": user.token,
	}
	row := db.getUser(user)
	if row != (UserTableEntry{}) {
		return USER_EXISTS, fmt.Errorf("user already exists")
	}
	
	query := "INSERT INTO users (username, password, sessiontoken) VALUES (@username, @password, @sessiontoken)"
	_, err := db.conn.Exec(context.Background(), query, args)
	if err != nil {
		log.Printf("Error inserting user into table: %v", err)
		return UNKNOWN, err
	}
	return -1, nil
}

