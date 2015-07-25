
module.exports = function (app) {
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  http.listen(3000, function () {
    console.log("Listening on port = ", 3000);
  });

  var nickNames = {};

  io.on('connection', function (socket) {
    socket.on('disconnect', function (data) {
      delete nickNames[socket.userName];
      io.sockets.emit('user names', nickNames);
    });

    socket.on("chat message", function (msg) {
      console.log("Message: ", msg);
      io.sockets.emit('new message', msg);
    });

    socket.on("new user", function (newUser, cb) {
      console.log("New User: ", newUser);
      if (!nickNames[newUser]) {
        nickNames[newUser] = true;
        io.sockets.emit('user names', nickNames);
        cb(newUser);
        socket.userName = newUser;
      } else {
        cb(null);
      }
    });

  });
};
