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
  var crawler = rewire('../lib/spider.js')
  var Spider = crawler.Spider
  // rewire mock
  var getPageLinks = crawler.__get__('getPageLinks');
  
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
  });
});
