class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.socket = io.connect('http://54.173.182.105:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect',function(){
            console.log("Connection Established using sockets");
            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom : 'SocioSphere'
            })
            self.socket.on('user_joined',(data)=>{
                console.log('a user joined ',data);
            });
        });

        //send a message on clicking the send message button 
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if(msg!=''){
                self.socket.emit('send_message',{
                    message : msg,
                    user_email: self.userEmail,
                    chatroom : 'SocioSphere'
                })
            }
            $('#chat-message-input').val("");
        })

        self.socket.on('receive_message',function(data){
            console.log("message received", data.message);
            let dis = $('#chat-messages-list');
            let details = "message other";
            console.log(data.user_email,self.userEmail);
            if(data.user_email == self.userEmail){
                details = "message you";
            }
            dis.append(`<li class="${details}">${data.message}<br><small>${data.user_email}</small></li>`);

            
        })
    }
}
