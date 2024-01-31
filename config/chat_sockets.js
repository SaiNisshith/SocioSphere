module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer,{
      cors: {
        origin: ["http://localhost:8000", "http://54.173.182.105:8000"],
        methods: ["GET", "POST"]
      }
    });

    io.sockets.on('connection', (socket) => {
        console.log('new user connected', socket.id);
        socket.on('disconnect',function(){
          console.log("Socket disconnected");
        })
        socket.on('join_room',function(data){
          console.log("Joining req recieved : ", data);
          socket.join(data.chatroom);
          io.in(data.chatroom).emit('user_joined',data);
        })

        socket.on('send_message',function(data){
          io.in(data.chatroom).emit('receive_message',data);
        })
      });
}
