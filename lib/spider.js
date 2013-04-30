var cheerio = require('cheerio')
var request = require('request')
var extend = require('extend')
var url = require('url')
var Set = require('Set')


var Options = function(baseOption){
  
}
Options.prototype = {
  
}


var Hash = function(){
  this.map = {}
  var self = this
  this.set = function(key, value){
    self.map[key] = value
  }
  this.push = function(key){
    self.map[key] = true
  }
  this.get = function(key){
    return map[key]
  }
  this.toArray = function(){
    return
  }
}

var Spider = function(startUrl, options){
  this.starturl = startUrl
  this.options = new Options(options)
  this.getted = {}
  this.brain = new Set()
}

//Override if quiet
var log = function(msg){
  console.log(log);
}

Spider.prototype.done = function(){
  
}

Spider.prototype.get = function(url, cb){
  var requestOption = {
    uri : url
  }
  this.brain.add(url, true)
  request(requestOption, function(err, req, body){
    cb(err, req, body)
  })
}

var getPageLinks = function(res){
  var requestUri = res.request.uri
  var body = res.body
  //TODO: Encoding
  $ = cheerio.load(body);
  var urlAttributes = {
    "a" : "href"
  }
  var pageLinks = new Set
  for(var tag in urlAttributes){
    $(tag).each(function(){
      var attrUrl = $(this).attr(urlAttributes[tag])
      if(attrUrl === undefined){
        return
      }
      var parsedUrl = url.parse(attrUrl)
      
      pageLinks.add(url.resolve(res.request.href, parsedUrl))
    })
  }
  return pageLinks.toArray()
}
module.exports = Spider