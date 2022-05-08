const express = require("express");
const controlador = require("../controllers/EquiposController")
var api = express.Router();

const autenticacion = require("../middlewares/verificacion");

api.post("/nuevoEquipo",autenticacion.Auth,controlador.agregarEquipo)
api.get("/misEquipos",autenticacion.Auth,controlador.misEquipos)
api.delete("/borrarEquipo/:ID",autenticacion.Auth,controlador.eliminarEquipo)
api.get("/misEquiposPDF",autenticacion.Auth,controlador.generarPdf)

module.exports=api;