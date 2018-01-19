const express = require('express')
var cors = require('cors')
const app = express()

var project2_router = require('./project2');
var project_router = require('./project');
var search_router = require('./search');
var comscore_router = require('./comscore');
var nielsen_router = require('./nielsen');

var whitelist = ['http://10.14.18.5:8000', 'http://127.0.0.1:8000']
var corsOptions = {
    origin: true,/*function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },*/
    methods:['POST','GET'],
    credentials:true
}

//app.use(cors());

app.use('/project2',cors(corsOptions), project2_router);
app.use('/project',cors(corsOptions), project_router);
app.use('/search',cors(corsOptions), search_router);
app.use('/comscore',cors(corsOptions), comscore_router);
app.use('/nielsen',cors(corsOptions), nielsen_router);

app.get('/', function (req, res) {
    res.send('Hello World, node.js server started!')
})


app.post('/', function (req, res) {
    res.send('Got a POST request')
})

app.use(express.static('static')); //to static files

app.listen(3000, function () {
    console.log('Node:3000, wordpress/lamp:8080, combined on port 8000')
})

