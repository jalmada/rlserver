var express = require('express');
var client = require('../connection.js');  
var router = express.Router();

router.post('/', function(req, res, next) {

    client.index({  
        index: 'match',
        body: {
          "started": true,
          "ended": false,
          "matchType": "Online",
          "ranked": true,
          "gameMode ": "soccer",
          "date": (new Date()).toISOString()
        }
      },function(err,resp,status) {
          console.log(resp);
      });
    return res.json({"name":"jose"});
});

router.get('/', function(req, res, next) {

    client.cluster.health({},function(err,resp,status) {  
        console.log("-- Client Health --",resp);
        return res.json({"name": resp});
    });

    // client.indices.create(
    //     {
    //         "index": 'match', 
    //         "body":{
    //             "mappings": {
    //                 "properties": {
    //                     "date": {
    //                         "type": "date" 
    //                     }
    //                 }
    //             } 
    //         }
    // },function(err,resp,status) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         console.log("create",resp);
    //     }
    // });

//2015/01/01 12:10:30
    client.index({  
        index: 'match',
        id: '3',
        type: 'infoupdate',
        body: {
          "started": true,
          "ended": false,
          "matchType": "Online",
          "ranked": true,
          "gameMode ": "soccer",
          "date": '2019-01-01'
        }
      },function(err,resp,status) {
          console.log(resp);
      });

});

module.exports = router;