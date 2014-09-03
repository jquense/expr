var a = require('assert')
  , expression = require('./index.js')
  , getter = expression.getter
  , setter = expression.setter
  , expr   = expression.expr 
  , obj = {}

obj = { foo: { bar: ['baz', 'bux'], fux: 5 }}

//--- Getters -----------------------------------------------
a.equal(getter('foo.fux')(obj), 5) 
a.deepEqual(getter('foo.bar')(obj), ['baz', 'bux']) 

a.equal(getter('foo.bar[1]')(obj), 'bux')
a.equal(getter('["foo"]["bar"][1]')(obj), 'bux')
a.equal(getter('[1]')([1, 'bux']), 'bux')


//safe access
a.equal(getter('foo.fux', true)(obj), 5) 
a.deepEqual(getter('foo.bar', true)(obj), ['baz', 'bux']) 

a.equal(getter('foo.bar[1]', true)(obj), 'bux')
a.equal(getter('["foo"]["bar"][1]', true)(obj), 'bux')
a.equal(getter('[1]', true)([1, 'bux']), 'bux')

a.equal(getter('foo.gih.df[0]', true)(obj), undefined)
a.equal(getter('["fr"]["bzr"][1]', true)(obj), undefined)

console.log(expr("['f oo'][2]", true))
console.log(expr('["foo"]["bar"][1]', true))
console.log(expr('["foo"].hi["bar"].prop.a[1]', true))