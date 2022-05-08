const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    usuario:String,
    password:String,
    rol:String
});

module.exports = mongoose.model("Usuarios", UsuarioSchema);