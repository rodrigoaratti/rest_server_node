const jwt = require('jsonwebtoken');



let verificarToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                msg: 'Usuario o Contraseña Inválido'
            });

        req.usuario = decoded.usuario;
        next();


    })

}


let verificarAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);

    if (!(usuario.role === 'ADMIN')) {
        console.log("ENTRE");
        return res.json({
            ok: false,
            msg: 'El usuario no es administrador'
        });
    } else {
        next();
    }
}

module.exports = {
    verificarToken,
    verificarAdminRole
};