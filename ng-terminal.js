angular
.module("ngTerminal", [])

.provider('terminalConfig', function() {
  var fileSystem,color,commands;
  return {
    setFileSystem: function(value) { fileSystem = value },
    setTextColor: function(value) { color = value },
    $get: function() {
      return { 
        "fs" : fileSystem, 
        "color" : color, 
        "history" : []      
      }
    }
  }
  
})

.controller("TerminalController", ['$scope', '$timeout', 'terminalConfig', function($scope, $timeout, terminalConfig) {
  $scope.terminal = terminalConfig
  $scope.user = "guest"
  $scope.prompt = "web-box:~ " + $scope.user +"$ ";
  $scope.command = ""
  $scope.cursor = ""
  $scope.tabPresses = 0;
  $scope.commandHistory = []
  $scope.currentCommand = 0;
  $scope.partialCommand = "";
  $scope.openFile = {};
  $scope.openFile.on = false;
  $scope.openFile.contents = "This is a text document\nthis should be on a new line."
  $scope.openFile.type = "edit";
  $scope.backspace = function () {
    $scope.command = $scope.command.substring(0,$scope.command.length - 1);
    $scope.tabPresses = 0;
    $scope.$apply();
  }

  var findContents = function(wd) {
    var matches = [];
    for (key in wd.contents) {
      matches.push(key);
    }
    return matches;
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
          return $scope.commandHistory[i].command;
        }
      }
    }
    return "";
  }

  var searchPath = function(cmd) {
    for (var i = 0; i < $scope.terminal.fs.$PATH.length; i++) {
      var dir = $scope.terminal.fs.getDirectory($scope.terminal.fs.$PATH[i]);
      if (dir.contents[cmd]) {
        return dir.contents[cmd].contents;
      }
    }
  }

  $scope.autoComplete = function() {
    var input = $scope.command.split(" ");
//  if no command typed yet  
    if (input.length == 1  && $scope.tabPresses > 1) {
      //if absolutely nothing typed
      if (input[0] == "") {
        var output = "";
        for (var i = 0; i < $scope.terminal.fs.$PATH.length; i++) {
          var dir = $scope.terminal.fs.getDirectory($scope.terminal.fs.$PATH[i]);
          var dir_matches = findContents(dir);
          for (var j = 0; j < dir_matches.length; j++) {
            output = output + "<span class='" + dir.contents[dir_matches[j]].type + "'>" + dir.contents[dir_matches[j]].name + "</span>"        
          }
        }
        $scope.commandHistory.push({"command":$scope.command,"output":output,"prompt" : $scope.prompt})
      }
      //if something typed but command not finished
      else {
        var output = "";
        var match = $scope.command;
        var matches = [];
        for (var i = 0; i < $scope.terminal.fs.$PATH.length; i++) {
          var dir = $scope.terminal.fs.getDirectory($scope.terminal.fs.$PATH[i]);
          var dir_matches = findContents(dir);
          for (var j = 0; j < dir_matches.length; j++) {
            if (dir_matches[j].substr(0,match.length) == match) {
              matches.push(dir_matches[j]);
            }
          }
        }
        if (matches.length == 1) {
          $scope.command = matches[0] + " ";
        }
        else if (matches.length > 0) {
          for (var j = 0; j < matches.length; j++) {
            output = output + "<span class='executable'>" + matches[j] + "</span>"        
          }        
          $scope.commandHistory.push({"command":$scope.command,"output":output,"prompt" : $scope.prompt});          
        }
      }
    }
    else {
//  if nothing except command typed yet    
      if (input[input.length -1] == "") {
        var wd = $scope.terminal.fs.getDirectory($scope.terminal.fs.wd.path);
        var matches = findContents(wd);
      }
      // something after command
      else {
        //if there is a /
        if (input[input.length-1].indexOf("/") >=0) {
          var last_slash = input[input.length-1].lastIndexOf('/');
          // if the slash is the last character in the string
          if (last_slash == (input[input.length-1].length - 1)) {
            var wd = $scope.terminal.fs.getDirectory(input[input.length-1]);
            var matches = findContents(wd);
          }
          //there is something after the last /
          else {
            //if the last slash is the first character
            if (last_slash == 0) {
              var wd = $scope.terminal.fs.getDirectory("/");
              var contents = findContents(wd);
              var matches = [];
              var match = input[input.length-1].substr(1)
              for (var i = 0; i < contents.length; i++) {
                if (contents[i].substr(0,match.length) == match) {
                  matches.push(contents[i]);
                }
              }
              if (matches.length > 0) {
                var match_index = $scope.command.lastIndexOf(match);
                $scope.command = $scope.command.substring(0,match_index);
              }
            }
            //if the last slash is not the first character
            else {
              var wd = $scope.terminal.fs.getDirectory(input[input.length-1].substring(0,last_slash));
              var contents = findContents(wd);
              var matches = [];
              var match = input[input.length-1].substr(last_slash+1)
              for (var i = 0; i < contents.length; i++) {
                if (contents[i].substr(0,match.length) == match) {
                  matches.push(contents[i]);
                }
              }
              var match_index = $scope.command.lastIndexOf(match);
              if (matches.length > 1) {
                $scope.command = $scope.command.substring(0,match_index + match.length);
              }
              else if (matches.length == 1) {
                $scope.command = $scope.command.substring(0,match_index);
              }
            }
          }
        }
        // if there is not a slash and there is something typed after the command
        else {
              var wd = $scope.terminal.fs.getDirectory($scope.terminal.fs.wd.path);
              var contents = findContents(wd);
              var matches = [];
              var match = input[input.length-1].substr(last_slash+1)
              for (var i = 0; i < contents.length; i++) {
                if (contents[i].substr(0,match.length) == match) {
                  matches.push(contents[i]);
                }
              }
              var match_index = $scope.command.lastIndexOf(match);
              if (matches.length > 1) {
                $scope.command = $scope.command.substring(0,match_index + match.length);
              }
              else if (matches.length == 1) {
                $scope.command = $scope.command.substring(0,match_index);
              }          
        }
      }

      if (matches.length == 1) {
          $scope.command = $scope.command + matches[0];
          if (wd.contents[matches[0]].type == 'directory') {
            $scope.command = $scope.command + '/';
          }
        else {
            $scope.command = $scope.command + ' ';          
        }
      }
      else if ($scope.tabPresses > 1 && matches.length > 0) {
        var output = "";
        for (var i = 0; i < matches.length; i++) {
          output = output + "<span class='" + wd.contents[matches[i]].type + "'>" + wd.contents[matches[i]].name + "</span>" 
        }
        $scope.commandHistory.push({"command":$scope.command,"output":output,"prompt" : $scope.prompt})
      }
    }
    $scope.$apply()
    $scope.scrollToBottom();
  }

  $scope.updatePrompt = function() {
    var wd = $scope.terminal.fs.getDirectory($scope.terminal.fs.wd.path);
    if (wd.path != $scope.terminal.fs.wd.default) {
      $scope.prompt = "web-box:" + wd.name + " " + $scope.user +"$ ";
    }
    else {
      $scope.prompt = "web-box:~ " + $scope.user +"$ ";
    }
    $scope.$apply();
  }
  
  $scope.execute = function() {
    var prompt = $scope.prompt;
    
    var input = $scope.command.split(" ");
    var options = $scope.command.split(" ");
    options.splice(0,1);
    var command = searchPath(input[0])
    if (command) {
      var func = new Function("options", command)
      var output = func(options)
    }
    else if (input != "") {
      var output = "-ngsh: " + input + ": command not found";
    }
    else {
      var output = "";
    }
    
    
    
    $scope.commandHistory.push({"command":$scope.command,"output":output,"prompt" : prompt});
    $scope.tabPresses = 0;
    $scope.command = "";
    $scope.currentCommand = 0;
    $scope.partialCommand = "";
    $scope.updatePrompt();
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
    if ($scope.terminalElement[0].scrollTop != $scope.terminalElement[0].scrollHeight) {
      $scope.terminalElement[0].scrollTop = $scope.terminalElement[0].scrollHeight
    } 

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
      var textarea = angular.element(elems[0].querySelector('textarea'));
      var cursor = angular.element(elems[0].querySelector('.cursor'));
      scope.terminalElement = angular.element(elems[0].querySelector('.term-view'));
      elems.on('click', function() {
        if (!scope.openFile.on) {
          console.log(input)
          console.log(textarea)
          input[0].focus();
        }
      })
      input.on('keydown', function(e) {
        //tab
        if (e.keyCode == 9) {
          e.preventDefault();
          scope.tabPresses++;
          scope.$apply();
          scope.autoComplete();
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
//          e.preventDefault();
          console.log(input);
        }
      })
      input.on('input', function(e) {
         scope.scrollToBottom();
      })
    }
  }
    
    
})

.directive('focus', ['$timeout', function($timeout) {
 return {
 scope : {
   trigger : '@focus'
 },
 link : function(scope, element) {
  scope.$watch('trigger', function(value) {
    if (value === "true") {
      $timeout(function() {
       element[0].focus();
      });
   }
 });
 }
};
}])

.directive('compile', ['$compile', function ($compile) {
return function(scope, element, attrs) {
    scope.$watch(
        function(scope) {
            return scope.$eval(attrs.compile);
        },
        function(value) {
            element.html(value);
            $compile(element.contents())(scope);
        }
    );
};
}])