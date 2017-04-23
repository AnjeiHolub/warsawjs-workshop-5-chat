var http = require('http');

var io = require('socket.io');

var uuidV4 = require('uuid/v4');


var createServer = function () {

    return new Promise((resolve, reject) => {

        var server = http.createServer();

        server.on('listening', () => resolve(server));

        server.on('error', reject);
        server.listen(3001);
    });




};

var users = [];

createServer().then((server) => {
    // console.log('started');
    
    var socket = io(server);
    socket.on('connection', (socket) => {
        socket.emit('hello', `hello user ${socket.id}`);
        socket.on('message', (msg) => {
            console.log(msg);
            socket.broadcast.emit('message', msg);


        });
        // socket.on('helloServer', (msg) => {
        //     console.log(msg);
        // });

        socket.on('msg', (msg) => {
            if (msg.line[0] === '/' && msg.line.slice(1).startsWith('register')) {
                var registerUser = true;
                var user = msg.line.split(' ');
                user.splice(0, 1);

                for (i = 0; i < users.length; i++) {
                    if (users[i].identifier === user[0]) {
                        console.log('Nazwa usera jest zajęta');
                        registerUser = false;
                        break;
                    }
                }

                if (registerUser) {
                    users.push({ identifier: user[0], password: user[1]});
                    console.log(user);
                }

            } else if (msg.line[0] === '/' && msg.line.slice(1).startsWith('login')) {
                var userLogin = msg.line.split(' ');

                userLogin.splice(0, 1);

               for (strNumber = 0; strNumber < users.length; strNumber++)
                {
                    if (users[strNumber].identifier === userLogin[0]) {
                        if (users[strNumber].password === userLogin[1]) {
                            console.log('User został zalogowany!');
                            users[strNumber].token = uuidV4();
                            socket.emit('tokenUserAuthorized', users[strNumber].token);
                            break;
                        }
                                                
                    }
                }
            } else {
                console.log(msg.token);
                for (i = 0; i < users.length; i++) {
                    if (users[i].token === msg.token) {
                        socket.broadcast.emit('msg', msg.line);
                        break;
                    }
                }
                
            }
            
        })
    })
}).catch(() => {
    console.log('error');
});

