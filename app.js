var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Set Controller
	// Require file system module 
	var fs = require('file-system');

	// Include controllers 
	fs.readdirSync('controllers').forEach(
		function (file) {  
			if(file.substr(-3) == '.js') {    
				const route = require('./controllers/' + file)    
				route.controller(app)  
			}
	})
// Set Controller


module.exports = app;
