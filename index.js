// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;
var isBuzzed = false;

io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('allow answer', function (data) {
    socket.broadcast.emit('allowed answer', {
      allowAnswer: data
    });
  });

  socket.on('click button', function (data) {
    if (isBuzzed) {
      return;
    }
    isBuzzed = true;


    // tell you that you clicked
    socket.emit('button clicked', {
      username: data
    });
    console.log(data);
    // tell everyone else that there was a click
    socket.broadcast.emit('button clicked', {
      username: data
    });
  });


  socket.on('clear', function (data) {
    isBuzzed = false;
    console.log('clear', data);
    if (data.isCorrect) {
      // console.log('correct', data);
      socket.broadcast.emit('answer is correct', {
        username: data.username
      });
    } else {
      socket.broadcast.emit('answer is wrong', {
        username: data.username
      });
    }
    socket.broadcast.emit('cleared');
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.user = {
      username: username,
      score: 0
    };
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
      isBuzzed: isBuzzed
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      user: socket.user,
      numUsers: numUsers
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        user: socket.user,
        numUsers: numUsers
      });
    }
  });
});
