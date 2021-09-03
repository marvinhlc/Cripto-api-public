'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

let EXP_DAYS            = 'days';
let EXP_HOURS           = 'hours';
let EXP_YEARS           = 'years';
let EXP_MONTHS          = 'months';
let EXP_WEEKS           = 'weeks';
let EXP_MINUTES         = 'minutes';
let EXP_SECONDS         = 'seconds';
let EXP_MILLISECONDS    = 'milliseconds';
let EXP_QUARTERS        = 'quarters';

function tokenValido(req, res, next){
    var auto = req.headers.authorization
    if(!auto){
        return res.status(403).send({ message: 'No tienes autorización'})
    }
    var token = req.headers.authorization.split(' ')[1]
    var promesa = new Promise(function(resolve, reject) {
            try {
                let payload = jwt.decode(token, config.SECRET_TOKEN)
                resolve(payload);
            } catch (error) {
                reject();
            }
    });
    
    promesa.then(function(payload){
        res.sub = payload.sub;
        next()
    }, function error(data){
        res.status(401).send({message:'Token no es valido'})
    });
}

function crearToken(idusuario,usuario)
{
    const payload = {
        sub: idusuario,
        iat: moment().unix(),
        exp: moment().add(config.MINUTES_EXPIRATION_TOKEN , EXP_MINUTES).unix(),
        user: usuario
    }    

    return jwt.encode(payload, config.SECRET_TOKEN)
}

module.exports = {
    tokenValido,
    crearToken
}