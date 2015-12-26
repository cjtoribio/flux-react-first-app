

module.exports = function(app, callback) {

	var server = require('http').createServer(app);
	var io = require('socket.io')(server);
	var onlineUsers = 0;

	io.sockets.on('connection', function(socket) {
		onlineUsers++;

		io.sockets.emit('onlineUsers', {
			onlineUsers: onlineUsers
		});

		socket.on('disconnect', function() {
			onlineUsers--;
			io.sockets.emit('onlineUsers', {
				onlineUsers: onlineUsers
			});
		});
	});

	callback(server);
	return server;
}