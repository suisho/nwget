
// option struct
var Opt = function(type, init){
  this.init = init
  this.type = type
  this.get = function(value){
    if(value !== undefined) return value
    return this.init
  }
}

var COMMANDS = {
  recursive : new Opt([Boolean], false),
  level     : new Opt([Number],  5),
  clobber   : new Opt([Boolean], true),
}


var parseOptions = function(options){
  options = options || {}
  //console.log(parsedOpts);
  var opts = {}
  for(var opt in COMMANDS){
    opts[opt] = COMMANDS[opt].get(options[opt])
  }
  return opts;
}

module.exports = parseOptions

module.exports.makeKnownOpts = function(){
  var knownOpts = {}
  for(var opt in COMMANDS){
    knownOpts[opt] = COMMANDS[opt].type
  }
  return knownOpts
}
