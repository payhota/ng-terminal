var fs = {
  root : {
    name: '/',
    path : "/",
    type : "directory",
    'contents' : {
      home : {
        name : "home",
        path : "/home",
        type : "directory",
        'contents' : {
          Documents : {
            name : "Documents",
            path : "/home/Documents",
            type : "directory"
          },
          Desktop : {
            name : "Desktop",
            path : "/home/Desktop",
            type : "directory"
          },
          Downloads : {
            name : "Downloads",
            path : "/home/Downloads",
            type : "directory"
          },
          Pictures : {
            name : "Pictures",
            path : "/home/Pictures",
            type : "directory"
          },
          Videos : {
            name : "Videos",
            path : "/home/Videos",
            type : "directory"
          }
        }
      },
      usr : {
        name : "usr",
        path : "/usr",
        type : "directory"
      },
      bin : {
        name : "bin",
        path : "/bin",
        type : "directory"
      },
    }
  },
  wd : {
    path : "/"
  }
}

var cmd = {
  "pwd" : {
    execute: function(fs, options) {
      return fs.wd.path
    }
  },
  "ls" : {
    execute : function(fs, options) {
      var path = fs.wd.path.split("/");
      var wd = fs.root;
      var contents = "";
      if (path[1] != "") {
        for (var i = 1; i < path.length; i++) {
          wd = wd.contents[path[i]]
        } 
      }
      for (var sub in wd.contents) {
        if (wd.contents[sub].type == "directory") {
          contents = contents + "<span class='directory'>" + wd.contents[sub].name + "</span>";
        }
        else if (wd.contents[sub].type == "text") {
          contents = contents + "<span class='text'>" + wd.contents[sub].name + "</span>";          
        }
      }
      return contents.toString()
    }
  },
  "cd" : {
    execute : function(fs, options) {
      if (options.length > 0) {
        var path = options[0].split('/');
        var wd = fs.root;
        if (path[0] == '') {
          for (var i = 1; i < path.length; i++) {
            wd = wd.contents[path[i]]
          }
        }
        else {
          var wd_path = fs.wd.path.split('/')
          for (var i = 1; i < wd_path.length; i++) {
            wd = wd.contents[path[i]]
          }
        }
        if (wd) {
          console.log(wd)
        }
        else {
          console.log("NOT FOUND!")
        }

      }
      else {
        // go back to home
      }
    }
  }
}

var color = {
  "normal" : "#FFFFFF",
  "directory" : "red",
  "text" : "green"
}
angular
.module("myApp", ['ngTerminal'])

.config(function (terminalConfigProvider) {
  terminalConfigProvider.setFileSystem(fs)
  terminalConfigProvider.setTextColor(color)
  terminalConfigProvider.setCommands(cmd)
})

.controller("myController", ['$scope', function($scope) {
  
  
  
}])