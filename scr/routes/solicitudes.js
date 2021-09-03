const express = require('express');
const router = express.Router();
const db = require('../database.js')
const keys = require('../keys.js')
const tozilla = require('../lib/tokenzzilla')
const monedas = require('./criptomonedasdb')
const {File} = require('file-api')

//MULTER
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./uploads/');
    },
    filename: function(req, file, cb){
        const fname = (new Date().toISOString() + file.originalname).replace(/:/g,'_')
        console.log(fname)
        cb(null, fname)
    }
})
const upload = multer({ storage: storage })

router.post('/', upload.single('ficheros'), async(req, res) => {
    const {
        nombres,
        apellidos,
        telefono,
        email,
        tipodocumento,
        numerodocumento,
        genero,
        ficheros
    } = req.body

    const sql = `INSERT INTO solicitudes SET ?`

    try {
        const {affectedRows,insertId} = await db.query(sql, {nombres,apellidos,telefono,email,tipodocumento,numerodocumento,genero})

        //AHORA PROCESAMOS LOS FICHEROS
        /*const contenido = ficheros[0].split(',')[1]
        const buffer = Buffer.from(contenido,'base64')
        const file = new File({buffer: buffer, name:'personal_rostro.jpg', type: 'image/jpeg'});
        console.log(file)
        */

        //ENVIAMOS EL RESPONSE
        console.log(req.file)
        res.send({
                    ok:insertId > 0,
                    mensaje:'Datos guardados correctamente',
                    data:{affectedRows,insertId}
                });
    } catch (error) {
        console.log(error)
        res.send({
                    ok:false,
                    mensaje:'Error al intentar guardar los datos.',
                    data:null
                });        
    }
});

router.post('/:id', async(req,res) => {
    res.setHeader('Access-Control-Allow-Origin', keys.url_coors);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    //const {personal_rostro} = req.body
    console.log("post")
    console.log(req.body)

    res.send({
            ok:false,
            mensaje:'Error al intentar subir el archivo.',
            data:null
        });       
})

module.exports = router;