var url     = require('url')
var path    = require('path')
var fs      = require('fs')
var qs      = require('querystring')

var cheerio = require('cheerio')
var request = require('request')
var extend  = require('extend')
var async   = require('async')
var Set     = require('Set')
var mkdirp  = require('mkdirp')

var Option = require('./option')
var encode = require('./encode')



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
  var domains = [url.parse(this.option("uri")).hostname]
  if(this.option("span-host")){
    var _domains = this.option("domains")
    if(typeof _domains === "string"){
      _domains = _domains.split(",")
    }
    if(Array.isArray(_domains)){
      domains = domains.concat(_domains)
    }
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
  self.get(task.uri, function(err, res, body){
    var links = getPageLinks(res)

    var nextLevel = task.level + 1
    // next level crawling
    links.forEach(function(link){
      // skip if over level
      if(self.option("level") < task.level){
        log("skip because level over")
        return
      }
        
      // skip if ignore
      if(self.isIgnoreCrawl(link)){
        //log("skip because match ignore rule")
        return
      }
      
      log([nextLevel, link]);
      self.push(link, nextLevel)
    })
    self.save(task.uri, body, function(err, filepath){
      log(["save", filepath])
      if(err){
        console.error(err);
      }
    })
    callback()

  })
}

/**
 * request.get wrapper
 * @param  {[type]}   uri [description]
 * @param  {Function} cb  [description]
 * @return {[type]}       [description]
 */
Spider.prototype.get = function(uri, callback){
  var requestOption = {
    uri : uri,
    encoding : null
  }
  request(requestOption, function(err, req, body){
    callback(err, req, body)
  })
}

Spider.prototype.isIgnoreCrawl = function(link){
 
  // domain
  var parsedLink = url.parse(link)
  if(this.option("domains").indexOf(parsedLink.hostname) === -1){
    return true
  }
  
  return false
}

Spider.prototype.save = function(uri, body, callback){
  callback = callback || function(){}
  if(this.option("no-save")){
    callback(null, null)
    return
  }
  
  var filePath = this.createSaveFilePath(uri)
  if(this.isIgnoreSave(filePath)){
    callback(null, null)
    return
  }
  
  // TODO: use file handler
  var saveFilePath = uniqueFilePath(filePath)
  mkdirp(path.dirname(saveFilePath), function(err){
    if(err){
      callback(err, null)
      return
    }
    fs.writeFile(saveFilePath, body, function(err){
      callback(err, saveFilePath)
    })
  })
}

Spider.prototype.createSaveFilePath = function(uri){
  var prefix     = this.option("directory-prefix")
  
  var parsedLink = url.parse(uri)
  var filePath   = path.join("./" , prefix)
  if(/\/$/.test(parsedLink.path)){
    parsedLink.path += "index.html"
  }
  
  // TODO: on windows, maybe need replace ? to @
  filePath = path.join(filePath, parsedLink.hostname, parsedLink.path)

  return filePath
}

Spider.prototype.isIgnoreSave = function(filePath){

  var accept = this.option("accept")
  if( accept ){
    if(!(new RegExp(reject).test(filePath))) {
      return true
    }
  }

  var reject = this.option("reject")
  if( reject ){
    if(new RegExp(reject).test(filePath)){
      return true
    }
  }
  return false
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
  var body = encode(res)
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