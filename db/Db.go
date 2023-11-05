package db

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Db () *mongo.Client {

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017/first-go"))

	if err != nil {
		panic(err)
	}

	return client

}
