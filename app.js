var fs = {
  root : {
    path : "/",
    subdirectories : [
      {
        path : "/home",
        subdirectories : [
          {
            path : "/home/pjtatlow",
            subdirectories : [
              {
                path : "/home/pjtatlow/Desktop",
                subdirectories : [],
                files : []
              }
            ],
            files : []
          }
        ],
        files : []
      }
    ],
    files : []
  },
  wd : {
    path : "/home/pjtatlow"
  }
}

var cmd = [
  {
    name: "pwd",
    execute: function(fs) {
      return fs.wd.path
    }
  }
]

angular
.module("myApp", ['ngTerminal'])

.config(function (terminalConfigProvider) {
  terminalConfigProvider.setFileSystem(fs)
  terminalConfigProvider.setTextColor("#FFFFFF")
  terminalConfigProvider.setCommands(cmd)
})

.controller("myController", ['$scope', function($scope) {
  
  
  
}])