
var url = 'http://' + document.domain + ':' + location.port;
var socket = io.connect(url + "/MyHackPad");


sendDiff = function(diff)
{
  socket.emit('receiveDiff' , { "username" : diff.data[0] ,
                                "difference" : diff.data[1] ,
                                "TextValue" : diff.data[2],
                                "timestamp" : new Date().getTime()
                              });


};
