var url     = require('url')
var path    = require('path')
var fs      = require('fs')

var cheerio = require('cheerio')
var request = require('request')
var extend  = require('extend')
var async   = require('async')
var Set     = require('Set')

var Option = require('./option')



//Override if quiet
var log = function(msg){
  console.log(msg);
}

var Spider = function(option){
  this.option = new Option(option)
  this.pushed = new Set() // save already pushed

  this.init()
  
  var self = this
  this.queue = async.queue(function(task, callback){
    self.worker(task, callback)
  })
}

Spider.prototype.init = function(){
  
  if(this.option("recursive")){
    this.option.setDefault("level", 5)
  }
  // accept default value
  this.option.setDefault("accept", ".*")
    
  // set domain
  // adding self domain.
  // GNU wget exclude self domain. but I think that is very unusefle
  var domains = [url.parse(this.option("uri")).domain]
  if(this.option("span-host")){
    domains.concat(this.option("domains").split(","))
  }
  this.option("domains", domains)
  
}

Spider.prototype.start = function(){
  this.push(this.option("uri"), 0)
}

/**
 * start clawring
 * @param  {[type]} url   [description]
 * @param  {[type]} level [description]
 * @return {[type]}       [description]
 */
Spider.prototype.push = function(uri, level){
  if(level === undefined){
    throw "Invalid level"
  }
  if(this.pushed.has(uri)){
    return false
  }
  this.pushed.add(uri)
  log([level,uri]);
  this.queue.push({
    uri : uri,
    level : level
  })
}

/**
 * async queue worker
 * @type {Object}   task
 * @type {Function} callback
 */
Spider.prototype.worker = function(task, callback){
  var self = this
  self.get(task.uri, function(err, r, body){
    self.save(r, body)
    var links = getPageLinks(r)
    // next level crawling
    links.forEach(function(link){
      // skip if over level
      if(self.option("level") < task.level) return
        
      // skip if ignore
      if(self.isIgnoreLink(link)) return
      
      self.push(link, task.level + 1)
      self.save(link, body)
    })
    callback()
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
  request(requestOption, function(err, req, body){
    cb(err, req, body)
  })
}

Spider.prototype.isIgnoreLink = function(link){
  var url = require('url')
  var whitelist = this.option("accept")
  var blacklist = this.option("reject")
  
  // domain
  var parsedLink = url.parse(link)
  if(this.option("domains").indexOf(parsedLink.domain) === -1){
    return true
  }
  return false
}

Spider.prototype.save = function(link, body, callback){
  
}

Spider.prototype.createSaveFilePath = function(link){
  var prefix     = this.option("directory-prefix")
  var parsedLink = url.parse(link)
  var filePath   = path.join("./" , prefix)
  
  filePath = path.join(filePaht, parsedLink.domain, parsedLink.path)
  var prefix = 0;
  
  
  return filePath
}

/**
 * Append number if file exist
 * @param  {String} path
 * @return {String}
 */
var uniqueFilePath = function(filePath){
  
  var uniqueFilePath = filePath
  for(var i=1; i < Number.MAX_VALUE; i++){
    
    if(!fs.existsSync(uniqueFilePath)){
      break;
    }
    uniqueFilePath = filePath + "." + i
  }
  return uniqueFilePath
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
      var url = require('url')
      var parsedUrl = url.parse(attrUrl)
      
      pageLinks.add(url.resolve(res.request.href, parsedUrl))
    })
  }
  return pageLinks.toArray()
}

/**
 * ([uri], options, callback)
 * @param {String|Array} url
 * @param {Object} options
 */

module.exports = function(uri, options, callback){
  if(options === undefined){
    options  = uri
    callback = options
  }

  if(uri.length === 0){
    return false
  }
  options.uri = uri
  options.callback = callback
  var spider = new Spider(options)
  spider.start()
}
module.exports.Spider = Spider