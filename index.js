/**
 * @license
 * expr 1.0.0
 * Copyright 2014 Jason Quense
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 * Copyright :copyright: 2014 Telerik
 * Available under MIT license <https://github.com/theporchrat/expr/blob/master/LICENSE.txt>
 */
"use strict";

var regexCache = {}
  , setCache = {}
  , getCache = {};

module.exports = {
  
  expr: expr,

  setter: function(path){
    return setCache[path] || ( setCache[path] = new Function('data, value', expr(path, 'data') + ' = value'))
  },

  getter: function(path, safe) {
    var k = path + "_" + safe
    return getCache[k] || ( getCache[k] = new Function('data', "return " + expr(path, safe, 'data') ))
  }
}

function expr(expression, safe, param){
  var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g

  expression = expression || ""
  
  if (typeof safe === 'string') {
    param = safe;
    safe = false;
  }

  param = param || 'data'

  if(expression && expression.charAt(0) !== '[')
    expression = '.' + expression

  return safe ? makeSafe(expression.match(SPLIT_REGEX), param) : param + expression 
}

function makeSafe(parts, param) {
  var result = param
    , part, idx, isLast, isArray, isBracket;

  for (idx = 0; idx < parts.length; idx++){
    part   = parts[idx]
    isLast = idx === (parts.length - 1);
    
    if( part ) {
      isBracket = ["'", '"'].indexOf(part.charAt(0)) !== -1
      isArray   = /^\d+$/.test(part)

      part = ( isBracket || isArray) 
           ? '[' + part + ']' 
           : '.' + part

      result += part  + (!isLast ? " || {})" : ")")
    }
  }

  return new Array(parts.length + 1).join("(") + result;
}