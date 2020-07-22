const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

app.get('/', function(req, res) {

    res.json({ msg: 'OOOPS FUNCIONA' })

})

app.get('/usuario', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let estado = req.query.estado || true;


    let condicion = { estado: estado };

    console.log(condicion);

    Usuario.find(condicion, 'estado google  nombre email apellido role')
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, msg: 'Error al obtener los usuarios' });
            }

            Usuario.count(condicion, (err, cantidad) => {
                if (err)
                    return res.status(400).json({ ok: false, msg: 'Error al obtener los usuarios' });
                res.json({ ok: true, msg: 'OK', cantidad, usuarios });
            });

        });
    // res.json({ msg: 'ops' })

    // Usuario.find({})
    //     .exec((error, usuarios) => {
    //         if (error) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: error,
    //                 msg: 'Error al obtener los usuarios'
    //             });
    //         }
    //         response.json({ ok: true, usuarios });

    //     });
});

app.post('/usuario', [verificarToken, verificarAdminRole], (req, res) => {
    let campos = req.body;
    /* if (campos.nombre === undefined) {
          res.status(400).json({
              ok: false,
              msg: 'el nombre es necesario'
          })
      } else {
          res.json({ msg: `respuesta usuario post `, campos });
      }*/

    let usuario = new Usuario({
        nombre: campos.nombre,
        password: bcrypt.hashSync(campos.password, 10),
        email: campos.email,
        apellido: campos.apellido,
        role: campos.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al guardar el usuario'
            })

        }
        // usuarioDB.password = null; Es una forma de hacerlo pero cambiamos el toJSON en el esquema
        res.status(200).json({
            ok: true,
            msg: `El usuario creado correctamente`,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let campos = _.pick(req.body, ['nombre', 'apellido', 'email', 'img']);

    Usuario.findByIdAndUpdate(id, campos, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al actualizar el usuario'
            });

        }
        res.json({ id, msg: 'ok', usuario: usuarioDB });
    });

    //res.json({ id, msg: 'respuesta usuario put' });
});

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], (req, res) => {

    let id_borrar = req.params.id;
    // Usuario.findByIdAndRemove(id_borrar, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: err,
    //             msg: 'Error al borrar el usuario'
    //         });

    //     }
    //     if (usuarioBorrado === null)
    //         return res.status(400).json({
    //             ok: false,
    //             err: { message: 'No se encontro el usuario' },
    //             msg: 'No se encontró el usuario'
    //         });
    //     res.json({ id_borrar, msg: 'ok', usuario: usuarioBorrado });


    // })

    Usuario.findByIdAndUpdate(id_borrar, { estado: false }, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al borrar el usuario'
            });

        }
        if (usuarioBorrado === null)
            return res.status(400).json({
                ok: false,
                err: { message: 'No se encontro el usuario' },
                msg: 'No se encontró el usuario'
            });
        res.json({ id_borrar, msg: 'ok', usuario: usuarioBorrado });


    })
});


module.exports = app;