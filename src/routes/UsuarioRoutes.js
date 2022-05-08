const express = require("express");
const controlador = require("../controllers/InicioController");
var api = express.Router();

const autenticacion = require("../middlewares/verificacion");

//Inicio
api.post("/login", controlador.Login);
api.post("/registro", controlador.Registro);

//Usuario Controller
const controller = require("../controllers/UsuarioController");
api.get("/verAdmins", autenticacion.Auth, controller.VerAdmins)
api.get("/verUsers", autenticacion.Auth, controller.VerUsuarios);

api.post("/agregarUsuario", autenticacion.Auth, controller.AgregarUsuarios);
api.put("/editarUsuario/:ID", autenticacion.Auth, controller.EditarUsuarios);
api.delete(
  "/eliminarUsuarios/:ID",
  autenticacion.Auth,
  controller.EliminarUsuarios
);

//Funciones del usuario logueado
api.get("/verPerfil", autenticacion.Auth, controller.verPerfil);
api.put("/editarPerfil", autenticacion.Auth, controller.editarPerfil);
api.delete("/eliminarPerfil", autenticacion.Auth, controller.eliminarPerfil);

module.exports = api;
