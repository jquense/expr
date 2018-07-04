/**
 * Based on Kendo UI Core expression code <https://github.com/telerik/kendo-ui-core#license-information>
 */
'use strict'
var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g,
  DIGIT_REGEX = /^\d+$/,
  LEAD_DIGIT_REGEX = /^\d/,
  SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,
  CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/,
  MAX_CACHE_SIZE = 512

var contentSecurityPolicy = false,
  pathCacheSize = 0,
  pathCache = {},
  setCache = {},
  getCache = {}

try {
  new Function('')
} catch (error) {
  contentSecurityPolicy = true
}

module.exports = {
  expr: expr,

  setter: contentSecurityPolicy ? setterFallbackMemoized : setterEval,

  getter: contentSecurityPolicy ? getterFallbackMemoized : getterEval,

  split: split,

  join: function(segments) {
    return segments.reduce(function(path, part) {
      return (
        path +
        (isQuoted(part) || DIGIT_REGEX.test(part)
          ? '[' + part + ']'
          : (path ? '.' : '') + part)
      )
    }, '')
  },

  forEach: function(path, cb, thisArg) {
    forEach(split(path), cb, thisArg)
  }
}

function setterEval(path) {
  return (
    setCache[path] ||
    (setCache[path] = new Function(
      'data, value',
      expr(path, 'data') + ' = value'
    ))
  )
}

function setterFallbackMemoized(path) {
  var parts = normalizePath(path)
  return function(data, value) {
    return setterFallback(parts, data, value)
  }
}

function setterFallback(parts, data, value) {
  var index = 0,
    len = parts.length
  while (index < len - 1) {
    data = data[parts[index++]]
  }
  data[parts[index]] = value
}

function getterEval(path, safe) {
  var k = path + '_' + safe
  return (
    getCache[k] ||
    (getCache[k] = new Function('data', 'return ' + expr(path, safe, 'data')))
  )
}

function getterFallbackMemoized(path, safe) {
  var parts = normalizePath(path)
  return function(data) {
    return getterFallback(parts, safe, data)
  }
}

function getterFallback(parts, safe, data) {
  var index = 0,
    len = parts.length
  while (index < len) {
    if (data || !safe) {
      data = data[parts[index++]]
    } else {
      return
    }
  }
  return data
}

function normalizePath(path) {
  var parts = pathCache[path]
  if (parts) {
    return parts
  }
  if (pathCacheSize >= MAX_CACHE_SIZE) {
    pathCache = {}
    pathCacheSize = 1
  } else {
    pathCacheSize++
  }
  parts = pathCache[path] = split(path).map(function(part) {
    return part.replace(CLEAN_QUOTES_REGEX, '$2')
  })
  return parts
}

function split(path) {
  return path.match(SPLIT_REGEX)
}

function expr(expression, safe, param) {
  expression = expression || ''

  if (typeof safe === 'string') {
    param = safe
    safe = false
  }

  param = param || 'data'

  if (expression && expression.charAt(0) !== '[') expression = '.' + expression

  return safe ? makeSafe(expression, param) : param + expression
}

function forEach(parts, iter, thisArg) {
  var len = parts.length,
    part,
    idx,
    isArray,
    isBracket

  for (idx = 0; idx < len; idx++) {
    part = parts[idx]

    if (part) {
      if (shouldBeQuoted(part)) {
        part = '"' + part + '"'
      }

      isBracket = isQuoted(part)
      isArray = !isBracket && /^\d+$/.test(part)

      iter.call(thisArg, part, isBracket, isArray, idx, parts)
    }
  }
}

function isQuoted(str) {
  return (
    typeof str === 'string' && str && ["'", '"'].indexOf(str.charAt(0)) !== -1
  )
}

function makeSafe(path, param) {
  var result = param,
    parts = split(path),
    isLast

  forEach(parts, function(part, isBracket, isArray, idx, parts) {
    isLast = idx === parts.length - 1

    part = isBracket || isArray ? '[' + part + ']' : '.' + part

    result += part + (!isLast ? ' || {})' : ')')
  })

  return new Array(parts.length + 1).join('(') + result
}

function hasLeadingNumber(part) {
  return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX)
}

function hasSpecialChars(part) {
  return SPEC_CHAR_REGEX.test(part)
}

function shouldBeQuoted(part) {
  return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part))
}
