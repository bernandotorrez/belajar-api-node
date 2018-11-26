const db = require('../config/database');

module.exports.controller = (index) => {  

/*if(rows.length == 0) res.send('satu');
else if(rows.length > 0) res.send('lebih dari satu');*/

index.get('/', (req, res) => {
	res.send('tes');
})

index.get('/api/test', (req, res, next) => {
	db.query("CALL SPGetUserData ('')", function(err, rows, fields) {
		if(err) res.send(err);
   		else res.status(200).send(rows[0]);
	})
});

index.get('/api/test/:id', (req, res, next) => {
	const id = req.params.id;

	db.query(`CALL SPGetUserData ('${id}')`, function(err, rows, fields) {
   		if(err) res.send(err);
		else if(rows[0].length==0 || rows[0] == '') res.status(404).send('empty');
   		else res.status(200).send(rows[0]);
	})
});	
} 
