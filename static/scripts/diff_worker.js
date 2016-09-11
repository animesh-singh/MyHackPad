importScripts('diff_match_patch_uncompressed.js');
importScripts('sockets.js');

var sentDiffs = 0;

onmessage = function(ev){
  var dmp = new diff_match_patch();

  console.log("diff_worker : ")


  // console.log(ev.data[1]);
  // console.log(ev.data[2]);
  // console.log(ev.data[0]);

  var previous_text = ev.data[1];
  var current_text = ev.data[2];
  var username = ev.data[0];

  //take the diff
  var diff = dmp.diff_main(previous_text, current_text);

  console.log(diff);


  if (diff.length > 2) {
     dmp.diff_cleanupSemantic(diff);
   //  dmp.diff_cleanupEfficiency(diff);
  }

  var patch_list = dmp.patch_make(previous_text, current_text, diff);

  // pass the patch back to main thread
  if(patch_list.length > 0){
    sendDiff (
      { "username" :   username ,
        "difference" : patch_list ,
        "TextValue" :  current_text
      });

    postMessage("data has been sent");

  }
}
