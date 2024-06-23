cd ../pbDefinitions

eval "protoc --go_out=../auth-server/pb --go_opt=paths=source_relative \
    --go-grpc_out=../auth-server/pb --go-grpc_opt=paths=source_relative \
    tokenverifier.proto"

cd ../auth-server && go mod tidy