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
        type : "directory",
        contents : {
          bin : {
            name : "bin",
            path : "/usr/bin",
            type : "directory",
            contents : {
              pwd : {
                name : "pwd",
                path : "/usr/bin/pwd",
                type : "executable",
                contents : "return this.fs.wd.path;"
              },
              ls : {
                name : "ls",
                path : "/usr/bin/ls",
                type : "executable",
                contents : 
                "var output = '';"+
                "if (options.length == 0) {" +
                  "var wd = this.fs.getDirectory(this.fs.wd.path);" +
                  "for (var cont in wd.contents) {" + 
                    "output = output + \"<span class='\" + wd.contents[cont].type + \"'>\" + wd.contents[cont].name + \"</span>\" "+
                  "}" +
                  "return output;" +
                "}" + 
                "else {" +
                  "for (var w = 0; w < options.length; w++) {"+
                    "var wd = this.fs.getDirectory(options[w]);"+
//                    "console.log(wd);"+
                    "if (wd) {"+
                      "if (options.length > 1) { output = output + wd.path + \"/:<br>\";}"+
                      "for (var cont in wd.contents) {" + 
                        "output = output + \"<span class='\" + wd.contents[cont].type + \"'>\" + wd.contents[cont].name + \"</span>\" "+
                      "}" +
                      "if (options.length > 1 && w < (options.length -1)) { output = output + '<br>' }"+
                    "}"+
                    "else {" +
                      "output = output + \"ls: \" + options[w] + \": No such file or directory\"; "+
                      "if (options.length > 1 && w < (options.length -1)) { output = output + '<br>' }"+
                    "}"+
                  "}"+
                  "return output"+
                "}"
              },
              cd : {
                name : "cd",
                path : "/usr/bin/cd",
                type : "executable",
                contents : function() {
                  "var wd = this.getDirectory(options[0])"+
                  "if (wd) { this.wd.path = wd.path;}"+
                  "else { return \"cd: \" + options[0] + \": No such file or directory\" }"
                }
            }
            }
          }
        }
      },
      bin : {
        name : "bin",
        path : "/bin",
        type : "directory"
      }
    }
  },
  wd : {
    path : "/home"
  },
  getDirectory : function(d) {
    var dir = d.split('/');
    if (dir[dir.length-1] == "") { dir.pop(); }
    if (dir[0] == '') {
      var wd = this.root;
      dir.splice(0,1);
    }
    else {
      var wd = this.getDirectory(this.wd.path);
    }
    for (var q = 0;q < dir.length;q++) {
      console.log(dir[q]);
      if (dir[q] != ".." && dir[q] != ".") {
        console.log("Not a ..");
        if (wd.contents[dir[q]]) {
          wd = wd.contents[dir[q]]
        }
        else {
          return false;
        }
      }
      else if (dir[q] == "..") {
        var split = wd.path.split('/');
        if (split[split.length -1] == "") {
          split.pop();
        }
        split.pop();
        if (split.length > 1) {
          var new_path = split.join("/");
          wd = this.getDirectory(new_path);
          if (!wd) {
            return false;
          }
        }
        else {
          wd = this.root;
        }
      }
      else if (dir[q] == ".") {

      }
    } 
    return wd;    
    
    
  },
  $PATH : ["/usr/bin/"]
}

var cmd = {
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
  "text" : "blue",
  'executable' : "green"
  
}
angular
.module("myApp", ['ngTerminal'])

.config(function (terminalConfigProvider) {
  terminalConfigProvider.setFileSystem(fs)
  terminalConfigProvider.setTextColor(color)
})

.controller("myController", ['$scope', function($scope) {
  
  
  
}])