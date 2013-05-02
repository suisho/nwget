// @see grunt/option.js

module.exports = function(obj){
  var data = {}
  var option = function(key, value){
    // setter
    if(value !== undefined){
      data[key] = value
      return value
    }
    
    // getter
    var no = key.match(/^no-(.+)$/);
    if(no){
      return data[no[1]] === false;
    } else {
      return data[key];
    }
    
  }
  
  option.setDefault = function(key, value){
    if(data[key] === undefined){
      data[key] == value
    }
  }
  
  option.get = function(key, defaultValue){
    var value = option(key)
    return (value !== undefined) ? value : defaultValue
  }
  
  option.init = function(obj) {
    return (data = obj || {});
  };
  option.dump = function(){
    console.log(data);
  }
  option.init(obj)
  return option
}
