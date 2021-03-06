var jschardet = require('jschardet')
var cheerio = require('cheerio')
var encoding = require('encoding')

/**
 * Output utf8 converted body
 * @param  {Response} res HTTP response
 * @return {String}   converted body
 */
module.exports = function(res, toCharset){
  
  var charset = null
  
  if(toCharset){
    charset = toCharset
  }
  
  // Find from header
  var contentType = res.headers['content-type'] || ""
  var matches = contentType.match(/charset=(.*)/)
  if(charset === null && matches && matches[1]){
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
  
  //console.log( encoding.convert(res.body, 'utf-8', charset).toString());
  return encoding.convert(res.body, 'utf-8', charset)
}