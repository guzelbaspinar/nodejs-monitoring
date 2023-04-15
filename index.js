
/**
 * Module dependencies.
 */
// var app = require('./app');
import { app, register } from './app';
var debug = require('debug')('backend:server');
var http = require('http');

import config from './config';
import SQLDB from './db/sql';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

(async () => {
  try {
    const sqlDb = new SQLDB(register)
    await sqlDb.connect(config.DB)
    server.listen(port, () => {
      console.log(`Server listening on port:${port}`);
    });
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (err) {
    throw err;
  }
})();


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  console.log('Server Listening => ', addr);
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

const unexpectedErrorHandler = (error) => {
  console.log(`Uncaught Error: ${error.message} ${error.stack}`);
};

process.on('uncaughtException', unexpectedErrorHandler);

process.on("exit", (code) => {
  console.log("Process exited with code: ", code);
});

