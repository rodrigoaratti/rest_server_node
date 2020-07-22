require('./config/config')

const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');

const app = express()


app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.use(require('./routes/index'));


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.URL_DB_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err)
            throw new Error(`No se pudo establecer la conexión con la base de datos`);
        else
            console.log('Base de Datos Online!!');
    });
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
});