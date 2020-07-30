const express = require('express');
const fs = require('fs');
const path = require('path');
let app = express();


app.get('/imagen/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let path_noimg = path.resolve(__dirname, '../assets/no-image.jpg')
    res.sendFile(path_noimg)
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    console.log(pathImg);
    if (!fs.existsSync(pathImg)) {
        console.log('entre');
        pathImg = path_noimg;
    }


    res.sendFile(pathImg)
});


module.exports = app;