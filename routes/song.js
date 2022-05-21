const express = require('express');
const ruta = express.Router();
const Song = require('../models/song_model')
const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string() //El tipo string
        .min(3) // Que tenga una longitud minima de 3
        .max(20) // Que tenga una longitud maxima de 10
        .required(), // Es obligatorio

    tracknumber: Joi.number() //El tipo numero
        .min(1)
        .max(20)
        .required(), // Es obligatorio

    lengthtrack: Joi.number() //El tipo numero
        .min(1)
        .max(1000) //Aqui son segundos
        .required() // Es obligatorio

});

ruta.get('/', (req, res) => {
    let resultado = listarCancionesActivas();

    resultado
        .then(canciones => {
            res.json(canciones);
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
    const { error, value } = schema.validate({ title: body.title, tracknumber: body.tracknumber, lengthtrack: body.lengthtrack });
    //Si los datos de entrada son validos de acuerdo
    //con el esquema que definimos, podemos guardar los datos
    if (!error) {
        let resultado = crearCancion(body);

        //Operacion a realizar dependiendo si la promesa se resolvio de manera correcta o no
        resultado
            .then(song => {
                res.json({
                    valor: song
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
como parametro para identificar la cancion
que se quiere actualizar */

ruta.put("/:id", (req, res) => {
    //Validamos el nombre que tomamos del body
    const { error, value } = schema.validate({ title: req.body.title })

    if (!error) {
        let resultado = actualizarCancion(req.params.id, req.body);
        /* El resultado es una promesa qe se debe manejar
        de acuerdo con la forma en que se resuelva */
        resultado
            .then(song => { //Si se resuelve de manera correcta, vamos a recibir la cancion
                // como resultado vamos a enviar este json formado por un atributo valor con la cancion  que se actualizo
                // como valor
                res.json({
                    valor: song
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

/* En la ruta se debe especificar el email
como parametro para identificar al usuario
que se quiere desactivar */

ruta.delete("/:id", (req, res) => {

    if (!error) {
        let resultado = desactivarCancion(req.params.id);
        /* El resultado es una promesa qe se debe manejar
        de acuerdo con la forma en que se resuelva */
        resultado
            .then(song => { //Si se resuelve de manera correcta, vamos a recibir el usuario
                // como resultado vamos a enviar este json formado por un atributo valor con el usuario que se actualizo
                // como valor
                res.json({
                    valor: song
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

async function crearCancion(body) {
    //constructor, instancia de la cancion
    let cancion = new Song({
        title: body.title,
        tracknumber: body.tracknumber,
        lengthtrack: body.lengthtrack
    });

    //Parte del guardado, se regresa para saber que estamos guardando
    return await cancion.save();
}

//El primer parametro nos indica el atributo
//utilizado para buscar la cancion que queremos actualizar
// El segundo parametro es el body del req con la
//informacion que se quiere actualizar la cancion.

async function actualizarCancion(id, body) {
    /*Para actualizar vamos a utilizar el metodo findOneAndUpdate
    El primer parametro ndica el atributo que se usara para
    buscar(identificar) al usuario que se quiere actualizar, en
    este caso el tracknumber.
    El segundo parametro incluye los cambios en los valores
    de los atributos, a partir de la informacion del body*/
    let cancion = await Song.findOneAndUpdate({ "_id": id }, {
        $set: {
            title: body.title,
            tracknumber: body.tracknumber,
            lengthtrack: body.lengthtrack
        }
    }, { new: true }); //Parametro para devolver el documento actualizado
    return cancion;
}

async function desactivarCancion(id) {
    /*Igual que arriba, usamos la funcion findOneAndUpdate
    con el tracknumber como el atrbuto para identificar la cancion*/
    let cancion = await Song.findOneAndUpdate({ "_id": id }, {
        $set: {
            /*Actualiza el estado la cancion al false
            para desactivarlo*/
            estado: false
        }
    }, { new: true });
    return cancion;
}

//Metodo para recuperar canciones
async function listarCancionesActivas() {
    let canciones = await Song.find({ "estado": true }); //Recupera a las canciones que tengan el estado = true
    return canciones;
}

module.exports = ruta; //Se exporta el objeto que va a contener todas las rutas que definiremos dentro de este archivo.