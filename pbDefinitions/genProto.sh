if ! [ -d ./token_services ]; then
  mkdir token_services
fi

DEST="./token_services"
eval "protoc --go_out=$DEST --go_opt=paths=source_relative \
    --go-grpc_out=$DEST --go-grpc_opt=paths=source_relative \
    token_services.proto"