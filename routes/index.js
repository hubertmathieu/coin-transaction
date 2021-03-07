var express = require('express');
var router = express.Router();
var session = require('express-session');
var utils = require('../utils')
const { body, validationResult } = require('express-validator');
var database = require('../database');



/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.destroy();
    res.render('index', { title: 'Hub Bank'});
});

router.get('/signup', function(req, res, next) {
    req.session.destroy();
  res.render('signup', { title: 'Inscription'});
});

router.get('/login', function(req, res, next) {
    req.session.destroy();
    res.render('login', { title: 'Connexion' });
});

router.get('/logout', function(req, res, next) {
  res.render('logout', { title: 'Log out' });
});

router.post('/login', [
    body('email').isEmail().withMessage("Votre adresse courriel n'est pas valides.").normalizeEmail(),
    body('password').isLength({ min: 1 }).withMessage("Vous devez entrer votre mot de passe.").trim().escape()]
    ,(req, res) => {

    if (!validationResult(req).isEmpty()) {
        res.render('login', { title: 'Connexion', errors: validationResult(req).array() });
    }
    database.authenticateUser(req.body, (data) => {
        if (data[0] !== undefined) {
            req.session.user = data[0];
            req.session.user.completeName = req.session.user.firstname + ' ' + req.session.user.lastname;
            res.redirect('/transaction');
        }
        res.render('login', { title: 'Connexion', errors: [{msg: "Connexion refusée"}]});
    });
});

router.post("/signup", [
    body('email').isEmail().withMessage("Votre adresse courriel n'est pas valides.").normalizeEmail(),
    body('firstname').isAlpha().withMessage("Votre prénom doit-être valide (plus que 5 charactère).").trim().escape(),
    body('lastname').isAlpha().withMessage("Votre nom doit-être valide.").trim().escape(),
    body('username').isLength({ min: 3 }).withMessage("Votre nom d'utilisateur doit-être valide.").trim().escape(),
    //faire regex pour password
    body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Votre mot de passe doit-être sécuritaire: un charactère minuscule, un charactère majuscule, un charactère spécial et un chiffre.")
    ],(req, res) =>{

    database.findUserByEmail(req.body, (data) => {
        if ((data[0] !== undefined)) {
            res.render('signup', { title: 'Inscription', errors: [{msg: "Cet email existe déjà."}]});
        } else {
            if (!validationResult(req).isEmpty()) {
                res.render('signup', { title: 'Inscription', errors: validationResult(req).array()});
            }
            database.inertUser(req.body);
            res.redirect('/login');
        }
    });
});


module.exports = router;
