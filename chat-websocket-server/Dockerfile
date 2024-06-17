FROM golang:1.22

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /

EXPOSE 8080

CMD ["go", "run", "."]