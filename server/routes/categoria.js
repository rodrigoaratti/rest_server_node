const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');

const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');

app.get('/categoria', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let activo = req.query.activo || true;


    let condicion = { activo: activo };


    Categoria.find(condicion, 'nombre activo')
        .populate('usuario', 'nombre email')
        .limit(limite)
        .skip(desde)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({ ok: false, msg: 'Error al obtener las categorias' });
            }

            Categoria.count(condicion, (err, cantidad) => {
                if (err)
                    return res.status(400).json({ ok: false, msg: 'Error al obtener los cateogorias' });
                res.json({ ok: true, msg: 'OK', cantidad, categorias });
            });

        });
});

app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, msg: 'Error al recuperar la categoria' })
        } else {
            return res.json({ ok: true, categoria: categoriaDB });
        }
    });

})
app.post('/categoria', [verificarToken, verificarAdminRole], (req, res) => {
    let campos = req.body;
    let categoria = new Categoria({
        nombre: campos.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al guardar la categoria'
            })

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al guardar la categoria'
            })

        }
        res.status(200).json({
            ok: true,
            msg: `La categoria ha sido creada correctamente`,
            categoria: categoriaDB
        });
    });

});

app.put('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    let campos = _.pick(req.body, ['nombre', 'activo']);

    Categoria.findByIdAndUpdate(id, campos, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al actualizar la Categoria'
            });

        }
        res.json({ id, msg: 'ok', categoria: categoriaDB });
    });


});

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], (req, res) => {

    let id_borrar = req.params.id;

    Categoria.findByIdAndUpdate(id_borrar, { activo: false }, { new: true, runValidators: true }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err,
                msg: 'Error al borrar la Categoria'
            });

        }
        if (categoriaBorrada === null)
            return res.status(400).json({
                ok: false,
                err: { message: 'No se encontro la Categoria' },
                msg: 'No se encontró la Categoria'
            });
        res.json({ id_borrar, msg: 'ok', categoria: categoriaBorrada });


    })
});


module.exports = app;