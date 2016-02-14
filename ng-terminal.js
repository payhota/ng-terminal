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
  $scope.currentCommand = 0;
  $scope.partialCommand = "";
  $scope.backspace = function () {
    $scope.command = $scope.command.substring(0,$scope.command.length - 1);
    $scope.$apply();
  }
  
  var findCommand = function(next) {
    if (next == 0) {
      return $scope.partialCommand;
    }
    
    var notEmpty = 0;
    var used = [];
    for (i = ($scope.commandHistory.length - 1); i >= 0; i--) {
      if ($scope.commandHistory[i].command[0] != "" && used[used.length-1] != $scope.commandHistory[i].command[0]) {
        used.push($scope.commandHistory[i].command[0]);
        notEmpty++;
        if (notEmpty == next) {
          return $scope.commandHistory[i].command[0];
        }
      }
    }
    return "";
  }
  
  $scope.execute = function() {
    var input = $scope.command.split(" ");
    var command = $scope.terminal.commands[input[0]];
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
    $scope.currentCommand = 0;
    $scope.partialCommand = "";
    $scope.$apply();
    $scope.scrollToBottom();
  }
  
  $scope.changeCommand = function(direction) {
    if ($scope.currentCommand == 0) {
      $scope.partialCommand = $scope.command;
    }
    if (direction == "up") {
      var nextCommand = $scope.currentCommand + 1;
      if (nextCommand <= $scope.commandHistory.length) {
        var cmd = findCommand(nextCommand);
        if (cmd != "") {
          $scope.currentCommand++;
        }
      }
    }
    else if (direction == "down") {
      var nextCommand = $scope.currentCommand - 1;
      if (nextCommand != -1) {
        var cmd = findCommand(nextCommand);
        if (cmd != "") {
          $scope.currentCommand--;
        }
      }
    }
    if (cmd) {
      $scope.command = cmd;
    }
    else if (nextCommand < 1) {
      $scope.command = $scope.partialCommand;
    }
    $scope.$apply();
  }
  
  $scope.scrollToBottom = function () {
    $timeout(function() {
      if ($scope.terminalElement[0].scrollTop != $scope.terminalElement[0].scrollHeight) {
      $scope.terminalElement[0].scrollTop = $scope.terminalElement[0].scrollHeight
      } 
    },5)

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
      scope.terminalElement = angular.element(elems[0].querySelector('.terminal'));
      elems.on('click', function() {
//        console.log(input);
        input[0].focus();
      })
      input.on('keydown', function(e) {
        scope.scrollToBottom();
        
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
          scope.changeCommand("up");
        }
        //down arrow        
        else if (e.keyCode == 40) {
          e.preventDefault();
          scope.changeCommand("down");
        }
        //left and right arrows
        else if (e.keyCode == 39 || e.keyCode == 37) {
          e.preventDefault();
        }
      })
    }
  }
    
    
})

