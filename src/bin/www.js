#!/usr/bin/env node
/**
 * Module dependencies.
 */
import debug from 'debug';
import http from 'http';
import app from '../app';
/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3002');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */



const onError = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        alert(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        alert(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  console.log(`listening on port ${port} ...... `)});
server.on('error', onError);
server.on('listening', onListening);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});
io  
  .of('/dimensions')
  .on("connection", (socket) => {
    console.log("New player")
    socket.emit("welcome", "Bienvenido a dimensiones y subatributos en tiempo real")

    socket.on("joinRoom", (room) => {
      socket.join(room)
      return socket.emit("success", "Se a unido a su room personal")
    })
    socket.on("leaveRoom", (room) => {
      socket.leave(room)
      return socket.emit("success", "Se ha salido de su room personal")
    })
  })
app.locals.io = io