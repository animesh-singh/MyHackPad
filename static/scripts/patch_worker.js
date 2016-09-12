importScripts('diff_match_patch_uncompressed.js');


onmessage = function(ev){

  var dmp = new diff_match_patch();
  
  var username = ev.data["username"];
  var currentText = ev.data["currentText"]
  var patch = ev.data["patch"];
  
  //apply the patch
  console.log("current text : "+currentText);
  console.log("Patch : ");
  console.log(patch);
  

  var results = dmp.patch_apply(patch, currentText);
  
  console.log("Patch has been applied");
  console.log(results[0]);
  console.log(results[1]);
  
  postMessage([username, results[0]]);
}