var nopt    = require('nopt')
var spider  = require("../lib/spider")
var async   = require("async")

var KNOWN_OPT = {
  // Download
  "spider"           : [Boolean],
  "clobber"          : [Boolean],
  
  // Directories
  "directory-prefix" : [String],
  
  // Recursive download
  "recursive"        : [Boolean],
  "level"            : [Number],
  
  // Recursive accept/reject
  "domains"          : [String, Array],
  "exclude-domains"  : [String, Array],
  "span-host"        : [Boolean],
}

var SHORT_HAND = {
  "r"  : ["--recursive"],
  "nc" : ["--no-clobber"],
  "l"  : ["--level"],
  "D"  : ["--domains"],
  "H"  : ["--span-host"],
  "P"  : ["--directory-prefix"]
}

var showHelp = function(){
  console.log("Usage: nwget [OPTION]... [URL]...")
}


var argvOpts  = nopt(KNOWN_OPT,
                     SHORT_HAND,
                     process.argv)

var uriList = argvOpts.argv.remain
if(uriList.length == 0 ){
  showHelp()
}

delete argvOpts.argv

async.mapSeries(uriList, function(uri, callback){
  console.log("Crawl " + uri);
  console.log(argvOpts);
  spider(uri, argvOpts, callback)
})