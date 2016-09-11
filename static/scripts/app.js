var diff_worker = new Worker('static/scripts/diff_worker.js');
var patch_worker = new Worker('static/scripts/patch_worker.js');


angular.module("MyHackPad", ['textAngular'])
        .controller('texteditor', ['$scope', 'textAngularManager',
        function textEditor($scope, textAngularManager) {
            $scope.orightml = 'Enter text here.';

            $scope.$watch('htmlcontent',function(newValue, oldValue){
              // diff_worker.onTextChange();

              // console.log("old : "+ oldValue);
              // console.log("new : "+ newValue);

            });





            $scope.htmlcontent = $scope.orightml;
            $scope.disabled = false;
        }]);
