const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EquiposSchema = Schema({
  nombre: String,
  golesFavor: Number,
  golesContra: Number,
  diferenciaGoles: Number,
  partidos: Number,
  puntos: Number,
  idUsuario: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  idLiga: { type: Schema.Types.ObjectId, ref: "Ligas" },
});

module.exports = mongoose.model("Equipos", EquiposSchema);
