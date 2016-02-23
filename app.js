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
          pjtatlow : {
            name : "pjtatlow",
            path : "/home/pjtatlow",
            type : "directory",
            contents: {
              Documents : {
                name : "Documents",
                path : "/home/pjtatlow/Documents",
                type : "directory",
                contents: {
                  "test\txt" : {
                    name : "test.txt",
                    path : "/home/pjtatlow/Documents/test.txt",
                    type : "text",
                    contents : "This is a text document\nthis should be on a new line."
                  }
                }
              },
              Desktop : {
                name : "Desktop",
                path : "/home/pjtatlow/Desktop",
                type : "directory",
                contents: []
              },
              Downloads : {
                name : "Downloads",
                path : "/home/pjtatlow/Downloads",
                type : "directory",
                contents: []
              },
              Pictures : {
                name : "Pictures",
                path : "/home/pjtatlow/Pictures",
                type : "directory",
                contents: []
              },
              Videos : {
                name : "Videos",
                path : "/home/pjtatlow/Videos",
                type : "directory",
                contents: []
              }
            }
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
                contents : 
                  "if (options.length > 0) {"+
                    "var wd = this.fs.getDirectory(options[0]);"+
                    "if (wd && wd.type=='directory') { this.fs.wd.path = wd.path;}"+
                    "else if (wd && wd.type!='directory') { return \"cd: \" + options[0] + \": Not a directory\" }" +
                    "else { return \"cd: \" + options[0] + \": No such file or directory\" }"+
                  "}"+
                  "else { this.fs.wd.path = this.fs.wd.default }"  
              }
            }
          }
        }
      },
      bin : {
        name : "bin",
        path : "/bin",
        type : "directory",
        contents : {
          cp : {
            name : "cp",
            path : "/bin/cp",
            type : "executable",
            contents : "" 
          },
          echo : {
            name : "echo",
            path : "/bin/echo",
            type : "executable",
            contents : "return options.join(' ')" 
          }
        }
      }
    }
  },
  wd : {
    path : "/home/pjtatlow",
    default : "/home/pjtatlow",
    name: "~"
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
      if (dir[q] != ".." && dir[q] != "." && dir[q] != '~') {
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
      else if (dir[q] == "~") {
        wd = this.getDirectory(this.wd.default)
      }
    } 
    return wd;    
    
    
  },
  $PATH : ["/usr/bin/", "/bin"]
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

.controller("myController", ['$scope', 'terminalConfig', function($scope, terminalConfig) {  
  
}])