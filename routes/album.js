const express = require('express');
const ruta = express.Router();
const Album = require('../models/album_model');
const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string() //El tipo string
        .alphanum()
        .min(1) // Que tenga una longitud minima de 3
        .max(20) // Que tenga una longitud maxima de 10
        .required(), // Es obligatorio

    label: Joi.string() //El tipo numero
        .alphanum()
        .min(1) // Que tenga una longitud minima de 3
        .max(50) // Que tenga una longitud maxima de 50
        .required(), // Es obligatorio

    genre: Joi.string() //El tipo numero
        .alphanum()
        .min(1) // Que tenga una longitud minima de 3
        .max(30) // Que tenga una longitud maxima de 10
        .required(), // Es obligatorio

    year: Joi.number() //El tipo numero
        .integer()
        .min(1900)
        .max(2022)
        .required() // Es obligatorio

});

ruta.get('/', (req, res) => {

    let resultado = listarAlbumsActivos();
    resultado
        .then(album => { //Si se resuelve de manera correcta, vamos a recibir el usuario
            res.json({
                valor: album
            });
        })
        //En caso de que halla un error
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

ruta.post('/', (req, res) => {
    let body = req.body;
    //Validamos la entrada de datos que se recuperan del body
    const { error, value } = schema.validate({ title: body.title, label: body.label, genre: body.genre, year: body.year });
    //Si los datos de entrada son validos de acuerdo
    //con el esquema que definimos, podemos guardar los datos

    if (!error) {
        let resultado = crearAlbum(body);

        //Operacion a realizar dependiendo si la promesa se resolvio de manera correcta o no
        resultado
            .then(album => {
                res.json({
                    valor: album
                });
            })
            //En caso de que halla un error
            .catch(err => {
                res.status(400).json({
                    error: err
                });
            })
    } else {
        res.status(400).json({
            error: err
        });
    }
});

/* En la ruta se debe especificar el title
como parametro para identificar al album
que se quiere actualizar */

ruta.put("/:id", (req, res) => {
    let body = req.body;
    //Validamos el nombre que tomamos del body
    const { error, value } = schema.validate({ title: body.title, label: body.label, genre: body.genre, year: body.year });
    //Si los datos de entrada son validos de acuerdo
    //con el esquema que definimos, podemos guardar los datos

    if (!error) {
        let resultado = actualizarAlbum(req.params.id, req.body);

        resultado
            .then(album => { //Si se resuelve de manera correcta, vamos a recibir el usuario
                res.json({
                    valor: album
                });
            })
            //En caso de que halla un error
            .catch(err => {
                res.status(400).json({
                    error: err
                });
            });
    } else {
        res.status(400).json({
            error: err
        });
    }
});

/* En la ruta se debe especificar el email
como parametro para identificar al curso
que se quiere actualizar */

ruta.delete("/:id", (req, res) => {

    //console.log(error);
    let resultado = desactivarAlbum(req.params.id);
    resultado
        .then(album => {
            res.json({
                valor: album
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

async function actualizarAlbum(id, body) {
    let albums = await Album.findByIdAndUpdate(id, {
        $set: {
            title: body.title,
            label: body.label,
            genre: body.genre,
            year: body.year
        }
    }, { new: true });
    return albums;
}

async function crearAlbum(body) {
    //constructor, instancia de album
    //Al momento de crear artistas si tienes dos nombres, para representarlo en el url tendras
    //que sustituir el espacio por un %20

    let albums = new Album({
        title: body.title,
        label: body.label,
        genre: body.genre,
        year: body.year
    });

    return await albums.save();
}

async function desactivarAlbum(id) {
    let albums = await Album.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, { new: true });
    return albums;
}

async function listarAlbumsActivos() {
    let albums = await Album.find({ 'estado': true });
    return albums;
}

module.exports = ruta; //Se exporta el objeto que va a contener todas las rutas que definiremos dentro de este archivo.