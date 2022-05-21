const express = require('express');
const ruta = express.Router();
const Singer = require('../models/singer_model');
const Album = require('../models/album_model');


ruta.get('/:id', (req, res) => {
    let resultado = listarAlbum(req.params.id)
    resultado
        .then(albums => {
            res.json(albums);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

/*
Peticion para registrar un album
en un artista. Se reciben dos parametros
el id del album y el email del realname del artista*/
ruta.post('/:id/:realname', (req, res) => {
    let resultado = registrarAlbum(req.params.id, req.params.realname);
    resultado
        .then(album => {
            res.json({
                valor: album
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

/*
Peticion para quitar un album
de un artista. Se reciben dos parametros
el id del album y el nombre del artista*/
ruta.delete('/:id/:realname', (req, res) => {
    let resultado = quitarAlumno(req.params.id, req.params.realname);
    resultado
        .then(singer => {
            res.json({
                valor: singer
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

async function registrarAlbum(title, realname) {

    let album = await Album.findOne({ 'title': title });
    if (!album) {
        throw new Error('¡El album no existe en la base!');
    }

    /*let artista = await Singer.findOne({ 'realname': realname });
    if (!artista) {
        throw new Error('¡El artista no existe en la base!');
    }*/

    let resultado = await Singer.updateOne({ 'realname': realname }, {
        $addToSet: {
            album: title //Actualiza el curso agregando el titulo del artista
                //al arreglo de album. Solo agrega el titulo
                //Si este no esta en el arreglo.
                //SI el titulo ya esta en el arreglo, no se hace nad
        }
    });
    //Comprueba si se modifico el documento del Album.
    //Si no se modifico, es por que el titulo del artista
    //ya existe en el arreglo de alumnos del Album.
    //modifiedCount == 0 -> No se modifico el documento.
    //modifiedCount == 1 -> Se modifico el documento.
    if (!resultado.modifiedCount) {
        throw new Error('!El album ya esta registrado en este artista!');
    }
    //En caso de querer recuperar  wl Album actualizado
    let artista = Singer.findById(id);
    return artista;
}

async function listarAlbum(id) {
    //Recupera los alumnos de un Album con id determinado
    let albums = await Singer.findById(id).select({ artisticname: 1, album: 1, _id: 0 });
    //El id del Album siempre se devuelve por default.
    //SI no lo queremos, hay que especificarlo con un 0.

    return albums;
}

async function quitarAlumno(title, realname) {
    let resultado = await Singer.updateOne({ 'realname': realname }, {
        //Extraccion de elementos dentro de un arreglo
        $pullAll: {
            //Del arreglo alumnos saca el title del album
            //Actualiza el artista eliminando el titulo
            //del arrelgo de album.
            album: [title]
        }
    });

    //Comprueba si se modifico el documento del artista.
    //Si no se modifico es por que el titulo del album no esta en
    //el arreglo.
    if (!resultado.modifiedCount) {
        throw new Error('¡ El album no esta registrado en este artista !')
    }


    //En caso de querer recuperar el curso actualizado.
    let singer = await Singer.findById(realname);
    return singer;

}



module.exports = ruta;