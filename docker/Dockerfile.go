FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY services/go-gateway/go.mod services/go-gateway/go.sum ./
RUN go mod download
COPY services/go-gateway/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/berry-gateway ./cmd/server

FROM alpine:3.19
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /bin/berry-gateway /app/berry-gateway
EXPOSE 8080
ENTRYPOINT ["/app/berry-gateway"]
