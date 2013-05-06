/**
 * async execute on hierarcical.
 * async.queue thorw RangeError when push task inner async task.
 */

var async = require('async')
if( typeof setImmediate !== "function"){
  setImmediate = process.nextTick
}
var levelWorker = function(arr, iterator, level, maxLevel, callback){
  async.map(arr, iterator, function(err, results){

    // finish when level is over
    if(0 < maxLevel && maxLevel <= level){
      callback(null, level, results)
      return
    }

    // finish when result error
    if(err){
      callback(err, level, results)
      return
    }
    
    if(!Array.isArray(results)){
      results = []
    }
    
    // flatten result
    var nextArr = flatten(results)
    
    // finish if nextArr is empty
    if(nextArr.length == 0){
      callback(null, level, results)
      return
    }
    setImmediate(function(){
      levelWorker(nextArr, iterator, level + 1, maxLevel, callback)
    })
  })
}

var flatten = function(arr){
  var flattenArr = []
  arr.forEach(function(r){
    flattenArr = flattenArr.concat(r)
  })
  return flattenArr
}
/**
 * async_hierarchy(arr, iterator, [maxLevel], [callback])
 * @param  {Array}     arr      array
 * @param  {Function}  iterator itrerator func(item, callback)
 * @param  {Integer}   maxLevel max hierarchy level. Set inifnate if 0. Default is 0
 * @param  {Function}  callback  callback
 */
module.exports = function(arr, iterator, maxLevel, callback){
  if(typeof maxLevel == "function"){
    callback = maxLevel
    maxLevel = 0
  }
  
  if(callback === undefined){
    callback = function(){}
  }
  
  levelWorker(arr, iterator, 1, maxLevel, callback)
}