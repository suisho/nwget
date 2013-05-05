var jschardet = require('jschardet')
var cheerio = require('cheerio')
var encoding = require('encoding')

/**
 * Output utf8 converted body
 * @param  {Response} res HTTP response
 * @return {String}   converted body
 */
module.exports = function(res){
  
  var charset = null
  
  // Find from header
  var contentType = res.headers['content-type'] || ""
  var matches = contentType.match(/charset=(.*)/)
  if(matches && matches[1]){
    charset = matches[1]
  }

  // Find from <meta> tag
  if(charset === null){
    var $ = cheerio.load(res.body);
    charset = $('meta[http-equiv="Content-Type"]').attr('content');
  }
  
  // Detect from body
  if(charset === null){
    charset = jschardet.detect(res.body).encoding
  }
  
  
  return encoding.convert(res.body, 'utf-8', charset)
}