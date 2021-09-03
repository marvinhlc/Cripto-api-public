const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//ROUTERS
app.use(function(req, res, next){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    //midleware cors
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", 
        "GET, POST, OPTIONS, PUT, PATCH, DELETE")
        return res.status(200).json({});
    }

    console.log('caching...');
    next();
});

//ROUTER-BASE
app.get('/', (req,res) => {
    res.send("hola mundo!")
})

//ROUTER-USUARIOS
app.use('/usuarios', require('./scr/routes/usuarios.js'))
app.use('/criptomonedas', require('./scr/routes/criptomonedas'))
app.use('/api/v1/solicitudes', require('./scr/routes/solicitudes'))


//START SERVER
//app.use(cors)//se maneja con un midleware escrito arriba
app.set('port', process.env.PORT || 3005)
app.listen(app.get('port'), () => {
    console.log("Running...")
})