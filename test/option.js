var fs = require('fs')
var assert = require('assert')
var util = require('util')

describe('Options', function () {
  
  var Options = require("../lib/option")
  
  it('should set option', function(){
    var option = Options()
    option("recursive", true)
    assert.ok(option("recursive"))
  })
  
  it('other option has other data', function () {
    var option1 = Options()
    var option2 = Options()
    option1("foo", "baa")
    option2("foo", "bee")
    option1.dump()
    option2.dump()
    
    assert.equal(option1("foo"), "baa")
    assert.equal(option2("foo"), "bee")
  });
  
  it('should get reverse if no- flag', function(){
    var option = Options()
    option("clobber", false)
    assert.ok(option("no-clobber"))
  })
  
  it('should get default if not set', function(){
    var option = Options()
    option.init()
    assert.equal(option.get("level"), undefined)
    assert.equal(option.get("level", 5), 5)
  })
  
  it('should get data value if value is setted', function(){
    var option = Options()
    option.init()
    assert.equal(option.get("level"), undefined)
    option("level", 10)
    assert.equal(option.get("level", 5), 10)
  })
});