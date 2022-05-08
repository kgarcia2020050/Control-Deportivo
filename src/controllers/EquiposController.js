const Equipos = require("../models/Equipos");

const PDFDocument = require("../PDF/PDF");

const fs = require("fs");


function agregarEquipo(req, res) {
  var datos = req.body;
  var modeloEquipo = new Equipos();

  if (
    datos.nombre &&
    datos.idLiga &&
    datos.golesFavor &&
    datos.golesContra &&
    datos.partidos &&
    datos.puntos
  ) {
    Equipos.find({ idLiga: datos.idLiga }, (error, ligaHallada) => {
      if (error)
        return res
          .status(500)
          .send({ Error: "Error al buscar equipos por liga." });
      if (ligaHallada.length >= 10) {
        return res
          .status(500)
          .send({ Error: "Cada liga solo puede tener 10 equipos." });
      } else {
        modeloEquipo.nombre = datos.nombre;
        modeloEquipo.golesFavor = datos.golesFavor;
        modeloEquipo.golesContra = datos.golesContra;
        modeloEquipo.diferenciaGoles = datos.golesFavor - datos.golesContra;
        modeloEquipo.partidos = datos.partidos;
        modeloEquipo.puntos = datos.puntos;
        modeloEquipo.idUsuario = req.user.sub;
        modeloEquipo.idLiga = datos.idLiga;

        modeloEquipo.save((error, equipoAgregado) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al guardar el equipo." });
          if (!equipoAgregado)
            return res
              .status(500)
              .send({ Error: "No se pudo guardar al equipo." });
          return res.status(200).send({ Nuevo_equipo: equipoAgregado });
        });
      }
    });

    modeloEquipo.nombre = datos.nombre;
  } else {
    return res.status(500).send({
      Error: "Debes enviar el nombre del equipo y la liga a la que pertenece.",
    });
  }
}

function eliminarEquipo(req, res) {
  var idEquipo = req.params.ID;

  Equipos.findByIdAndDelete({ _id: idEquipo }, (error, equipoBorrado) => {
    if (error)
      return res.status(500).send({ Error: "Error al borrar el equipo." });
    if (!equipoBorrado)
      return res.status(500).send({ Error: "No se pudo borrar al equipo." });
    return res.status(200).send({ Equipo_borrado: equipoBorrado });
  });
}

function misEquipos(req, res) {
  Equipos.find({ idUsuario: req.user.sub }, (error, listaEquipos) => {
    if (error)
      return res.status(500).send({ Error: "Error al obtener los equipos." });
    if (listaEquipos.length == 0)
      return res.status(500).send({ Error: "No tienes equipos." });
    return res.status(200).send({ Mis_equipos: listaEquipos });
  });
}

function generarPdf(req, res) {
  
    Equipos.find({ idUsuario: req.user.sub }, (error, misEquipos) => {
      if (error) return res.status(500).send({ Error: "Error en la peticion." });
      if (!misEquipos)
        return res.status(404).send({ Error: "No se pudo generar el PDF." });
      if (misEquipos == 0) {
        return res.status(500).send({ Error: "No tienes ningun equipo." });
      }
  
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream("Equipos de " + req.user.nombre + ".pdf"));
      doc.pipe(res);
      doc
        //.image("../Pdf/pngwing.com.png")
        .fillColor("#141414")
        .strokeColor("#22366B")
        .fontSize(20)
        .text("Equipos de " + req.user.nombre, { align: "center" })
        .fontSize(10)
        .moveDown();
  
      const table = {
        headers: ["Nombre equipo", "Goles a favor", "Goles en contra", "Partidos Jugados","Puntos"],
        rows: [],
      };
  
      for (const datos of misEquipos) {
        table.rows.push([
          datos.nombre,
          datos.golesFavor,
          datos.golesContra,
          datos.partidos,
          datos.puntos
        ]);
      }
  
      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold"),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
      });
  
      doc.end();
    }).sort({puntos:-1});
  }

module.exports = {
  agregarEquipo,
  eliminarEquipo,
  misEquipos,
  generarPdf
};
