var express = require('express');
var client = require('../connection.js');  
var router = express.Router();

var processPlayerInfo = function(data){
  
}

var processMatchFeature = function(data){
  return data;
}

var processRosterFeature = function(data){

  if('playersInfo' in data){
    let playerNo = 0;
    let playerData = {};
    
    for(; playerNo < 8; playerNo++){
      let propName = `player${playerNo}`;
      if(propName in data.playersInfo){
        playerData = JSON.parse(decodeURI(data.playersInfo[propName]))
        break;
      }
    }
    data.playersInfo[`player${playerNo}`] = playerData;
  }

  return data;
}

var processMatchInfoFeature = function(data){
  return data;
}

var processMeFeature = function(data){
  return data;
}

var processStatsFeature = function(data){
  return data;
}

var processInfo = function(data){
  //{"info":{"matchInfo":{"gameState":"Active"}},"feature":"match"}
  

  let feature = 'unknown';
  let dataToSave = {};

  if('feature' in data){
    feature = data.feature;
  }

  if(feature == 'match'){
    dataToSave.body = processMatchFeature(data.info);
  } else if (feature == 'roster') {
    dataToSave.body = processRosterFeature(data.info);
  } else if (feature == 'match_info') {
    dataToSave.body = processMatchInfoFeature(data.info);
  } else if (feature == 'me') {
    dataToSave.body = processMeFeature(data.info);
  } else if (feature == 'stats') {
    dataToSave.body = processStatsFeature(data.info);
  }

  dataToSave.index = feature;
  dataToSave.body.date = (new Date()).toISOString();

  //Saves to ES
  console.log(dataToSave);
  // client.index(dataToSave ,function(err,resp,status) {
  //   console.log(resp);
  // }); 

}



var processEvent = function(data){
  //{"events":[{"name":"matchEnd","data":""}]}
  console.log(data);
}

router.post('/', function(req, res, next) {
  let data = req.body;

  if('info' in data){
    processInfo(data);
  } else if ('event' in data){
    processEvent(data)
  }

  res.sendStatus(200);
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