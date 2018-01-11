var _=require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var sessions = require("client-sessions");

var router = express.Router();
var sessionID=Math.floor(Math.random() * 1000000000);
var request;
var results;
var resultsRemaining;
var item;
var fullfillmentText;
//http://127.0.0.1:3000/search?lastname=roosevelt&firstname=franklin&category=president&year=1933
router.use(bodyParser.json());
// middleware that is specific to this router
router.use(sessions({
    cookieName: 'myNodeSession', // cookie name dictates the key name added to the request object
    secret: 'superjonbotReallyLikesSpagettiCarbonara_1abcdefhddvdvsg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));
var capitalizeFirstLetter=function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var getResultsfromServer= function(req){
    var fs= require('fs');
    var content=fs.readFileSync("static/db.json");
    var results=JSON.parse(content);
    var searchString=undefined;

    //!**LASTNAME SEARCH**!/
    if (req.query.lastname){
        searchString=req.query.lastname;
        results=_.filter(results, function(value,key){
            return value.Category.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.Title.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.Caption.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.KEYWORDS.toLowerCase().indexOf(searchString.toLowerCase())!=-1
        })
    }

    //!**FIRSTNAME SEARCH**!/
    if (req.query.firstname){
        searchString=req.query.firstname;
        results=_.filter(results, function(value,key){
            return value.Category.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.Title.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.Caption.toLowerCase().indexOf(searchString.toLowerCase())!=-1 ||
                value.KEYWORDS.toLowerCase().indexOf(searchString.toLowerCase())!=-1
        })
    }

    //!**CATEGORY SEARCH**!/
    if (req.query.category){
        searchString=req.query.category;
        results=_.filter(results, function(value,key){
            return value.Category.toLowerCase().indexOf(searchString.toLowerCase())!=-1
        })
    }

    //!**YEAR SEARCH**!/
    if (req.query.year){
        searchString=req.query.year;

        if(isNaN(req.query.year)) {

            searchString=searchString.substring(0,4);
            console.log('searching for match '+searchString)
            if(searchString.substring(2,4)=='00'){
                //century match
                results=_.filter(results, function(value,key){
                    return String(value.YEAR).substring(0,2)==searchString.substring(0,2)
                })
            } else {
                //decade match
                results=_.filter(results, function(value,key){
                    return String(value.YEAR).substring(0,3)==searchString.substring(0,3)
                })


            }


        } else {
            //exact year match search
            console.log('searching for match '+searchString)
            results=_.filter(results, function(value,key){
                return Number(value.YEAR)==Number(searchString)
            })

        }

    }


    console.log('db items: '+results.length)
    console.log('Results: '+results.length+' ::: finding '+searchString);
    return results;
}


var getResultsfromPost= function(req){

    //form post like regular get request

    var reqResults=req.body.result;
    var reqParams=reqResults.parameters;
    var queryObj={query:{}}

    if(reqParams["given-name"].length!=0){queryObj.query.firstname=reqParams["given-name"]}
    if(reqParams["last-name"].length!=0){queryObj.query.lastname=reqParams["last-name"]}
    if(reqParams["speech_categories"].length!=0){queryObj.query.category=reqParams["speech_categories"]}
    if(reqParams["speech_decades"].length!=0){queryObj.query.year=reqParams["speech_decades"]}
    if(reqParams["my-action"].length!=0){queryObj.query['my-action']=reqParams["my-action"]}

   return getResultsfromServer(queryObj)

}




var checkPostSession = function (req, res, next) {
    console.log('check post session...')
    req.query=JSON.stringify(req.body.result.parameters)

    var isAnewQuery=req.myNodeSession.lastquery!=JSON.stringify(req.query);
    console.log('iHasCookiesSet?'+req.myNodeSession.iHasCookiesSet+' isAnewQuery?'+isAnewQuery+' (results!=undefined):'+(results!=undefined));

    if (req.myNodeSession.iHasCookiesSet && !isAnewQuery && (results!=undefined)) {
        request='continued';
        console.log('* continued request *')
    } else {
        request='new';
        console.log('* NEW request *')
        results=getResultsfromPost(req)
        //RANDOMIZE?
        if (JSON.parse(req.query)['my-action']=='playrandom') {
            console.log('randomizing results')
            results=shuffle(results)
        }
        resultsRemaining=results.slice();
        console.log('req.myNodeSession.totalResults'+req.myNodeSession.totalResults)
    }
    next()
}


var checkSession = function (req, res, next) {
    console.log('check get session')
    var isAnewQuery=req.myNodeSession.lastquery!=JSON.stringify(req.query);
    //console.log('iHasCookiesSet?'+req.myNodeSession.iHasCookiesSet+' isAnewQuery?'+isAnewQuery);

    if (req.myNodeSession.iHasCookiesSet && !isAnewQuery && (results!=undefined)) {
        request='continued';
        console.log('* continued request *')
    } else {
        request='new';
        console.log('* NEW request *')
        results=getResultsfromServer(req)

        resultsRemaining=results.slice();
        console.log('req.myNodeSession.totalResults'+req.myNodeSession.totalResults)
    }

    next()
}

var chooseData = function (req, res, next) {
    console.log('chooseData')
   // var randomIndex=Math.floor(Math.random() * resultsRemaining.length-1);     // returns a number between 0 and 9
    item=resultsRemaining.pop()

    if(req.query.category){
        var category=capitalizeFirstLetter(req.query.category)+' '
    }else{
        var category='';
    }

    fullfillmentText="Here's "+category+"speech "+(results.length-resultsRemaining.length)+" of "+results.length

   if ((item==undefined)&&resultsRemaining.length==0){
        fullfillmentText="There's no more"+category+" speeches"
    }

    if (results.length==0){
        fullfillmentText="There's no"+category+" speeches"
    }


if(req.query.lastname){
    if(req.query.firstname){
        fullfillmentText=fullfillmentText+" by "+capitalizeFirstLetter(req.query.firstname)+" "+capitalizeFirstLetter(req.query.lastname)
    }  else {
        fullfillmentText=fullfillmentText+" by "+capitalizeFirstLetter(req.query.lastname)
    }

}

    if(req.query.year){fullfillmentText=fullfillmentText+" from "+req.query.year}


    next()
}

var output = function (req, res) {

    console.log('output: '+JSON.stringify(req.query))
    req.myNodeSession.iHasCookiesSet=true;
    req.myNodeSession.lastquery=JSON.stringify(req.query);

    if (item.Caption==undefined||item.Caption==""){item.Caption="<no caption data>"}

    var jsonReturn = {
        "speech": item.Caption,
        "displayText": fullfillmentText,
        "data": {
            returnType:request,
            totalResults:results.length,
            remainingResults:resultsRemaining.length,
            fullfillmentText:fullfillmentText,
            rawData:item},
        "source": "HistorySpeechesFullfillmentServer"
    }

    res.header('Access-Control-Allow-Credentials', 'true');

    res.send(JSON.stringify(jsonReturn))
}

router.get('/', [checkSession, chooseData, output])

router.post('/', [checkPostSession, chooseData, output])



module.exports = router

/*

 // define the about route
 router.get('/about', function (req, res) {
 res.send('About project')
 })


 */

// router.post('/', function (req, res) {
//
//     res.send('Search Got a POST request')
//
//     var reqResults=req.body.result;
//     var reqParams=reqResults.parameters;
//     console.log('Search Got a POST request:'+JSON.stringify(reqParams))
//
//
// })