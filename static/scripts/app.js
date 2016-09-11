var diff_worker = new Worker('static/scripts/diff_worker.js');
var patch_worker = new Worker('static/scripts/patch_worker.js');


angular.module("MyHackPad", ['textAngular'])
        .controller('texteditor', ['$scope', 'textAngularManager',
        function textEditor($scope, textAngularManager) {
            $scope.orightml = 'Enter text here.';

            $scope.$watch('htmlcontent',function(newValue, oldValue){
              // var data = {"oldValue" : oldValue,
              //             "newValue" : newValue,
              //             "username" : "MyUser"};
              //
              // console.log("app : oldVal" + data.oldValue);
              // console.log("app : newVal" + data.newValue);
              // console.log("app : userVal" + data.username);

diff_worker.postMessage([oldValue , newValue , userName="MyUser"]);

diff_worker.onmessage = function(ev){
  console.log("message Returned : "+ ev);
    };
              // console.log("old : "+ oldValue);
              // console.log("new : "+ newValue);

            });





            $scope.htmlcontent = $scope.orightml;
            $scope.disabled = false;
        }]);
