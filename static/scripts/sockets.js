importScripts('socket.io.js');


var url = 'http://' + '127.0.0.1' + ':' + location.port;

var socket = io.connect(url + "/MyHackPad");

  // console.log(url);
  // console.log(socket);


sendDiff = function(diff)
{
  console.log("sending data through the socket");
  console.log("username" + diff.username + "\n" +
              "difference" + diff.difference +"\n" +
              "TextValue" + diff.TextValue+"\n" +
              "timestamp" + new Date().getTime());

  socket.emit('receiveDiff' , { "username" : diff.username ,
                                "difference" : diff.difference ,
                                "TextValue" : diff.TextValue,
                                "timestamp" : new Date().getTime()
                              });


};
