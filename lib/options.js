
// option structObject
var OptionParam = function(type, init){
  this.init = init
  this.type = type
  
  this.get = function(value){
    if(value !== undefined) return value
    return this.init
  }
}


var COMMANDS = {
  url       : new OptionParam([String,Array]),
  recursive : new OptionParam([Boolean], false),
  level     : new OptionParam([Number],  5),
  clobber   : new OptionParam([Boolean], true),
}
var SHORT_HAND = {
  "r"  : ["--recursive"],
  "nc" : ["--no-clobber"],
  "l"  : ["--level"],
}

var parseOptions = function(options){
  options = options || {}
  var opts = {}
  for(var opt in COMMANDS){
    opts[opt] = COMMANDS[opt].get(options[opt])
  }
  return opts;
}

module.exports = function(options){
  return parseOptions(options)
}
/**
 * Make Object for nopt's lnownOpt
 * @see bin/nwget.js
 * @return {Object}
 */
module.exports.getKnownOpts = function(){
  var knownOpts = {}
  for(var opt in COMMANDS){
    knownOpts[opt] = COMMANDS[opt].type
  }
  return knownOpts
}
module.exports.getShortHand = function(){
  return SHORT_HAND
}
module.exports.argv = function(){
  var nopt = require('nopt')
  var argvOpts  = nopt(this.getKnownOpts(),
                       this.getShortHand(),
                       process.argv)
  argvOpts.url = argvOpts.argv.remain[0]
  return parseOptions(argvOpts)
}
