const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: [true, 'El nombre de la categoria debe ser unico'],
        required: [true, 'El nombre del usuario es requerido']

    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    activo: { type: Boolean, default: true }
});



module.exports = mongoose.model('Categoria', categoriaSchema);