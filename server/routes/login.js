const express = require('express');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

app.post('/login', (req, res) => {

    const campos = req.body;

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


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    console.log("EL TOKEN ES ", token);
    let googleuser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                msg: "Error al verficar el token"
            })
        });

    Usuario.findOne({ email: googleuser.email }, (err, usuarioDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: 'Error al procesar la solicitud' });

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({ ok: false, msg: 'Debe utilizar la autenticación normal' });
            } else {

                let token = jwt.sign({ usuario: usuarioDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.VENCIMIENTO_TOKEN })
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }

        } else {

            let usuario = new Usuario();
            usuario.nombre = googleuser.name;
            usuario.email = googleuser.email;
            usuario.password = '123';
            usuario.google = true;
            usuario.img = googleuser.picture;
            usuario.apellido = "prueba";

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({ ok: false, msg: 'Error al procesar la solicitud' });
                } else {
                    let token = jwt.sign({ usuario: usuarioDB }, process.env.SECRET_TOKEN, { expiresIn: process.env.VENCIMIENTO_TOKEN })
                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                }

            })
        }

    })
});











module.exports = app;