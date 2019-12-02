#!/usr/bin/env node

/** Module dependencies.*/
let app = require('../app');
let debug = require('debug')('back-end:server');
let http = require('http');
const config = require('../config/network');
const logColor = require('../src/untils/logColor');
const service = require('./services');

/** Get port from environment and store in Express.*/
let port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/** Create HTTP server.*/
let server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', function (socket) {
  let mac = socket.handshake.query.mac;
  console.log("Query: ", socket.handshake.query.mac);
  setInterval(async function(){
    let data = service.fakeData(mac)
    let topic = "health_"+data.mac;
    socket.emit(topic, data);
  }, 3000);
  /** My thesis*/
  // let old_time = "";
  // setInterval(async function(){
  //   let data = await service.getNewestData(mac);
  //   let topic = "health_"+data.mac;
  //   if(data.time !== old_time){
  //     old_time = data.time;
  //     socket.emit(topic, data);
  //   }
  // }, 3000)
  /**---------------*/
  socket.on("disconnect", function () {
    console.log("Client disconnected!!!")
  })
});

/** Listen on provided port, on all network interfaces.*/
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/** Normalize a port into a number, string, or false.*/
function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

/** Event listener for HTTP server "error" event.*/
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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

/** Event listener for HTTP server "listening" event.*/
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  logColor(`Listening on: color:yellow${bind}`);
}

logColor(`color:light_blue
███╗   ███╗██╗██████╗  █████╗ ███╗   ██╗██████╗     ██████╗ 
████╗ ████║██║██╔══██╗██╔══██╗████╗  ██║██╔══██╗    ╚════██╗
██╔████╔██║██║██████╔╝███████║██╔██╗ ██║██║  ██║     █████╔╝
██║╚██╔╝██║██║██╔══██╗██╔══██║██║╚██╗██║██║  ██║     ╚═══██╗
██║ ╚═╝ ██║██║██████╔╝██║  ██║██║ ╚████║██████╔╝    ██████╔╝
╚═╝     ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝     ╚═════╝ 
`);
