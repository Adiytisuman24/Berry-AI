package events

import (
	"context"
	"log/slog"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisBus struct {
	Client *redis.Client
}

func ConnectRedis() (*RedisBus, error) {
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379"
	}

	opts, err := redis.ParseURL(redisURL)
	var client *redis.Client
	if err != nil {
		client = redis.NewClient(&redis.Options{
			Addr:        redisURL,
			DialTimeout: 3 * time.Second,
		})
	} else {
		client = redis.NewClient(opts)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		slog.Warn("Could not connect to Redis, operating in local event mode", "error", err)
		return nil, err
	}

	slog.Info("Connected to Redis server for real-time Pub/Sub")
	return &RedisBus{Client: client}, nil
}

func (r *RedisBus) Publish(ctx context.Context, channel string, message string) error {
	if r == nil || r.Client == nil {
		return nil
	}
	return r.Client.Publish(ctx, channel, message).Err()
}

func (r *RedisBus) Subscribe(ctx context.Context, channel string) *redis.PubSub {
	if r == nil || r.Client == nil {
		return nil
	}
	return r.Client.Subscribe(ctx, channel)
}
