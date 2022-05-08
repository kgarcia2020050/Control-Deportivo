const encriptar = require("bcrypt-nodejs");
const Usuarios = require("../models/Usuario");

function AgregarUsuarios(req, res) {
  if (req.user.sub == "USER") {
    return res
      .status(500)
      .send({ Error: "Solo el administrador puede ejecutar esta acción." });
  }

  var datos = req.body;
  var modeloUsuario = new Usuarios();
  if (datos.nombre && datos.usuario && datos.password) {
    modeloUsuario.nombre = datos.nombre;
    modeloUsuario.usuario = datos.usuario;


    if(datos.rol=="ADMIN"){
      modeloUsuario.rol=datos.rol;
    }else if(datos.rol=="USER"){
      modeloUsuario.rol=datos.rol;
    }else if(!datos.rol){
      modeloUsuario.rol="USER";
    }else{
      return res.status(500).send({Error:"Solo pueden existir 2 tipos de rol: ADMIN y USER. "})
    }


    Usuarios.find({ usuario: datos.usuario }, (error, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        encriptar.hash(datos.password, null, null, (error, claveEncriptada) => {
          modeloUsuario.password = claveEncriptada;
          modeloUsuario.save((error, usuarioAgregado) => {
            if (error)
              return res.status(500).send({ Error: "Error en la petición." });
            if (!usuarioAgregado)
              return res
                .status(500)
                .send({ Error: "No se pudo agregar al usuario." });
            return res.status(200).send({ Usuario_agregado: usuarioAgregado });
          });
        });
      }else{
        return res.status(500).send({Error:"Ya existe alguien con este nombre de usuario."})
      }
    });
  } else {
    return res.status(500).send({ Error: "Debes de llenar todos los datos." });
  }
}

function EditarUsuarios(req, res) {
  var idUsuario = req.params.ID;
  if (req.user.sub == "USER") {
    return res
      .status(500)
      .send({ Error: "Solo el administrador puede ejecutar esta acción." });
  }
  var datos = req.body;
  if (!datos) {
    return res.status(500).send({ Error: "No hay campos para modificar." });
  }

  if (datos.password) {
    return res
      .status(500)
      .send({ Error: "No se puede modificar la password." });
  } else {
    Usuarios.findById({ _id: idUsuario }, (error, usuarioEncontrado) => {
      if (!usuarioEncontrado) {
        return res.status(500).send({ Error: "Este usuario no existe." });
      } else if (usuarioEncontrado.rol == "ADMIN") {
        return res.status(500).send({
          Error: "No puedes editar la informacion de otros administradores.",
        });
      } else {
        Usuarios.findByIdAndUpdate(
          { _id: idUsuario },
          datos,
          { new: true },
          (error, usuarioModificado) => {
            if (error)
              return res
                .status(500)
                .send({ Error: "Error al intentar modificar al usuario." });
            if (!usuarioModificado)
              return res
                .status(500)
                .send({ Error: "No se pudo modificar al usuario." });
            return res
              .status(200)
              .send({ Usuario_modificado: usuarioModificado });
          }
        );
      }
    });
  }
}
  
function EliminarUsuarios(req, res) {
  if (req.user.sub == "USER") {
    return res
      .status(500)
      .send({ Error: "Solo el administrador puede ejecutar esta acción." });
  }

  var idUsuario = req.params.ID;
  Usuarios.findById({ _id: idUsuario }, (error, usuarioEncontrado) => {
    if (!usuarioEncontrado) {
      return res.status(500).send({ Error: "Este usuario no existe." });
    } else if (usuarioEncontrado.rol == "ADMIN") {
      return res
        .status(500)
        .send({ Error: "No puedes eliminar a otros administradores." });
    } else {
      Usuarios.findByIdAndDelete(
        { _id: idUsuario },
        (error, usuarioEliminado) => {
          if (error)
            return res
              .status(500)
              .send({ Error: "Error al eliminar al usuario." });
          if (!usuarioEliminado)
            return res
              .status(500)
              .send({ Error: "No se pudo eliminar al usuario." });
          return res.status(200).send({ Usuario_eliminado: usuarioEliminado });
        }
      );
    }
  });
}

function VerUsuarios(req, res) {
  if (req.user.sub == "USER") {
    return res
      .status(500)
      .send({ Error: "Solo el administrador puede ejecutar esta acción." });
  }

  Usuarios.find({ rol: "USER" }, (error, listaUsuarios) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al obtener a los usuarios." });
    if (listaUsuarios.length == 0)
      return res
        .status(500)
        .send({ Error: "No existe ningun usuario registrado." });
    return res.status(200).send({ Usuarios_registrados: listaUsuarios });
  });
}

function VerAdmins(req, res) {
  if (req.user.sub == "USER") {
    return res
      .status(500)
      .send({ Error: "Solo el administrador puede ejecutar esta acción." });
  }

  Usuarios.find({ rol: "ADMIN" }, (error, listaAdmins) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al obtener a los administradores." });
    return res.status(200).send({ Administradores: listaAdmins });
  });
}

function verPerfil(req, res) {
  Usuarios.findById({ _id: req.user.sub }, (error, usuarioEncontrado) => {
    if (error)
      return res
        .status(500)
        .send({ Error: "Error al obtener el perfil del usuario." });
    if (!usuarioEncontrado)
      return res.status(500).send({ Error: "Este usuario no existe." });
    return res.status(200).send({ Mi_perfil: usuarioEncontrado });
  });
}

function editarPerfil(req, res) {
  var datos = req.body;
  if (!datos) {
    return res.status(500).send({ Erro: "No hay campos para modificar." });
  }
  if (datos.password) {
    return res
      .status(500)
      .send({ Error: "No se puede modificar la password." });
  } else {
    Usuarios.findByIdAndUpdate(
      { _id: req.user.sub },
      datos,
      { new: true },
      (error, usuarioEditado) => {
        if (error)
          return res
            .status(500)
            .send({ Error: "Error al modificar el perfil." });
        if (!usuarioEditado)
          return res.status(500).send({ Error: "Este usuario no existe." });
        return res.status(500).send({ Perfil_editado: usuarioEditado });
      }
    );
  }
}

function eliminarPerfil(req, res) {
  Usuarios.findByIdAndDelete(
    { _id: req.user.sub },
    (error, perfilEliminado) => {
      if (error)
        return res.status(500).send({ Error: "Error al eliminar el perfil." });
      if (!perfilEliminado)
        return res.status(500).send({ Error: "Este usuario no existe." });
      return res.status(200).send({ Exito: "Perfil eliminado correctamente." });
    }
  );
}

module.exports = {
  AgregarUsuarios,
  EditarUsuarios,
  EliminarUsuarios,
  VerAdmins,
  VerUsuarios,
  verPerfil,
  editarPerfil,
  eliminarPerfil,
};
