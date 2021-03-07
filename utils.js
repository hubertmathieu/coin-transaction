require('dotenv').config();
const crypto = require("crypto");
const secret = process.env.SECRET;
const algorithmHash = process.env.ALGORITHN_HASH;
const algorithmCrypto = process.env.ALGORITHM_CRYPTO;
const password = process.env.PASSWORD;


exports.encrypt = function (text){
    const cipher = crypto.createCipher(algorithmCrypto,password);
    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

exports.decrypt = function (text){
    const decipher = crypto.createDecipher(algorithmCrypto,password);
    let decrypted = decipher.update(text,'hex','utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


exports.date = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}


exports.getHash = function (text) {
    return crypto.createHmac(algorithmHash, secret)
        .update(text)
        .digest('hex');
}

exports.transformExpiration = function (expiration) {
    if (expiration.charAt(2) != '/' && expiration.charAt(2) != '-') {
        return [expiration.slice(0, 2), "-", expiration.slice(2)].join('');
    }
    return expiration.substring(0, 2) + "-" + expiration.substring(3);
}

exports.getFund = function (transactions, isProfit) {
    var spends = 0;
    transactions.forEach( element => {
            if (element['isProfit'] == isProfit) {
                spends += parseFloat(element['amount']);
            }
        }
    );
    return spends;
}



