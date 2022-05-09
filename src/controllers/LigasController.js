const Ligas = require("../models/Ligas");
const Equipos = require("../models/Equipos");
const PDFDocument = require("../PDF/PDF");

const fs = require("fs");

function agregarLiga(req, res) {
  var datos = req.body;
  var modeloLiga = new Ligas();
  if (datos.nombre) {
    Ligas.findOne({ nombre: datos.nombre }, (error, ligaEncontrada) => {
      if (error)
        return res.status(500).send({ Error: "Error al buscar una liga." });
      if (ligaEncontrada) {
        return res
          .status(500)
          .send({ Error: "Ya existe una liga con el mismo nombre." });
      } else {
        modeloLiga.nombre = datos.nombre;
        modeloLiga.idUsuario = req.user.sub;
        modeloLiga.save((error, ligaGuardada) => {
          if (error)
            return res.status(500).send({ Error: "Error al guardar la liga." });
          return res.status(200).send({ Liga_agregada: ligaGuardada });
        });
      }
    });
  }
}

function misLigas(req, res) {
  Ligas.find({ idUsuario: req.user.sub }, (error, ligasHalladas) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener las ligas." });
    if (ligasHalladas.length == 0)
      return res.status(200).send({ Error: "No tienes ninguna liga." });
    return res.status(200).send({ Mis_ligas: ligasHalladas });
  });
}

function editarLiga(req, res) {
  var idLiga = req.params.ID;
  var datos = req.body;
  if (!datos.nombre) {
    return res.status(500).send({ Error: "No hay campos para modificar." });
  } else {
    Ligas.findByIdAndUpdate(
      { _id: idLiga, idUsuario: req.user.sub },
      datos,
      { new: true },
      (error, ligaEditada) => {
        if (error)
          return res.status(500).send({ Error: "Error al buscar la liga." });
        if (!ligaEditada)
          return res.status(500).send({ Error: "Esta liga no te pertenece." });
        return res.status(200).send({ Liga_editada: ligaEditada });
      }
    );
  }
}

function eliminarLiga(req, res) {
  var idLiga = req.params.ID;
  Ligas.findByIdAndDelete(
    { _id: idLiga, idUsuario: req.user.sub },
    (error, ligaEliminada) => {
      if (error)
        return res.status(500).send({ Error: "Error al eliminar la liga." });
      Equipos.deleteMany({ idLiga: idLiga }, (error, equiposBorrados) => {
        if (error)
          return res.status(500).send({ Error: "Error al borrar equipos." });
        if (!ligaEliminada)
          return res.status(500).send({ Error: "Esta liga no te pertenece." });
        return res.status(200).send({ Liga_eliminada: ligaEliminada });
      });
    }
  );
}

module.exports = { agregarLiga, misLigas, editarLiga, eliminarLiga };
