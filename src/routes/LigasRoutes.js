const express = require("express");
const controlador = require("../controllers/LigasController")
var api = express.Router();

const autenticacion = require("../middlewares/verificacion");

api.get("/misLigas",autenticacion.Auth,controlador.misLigas)
api.post("/agregarLiga",autenticacion.Auth,controlador.agregarLiga)
api.put("/editarLiga/:ID",autenticacion.Auth,controlador.editarLiga)
api.delete("/borrarLiga/:ID",autenticacion.Auth,controlador.eliminarLiga)

module.exports=api;