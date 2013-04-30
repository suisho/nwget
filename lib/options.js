
// option struct
var Opt = function(type, init){
  this.init = init
  this.type = type
}
Opt.prototype.get = function(value){
  if(value !== undefined){
    return value
  }
  return this.init
}


var makeKnownOpts = function(optCommands){
  var knownOpts = {}
  for(var opt in optCommands){
    knownOpts[opt] = opt.type
  }
  return knownOpts
}

var COMMANDS = {
  recursive : new Opt([Boolean], false),
  clobber   : new Opt([Boolean], true)
}


var shortHand = {
  "r"  : ["--recursive"],
  "nc" : ["--no-clobber"]
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
module.exports.argv = function(){
  var nopt = require('nopt')
  var argvOpts = nopt(makeKnownOpts(COMMANDS), shortHand, process.argv)
  return parsedOptions(argvOpt)
}