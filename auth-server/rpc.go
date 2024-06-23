package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	pb "github.com/ngsengleng/PeerPrep/pbDefinitions/token_services"
	"google.golang.org/grpc"
)

var port = flag.Int("port", 50051, "The server port")
type server struct {
	pb.UnimplementedTokenServicesServer
}

func (s *server) VerifyToken(ctx context.Context, in *pb.VerifyRequest) (*pb.VerifyReply, error) {
	isValidToken := ValidToken(in.GetToken())
	return &pb.VerifyReply{
		IsValid: isValidToken,
	}, nil
}

func NewRpcServer() {
	flag.Parse()
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen on auth server: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterTokenServicesServer(s, &server{})
	log.Printf("server listening on %v", listener.Addr())
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	defer listener.Close()
	defer s.GracefulStop()
}

