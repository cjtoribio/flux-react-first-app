var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log(process.versions);
	console.log("master: " + process.pid);
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});
} else {
	console.log("worker: " + process.pid);
	require('./server');
}