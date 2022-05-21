const express = require('express');
const ruta = express.Router();
const Singer = require('../models/singer_model');
const Joi = require('joi');

const schema = Joi.object({
    artisticname: Joi.string() //El tipo string
        .min(3) // Que tenga una longitud minima de 3
        .max(20) // Que tenga una longitud maxima de 10
        .required(), // Es obligatorio

    realname: Joi.string() //El tipo string
        .min(3) // Que tenga una longitud minima de 3
        .max(20), // Que tenga una longitud maxima de 10
    //.required(), // Es obligatorio

    nationality: Joi.string() //El tipo string
        .min(3) // Que tenga una longitud minima de 3
        .max(20) // Que tenga una longitud maxima de 10
        .required() // Es obligatorio
});

ruta.get('/', (req, res) => {
    let resultado = listarArtistasActivos();

    resultado
        .then(artistas => {
            res.json(artistas);
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
});

ruta.post('/', (req, res) => {
    let body = req.body;
    //Validamos la entrada de datos que se recuperan del body
    const { error, value } = schema.validate({ artisticname: body.artisticname, realname: body.realname, nationality: body.nationality });
    //Si los datos de entrada son validos de acuerdo
    //con el esquema que definimos, podemos guardar los datos
    if (!error) {
        let resultado = crearArtista(body);

        //Operacion a realizar dependiendo si la promesa se resolvio de manera correcta o no
        resultado
            .then(artist => {
                res.json({
                    valor: artist
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

/* En la ruta se debe especificar el artisticname
como parametro para identificar al artista
que se quiere actualizar */

ruta.put("/:realname", (req, res) => {
    //Validamos la entrada de datos que se recuperan del body
    const { error, value } = schema.validate({ artisticname: req.body.artisticname, nationality: req.body.nationality });
    //Si los datos de entrada son validos de acuerdo
    //con el esquema que definimos, podemos guardar los datos

    if (!error) {
        let resultado = actualizarArtista(req.params.realname, req.body);
        /* El resultado es una promesa qe se debe manejar
        de acuerdo con la forma en que se resuelva */
        resultado
            .then(artist => { //Si se resuelve de manera correcta, vamos a recibir el artisas
                // como resultado vamos a enviar este json formado por un atributo valor con el artista que se actualizo
                // como valor
                res.json({
                    valor: artist
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
            error: error
        });
    }

});

/* En la ruta se debe especificar el realname
como parametro para identificar al usuario
que se quiere desactivar */

ruta.delete("/:realname", (req, res) => {

    let resultado = SingerdesactivarArtista(req.params.realname);
    /* El resultado es una promesa qe se debe manejar
    de acuerdo con la forma en que se resuelva */
    resultado
        .then(artist => { //Si se resuelve de manera correcta, vamos a recibir el artista
            // como resultado vamos a enviar este json formado por un atributo valor con el artista que se actualizo
            // como valor
            res.json({
                valor: artist
            });
        })
        //En caso de que halla un error
        .catch(err => {
            res.status(400).json({
                error: err
            });
        })
        /*
        if (!error) {
            
        } else {
            res.status(400).json({
                error: error
            });
        }*/

});

async function crearArtista(body) {
    //constructor, instancia de singer
    //Al momento de crear artistas si tienes dos nombres, para representarlo en el url tendras
    //que sustituir el espacio por un %20
    let artista = new Singer({
        artisticname: body.artisticname,
        realname: body.realname,
        nationality: body.nationality
    });

    //Parte del guardado, se regresa para saber que estamos guardando
    return await artista.save();
}

//El primer parametro nos indica el atributo
//utilizado para buscar el artista que queremos actualizar
// El segundo parametro es el body del req con la
//informacion que se quiere actualizar del artista.

async function actualizarArtista(realname, body) {
    /*Para actualizar vamos a utilizar el metodo findOneAndUpdate
    El primer parametro ndica el atributo que se usara para
    buscar(identificar) al artista que se quiere actualizar, en
    este caso el realname.
    El segundo parametro incluye los cambios en los valores
    de los atributos, a partir de la informacion del body*/
    let artista = await Singer.findOneAndUpdate({ "realname": realname }, {
        $set: {
            artisticname: body.artisticname,
            nationality: body.nationality
        }
    }, { new: true }); //Parametro para devolver el documento actualizado
    return artista;
}

async function SingerdesactivarArtista(realname) {
    /*Igual que arriba, usamos la funcion findOneAndUpdate
    con el artisticname como el atrbuto para identificar al
    artista*/
    let artista = await Singer.findOneAndUpdate({ "realname": realname }, {
        $set: {
            /*Actualiza el estado del artista al false
            para desactivarlo*/
            estado: false
        }
    }, { new: true });
    return artista;
}

//Metodo para recuperar artistas
async function listarArtistasActivos() {
    let artistas = await Singer.find({ "estado": true }); //Recupera a los artistas que tengan el estado = true
    return artistas;
}

module.exports = ruta; //Se exporta el objeto que va a contener todas las rutas que definiremos dentro de este archivo.