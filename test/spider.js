var fs = require('fs')
var assert = require('assert')
var util = require('util')
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
  var rewire = require('rewire')
  var Spider = rewire('../lib/spider.js')
  // rewire mock
  var getPageLinks = Spider.__get__('getPageLinks');
  it('start', function(done){
    
  })
  it('parse url attr can true parsing', function (done) {
    // TODO: separate to single test
    var startUrl = "http://google.com"
    var spider = new Spider(startUrl,{})
    spider.get(startUrl, function(e, r, body){
      var links = getPageLinks(r, body)
      assert.ok(util.isArray(links))
      done()
    })
  });
});
