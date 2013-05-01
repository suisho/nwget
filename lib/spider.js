var url = require('url')

var cheerio = require('cheerio')
var request = require('request')
var extend  = require('extend')
var async   = require('async')
var Set     = require('Set')

var parseOptions = require('./options')



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

module.exports = function(url, options){
    console.log(url, options);

  if(options === undefined){
    options = url
    url     = options.url
  }

  if(typeof url === "string"){
    url = [ url ]
    options.url = url
  }

  var spider = new Spider(options)
  spider.start()
}
/**
 * ([url], options)
 * @param {String|Array} url
 * @param {Object} options
 */
var Spider = function(options){
    // args
  this.options = parseOptions(options)

  this.visited = new Set() // save already visited
  
  var self = this
  this.queue = async.queue(function(task, callback){
    
    self.get(task.url, function(err, r, body){
      console.log("Finish", task.url);
      var links = getPageLinks(r)
      // next level crawling
      links.forEach(function(item){
        self.push(item, task.level + 1)
      })
      callback()
    })
  })
  

}

//Override if quiet
var log = function(msg){
  console.log(msg);
}


Spider.prototype.start = function(){
  var self = this
  this.options.url.forEach(function(_url){
    self.push(_url, 0)
  })
}
/**
 * start clawring
 * @param  {[type]} url   [description]
 * @param  {[type]} level [description]
 * @return {[type]}       [description]
 */
Spider.prototype.push = function(url, level){
  if(level === undefined){
    throw "Invalid level"
  }
  log([level,url]);
  this.queue.push({
    url : url,
    level : level
  })
}

/**
 * request.get wrapper
 * @param  {[type]}   url [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
Spider.prototype.get = function(url, cb){
  var requestOption = {
    uri : url
  }
  this.visited.add(url, true)
  request(requestOption, function(err, req, body){
    cb(err, req, body)
  })
}

/**
 * Parse url link from web page
 * @param  {Object}    res Request's response
 * @return {Array}     Link url
 */
var getPageLinks = function(res){
  if(res == undefined){
    return []
  }
  var requestUri = res.request.uri
  var body = res.body
  //TODO: Encoding
  $ = cheerio.load(body);
  var urlAttributes = {
    "a"   : "href",
    "img" : "src"
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