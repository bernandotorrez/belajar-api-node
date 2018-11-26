const db = require('../config/database');
const Joi = require('joi');
const md5 = require('md5');

module.exports.controller = (login) => {

	
	// why validation.error? because the Joi callback have an object called error

	// fungsi { } pada const adalah mengextends key, contoh 
	// const { username } = req.body itu sama dengan const username = req.body.username

	login.post('/api/login', (req, res, next) => {
		const { username, password } = req.body;
		const { error } = validate(req.body);

		if(error){
			// 400 is bad request
		res.status(400).send(error.details[0].message);
		return;
		}

		db.query(`CALL SPGetUserData ('${username}', '${md5(password)}')`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows.length==0 || rows=='') res.status(404).send('not found');
   			else res.send(rows[0]).status(200);

   			
		});
	});

	login.put('/api/login/:username', (req, res, next) => {
		const { password, level } = req.body;
		const { error } = validate(req.body);

		//res.send(req.params.username);
		/*db.query(`SELECT * from login WHERE username = '${req.params.username}'`, (err, rows, fields) => {
			if(err) res.status(400).send(err);return;
			else if(rows.count == 0) res.status(404).send('Not Found');
			

		});*/
		
		if(error){
			// 400 is bad request
		res.status(400).send(error.details[0].message);
		return;
		}

		db.query(`UPDATE login SET level = '${level}' WHERE username = '${username}'`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows.length==0 || rows=='') res.status(404).send('not found');
   			else res.send(rows).status(200);

   			
		});

	});

	function validate(params){
		const Schema = {

		password: Joi.required(),
		level: Joi.required()	

		};

		const validation = Joi.validate(params, Schema);

		return validation;
	}

}