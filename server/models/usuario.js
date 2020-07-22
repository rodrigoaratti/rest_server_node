const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN', 'USUARIO'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del usuario es requerido']
    },
    apellido: {
        type: String,
        required: [true, 'El apelido del usuario es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo del usuario es requerido']
    },
    password: {
        type: String,
        required: [true, 'El password del usuario es requerido']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USUARIO',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(validator, { message: 'El {PATH} del usuario debe ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);