var io = require('socket.io-client');
var readline = require('readline');
var socket = io('http://localhost:3001');
var os = require('os');

socket.emit('message', 'Hello!');
// socket.emit('helloServer', `Hello I'm new User`);

var accessToken = null;

socket.on('tokenUserAuthorized', (token) => {
  accessToken = token;
});

socket.on('hello', (message) => {
  writeLine(message);
});

socket.on('msg', (message) => {
  writeLine(message);
});


function writeLine(line) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(line + os.EOL);

  cli.prompt(true);
}


var cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

cli.setPrompt('> ');
cli.prompt();

cli.on('line', (line) => {
  var data = {line: line, token: accessToken};
  socket.emit('msg', data);
});