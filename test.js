var a = require('assert')
  , expression = require('./index.js')
  , getter = expression.getter
  , setter = expression.setter
  , expr   = expression.expr 
  , obj = {}

obj = { foo: { bar: ['baz', 'bux'], fux: 5 }}

//--- Getters -----------------------------------------------
a.strictEqual(getter('foo.fux')(obj), 5) 
a.deepEqual(getter('foo.bar')(obj), ['baz', 'bux']) 

a.strictEqual(getter('foo.bar[1]')(obj), 'bux')
a.strictEqual(getter('["foo"]["bar"][1]')(obj), 'bux')
a.strictEqual(getter('[1]')([1, 'bux']), 'bux')


//safe access
a.strictEqual(getter('foo.fux', true)(obj), 5) 
a.deepEqual(getter('foo.bar', true)(obj), ['baz', 'bux']) 

a.strictEqual(getter('foo.bar[1]', true)(obj), 'bux')
a.strictEqual(getter('["foo"]["bar"][1]', true)(obj), 'bux')
a.strictEqual(getter('[1]', true)([1, 'bux']), 'bux')

a.strictEqual(getter('foo.gih.df[0]', true)(obj), undefined)
a.strictEqual(getter('["fr"]["bzr"][1]', true)(obj), undefined)

//--- Setters -----------------------------------------------
setter('foo.fux')(obj, 10)
a.strictEqual(obj.foo.fux, 10)

setter('foo.bar[1]')(obj, 'bot')
a.strictEqual(obj.foo.bar[1], 'bot')

setter('["foo"]["bar"][1]')(obj, 'baz')
a.strictEqual(obj.foo.bar[1], 'baz')

console.log('--- Tests Passed ---')