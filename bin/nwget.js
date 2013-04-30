var nopt = require('nopt')
var options = require("../lib/options")
var Spider = require("../lib/spider")

var shortHand = {
  "r"  : ["--recursive"],
  "nc" : ["--no-clobber"],
  "l"  : ["--level"],
}
var knownOpts = options.makeKnownOpts()
var argvOpts = nopt(knownOpts, shortHand, process.argv)

console.log(argvOpts);
var parsedOpts = options(argvOpts)

var spider = new Spider(argvOpts.argv.remain[0], options)
spider.start()