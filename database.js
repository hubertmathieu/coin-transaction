var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';
const utils = require('./utils')
const crypto = require('crypto');


exports.findAllUsers = function (callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').find().toArray(function(err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
}

exports.findUserByEmail = function (user ,callback) {
    console.log(user.email);
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').find({email: user.email, username: user.username}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
}

exports.authenticateUser = function ( user ,callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').find({email: user.email, password: utils.getHash(user.password)}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
}

exports.inertUser = function (user) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log(utils.getHash(user.password));
        db.db('hubbank').collection('users').insertOne({firstname: user.firstname, lastname: user.lastname, username: utils.encrypt(user.username), password: utils.getHash(user.password),email: user.email, amount: 1000, transaction: []},function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}


exports.addFund = function (user, fund) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').update({email: user["email"]}, {$push: {transaction: {email: user["email"], amount: fund, date: utils.date(), isProfit: true}}, $inc: {amount: parseFloat(fund)}},function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}

exports.findUserByEmail = function ( form,callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').find({email: form.email}).toArray(function (err, result) {
            if (err) throw err;
            callback(result);
            db.close();
        });
    });
}

exports.sendTransaction = function (user, receiver) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').update({email: user["email"]}, {$push: {transaction: {email: receiver.email, amount: receiver.amount, date: utils.date(), isProfit: false}}, $inc: {amount: -parseFloat(receiver.amount)}},function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}

exports.receiveTransaction = function (user, receiver) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').update({email: receiver.email}, {$push: {transaction: {email: user["email"], amount: receiver.amount, date: utils.date(), isProfit: true}}, $inc: {amount: parseFloat(receiver.amount)}},function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}

exports.getTransactionByUser = function (user, callback) {
    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db('hubbank').collection('users').find({email: user["email"]}).toArray(function (err, result) {
            if (err) throw err;
            callback(result[0].transaction.reverse());
            db.close();
        });
    });
}
