var express = require('express')
var router = express.Router();


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

    res.send('Project home page')
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About project')
})

module.exports = router