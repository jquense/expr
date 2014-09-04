expr
=======

tiny expression helper for creating compiled accessors; handles most stuff, including ["bracket notation"] for property access. Originally based off of Kendo UI Core expression code

    npm install property-expr

## Use

    var expr = require('property-expr')
      , obj = {
          baz: [ "hi", { buz: { baz: 'found me!' } }]
        };

    var getBaz = expr.getter('foo.bar[1]["buz"].baz')
      , setBaz = expr.setter('foo.bar[1]["buz"].baz')

    console.log(getBaz(obj)) // => 'found me!'
    setBaz(obj, 'set me!')
    console.log(foo.bar[1].buz.baz) // => 'set me!'

### getter(expression, [ safeAccess ])

returns a function that accepts an obj and returns the value at the supplied expression. You can create a "safe" getter, which won't error out when accessing properties that don't exist, reducing existance checks befroe property access:

    expr.getter('foo.bar.baz', true)({ foo: {} }) // => undefined
    //instead of val = foo.bar && foo.bar.baz

### setter(expression)

returns a function that accepts an obj and a value and sets the property pointed to by the expression to the supplied value.


### expr(expression, [ safeAccess], [ paramName = 'data'])

returns a normalized expression string pointing to a property on root object 
`paramName`.

    expr.expr("foo['bar'][0].baz", true, 'obj') // => "(((obj.foo || {})['bar'] || {})[0])"