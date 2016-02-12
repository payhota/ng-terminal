angular
.module("ngTerminal", [])


.controller("TerminalController", ['$scope', function($scope) {
  $scope.prompt = "TEST:"
  $scope.command = ""
  $scope.cursor = ""
  $scope.backspace = function () {
    $scope.command = $scope.command.substring(0,$scope.command.length - 1);
    $scope.$apply();
  }
  $scope.execute = function() {

  }
  $scope.changeCommand = function(x) {
    
  }
}])

.directive('terminal', ['$timeout', function($timeout) {
  return {
    restrice: 'E',
    controller: 'TerminalController',
    transclude: true,
    templateUrl : 'terminal.html',
    link : function(scope, elems, attrs) {
      var input = angular.element(elems[0].querySelector('input'));
      var cursor = angular.element(elems[0].querySelector('.blinking-cursor'));
      elems.on('click', function() {
        input[0].focus();
      })
      input.on('keydown', function(e) {
        console.log(e.keyCode)
        //tab
        if (e.keyCode == 9) {
          e.preventDefault();
        }
        //backspace
        else if (e.keyCode == 8) {
          e.preventDefault();
          scope.backspace();
        }
        //return
        else if (e.keyCode == 13) {
          e.preventDefault();
          scope.execute();
        }
        //up arrow
        else if (e.keyCode == 38) {
          e.preventDefault()
//          scope.changeCommand(1);
        }
        //down arrow        
        else if (e.keyCode == 40) {
          e.preventDefault();
//          scope.changeCommand(-1);
        }
        //left and right arrows
        else if (e.keyCode == 39 || e.keyCode == 37) {
          e.preventDefault();
        }
      })
    }
  }
    
    
}])