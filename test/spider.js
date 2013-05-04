var fs = require('fs')
var assert = require('assert')
var util = require('util')
var mkdirp = require('mkdirp')
var touch = require('touch')
var rewire = require('rewire')

/*
describe('mikeal Spider', function () {
  it("力試し", function(done){
    var spider = require('spider')
    var s = spider()
    var url = "http://google.com"
    s.get(url);
    s.cache.get(url, function(err, foo){
      console.log(err, foo);
      done()
    })
  })
})
*/




describe('Spider', function () {
  var crawler = rewire('../lib/spider.js')
  var Spider = crawler.Spider
  // rewire mock
  var getPageLinks = crawler.__get__('getPageLinks')
  it('parse url attr can true parsing', function (done) {
    // TODO: separate to single test
    var startUrl = "http://google.com"
    var option = {
      uri: startUrl
    }
    var spider = new Spider(option)
    spider.get(startUrl, function(e, r, body){
      var links = getPageLinks(r, body)
      assert.ok(util.isArray(links))
      done()
    })
  })
})

describe('Unique file Path', function(){
  var crawler = rewire('../lib/spider.js')
  var uniqueFilePath = crawler.__get__('uniqueFilePath')
  
  beforeEach(function () {
    try{
      fs.unlinkSync("./tmp/unique")
    }catch(e){}
    mkdirp.sync("./tmp/unique")
  })
  
  it('should get "foo.1"', function(){
    touch.sync("./tmp/unique/foo")
    var actual = uniqueFilePath("./tmp/unique/foo")
    assert.equal(actual, "./tmp/unique/foo.1")
  })
  
  it('should get "baa"', function(){
    // without touch
    var actual = uniqueFilePath("./tmp/unique/baa")
    assert.equal(actual, "./tmp/unique/baa")
  })
  
  it('should get "baz.4"', function(){
    touch.sync("./tmp/unique/baz")
    touch.sync("./tmp/unique/baz.1")
    touch.sync("./tmp/unique/baz.2")
    touch.sync("./tmp/unique/baz.3")
    
    var actual = uniqueFilePath("./tmp/unique/baz")
    assert.equal(actual, "./tmp/unique/baz.4")
  })
})
