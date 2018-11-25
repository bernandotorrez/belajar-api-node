module.exports.controller = (index) => {  

var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require('../config/database');
/* GET home page. */

index.get('/', (req, res) => {
	res.send('tes');
})

index.get('/api/test', (req, res, next) => {
	db.query("CALL SPGetUserData ('')", function(err, rows, fields) {
   		if(err) res.send(err)
   		else res.send(rows);
	})
});

index.get('/api/test/:id', (req, res, next) => {
	var id = req.params.id;

	db.query(`CALL SPGetUserData (${id})`, function(err, rows, fields) {
   		if(err) res.send(err)
   		else res.send(rows);
	})
});

} 
