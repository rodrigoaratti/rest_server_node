require('./config/config')

const express = require('express');
const body = require('body-parser');

const app = express()


app.use(body.urlencoded({ extended: false }));
app.use(body.json());

app.get('/', function(req, res) {
    res.json('Hello World')
})

app.get('/usuario', (req, res) => {

    res.json('respuesta usuario get')
});

app.post('/usuario', (req, res) => {
    let campos = req.body;
    if (campos.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'el nombre es necesario'
        })
    } else {
        res.json({ msg: `respuesta usuario post `, campos });
    }


})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id, msg: 'respuesta usuario put' });
});

app.delete('/usuario', (req, res) => {
    res.json('respuesta usuario delete')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${ process.env.PORT }`);
})