var Router = require('react-router');
var routes = require('../app/routes');
var ReactDOM = require('react-dom/server');
var swig  = require('swig');
var React = require('react');
var logger= require('../utils/logger');

module.exports = function(app){

	app.use(function(req, res, next) {
		Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
			if (err) {
				res.status(500).send(parseError(500,err));
			} else if (redirectLocation) {
				res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
			} else if (renderProps) {
					var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
					var page = swig.renderFile('views/index.html', { html: html });
					res.status(200).send(page);
			} else {
					res.status(404).send(parseError(404,err));
			}
		});
	});
	
	// app.use(logger.getExpressErrorLogger());

	app.use(function(err, req, res, next) {
		logger.error(err);
		res.status(err.status || 500);
		res.send(parseError(err.status || 500, err));
	});



}


function parseError(status, err) {
	if (status == null || (status >= 500 && status <= 599) || err) {
		return {
			message: err.message,
			status: status || 500,
			code: err.code || 'UKNOWN'
		};
	}
	return {
		message: 'Action not available',
		status: 404,
		code: 'PAGE_NOT_FOUND'
	};
}


