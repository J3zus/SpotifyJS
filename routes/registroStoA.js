const express = require('express');
const ruta = express.Router();
const Album = require('../models/album_model');
const Song = require('../models/song_model');


ruta.get('/:id', (req, res) => {
    let resultado = listarSong(req.params.id)
    resultado
        .then(song => {
            res.json(song);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

/*
Peticion para registrar una cancion
en un album. Se reciben tres parametros
el id del album, nombre del album  y el nombre de la cancion*/
ruta.post('/:id/:titlealbum/:titlesong', (req, res) => {

    console.log("Bandera");

    let resultado = registrarSong(req.params.id, req.params.titlealbum, req.params.titlesong);
    resultado
        .then(song => {
            res.json({
                valor: song
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

/*
Peticion para quitar una cancion
de un album. Se reciben tres parametros
el id del album, nombre del album y titulo de la cancion */
ruta.delete('/:id/:titlealbum/:titlesong', (req, res) => {
    let resultado = quitarAlbum(req.params.id, req.params.titlealbum, req.params.titlesong);
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

async function registrarSong(id, titlealbum, titlesong) {

    let song = await Song.findOne({ 'title': titlesong });
    if (!song) {
        throw new Error('¡La cancion no existe en la base!');
    }

    let resultado = await Album.updateOne({ 'title': titlealbum }, {
        $addToSet: {
            song: titlesong //Actualiza el album  agregando el titulo de la cancion
                //al arreglo de song del album. Solo agrega el titulo
                //Si este no esta en el arreglo.
                //SI el titulo ya esta en el arreglo, no se hace nada
        }
    });
    //Comprueba si se modifico el documento de las canciones.
    //Si no se modifico, es por que el nombre de la cancion
    //ya existe en el arreglo de song del album.
    //modifiedCount == 0 -> No se modifico el documento.
    //modifiedCount == 1 -> Se modifico el documento.
    if (!resultado.modifiedCount) {
        throw new Error('!La cancion ya esta registrado en este album!');
    }
    //En caso de querer recuperar el Album actualizado

    let album = Album.findById(id);
    return album;
}

async function listarSong(id) {
    //Recupera las canciones  de un Album con id determinado
    let albums = await Album.findById(id).select({ title: 1, genre: 1, year: 1, song: 1, _id: 0 });
    //El id del artista siempre se devuelve por default.
    //Si no lo queremos, hay que especificarlo con un 0.

    return albums;
}

async function quitarAlbum(id, titlealbum, titlesong) {
    console.log(titlesong);
    let resultado = await Album.updateOne({ 'title': titlealbum }, {
        //Extraccion de elementos dentro de un arreglo
        $pullAll: {
            //Del arreglo singers saca la cancion del album
            //Actualiza el album eliminando el titulo
            //del arreglo de song.
            song: [titlesong]
        }
    });

    //Comprueba si se modifico el documento del album.
    //Si no se modifico es por que el titulo de la cancion no esta en
    //el arreglo.
    if (!resultado.modifiedCount) {
        throw new Error('¡ La cancion no esta registrado en este artista !')
    }

    //En caso de querer recuperar el artista actualizado.
    let album = await Album.findById(id);
    return album;

}

module.exports = ruta;