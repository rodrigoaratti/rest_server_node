const express = require('express');
const fileupload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// Paquetes para manejar el filesystem
const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileupload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ ok: false, msg: 'No hay archivos para subir' });
    }



    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo es incompatible'
        });
    }
    if (process.env.EXTENSIONES_VALIDAS.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            msg: 'Extensión inválida'
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, msg: 'No fue posible procesar el archivo' });
    })
    if (tipo === 'usuarios')
        procesarImagenUsuario(id, res, nombreArchivo);
    else
        procesarImagenProducto(id, res, nombreArchivo);
});


function procesarImagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({ ok: false, msg: 'No fue posible actualizar el Usuario' });
        }
        if (!usuarioDB) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({ ok: false, msg: 'No se encontro el Usuario' });
        }


        borrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            if (err) {
                return res.status(500).json({ ok: false, msg: 'No fue posible actualizar el Usuario' });
            }
            if (!usuarioDB) {
                return res.status(500).json({ ok: false, msg: 'No se encontro el Usuario' });
            }
            res.json({ ok: true, msg: 'Usuario Guardado Correctamente' })
        })

    })
}

function procesarImagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'productos');
            return res.status(500).json({ ok: false, msg: 'No fue posible actualizar el Usuario' });
        }
        if (!productoDB) {
            borrarImagen(nombreArchivo, 'productos');
            return res.status(500).json({ ok: false, msg: 'No se encontro el Usuario' });
        }
        borrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            if (err) {
                return res.status(500).json({ ok: false, msg: 'No fue posible actualizar el Producto' });
            }
            if (!productoDB) {
                return res.status(500).json({ ok: false, msg: 'No se encontro el Producto' });
            }
            res.json({ ok: true, msg: 'Producto Guardado Correctamente' })
        })

    })
}

function borrarImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;