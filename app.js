var fs = {
  root : {
    name: '/',
    path : "/",
    type : "directory",
    home : {
      path : "/home",
      type : "directory",
      
    }
  },
  wd : {
    path : "/home/pjtatlow"
  }
}

var cmd = {
  "pwd" : {
    execute: function(fs) {
      return fs.wd.path
    }
  }
}


angular
.module("myApp", ['ngTerminal'])

.config(function (terminalConfigProvider) {
  terminalConfigProvider.setFileSystem(fs)
  terminalConfigProvider.setTextColor("#FFFFFF")
  terminalConfigProvider.setCommands(cmd)
})

.controller("myController", ['$scope', function($scope) {
  
  
  
}])