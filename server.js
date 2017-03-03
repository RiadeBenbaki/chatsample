var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var onlineusers = [];

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {  
    console.log('Connected...');


  client.on('messages',function(data) { 

         client.broadcast.emit('messages',{ content : data.content,sender : data.sender});
         client.emit('messages',{ content : data.content,sender : data.sender });
  });

  client.on('setusername',function(data) {
  	client.username = data;
  	onlineusers.push(client.username);
  	 client.broadcast.emit('onlineusers',onlineusers);
  	 client.emit('onlineusers',onlineusers);

});


  client.on('disconnect', function() {
      var index = onlineusers.indexOf(client.username);
      if(index > -1) { onlineusers.splice(index, 1);}
client.broadcast.emit('onlineusers',onlineusers);
  	 client.emit('onlineusers',onlineusers);

  });

});  

server.listen(4200);  