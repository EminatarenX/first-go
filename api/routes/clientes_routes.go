package routes

import (
	"github.com/gofiber/fiber/v2"
	"api-auth/api/controllers"
	
)


func ClientesRouter( app *fiber.App){
	client := app.Group("/api/clientes")
	client.Get("/", controllers.GetClientes)
	client.Post("/", controllers.CreateCliente)
	client.Get("/:id", controllers.GetCliente)
}