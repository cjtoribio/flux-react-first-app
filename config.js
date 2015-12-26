var dbConfig = {
	dev: {
		database: process.env.MONGO_URI || 'localhost'
	}
}




var env = process.env.NODE_ENV || 'dev';
module.exports = {
	database: dbConfig[env].database
}