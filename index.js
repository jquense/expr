/**
 * @license
 * expr 1.0.0
 * Copyright 2014 Jason Quense
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 * Copyright :copyright: 2014 Telerik
 * Available under MIT license <https://github.com/theporchrat/expr/blob/master/LICENSE.txt>
 */
'use strict';
var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g

var setCache = {}
  , getCache = {};

module.exports = {
  
  expr: expr,

  setter: function(path){
    return setCache[path] || ( setCache[path] = new Function('data, value', expr(path, 'data') + ' = value'))
  },

  getter: function(path, safe) {
    var k = path + '_' + safe
    return getCache[k] || ( getCache[k] = new Function('data', "return " + expr(path, safe, 'data') ))
  },

  split: function(path){
    return path.match(SPLIT_REGEX)
  },

  forEach: function(path, cb, thisArg) {
    forEach(path.match(SPLIT_REGEX), cb, thisArg)
  }
}


function expr(expression, safe, param){
  expression = expression || ''
  
  if (typeof safe === 'string') {
    param = safe;
    safe = false;
  }

  param = param || 'data'

  if(expression && expression.charAt(0) !== '[')
    expression = '.' + expression

  return safe ? makeSafe(expression, param) : param + expression 
}

function forEach(parts, iter, thisArg){
  var len = parts.length
    , part, idx, isArray, isBracket;

  for (idx = 0; idx < len; idx++){
    part = parts[idx]

    if( part ) {
      isBracket = ["'", '"'].indexOf(part.charAt(0)) !== -1
      isArray   = /^\d+$/.test(part)

      iter.call(thisArg, part, isBracket, isArray, idx, parts)
    }
  }
}

function makeSafe(path, param) {
  var result = param
    , parts = path.match(SPLIT_REGEX)
    , isLast;

  forEach(parts, function(part, isBracket, isArray, idx, parts){
    isLast = idx === (parts.length - 1);

    part = ( isBracket || isArray) 
           ? '[' + part + ']' 
           : '.' + part

    result += part + (!isLast ? ' || {})' : ')')
  })

  return new Array(parts.length + 1).join('(') + result;
}