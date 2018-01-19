/*

testing nielsen tracking
charles remote remapping

host: sandbox-cloudapi.imrworldwide.com
path: (asterix)/a


>>forward to>>

host: 192.168.2.1
port: 3000
path: /nielsen


*/

var fs = require('fs');
var _=require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var sessions = require("client-sessions");
//const querystring = require('querystring');

var router = express.Router();
/*

http://sandbox-cloudapi.imrworldwide.com/nmapi/v2/7BBFE823-AF43-4323-A8C1-D15F2BC84457/1516392565366207575/a?b=%7B%22type%22:%22content%22,%22calc_position%22:396,%22metadata%22:%7B%22content%22:%7B%22crossId1%22:%22177080%22,%22progen%22:%22GV%22,%22type%22:%22content%22,%22program%22:%2260DaysIn%22,%22adloadtype%22:%222%22,%22length%22:%222590%22,%22hasAds%22:%221%22,%22isfullepisode%22:%22y%22,%22airdate%22:%2220160310%2011:01:00%22,%22assetid%22:%22641589315539%22,%22title%22:%22First%20Timers%22%7D,%22static%22:%7B%7D,%22ad%22:%7B%22type%22:%22preroll%22,%22assetid%22:%2222231568%22%7D%7D,%22position%22:0,%22event%22:%22playhead%22,%22devInfo%22:%7B%22uoo%22:%22false%22,%22apn%22:%22A%2526E%22,%22apv%22:%227.2.2%22,%22devId%22:%22ddfb0f39b4699b41c0b82b4bd335e8fcf0df%22%7D,%22utc%22:1516394575241%7D


http://192.168.2.1:3000/nielsen?b=%7B%22type%22:%22content%22,%22calc_position%22:396,%22metadata%22:%7B%22content%22:%7B%22crossId1%22:%22177080%22,%22progen%22:%22GV%22,%22type%22:%22content%22,%22program%22:%2260DaysIn%22,%22adloadtype%22:%222%22,%22length%22:%222590%22,%22hasAds%22:%221%22,%22isfullepisode%22:%22y%22,%22airdate%22:%2220160310%2011:01:00%22,%22assetid%22:%22641589315539%22,%22title%22:%22First%20Timers%22%7D,%22static%22:%7B%7D,%22ad%22:%7B%22type%22:%22preroll%22,%22assetid%22:%2222231568%22%7D%7D,%22position%22:0,%22event%22:%22playhead%22,%22devInfo%22:%7B%22uoo%22:%22false%22,%22apn%22:%22A%2526E%22,%22apv%22:%227.2.2%22,%22devId%22:%22ddfb0f39b4699b41c0b82b4bd335e8fcf0df%22%7D,%22utc%22:1516394575241%7D



http://192.168.2.1:3000/nielsen
http://192.168.2.1:3000/comscore?c1=19&c2=3005002&ns_ap_an=AEWatchApp&ns_ap_pn=js&ns_ap_pv=7.2.2&c12=6a05b2fcc5fc693f88c2dc5fc8ed6437-cs62&name=foreground&ns_ap_ec=111&ns_ap_ev=hidden&ns_ap_device=Apple%20TV&ns_ap_id=1515618462867&ns_ap_pfm=atv&ns_ap_pfv=7.2.2&ns_ap_ver=unknown&ns_ap_sv=2.1705.04&ns_ap_cv=1.6.1.170711&ns_type=hidden&ns_radio=unknown&ns_nc=1&ns_st_sv=6.1.0.170130&ns_st_smv=5.8&ns_st_it=r&ns_st_id=641589315539&ns_st_ec=5&ns_st_sp=1&ns_st_sc=1&ns_st_psq=2&ns_st_asq=1&ns_st_sq=1&ns_st_ppc=1&ns_st_apc=1&ns_st_spc=1&ns_st_cn=2&ns_st_ev=hb&ns_st_po=40113&ns_st_cl=2590000&ns_st_hc=4&ns_st_mp=js_api&ns_st_mv=6.1.0.170130&ns_st_pn=1&ns_st_tp=0&ns_st_ci=641589315539&ns_st_pt=40113&ns_st_dpt=40113&ns_st_ipt=10020&ns_st_et=40113&ns_st_det=40113&ns_st_upc=40113&ns_st_dupc=40113&ns_st_iupc=10020&ns_st_upa=40113&ns_st_dupa=40113&ns_st_iupa=10020&ns_st_lpc=40113&ns_st_dlpc=40113&ns_st_lpa=40113&ns_st_dlpa=40113&ns_st_pa=69024&ns_ap_jb=unknown&ns_ap_res=0x0&ns_ap_sd=1080x1920&ns_ap_cs=144&ns_ap_lang=en&ns_ap_ar=unknown&ns_ts=1515621530788&ns_st_bc=0&ns_st_dbc=0&ns_st_bt=0&ns_st_dbt=0&ns_st_bp=0&ns_st_skc=0&ns_st_dskc=0&ns_st_ska=0&ns_st_dska=0&ns_st_skd=0&ns_st_skt=0&ns_st_dskt=0&ns_st_pc=0&ns_st_dpc=0&ns_st_pp=1&ns_st_br=0&ns_st_rt=100&ns_st_ub=0&ns_st_ki=1200000&ns_st_pr=60%20Days%20In%3A%20Atlanta&ns_st_sn=1&ns_st_en=2&ns_st_ep=First%20Timers&ns_st_ct=vc&ns_st_ge=*null&ns_st_st=*null&ns_st_ce=1&ns_st_ia=*null&ns_st_ddt=*null&ns_st_tdt=*null&ns_st_pu=aetv&ns_st_ti=*null&c3=aetv&c4=60%20Days%20In%3A%20Atlanta&c6=First%20Timers

*/

