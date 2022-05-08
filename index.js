const mongoose = require('mongoose');
const app = require('./app');

const inicio=require('./src/controllers/InicioController');

mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb://localhost:27017/Control-Deportivo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conexión exitosa.');

    app.listen(3000, function () {
      console.log('Conectado al puerto 3000.');
    });
  })
  .catch((error) => console.log(error));

  inicio.Admin()