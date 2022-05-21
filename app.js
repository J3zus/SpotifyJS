// Program Name: Practica 3
//Author: Blas Fuentes
//Description: Assignament3 for the STCS
//Date: 05/20/2022

//Habilitar demon de la base de datos
//mongod --dbpath "C:\Users\bdjmo\OneDrive - Universidad de Guanajuato\Ditecma\STCS\Code\mongodb5\db"

//Importar los paquetes necesarios
const express = require('express');
const mongoose = require('mongoose');
const singer = require('./routes/singer');
const album = require('./routes/album');
const registroAtoS = require('./routes/registroAtoS');
const registroStoA = require('./routes/registroStoA');
const song = require('./routes/song');
const app = express();


//Funciones Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/singer', singer);
app.use('/api/album', album);
app.use('/api/song', song);
app.use('/api/registroAtoS', registroAtoS);
app.use('/api/registroStoA', registroStoA);

const port = process.env.PORT || 3000;

//Funcion callback para saber si se pudo abrir el puerto
app.listen(port, () => {
    console.log(`API REST OK y escuchando en el puerto ${port}...`);
});

mongoose.connect('mongodb://localhost:27017/Practica3')
    .then(() => console.log('Conectado a Mongodb!'))
    .catch(err => console.log('No se puede conectar con MongoDB', err));