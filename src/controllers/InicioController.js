const encriptar = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const Usuarios = require("../models/Usuario");

function Admin() {
  var modeloUsuario = new Usuarios();
  Usuarios.find({ rol: "ADMIN" }, (error, administrador) => {
    if (administrador.length == 0) {
      modeloUsuario.usuario = "ADMIN";
      modeloUsuario.rol = "ADMIN";
      clave = "deportes123";
      encriptar.hash(clave, null, null, (error, claveEncriptada) => {
        modeloUsuario.password = claveEncriptada;
        modeloUsuario.save((error, administrador) => {
          if (error) console.log("Error en la peticion.");
          if (!administrador) console.log("No se pudo crear al administrador.");
          console.log("Administrador: " + administrador);
        });
      });
    } else {
      console.log(
        "Ya existe un administrador." + " Sus datos son " + administrador
      );
    }
  });
}

function Login(req, res) {
  var datos = req.body;

  if (datos.usuario == null || datos.password == null) {
    return res.status(500).send({ Error: "Debes ingresar todos los datos." });
  } else {
    Usuarios.findOne({ usuario: datos.usuario }, (error, usuarioEncontrado) => {
      if (error)
        return res.status(500).send({ Error: "Error en la peticion." });
      if (usuarioEncontrado) {
        encriptar.compare(
          datos.password,
          usuarioEncontrado.password,
          (error, claveVerificada) => {
            if (claveVerificada) {
              if (datos.obtenerToken == "true") {
                return res
                  .status(200)
                  .send({ Token: jwt.crearToken(usuarioEncontrado) });
              } else {
                usuarioEncontrado.password = undefined;
                return res
                  .status(200)
                  .send({ Inicio_exitoso: usuarioEncontrado });
              }
            } else {
              return res.status(500).send({ Error: "La clave no coincide." });
            }
          }
        );
      } else {
        return res
          .status(500)
          .send({ Error: "Los datos de inicio no existen." });
      }
    });
  }
}

function Registro(req, res) {
  var datos = req.body;
  var modeloUsuario = new Usuarios();
  if (datos.nombre && datos.usuario && datos.password) {
    modeloUsuario.nombre = datos.nombre;
    modeloUsuario.usuario = datos.usuario;
    modeloUsuario.rol = "USER";

    Usuarios.find({ usuario: datos.usuario }, (error, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          modeloUsuario.password = claveEncriptada;
          modeloUsuario.save((error, userAgregado) => {
            if (error)
              return res.status(500).send({ Error: "Error en la peticion." });
            if (!userAgregado)
              return res.status(404).send({
                Error: "No te pudiste registrar.",
              });
            return res.status(200).send({ Registro_exitoso: userAgregado });
          });
        });
      } else {
        return res
          .status(500)
          .send({ Error: "Ya existe un usuario con el mismo nombre de usuario." });
      }
    });
  } else {
    return res
      .status(500)
      .send({ Error: "Debes llenar los campos solicitados." });
  }
}

module.exports = {
  Admin,
  Login,
  Registro
};
