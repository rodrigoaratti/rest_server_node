const express = require('express');
const { verificarAdminRole, verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
const categoria = require('../models/categoria');
const _ = require('underscore');
const { isRegExp } = require('underscore');



// Todos los productos haciendo el populate con el usuario y la categoria
// cargar un producto por id
// Crear producto con post
// actualizar el producto con el put
// borrar un producto 



app.get('/producto', verificarToken, (req, res) => {

    let condicion = {};
    let limite = req.query.limite || 100;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find(condicion)
        .limit(limite)
        .skip(desde)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err)
                return res.status(500).json({ ok: false, msg: 'Error recuperando los productos' });
            Producto.count(condicion, (err, cant) => {
                if (err)
                    return res.status(500).json({ ok: false, msg: 'Error recuperando los productos' });
                res.json({ ok: true, cantidad: cant, productos });
            });

        })

});

app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err)
                return res.status(500).json({ ok: false, msg: 'Error recuperando datos del producto seleccionado' });

            if (!productoDB)
                return res.status(500).json({ ok: false, msg: 'Error recuperando datos del producto seleccionado' });

            return res.json({ ok: true, producto: productoDB })
        })
});

app.get('/producto/buscar/:busqueda', verificarToken, (req, res) => {

    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i')
    Producto.find({ nombre: regExp })
        .populate('categoria')
        .populate('usuario')
        .exec((err, productos) => {

            if (err)
                return res.status(500).json({ ok: false, msg: 'Error recuperando los productos' });

            return res.json({ ok: true, productos: productos })
        })
})

app.post('/producto', [verificarToken, verificarAdminRole], (req, res) => {


    let campos = req.body;
    let usuario = req.usuario;
    let producto = new Producto({
        nombre: campos.nombre,
        precioUni: campos.precioUni,
        descripcion: campos.descripcion,
        categoria: campos.categoria,
        usuario: usuario._id
    });

    producto.save((err, productoDB) => {

        if (err)
            return res.status(500).json({ ok: false, msg: 'Error al guardar el producto' });

        if (!productoDB)
            return res.status(500).json({ ok: false, msg: 'Error al guardar el producto' });

        res.json({ ok: true, producto: productoDB })

    });
});

app.put('/producto/:id', [verificarToken, verificarAdminRole], (req, res) => {

    let campos = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'disponible', 'categoria']);
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, campos, { runvalidations: true, new: true }, (err, productoDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: 'Error actualizando producto' });

        return res.json({ ok: true, producto: productoDB })
    })
});

app.delete('/producto/:id', [verificarToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { runvalidations: true, new: true }, (err, productoDB) => {
        if (err)
            return res.status(500).json({ ok: false, msg: 'Error eliminando producto' });

        return res.json({ ok: true, producto: productoDB })
    })

});


















module.exports = app;