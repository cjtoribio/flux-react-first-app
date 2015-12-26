var express = require('express');
var logger  = require('../utils/logger');

module.exports = {
	start: function(callback){
		var app = express();
		var server = null;
		
		require('./uses')(app);

		require('./characters')(app);

		require('./defaults')(app);
		
		require('./socketio')(app, srv => server = srv);

		server.listen(app.get('port'), function() {
			logger.info('Express server listening on port ' + app.get('port'));
			logger.profile('System Turn On ');
		});

		if(callback)(app, server);
		return app;
	}
}