var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var database = require('../database')
var utils = require('../utils')
const { body, validationResult, check } = require('express-validator');
const addFundUrl = "http://credit.cegeplabs.qc.ca/api/withdraw/"


//TRANSACTION

router.get('/transaction', function(req, res, next) {
    if (req.session.user === undefined) {
        res.redirect('/login');
    } else {
        console.log(req.session.user);
        database.getTransactionByUser(req.session.user, (data) =>{
            res.render('transaction', { title: 'Transactions', transactions: data, amount: req.session.user.amount, name : req.session.user.completeName, revenue: utils.getFund(data, true), spending: utils.getFund(data, false)});
        });
    }
});





//TRANSFERT

router.get('/transfert', function(req, res, next) {
    if (req.session.user === undefined) {
        res.redirect('/login');
    } else {
        res.render('transfert', { title: 'Transfert', amount: req.session.user.amount, name : req.session.user.completeName});
    }

});

router.post("/transfert", [
    body('email').isLength({min: 1}).withMessage("Vous devez entrer une adresse couriel.").normalizeEmail(),
    body('username').isLength({min: 1}).withMessage("Vous devez entrer un nom d'utilisateur.").trim(),
    body('amount').isLength({min: 1}).withMessage("Vous devez entrer un montant à transférer.").trim()
],(req, res) => {

    if (req.session.user === undefined) {
        res.redirect('/login');
    } else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render('transfert', { title: 'Transfert', errors: errors.array(), name : req.session.user.completeName});
        }

        database.findUserByEmail(req.body, (data) => {
            if (data[0] !== undefined) {
                if (utils.decrypt(data[0].username) == req.body.username) {
                    if (req.session.user.email != req.body.email) {
                        req.session.user.amount -= parseFloat(req.body.amount);
                    }
                    database.sendTransaction(req.session.user, req.body);
                    database.receiveTransaction(req.session.user, req.body);
                    res.render('transfert', { title: 'Transfert', success: "La transaction a été effectuée.", amount: req.session.user.amount, name : req.session.user.completeName});
                }
            }
            res.render('transfert', { title: 'Transfert', errors: [{msg: "La transaction a échoué"}], amount: req.session.user.amount, name : req.session.user.completeName});
        });
    }
});


//FUND

router.get('/fund', function(req, res, next) {
    if (req.session.user === undefined) {
        res.redirect('/login');
    } else {
        res.render('fund', { title: 'Ajout de fond' , amount: req.session.user.amount, name : req.session.user.completeName});
    }

});

router.post("/fund", [
    body('credit').isLength({min: 1}).withMessage("Vous devez entrer une carte de crédit.").trim(),
    body('expiration').isLength({min: 1}).withMessage("Vous devez entrer une date d'expiration.").trim(),
    body('amount').isLength({min: 1}).withMessage("Vous devez entrer un montant.").trim()
    //body('expiration').matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/).withMessage("La date n'existe pas.")
], (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/login');
    } else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.render('fund', { title: 'Ajout de fond', errors: errors.array(), amount: req.session.user.amount, name : req.session.user.completeName});
        }
        addFund(res, req);
    }
});

function addFund(res, req) {
    console.log(utils.transformExpiration(req.body.expiration));
    var url = addFundUrl + req.body.credit + "?amt=" + req.body.amount + "&exp=" + utils.transformExpiration(req.body.expiration);
    fetch(url, {
        method:'POST'
    })
        .then(res => res.json())
        .then(text => {
            console.log(text);
            if (text["status"] == "success") {
                console.log("ça marche");
                req.session.user.amount += parseFloat(req.body.amount);
                database.addFund(req.session.user, req.body.amount);
                res.render('fund', { title: 'Ajout de fond', success: "La transaction a été effectée", amount: req.session.user.amount, name : req.session.user.completeName});
            } else {
                res.render('fund', { title: 'Ajout de fond', errors: [{msg: "La transaction a échoué"}], amount: req.session.user.amount, name : req.session.user.completeName});
            }
        });
}





module.exports = router;
