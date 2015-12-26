var config   = require('../config');
var mongoose = require('mongoose');
var Character = require('./character');

module.exports = {

	start: function(){
		mongoose.connect(config.database);
		mongoose.connection.on('error', function() {
		  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
		});
	},
	Character: Character,

}