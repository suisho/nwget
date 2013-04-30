var fs = require('fs')
var assert = require('assert')
var util = require('util')

describe('Options', function () {
  var options = require("../lib/options")
  it('should recursive option on', function(){
    var opt = options()
    assert.equal(opt.clobber, true)
    assert.equal(opt.recursive, false)
    
    opt = options({
      recursive : true,
      clobber   : false
    })
    //console.log(opt);
    assert.equal(opt.clobber, false)
    assert.equal(opt.recursive, true)
  })

});