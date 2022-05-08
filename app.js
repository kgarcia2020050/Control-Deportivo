const express = require("express");
const cors = require("cors");
var app = express();

const inicio = require("./src/routes/UsuarioRoutes");
const ligas = require("./src/routes/LigasRoutes");
const equipos=require("./src/routes/EquiposRoutes")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use("/api", inicio, ligas,equipos);

module.exports = app;
