var express = require('express')
var router = express.Router();

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
});


var a=0;
server.listen(3001, function() { });
console.log('okay')
// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
var connection;

wsServer.on('connect', function(resp) {


    console.log('connect '+resp);
    setInterval(function(){
        a=a+1
        console.log(a);
        connection.send('got it bro '+a)
    },10000)

});

wsServer.on('request', function(request) {
    connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.

    console.log('from '+request.origin);

    connection.on('message', function(message) {
        console.log('received from '+request.origin+':'+JSON.stringify(message))
        connection.send('got it bro')
    });

    connection.on('close', function(connection) {
        console.log('test2'+connection)
    });
});

wsServer.on('close', function(webSocketConnection, closeReason, description) {

        console.log(webSocketConnection+' '+ closeReason+' '+ description)

});






// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {

    var fs= require('fs')
    console.log('Starting')
    var content=fs.readFileSync("package.json");
    var config=JSON.parse(content)
    console.log('Contents: '+config.name)
    console.log('carry on executing')

    res.send('Project 2 home page')
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About project')
})

module.exports = router