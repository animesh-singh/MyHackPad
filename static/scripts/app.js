var diff_worker = new Worker('static/scripts/diff_worker.js');
var patch_worker = new Worker('static/scripts/patch_worker.js');

// var COLORS = [
// '#e21400', '#91580f', '#f8a700', '#f78b00',
// '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
// '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
// ];

// Angular application initialization
var application = angular.module("MyHackPad", ['textAngular']);



// Socket initialization
var socket = io.connect('http://' + document.domain + ':' + location.port + "/MyHackPad");

socket.emit('connect');

// User count
socket.on('userCount', function(data) {
 application.controller('activeUserCount',[ '$scope',
  function textEditor($scope) {

    console.log("Received number of connected users : "+ data);
    $scope.users = data.count;
  }]);
});



function generateUUID(){
  var d = new Date().getTime();
  if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }



// Change it to the userID after adding the login/signup feature.
var userUniqueName = generateUUID();
// console.log("username : " + userUniqueName);

// Text editing application controller
var updateQueue  = [];
var finalText = "";
var updateRunning = false;



application.controller('texteditor', ['$scope', 'textAngularManager',
  function textEditor($scope, textAngularManager) {

    $scope.orightml = "Enter text here";

    $scope.$watch('htmlcontent',function(newValue, oldValue){

      diff_worker.postMessage([oldValue , newValue , userName=userUniqueName]);

      diff_worker.onmessage = function(ev){
        var username = ev.data.username;
        var patchText = ev.data.patchText;
        var textValue = ev.data.TextValue;
        var timestamp = new Date().getTime();

        var diffObject =  { 'username'  : username ,
                            'patchText' : patchText ,
                            'textValue' : textValue,
                            'timestamp' : timestamp
                          }

        // console.log("diffObject : "+ diffObject);

        socket.emit('receiveDiff' , diffObject );

        console.log("data has been sent to server successfully, "+
          "values are \n Username : "+username+"\npatchText : "+patchText+"\ntextvalue : "+textValue+"\ntimestamp : "+timestamp);
        
      };

    });

    // $scope.disabled = false;


    socket.on('applyDiff' , function(changeData){

      var username = changeData.data.username;
      var patchText = changeData.data.patchText;
      var textValue = changeData.data.textValue;
      var timestamp = changeData.data.timestamp;

      // console.log(changeData);
      console.log("got from server, "+
        "values are \n Username : "+username+"\npatchText : "+patchText+"\ntextvalue : "+textValue+"\ntimestamp : "+timestamp);
      console.log("current text : " + $scope.htmlcontent)

      if( username != userUniqueName)
      {
        
        patch_worker.postMessage({ "username" : username,
          "patch"      : patchText, 
          "currentText": $scope.htmlcontent });


        patch_worker.onmessage = function(ev)
        {
          console.log("Data returned from patch worker : ")
          console.log(ev);
          // console.log(ev.data[0]);
          // console.log(ev.data[1]);

          var username = ev.data[0];

          var result = ev.data[1];
        // updateQueue.push(result);


        $scope.htmlcontent = "" + result;


        // document.getElementsByName("htmlcontent")[0].setAttribute("value",result);
        // document.getElementsByName("htmlcontent")[1].setAttribute("value",result);
        // document.getElementsByName("htmlcontent")[2].setAttribute("value",result);

        console.log("$scope.orightml : " + $scope.orightml);
      }
    }

    else
    {
      console.log("Update successfully broadcasted.");
    }

  });

    
  $scope.htmlcontent = $scope.orightml;
  console.log("$scope.htmlcontent : " + $scope.htmlcontent);

}]);


// socket.on('applyDiff' , function(changeData){

//   var username = changeData.data.username;
//   var patchText = changeData.data.patchText;
//   var textValue = changeData.data.textValue;
//   var timestamp = changeData.data.timestamp;

//       // console.log(changeData);
//       console.log("got from server, "+
//         "values are \n Username : "+username+"\npatchText : "+patchText+"\ntextvalue : "+textValue+"\ntimestamp : "+timestamp);



//       patch_worker.postMessage({ "username" : username,
//         "patch"    : patchText, 
//         "currentText":  });


//       patch_worker.onmessage = function(ev)
//       {
//         console.log(ev);
//         console.log(ev.data.result);

//         var username = ev.data.username;

//         var result = ev.data.result;
//         updateQueue.push(result);
//       // finalText = result;
//     }

//   });



// var checkForUpdates = function()
// {
//  if(updateQueue.length > 0 && updateRunning == false) {
//    var currentUpdate = updateQueue.shift(); 
//    updateRunning = true;
//    applyUpdate(currentUpdate);
//    updateRunning = false;
//  }
// }


// function applyUpdate(data)
// {
//   console.log("applyUpdate : "+data);
//   finalText = data;

// }

// window.setInterval(checkForUpdates, 100);





// colect data from user
var userInfo={

  timeOpened:new Date(),
  timezone:(new Date()).getTimezoneOffset()/60,

  pageon(){return window.location.pathname},
  referrer(){return document.referrer},
  previousSites(){return history.length},

  browserName(){return navigator.appName},
  browserEngine(){return navigator.product},
  browserVersion1a(){return navigator.appVersion},
  browserVersion1b(){return navigator.userAgent},
  browserLanguage(){return navigator.language},
  browserOnline(){return navigator.onLine},
  browserPlatform(){return navigator.platform},
  javaEnabled(){return navigator.javaEnabled()},
  dataCookiesEnabled(){return navigator.cookieEnabled},
  dataCookies1(){return document.cookie},
  dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
  dataStorage(){return localStorage},

  sizeScreenW(){return screen.width},
  sizeScreenH(){return screen.height},
  sizeDocW(){return document.width},
  sizeDocH(){return document.height},
  sizeInW(){return innerWidth},
  sizeInH(){return innerHeight},
  sizeAvailW(){return screen.availWidth},
  sizeAvailH(){return screen.availHeight},
  scrColorDepth(){return screen.colorDepth},
  scrPixelDepth(){return screen.pixelDepth},


  latitude(){return position.coords.latitude},
  longitude(){return position.coords.longitude},
  accuracy(){return position.coords.accuracy},
  altitude(){return position.coords.altitude},
  altitudeAccuracy(){return position.coords.altitudeAccuracy},
  heading(){return position.coords.heading},
  speed(){return position.coords.speed},
  timestamp(){return position.timestamp},


};



