var flatten = require('flat').flatten;
var pathToRegexp = require('path-to-regexp');
var methods = require('methods');
var objectPath = require("object-path");

module.exports = function format(conf, options) {
  if (!conf || 'object' !== typeof conf) {
    throw new Error('No format schema.');
  }
  options = options || {};

  var _conf = {};

  var pathReg = new RegExp('(' + methods.join('|') + ')\\S*\\s+\/', 'i');
  Object.keys(conf).forEach(function (path) {
    // eg: 'GET /user/:userId'
    if (pathReg.test(path)) {
      _conf[path] = conf[path];
    } else {
      // eg: '/user/:userId', request.method: 'GET'
      _conf[((conf[path].request || {}).method || '(.+)') + ' ' + path] = conf[path];
    }
  });

  // flat object, but preserve array, see: https://www.npmjs.com/package/flat#safe
  Object.keys(_conf).forEach(function (path) {
    if (_conf[path].request) _conf[path].request = flatten(_conf[path].request, {safe: true});
    if (_conf[path].response) _conf[path].response = flatten(_conf[path].response, {safe: true});
  });

  if (options.debug) console.log(_conf);

  return function* (next) {
    var ctx = this;
    var matchArr = [];

    var ctx_path = ctx.method + ' ' + ctx.path;
    Object.keys(_conf).forEach(function (path) {
      if (pathToRegexp(path).test(ctx_path)) {
        matchArr.push(_conf[path]);
      }
    });

    // request
    matchArr.forEach(function (path) {
      for (var key in path.request) {
        var value = path.request[key];
        if ('function' == typeof value) {
          value = value.call(ctx, objectPath.get(ctx.request, key));
        }
        try {
          objectPath.set(ctx.request, key, value);
        } catch (e) {}
      }
    });

    yield* next;

    // response
    matchArr.forEach(function (path) {
      for (var key in path.response) {
        var value = path.response[key];
        var parentKey = key.split('.').slice(0, -1).join('.');
        if (~['header', 'headers'].indexOf(parentKey)) {
          var currentKey = key.split('.').slice(1).join('.');
          if ('function' == typeof value) {
            value = value.call(ctx, objectPath.get(ctx.response, key));
          }
          ctx.set(currentKey, value);
        } else {
          if ('function' == typeof value) {
            value = value.call(ctx, objectPath.get(ctx.response, key));
          }
          try {
            objectPath.set(ctx.response, key, value);
          } catch (e) {}
        }
      }
    });
  }
};