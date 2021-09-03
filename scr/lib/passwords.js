const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passords = {};
const util = require('util');

passords.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

passords.matchPassword = async (password, savedpassword) => {
    try{
        return await bcrypt.compare(password, savedpassword)
    }catch(e){
        console.log(e);
    }
};

passords.cryptoSha1 = async (password, savedpassword) => {
    try {
        const clave = await crypto.createHash('sha1').update(password, 'binary').digest('hex');
        //console.log(clave);
        if(clave === savedpassword){
            return true;
        }
    } catch (e) {
        console.log(e);
    }
}

passords.cryptoSha1Create = async (password) => {
    try {
        const clave = await crypto.createHash('sha1').update(password, 'binary').digest('hex');
        return clave;
    } catch (e) {
        console.log(e);
    }
}

passords.mysqlFormat = async (fecha) => {
    let _dd = fecha.substring(0,2);
    let _mm = fecha.substring(3,2);
    let _yy = fecha.substring(6,4);
    const _fecha = util.format('%s-%s-%s',_yy,_mm,_dd);
    console.log(fecha);
    console.log(_dd);
    console.log(_mm);
    console.log(_yy);
    return fecha;
}

module.exports = passords;