router.use(bodyParser.json());
// middleware that is specific to this router
router.use(sessions({
    cookieName: 'myNodeSession', // cookie name dictates the key name added to the request object
    secret: 'superjonbotReallyLikesSpagettiCarbonara_1abcdefhddvdvsg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

var checkSession = function (req, res, next) {
    next()
}

var chooseData = function (req, res, next) {
    next()
}

var output = function (req, res) {

    gotData=JSON.parse(req.query.b)

    var returnValue='type:'+gotData.type+' type:'+gotData.metadata[gotData.type].type+' event:'+gotData.event+' pos:'+gotData.position+' utc:'+gotData.utc+'\n'
    var screenValue='type:'+gotData.type+' type:'+gotData.metadata[gotData.type].type+' event:'+gotData.event+' pos:'+gotData.position+' utc:'+gotData.utc
        fs.appendFile("test.txt", returnValue, function(err) {
        if(err) {
            return console.log(err);
        }


    });


/*

{
    'type': 'content',
    'calc_position': 396,
    'metadata': {
        'content': {
            'crossId1': '177080',
            'progen': 'GV',
            'type': 'content',
            'program': '60DaysIn',
            'adloadtype': '2',
            'length': '2590',
            'hasAds': '1',
            'isfullepisode': 'y',
            'airdate': '20160310 11:01:00',
            'assetid': '641589315539',
            'title': 'First Timers'
        },
        'static': {},
        'ad': {
            'type': 'preroll',
            'assetid': '22231568'
        }
    },
    'position': 0,
    'event': 'playhead',
    'devInfo': {
        'uoo': 'false',
        'apn': 'A%26E',
        'apv': '7.2.2',
        'devId': 'ddfb0f39b4699b41c0b82b4bd335e8fcf0df'
    },
    'utc': 1516394575241
}

        */

    console.log(screenValue)
    res.header('Access-Control-Allow-Credentials', 'true');

    res.send(JSON.stringify(req.query.b))
    //res.send(returnValue)
}

router.get('/', [checkSession, chooseData, output])

//router.post('/', [checkPostSession, chooseData, output])



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