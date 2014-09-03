var regexCache = {}
  , setCache = {}
  , getCache = {};

module.exports = {
  
  expr: expr,

  setter: function(path, safe, param){
    return setCache[path + "_" + safe + "_" + param] || ( setCache[path] = new Function('data, value', expr(path, safe) + ' = value'))
  },

  getter: function(path, safe, param) {
    return getCache[path + "_" + safe + "_" + param] || ( getCache[path] = new Function('data', "return " + expr(path, safe) ))
  }
}

function expr(expression, safe, param){
  var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g

  expression = expression || ""
  
  if (typeof safe === 'string') {
    paramName = safe;
    safe = false;
  }

  param = param || 'data'

  if(expression && expression.charAt(0) !== '[')
    expression = '.' + expression

  return safe ? makeSafe(expression.match(SPLIT_REGEX), param) : param + expression 
}

function makeSafe(parts, param) {
  var result = param, part, idx, isLast;

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