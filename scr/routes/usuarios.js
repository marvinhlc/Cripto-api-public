const express = require('express');
const router = express.Router();
const db = require('../database.js')
const keys = require('../keys.js')
const tozilla = require('../lib/tokenzzilla')
const passords = require('../lib/passwords')

router.get('/', tozilla.tokenValido, async(req, res) => {
    const datos = await db.query("SELECT a.idusuario,a.usuario,a.credencial,a.nombre,a.fecha_insert,a.fecha_update FROM usuarios a ORDER BY a.usuario;");

    if(datos[0] == null)
        res.status(500).send({error:'Usuario no existe.'});

    res.send({datos});
});

//OBTENEMOS DATOS DEL USUARIO
router.post('/:id', async(req, res) => {
    const datos = await db.query(`SELECT 
                                    a.idusuario,
                                    a.usuario,
                                    a.credencial,
                                    a.nombre,
                                    a.fecha_insert,
                                    a.fecha_update 
                                FROM usuarios a
                                WHERE a.usuario = ?`, req.params.id);
    if(datos[0] == null)
        res.status(500).send({error:'Usuario no existe.'})

    //res.status(200).send({datos})
    let {password} = req.body;
    if(password == null)
        res.status(500).send({error:'Datos no son válidos.'})

    const usuario = datos[0]
    const valido = await passords.cryptoSha1(password, usuario.credencial);
    
    if(valido){
        res.status(200).send({
                                usuario: usuario.usuario,
                                idusuario: usuario.idusuario,
                                nombre: usuario.nombre,
                                token:tozilla.crearToken(usuario.idusuario,usuario.usuario)
                            })
    }else{
        res.status(500).send({error:'Credenciales no son validas'})
    }
});

//OBTENEMOS UN TOKEN
/*
router.get('/:id/token', async(req, res) => {
    const datos = await db.query(`SELECT 
                                    a.idusuario,
                                    a.usuario,
                                    a.credencial,
                                    a.nombre,
                                    a.fecha_insert,
                                    a.fecha_update 
                                FROM usuarios a
                                WHERE a.usuario = ?`, req.params.id);
    if(datos[0] == null)
        res.status(500).send({error:'Usuario no existe.'})

    const usuario = datos[0]
    res.status(200).send({token:tozilla.crearToken(usuario.idusuario,usuario.usuario)})

    /*
    let {password} = req.body;
    if(password == null)
        res.status(500).send({error:'Datos no son válidos.'})

    const usuario = datos[0]
    const valido = await passords.cryptoSha1(password, usuario.credencial);
    
    if(valido){
        res.status(200).send({token:tozilla.crearToken(usuario.idusuario,usuario.usuario)})
    }else{
        res.status(500).send({error:'Credenciales no son validas'})
    }
    
});
*/

module.exports = router;