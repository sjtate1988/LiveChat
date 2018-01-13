// Set up the nodejs application with router
var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* Using Socket.io */
var app = express();
var server = require('http').Server(app);
server.listen(2000);

var io = require('socket.io')(server);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});



/*  On connection of SocketIO server */
var clientName = [];
var j=0;
io.on('connection', function(socket){

// The server obtains all the login details when each client logs on
  socket.on('login_client', function(data){
    clientName.push(data);
// Send the message to welcome the user to the chatroom and pass the user list to all of the users.
    socket.emit('logged_in',{ greeting: 'Server: Welcome to the chat', clientName: clientName, numClients: j});
    io.sockets.emit('onlineUsers',{clients: clientName, numClients: j, message: clientName[clientName.length-1]+' has just logged in!'});
    j++;
  });

socket.on('client_message',function(data){
  console.log(data.message);
  io.sockets.emit('screen_input', data.clientName +': '+ data.message);
})
socket.on('logout', function(data){
  j--;
  k=clientName.indexOf(data.clientName);
  clientName.splice(k, 1);
  io.sockets.emit('onlineUsers',{clients: clientName, numClients: j});
  io.sockets.emit('userLeft', {client: data.clientName});
})


});

module.exports = app;
