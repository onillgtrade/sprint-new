const express = require('express');
const Aplica = express();
const path = require ('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fs = require('fs');

//Setting
Aplica.set('port', 5000);
Aplica.set('views', path.join(__dirname, 'views'));
Aplica.set('views engine', 'ejs');
Aplica.use(cookieParser());
//Routes
//Direccionamos principalmente a la siguiente direccion por defecto.
Aplica.use(require('./Routes/index'));
//Midelware
Aplica.use(morgan('dev'));

//Statics
Aplica.use(express.static(path.join(__dirname, 'public')));


//404 Handler
Aplica.use((req, res, next)=>{
    res.status(404).send('404 Not Found');
})



module.exports = Aplica;










