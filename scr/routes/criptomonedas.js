const express = require('express');
const router = express.Router();
const db = require('../database.js')
const keys = require('../keys.js')
const tozilla = require('../lib/tokenzzilla')
const monedas = require('./criptomonedasdb')

router.post('/', tozilla.tokenValido, async(req, res) => {
    const datos = monedas;

    if(datos == null)
        res.status(500).send({error:'No existe en la base de datos.'});

    res.send({datos});
});

module.exports = router;