package controllers

import (
	"github.com/gofiber/fiber/v2"
	"api-auth/db"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetClientes(c *fiber.Ctx) error{

	pool := db.Db().Database("first-go").Collection("clientes")

	cursor, err := pool.Find(context.Background(), bson.D{})

	if err != nil {
		panic(err)
	}

	var clientes []bson.M
	if err = cursor.All(context.Background(), &clientes); err != nil {
		panic(err)
	}
	
	return c.JSON(&fiber.Map{
		"data" : clientes,
	})

}

func CreateCliente(c *fiber.Ctx) error{

	cliente := struct {
		Name string `json:"name"`
		Email string `json:"email"`
	}{}
	c.BodyParser(&cliente)

	pool := db.Db().Database("first-go").Collection("clientes")

	// Insert a single document
	
	result, err := pool.InsertOne(context.TODO(), bson.D{
		{"name", cliente.Name},
		{"email", cliente.Email},
	})

	if err != nil {
		panic(err)
	}



	var insertedDocument map[string]interface{}

	err = pool.FindOne(context.TODO(), bson.M{"_id": result.InsertedID}).Decode(&insertedDocument)
	if err != nil {
    panic(err)
}

// Devuelve el documento insertado en la respuesta JSON
	return c.JSON(&fiber.Map{
    	"data": insertedDocument,
	})

}

func GetCliente(c *fiber.Ctx) error{
	
	pool := db.Db().Database("first-go").Collection("clientes")

	id, err := primitive.ObjectIDFromHex(c.Params("id"))

	if err != nil {
		panic(err)
	}

	var cliente map[string]interface{}

	err = pool.FindOne(context.Background(), bson.M{"_id": id}).Decode(&cliente)

	if err != nil {
		panic(err)
	}

	return c.JSON(&fiber.Map{
		"data" : cliente,
	})
}

func DeleteClient(c *fiber.Ctx) error {

	pool := db.Db().Database("first-go").Collection("clientes")

	id, err := primitive.ObjectIDFromHex(c.Params("id")) 

	if err != nil {
		panic(err)
	}

	_, err = pool.DeleteOne(context.Background(), bson.M{"_id": id})

	if err != nil {
		panic(err)
	}

	return c.JSON(&fiber.Map{
		"message" : "Cliente eliminado",
	})
	
}

func UpdateClient ( c *fiber.Ctx) error {

	pool := db.Db().Database("first-go").Collection("clientes")

	idParams := c.Params("id")
	if len(idParams) != 24 {
		return c.Status(400).JSON(&fiber.Map{
			"message" : "El id no es valido",
		})
	
	}

	id, err := primitive.ObjectIDFromHex(c.Params("id")) 

	if err != nil {
		panic(err)
	}

	cliente := struct {
		Name string `json:"name"`
		Email string `json:"email"`
	}{}
	c.BodyParser(&cliente)

	_, err = pool.UpdateOne(context.Background(), bson.M{"_id": id}, bson.D{
		{"$set", bson.D{
			{"name", cliente.Name},
			{"email", cliente.Email},
		}},
	})

	if err != nil {
		
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(&fiber.Map{
				"message" : "Cliente no encontrado",
			})

		}else {
			return c.Status(500).JSON(&fiber.Map{
				"message" : "Error al actualizar el cliente",
				"error" : err,
			})
	
		}
	}

	return c.JSON(&fiber.Map{
		"message" : "Cliente actualizado",
		"data" : cliente,
	})
}