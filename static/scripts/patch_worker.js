importScripts('diff_match_patch_uncompressed.js');


onmessage = function(ev){

  var dmp = new diff_match_patch();
  
  var username = ev.data["username"];
  var currentText = ev.data["currentText"]
  var patch = ev.data["patch"];
  
  //apply the patch

  var results = dmp.patch_apply(patch, currentText);
  
  postMessage([username, results[0]]);
}