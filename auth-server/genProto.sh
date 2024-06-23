cd ../pbDefinitions

DEST="../auth-server/tokenverifier"
eval "protoc --go_out=$DEST --go_opt=paths=source_relative \
    --go-grpc_out=$DEST --go-grpc_opt=paths=source_relative \
    tokenverifier.proto"

cd ../auth-server && go mod tidy