//const httpServer = require("http").createServer();
//const io = require("socket.io")(httpServer, {
  // ...
//});
//
const withTimeout = (onSuccess, onTimeout, timeout) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess.apply(this, args);
  }
}

const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer, {
	cors: {
	    origin: "http://localhost:8081",
	    methods: ["GET", "POST"],
   	 credentials: true
  	},
});

io.on('connection', socket => {
  console.log('connect');
  console.log('emitting');
  var room = 'online-order-channel';
  socket.join(room)
 // io.sockets.in(room).emit('event', {orderId: 'herelo'});

 let i = 0;
 setInterval(() => {
    console.log('emmitting interval');

    io.emit(room, {data: {
      order_id: '60827d7461247013357cd234' + i,
      store_id: '5d9f24ac85f9e71d726b65c2',
    }} ,send_to_self=false);

    i ++
  }, 1000 * 30);

});

httpServer.listen(3000, () => {
  console.log('go to http://localhost:3000');
});

