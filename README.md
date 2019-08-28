expr
=======

Tiny expression helper for creating compiled accessors; handles most stuff, including ["bracket notation"] for property access. Originally based off of Kendo UI Core expression code

    npm install property-expr

## Use

Setters and getters are compiled to functions and cached for Performance™

    var expr = require('property-expr')
      , obj = {
        foo: {
          bar: [ "hi", { buz: { baz: 'found me!' } }]
        }
      };

    var getBaz = expr.getter('foo.bar[1]["buz"].baz')
      , setBaz = expr.setter('foo.bar[1]["buz"].baz')

    console.log(getBaz(obj)) // => 'found me!'
    setBaz(obj, 'set me!')
    console.log(obj.foo.bar[1].buz.baz) // => 'set me!'

### `getter(expression, [ safeAccess ])`

Returns a function that accepts an obj and returns the value at the supplied expression. You can create a "safe" getter, which won't error out when accessing properties that don't exist, reducing existance checks befroe property access:

    expr.getter('foo.bar.baz', true)({ foo: {} }) // => undefined
    //instead of val = foo.bar && foo.bar.baz

### `setter(expression)`

Returns a function that accepts an obj and a value and sets the property pointed to by the expression to the supplied value.


### `expr(expression, [ safeAccess], [ paramName = 'data'])`

Returns a normalized expression string pointing to a property on root object
`paramName`.

    expr.expr("foo['bar'][0].baz", true, 'obj') // => "(((obj.foo || {})['bar'] || {})[0])"

### `split(path) -> Array`

Returns an array of each path segment.

```js
expr.split("foo['bar'][0].baz") // [ "foo", "'bar'", "0", "baz"]
```

### `forEach(path, iterator[, thisArg])`

Iterate through a path but segment, with some additional helpful metadata about the segment. The iterator function is called with: `pathSegment`, `isBracket`, `isArray`, `idx`, `segments`

```js
expr.forEach('foo["bar"][1]', function(pathSegment, isBracket, isArray, idx, segments) {
  // 'foo'   -> isBracket = false, isArray = false, idx = 0
  // '"bar"' -> isBracket = true,  isArray = false, idx = 1
  // '0'     -> isBracket = false, isArray = true,  idx = 2
})
```

### `normalizePath(path)`

Returns an array of path segments without quotes and spaces.
```js
expr.normalizePath('foo["bar"][ "1" ][2][ " sss " ]')
// ['foo', 'bar', '1', '2', ' sss ']
```

### `new Cache(maxSize)`

Just an utility class, returns an instance of cache. When the max size is exceeded, cache clears its storage.
```js
var cache = new Cache(2)
cache.set('a', 123) // returns 123
cache.get('a') // returns 123
cache.clear()

cache.set('a', 1)
cache.set('b', 2) // cache contains 2 values
cache.set('c', 3) // cache was cleaned automatically and contains 1 value
```


### CSP 

The default implementation of this package depends on `new Function`. If your Content Security Policy prevents the use 
`eval`, a (slower) fallback implementation will be used instead. 

This library will try to evaluate a test `new Function` 
statement in a `try`/`catch` block. If it succeeds, `eval` is allowed a the faster implementation will be used. If it 
fails the slower fallback implementation will be used.

If you have a CSP policy which blocks `eval` in place this test will send a violation event to your `report-uri` on 
every page load. You can prevent this check from being executed and force the fallback implementation by means of the 
following configuration code: 

```
setConfig({
  contentSecurityPolicy: true
})
```

Make sure you execute this configuration before any other Yup/Expr related code.  