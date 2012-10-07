// Generated by CoffeeScript 1.3.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  OpenCoffeeScad.DataStoreManager = (function() {

    function DataStoreManager(debug) {
      var name, store, _ref;
      this.debug = debug != null ? debug : false;
      this.LocalStore = new OpenCoffeeScad.LocalStore(this.debug);
      this.fsStore = new OpenCoffeeScad.FsStore(this.debug);
      this.gistStore = new OpenCoffeeScad.GistStore(this.debug);
      this.stores = {
        "local": this.LocalStore,
        "fs": this.fsStore,
        "gist": this.gistStore
      };
      _ref = this.stores;
      for (name in _ref) {
        store = _ref[name];
        store.detect_capabilities();
      }
    }

    DataStoreManager.prototype.save_file = function(store, fileName, data) {
      if (store == null) {
        store = "local";
      }
      if (fileName == null) {
        fileName = null;
      }
      if (data == null) {
        data = null;
      }
      if ((fileName != null) && (data != null)) {
        if (this.stores[store].available) {
          return this.stores[store].save_file(fileName, data);
        } else {
          return console.log("Unable to save file, " + store + " is not supported in this browser");
        }
      }
    };

    DataStoreManager.prototype.load_file = function(store, fileName) {
      if (store == null) {
        store = "local";
      }
      if (fileName == null) {
        fileName = null;
      }
      if (fileName != null) {
        if (this.stores[store].available) {
          return this.stores[store].load_file(fileName);
        } else {
          return console.log("Unable to load file, " + store + " is not supported in this browser");
        }
      }
    };

    DataStoreManager.prototype.get_files = function(store) {
      if (store == null) {
        store = "local";
      }
      if (this.stores[store].available) {
        return this.stores[store].get_files();
      } else {
        return console.log("Unable to get files, " + store + " is not supported in this browser");
      }
    };

    DataStoreManager.prototype.delete_file = function(store, fileName) {
      if (store == null) {
        store = "local";
      }
      if (fileName == null) {
        fileName = null;
      }
      if (fileName != null) {
        if (this.stores[store].available) {
          return this.stores[store].delete_file(fileName);
        } else {
          return console.log("Unable to delete file, " + store + " is not supported in this browser");
        }
      }
    };

    return DataStoreManager;

  })();

  OpenCoffeeScad.DataStore = (function() {

    function DataStore(debug) {
      this.debug = debug != null ? debug : false;
      this.available = false;
    }

    DataStore.prototype.detect_capabilities = function() {
      throw "NotImplemented";
    };

    DataStore.prototype.save_file = function(fileName, data) {
      if (fileName == null) {
        fileName = null;
      }
      if (data == null) {
        data = null;
      }
      throw "Save_file NotImplemented";
    };

    DataStore.prototype.load_file = function(fileName) {
      if (fileName == null) {
        fileName = null;
      }
      throw "load_file NotImplemented";
    };

    DataStore.prototype.get_files = function() {
      throw "get_files NotImplemented";
    };

    DataStore.prototype.delete_file = function() {
      throw "delete_file NotImplemented";
    };

    DataStore.prototype.clear_files = function() {
      throw "clear_files NotImplemented";
    };

    DataStore.prototype.get_projects = function() {
      throw "NotImplemented";
    };

    return DataStore;

  })();

  OpenCoffeeScad.LocalStore = (function(_super) {

    __extends(LocalStore, _super);

    function LocalStore(debug) {
      if (debug == null) {
        debug = false;
      }
      LocalStore.__super__.constructor.call(this, debug);
    }

    LocalStore.prototype.detect_capabilities = function() {
      if (window.localStorage != null) {
        console.log("Brower localStorage support ok");
        return this.available = true;
      } else {
        return console.log("Your browser does not support HTML5 localStorage. Try upgrading.");
      }
    };

    LocalStore.prototype.save_file = function(fileName, data) {
      if (fileName == null) {
        fileName = null;
      }
      if (data == null) {
        data = null;
      }
      if (this.debug) {
        console.log("saving to local storage");
      }
      try {
        localStorage.setItem(fileName, data);
        return this._addToSaves(fileName);
      } catch (e) {
        console.log("Error: " + e);
        if (e === QUOTA_EXCEEDED_ERR) {
          return console.log("Quota exceeded!");
        }
      }
    };

    LocalStore.prototype.load_file = function(fileName) {
      var data;
      if (fileName == null) {
        fileName = null;
      }
      try {
        data = "";
        data = localStorage.getItem(fileName);
        return data;
      } catch (e) {
        return console.log("Unable to load data, sorry");
      }
    };

    LocalStore.prototype.get_files = function() {
      var data;
      try {
        data = localStorage.getItem("files");
        if (data != null) {
          data = data.split(" ");
        } else {
          data = [];
        }
        if (this.debug) {
          console.log("Retrieved saves: " + data);
        }
        return data;
      } catch (e) {
        return console.log("Unable to load files list, sorry");
      }
    };

    LocalStore.prototype.delete_file = function(fileName) {
      return localStorage.removeItem(fileName);
    };

    LocalStore.prototype.clear_files = function() {
      return window.localStorage.clear();
    };

    LocalStore.prototype._addToSaves = function(filename) {
      var saves;
      saves = localStorage.getItem("files");
      if (!(saves != null)) {
        saves = [];
      } else {
        saves = saves.split(" ");
      }
      if (__indexOf.call(saves, filename) >= 0) {

      } else {
        saves.push(filename);
      }
      saves = saves.join(" ");
      if (this.debug) {
        console.log("saving files: " + saves);
      }
      return localStorage.setItem("files", saves);
    };

    return LocalStore;

  })(OpenCoffeeScad.DataStore);

  OpenCoffeeScad.FsStore = (function(_super) {

    __extends(FsStore, _super);

    function FsStore(debug) {
      if (debug == null) {
        debug = false;
      }
      FsStore.__super__.constructor.call(this, debug);
    }

    FsStore.prototype.detect_capabilities = function() {
      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      if (window.requestFileSystem != null) {
        return this.available = true;
      } else {
        return console.log("Your browser does not support the HTML5 FileSystem API. Please try the Chrome browser instead.");
      }
    };

    FsStore.prototype.save_file = function(fileName, data) {
      if (fileName == null) {
        fileName = null;
      }
      if (data == null) {
        data = null;
      }
      if (this.debug) {
        return console.log("saving to fs");
      }
      /*    
      generateOutputFileFileSystem:() ->
        # create a random directory name:
        dirname = "OpenJsCadOutput1_"+ parseInt(Math.random()*1000000000, 10)+"."+extension
        extension = @extensionForCurrentObject()
        filename = @filename+"."+extension
        
        window.requestFileSystem(TEMPORARY, 20*1024*1024, (fs)->
            fs.root.getDirectory(dirname, {create: true, exclusive: true}, (dirEntry) ->
                @outputFileDirEntry = dirEntry
                dirEntry.getFile(filename, {create: true, exclusive: true}, (fileEntry)->
                     fileEntry.createWriter((fileWriter)->
                        fileWriter.onwriteend = (e)->
                          @hasOutputFile = true
                          @downloadOutputFileLink.href = fileEntry.toURL()
                          @downloadOutputFileLink.type = @mimeTypeForCurrentObject()
                          @downloadOutputFileLink.innerHTML = @downloadLinkTextForCurrentObject()
                          @enableItems()
                          if(@onchange) @onchange()
        
                        fileWriter.onerror = (e)-> 
                          throw new Error('Write failed: ' + e.toString())
        
                        blob = @currentObjectToBlob()
                        fileWriter.write(blob)      
        
                      (fileerror) -> 
                        OpenJsCad.FileSystemApiErrorHandler(fileerror, "createWriter")
                 (fileerror) -> 
                    OpenJsCad.FileSystemApiErrorHandler(fileerror, "getFile('"+filename+"')")
              (fileerror) -> 
                OpenJsCad.FileSystemApiErrorHandler(fileerror, "getDirectory('"+dirname+"')") 
          (fileerror)->
            OpenJsCad.FileSystemApiErrorHandler(fileerror, "requestFileSystem")
      */

    };

    FsStore.prototype.load_file = function(fileName) {
      if (fileName == null) {
        fileName = null;
      }
    };

    FsStore.prototype.get_files = function() {};

    FsStore.prototype.delete_file = function() {};

    FsStore.prototype.clear_files = function() {};

    FsStore.prototype._onInitFs = function(fs) {
      return console.log("Opened file system: " + fs.name);
    };

    return FsStore;

  })(OpenCoffeeScad.DataStore);

  OpenCoffeeScad.GistStore = (function(_super) {

    __extends(GistStore, _super);

    function GistStore(debug) {
      if (debug == null) {
        debug = false;
      }
      GistStore.__super__.constructor.call(this, debug);
      this.currentUser = "kaosat-dev";
    }

    GistStore.prototype.detect_capabilities = function() {
      return this.available = true;
    };

    GistStore.prototype.save_file = function(fileName, data) {
      if (fileName == null) {
        fileName = null;
      }
      if (data == null) {
        data = null;
      }
      if (this.debug) {
        return console.log("saving to gist repo");
      }
    };

    GistStore.prototype.load_file = function(fileName) {
      var GistsOfK33g, oneGist;
      if (fileName == null) {
        fileName = null;
      }
      GistsOfK33g = new Gh3.Gists(new Gh3.User("kaosat-dev"));
      oneGist = new Gh3.Gist({
        id: "3842893"
      });
      return oneGist.fetchContents(function(err, res) {
        var myFile;
        if (err) {
          console.log("error " + err + " fetching gist");
        }
        console.log("oneGist : ", oneGist);
        console.log("Files : ", oneGist.files);
        myFile = oneGist.getFileByName("file2.coffee");
        console.log("myFile: " + myFile);
        console.log(myFile.content);
        return console.log("Gist files: " + oneGist.files);
      });
    };

    GistStore.prototype.get_files = function() {};

    GistStore.prototype.delete_file = function() {};

    GistStore.prototype.clear_files = function() {};

    GistStore.prototype.get_projects = function(userName) {
      var gists;
      if (userName == null) {
        userName = null;
      }
      if (userName != null) {
        return gists = new Gh3.Gists(new Gh3.User(userName));
      }
    };

    return GistStore;

  })(OpenCoffeeScad.DataStore);

}).call(this);
