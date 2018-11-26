const db = require('../config/database');
const Joi = require('joi');
const md5 = require('md5');

module.exports.controller = (login) => {

	

	// why validation.error? because the Joi callback have an object called error


	login.post('/api/login', (req, res, next) => {
		const { email, password } = req.body;
		const { error } = validate(req.body);

		if(error){
			// 400 is bad request
		res.status(400).send(error.details[0].message);
		return;
		}

		db.query(`CALL SPGetUserData ('${email}', '${password}')`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows.length==0 || rows=='') res.status(404).send('not found');
   			else res.send(rows[0]).status(200);

   			
		});
	});

	login.put('/api/login', (req, res, next) => {
		const { email, password, nama } = req.body;
		const { error } = validate(req.body);
		
		if(error){
			// 400 is bad request
		res.status(400).send(error.details[0].message);
		return;
		}

		db.query(`UPDATE users SET name = '${nama}' WHERE email = '${email}' AND password = '${password}'`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows.length==0 || rows=='') res.status(404).send('not found');
   			else res.send(rows).status(200);

   			
		});

	});

	function validate(params){
		const Schema = {

		email: Joi.string().min(1).required(),
		password: Joi.required(),
		nama: Joi.required()	

		};

		const validation = Joi.validate(params, Schema);

		return validation;
	}

}