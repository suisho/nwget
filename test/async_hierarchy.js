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

});