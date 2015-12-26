var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');

module.exports = function(app){

	app.set('port', process.env.PORT || 3000);
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.static(path.join(__dirname, '../public')));



	return app;
}