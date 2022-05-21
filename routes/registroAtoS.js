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
en un artista. Se reciben tres parametros
el id del artista, nombre del artista  y el nombre del album*/
ruta.post('/:id/:artisticname/:title', (req, res) => {
    let resultado = registrarAlbum(req.params.id, req.params.artisticname, req.params.title);
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
de un artista. Se reciben tres parametros
el id del artista, nombre del artista y titulo del album */
ruta.delete('/:id/:artisticname/:title', (req, res) => {
    let resultado = quitarAlbum(req.params.id, req.params.artisticname, req.params.title);
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

async function registrarAlbum(id, artisticname, title) {

    let album = await Album.findOne({ 'title': title });
    if (!album) {
        throw new Error('¡El album no existe en la base!');
    }

    /*let artista = await Singer.findOne({ 'realname': realname });  id
    if (!artista) {
        throw new Error('¡El artista no existe en la base!');
    }*/

    let resultado = await Singer.updateOne({ 'artisticname': artisticname }, {
        $addToSet: {
            album: title //Actualiza el artista  agregando el titulo del album
                //al arreglo de album del artista. Solo agrega el titulo
                //Si este no esta en el arreglo.
                //SI el titulo ya esta en el arreglo, no se hace nada
        }
    });
    //Comprueba si se modifico el documento del artista.
    //Si no se modifico, es por que el titulo del album
    //ya existe en el arreglo de album del artista.
    //modifiedCount == 0 -> No se modifico el documento.
    //modifiedCount == 1 -> Se modifico el documento.
    if (!resultado.modifiedCount) {
        throw new Error('!El album ya esta registrado en este artista!');
    }
    //En caso de querer recuperar  el Album actualizado

    let artista = Singer.findById(id);
    return artista;
}

async function listarAlbum(id) {
    //Recupera los alumnos de un Album con id determinado
    let albums = await Singer.findById(id).select({ artisticname: 1, album: 1, _id: 0 });
    //El id del artista siempre se devuelve por default.
    //Si no lo queremos, hay que especificarlo con un 0.

    return albums;
}

async function quitarAlbum(id, artisticname, title) {
    let resultado = await Singer.updateOne({ 'artisticname': artisticname }, {
        //Extraccion de elementos dentro de un arreglo
        $pullAll: {
            //Del arreglo singers saca el title del album
            //Actualiza el artista eliminando el titulo
            //del arreglo de album.
            album: [title]
        }
    });

    //Comprueba si se modifico el documento del artista.
    //Si no se modifico es por que el titulo del album no esta en
    //el arreglo.
    if (!resultado.modifiedCount) {
        throw new Error('¡ El album no esta registrado en este artista !')
    }

    //En caso de querer recuperar el artista actualizado.
    let singer = await Singer.findById(id);
    return singer;

}

module.exports = ruta;