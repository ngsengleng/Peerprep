package main

import (
	"context"
	"flag"
	"log"
	"time"

	pb "github.com/ngsengleng/PeerPrep/pbDefinitions/token_services"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var addr = flag.String("rpc", "localhost:50051", "connection address")

func ValidateJwtToken(token string) bool {
	flag.Parse()
	conn, err := grpc.NewClient(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewTokenServicesClient(conn)
	// Contact the server and print out its response.
	ctx, cancel := context.WithTimeout(context.Background(), time.Second * 10)
	defer cancel()
	r, err := c.VerifyToken(ctx, &pb.VerifyRequest{
		Token: token,
	})
	if err != nil {
		log.Fatalf("could not verify: %v", err)
	} else {
		log.Println("success")
	}
	return r.GetIsValid()
}