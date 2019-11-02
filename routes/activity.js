var express = require('express');
var client = require('../connection.js');  
var router = express.Router();

var meUsername = "xaratustra";

//Info Update
var processPlayerInfo = function(data){
  
}

var processMatchFeature = function(data){
  return null;
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

    if(playerData.name == meUsername){
      return null;
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

  if(!dataToSave.body){
    return;
  }

  dataToSave.index = feature;
  dataToSave.body.type = "info";
  dataToSave.body.date = (new Date()).toISOString();

  //Saves to ES
  console.log(dataToSave);
  // client.index(dataToSave ,function(err,resp,status) {
  //   console.log(resp);
  // }); 

}
/////////

var processEvent = function(events){
  //{"events":[{"name":"matchEnd","data":""}]}
  let dataToSave = {};

  let eventsToProcess = ['matchStart', 'matchEnd', "playerJoined",  "playerLeft", 
  "score", "opposingTeamGoal", "teamGoal","defeat","victory"];

  for(let i = 0; i < events.length; i++){
    let event = events[i];

    if(!eventsToProcess.includes(event.name)){
      continue;
    }

    dataToSave.body = event.data ? JSON.parse(event.data) : {};

    dataToSave.body.score = dataToSave.body.score ? parseInt(dataToSave.body.score) : 0;
    dataToSave.body.goals = dataToSave.body.goals ? parseInt(dataToSave.body.goals) : 0;
    dataToSave.body.deaths = dataToSave.body.deaths ? parseInt(dataToSave.body.deaths) : 0;
    dataToSave.body.state = dataToSave.body.state ? parseInt(dataToSave.body.state) : 0;
    dataToSave.body.team_score = dataToSave.body.team_score ? parseInt(dataToSave.body.team_score) : 0;

    dataToSave.body.eventname = event.name;
    dataToSave.index = "events";
    dataToSave.body.date = (new Date()).toISOString();

    //Saves to ES
    console.log(dataToSave);
    client.index(dataToSave ,function(err,resp,status) {
       console.log(resp);
    }); 
  }
}

router.post('/', function(req, res, next) {
  let data = req.body;

  if('info' in data){
    //processInfo(data);
  } else if ('events' in data){
    processEvent(data.events)
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