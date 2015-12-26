var logger = require('./utils/logger');
var async = require('async');
logger.profile('System Turn On ');

// Babel ES6/JSX Compiler
require('babel-register');


require('./models').start();
require('./endpoints').start();