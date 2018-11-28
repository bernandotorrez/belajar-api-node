const db = require('../config/database');
const Joi = require('joi');
const md5 = require('md5');

module.exports.controller = (login) => {

	
	// why validation.error? because the Joi callback have an object called error

	// fungsi { } pada const adalah mengextends key, contoh 
	// const { username } = req.body itu sama dengan const username = req.body.username

	const not_found = { "status": "data not found"};
	const success = { "status": "success" };

	login.get('/api/login', (req, res, next) => {

		db.query(`CALL SPGetUserData ('', '')`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows[0].length==0 || rows[0]=='') res.status(404).send(not_found);
   			else res.send(rows[0]).status(200);

   			
		});
	});


	login.post('/api/login', (req, res, next) => {
		const { username, password } = req.body;
		const { error } = validate(req.body);

		if(error){
			// 400 is bad request
		return res.status(400).send({"status" : error.details[0].message});
		
		}

		db.query(`CALL SPGetUserData ('${username}', '${md5(password)}')`, (err, rows, fields) => {
			
			if(err) res.send(err);
			else if(rows[0].length==0 || rows[0]=='') res.status(404).send(not_found);
   			else res.send(rows[0]).status(200);

   			
		});
	});

	login.put('/api/login/:username', (req, res, next) => {
		const { password, level } = req.body;
		const { username } = req.params;
		const { error } = validate({username, password, level});

		//res.send(req.params.username);
		/*db.query(`SELECT * from login WHERE username = '${req.params.username}'`, (err, rows, fields) => {
			if(err) res.status(400).send(err);return;
			else if(rows.count == 0) res.status(404).send('Not Found');
			
		});*/
		
		if(error){
			// 400 is bad request
		return res.status(400).send({"status" : error.details[0].message});
		
		}

		db.query(`UPDATE login SET level = '${level}' WHERE username = '${username}'`, (err, rows, fields) => {
			if(err) res.send(err);
			else if(rows.length==0 || rows=='') res.status(404).send(not_found);
   			else res.send(rows).status(200);

   			
		});

	});

	login.delete('/api/login/:username', (req, res, next) => {
		const { username } = req.params;
		/*var password, level;
		password = level = 'null';*/
		const [ password, level ] = 'null';
		const { error } = validate({username, password, level});

		// checking the validation
		if(error){
			return res.status(400).send(error.details[0].message);
		}

		db.query(`DELETE FROM login WHERE username = '${username}'`, (err, rows, field) => {
			if(err) res.status(400).send(err)
			else res.status(200).send(rows)
		});

	});

	function validate(params){
		const Schema = {
		username: Joi.required(),
		password: Joi.required(),
		level: Joi.required()	

		};

		const validation = Joi.validate(params, Schema);

		return validation;
	}

}
