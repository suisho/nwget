var rewire = require('rewire')

var assert = require('assert')
describe('flatten', function () {
  var flatten = rewire('../lib/async_hierarchy.js').__get__('flatten')

  it('should get flatten array', function(){
    var foo = [
      [1,2,3],
      4,
      [5, 6]
    ]
    var actual = flatten(foo)
    assert.deepEqual(actual, [1,2,3,4,5,6])
  })

  it('should get flatten array (by object)', function () {
    var foo = [
      [ {a : "b"}, {a : "c"} ],
      {a : "d"}
    ]
    var actual = flatten(foo)
    assert.deepEqual(actual, [
      {a : "b"},
      {a : "c"},
      {a : "d"},
    ])
  });
  
  it('should get emplty array', function () {
    var foo = [
      [],
      [],
    ]
    var actual = flatten(foo)
    assert.deepEqual(actual, [])
  });

});

describe('async hierarchy', function () {
  var hierarchy = require('../lib/async_hierarchy.js')

  it('prime number', function(done){
    var actual = []
    hierarchy([100], function(item, callback){
      var next = []
      for(var i = item - 1 ; i > 1; i--){
        if(item % i == 0){
          next.push(item / i)
          next.push(i)
          break
        }
      }
      if(next.length == 0){
        actual.push(item)
      }
      callback(null, next)
    }, function(err, level, result){
      assert.deepEqual(actual, [2, 2, 5, 5])
      done()
    })
  })
  
  it('set max level', function(done){
    var result =[]
    hierarchy([10], function(item, callback){
      result.push(item)
      callback(null, [item + 1])
    },
    5, // level
    function(err, level, _result){
     // console.log(result, level);
      assert.deepEqual(result, [10,11,12,13,14])
      done()
    })
  })
})

