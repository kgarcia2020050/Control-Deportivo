const mongoose = require('mongoose');
const app = require('./app');

const inicio=require('./src/controllers/InicioController');

mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb+srv://takeru:ellanomeama@cluster0.ppw9e.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conexión exitosa.');

    let puerto=process.env.PORT;
    
    app.listen(puerto,3000, function () {
      console.log('Conectado al puerto 3000.');
    });
  })
  .catch((error) => console.log(error));

  app.get('/',function (req, res) {
    return res.status(200).send("Hola mundo")
  }
  )

  inicio.Admin()