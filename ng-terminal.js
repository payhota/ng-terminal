angular
.module("ngTerminal", [])

.provider('terminalConfig', function() {
  var fileSystem,color,commands;
  return {
    setFileSystem: function(value) { fileSystem = value },
    setTextColor: function(value) { color = value },
    setCommands: function(value) { commands = value },
    $get: function() {
      return { 
        "fs" : fileSystem, 
        "color" : color, 
        "history" : [],
        "commands" : commands
      }
    }
  }
  
})

.controller("TerminalController", ['$scope', '$timeout', 'terminalConfig', function($scope, $timeout, terminalConfig) {
  $scope.terminal = terminalConfig
  $scope.prompt = "TEST: "
  $scope.command = ""
  $scope.cursor = ""
  $scope.commandHistory = []
  
  $scope.backspace = function () {
    $scope.command = $scope.command.substring(0,$scope.command.length - 1);
    $scope.$apply();
  }
  
  var findCommand = function(x) {
    return $scope.terminal.commands[x]
  }
  $scope.execute = function() {
    var input = $scope.command.split(" ");
    var command = findCommand(input[0]);
    if (command) {
      var output = command.execute($scope.terminal.fs)
    }
    else if (input != "") {
      var output = "-bash: " + input + ": command not found";
    }
    else {
      var output = "";
    }
    $scope.command = "";
    $scope.commandHistory.push({"command":input,"output":output,"prompt" : $scope.prompt})
    $scope.$apply();    
  }
  $scope.changeCommand = function(x) {
    
  }
}])

.directive('terminal', function() {
  return {
    restrice: 'E',
    controller: 'TerminalController',
    transclude: true,
    templateUrl : 'terminal.html',
    link : function(scope, elems, attrs) {
      var input = angular.element(elems[0].querySelector('input'));
      var cursor = angular.element(elems[0].querySelector('.cursor'));
      elems.on('click', function() {
        console.log(input);
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
    
    
})

