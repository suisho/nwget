
var async = require('async')
var levelWorker = function(arr, iterator, level, maxLevel, callback){
  level = level ? level : 1
  async.map(arr, function(task, cb){
    iterator(task, cb)
  }, function(err, results){
    
    if(maxLevel && maxLevel > level){
      callback(null, level)
      return
    }
    
    if(err || !Array.isArray(results)){
      callback(err, level)
      return
    }
    // flatten result
    var nextArr = flatten(results)
    
    if(nextArr.length == 0){
      callback(null, level)
    }
    async.nextTick(function(){
      levelWorker(r, worker, level + 1)
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

module.exports = function(arr, iterator, maxLevel, callback){
  levelWorker(arr, iterator, 0, maxLevel, callback)
}