var nopt = require('nopt')
var options = require("../lib/options")
var spider = require("../lib/spider")

var argv = options.argv()
spider(argv)
