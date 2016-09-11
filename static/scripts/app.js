var diff_worker = new Worker('static/scripts/diff_worker.js');
var patch_worker = new Worker('static/scripts/patch_worker.js');

var COLORS = [
'#e21400', '#91580f', '#f8a700', '#f78b00',
'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

// Angular application initialization
var application = angular.module("MyHackPad", ['textAngular']);



// Socket initialization
var socket = io.connect('http://' + document.domain + ':' + location.port + "/MyHackPad");
socket.on('connect', function() {
});



// User count
socket.on('userCount', function(data) {
 application.controller('activeUserCount',[ '$scope',
  function textEditor($scope) {
    $scope.htmlcontent = data.count;
  }]);
});



// Text editing application controller
var updateQueue  = [];
var finalText = "";
var updateRunning = false;

application.controller('texteditor', ['$scope', 'textAngularManager',
  function textEditor($scope, textAngularManager) {
    $scope.orightml = 'Enter text here.';

    $scope.$watch('htmlcontent',function(newValue, oldValue){

      // console.log("app : oldVal" + oldValue);
      // console.log("app : newVal" + newValue);

      diff_worker.postMessage([oldValue , newValue , userName="MyUser"]);

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



      patch_worker.postMessage({ "username" : username,
        "patch"      : patchText, 
        "currentText": $scope.htmlcontent });


      patch_worker.onmessage = function(ev)
      {
        console.log(ev);
        console.log(ev.data[0]);
        console.log(ev.data[1]);

        var username = ev.data[0];

        var result = ev.data[1];
        // updateQueue.push(result);
      $scope.orightml = result;
    }

  });

  // if(finalText != "")
  //   {
  //     $scope.orightml = finalText;
  //     finalText = ""
  //   }

    $scope.htmlcontent = $scope.orightml;
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



var checkForUpdates = function()
{
 if(updateQueue.length > 0 && updateRunning == false) {
   var currentUpdate = updateQueue.shift(); 
   updateRunning = true;
   applyUpdate(currentUpdate);
   updateRunning = false;
 }
}


function applyUpdate(data)
{
  console.log("applyUpdate : "+data);
  finalText = data;

}




window.setInterval(checkForUpdates, 100);