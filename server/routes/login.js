const express = require('express');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();

app.post('/login', (req, res) => {

    const campos = req.body;
    console.log(campos.email);
    Usuario.findOne({ email: campos.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ ok: false, msg: 'Error al hacer el login' });
        }

        if (!usuarioDB) {
            res.status(400).json({ ok: false, msg: 'Usuario o contraseña incorrecto' });
            return;
        }

        if (!bcrypt.compareSync(campos.password, usuarioDB.password)) {
            res.status(400).json({ ok: false, msg: 'Usuario o contraseña incorrecto' });
            return;
        }

        //Creamos el token
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.VENCIMIENTO_TOKEN })

        res.json({
            ok: true,
            msg: 'Login Correcto',
            usuario: campos.usuario,
            token
        });

    });
});














module.exports = app;