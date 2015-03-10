var koa = require('koa');
var bodyparser = require('koa-bodyparser');
var format = require('..');
var formatSchema = require('./format');

var app = koa();

app.use(bodyparser());
app.use(format(formatSchema, {debug: true}));

if (module.parent) {
  module.exports = app;
} else {
  app.listen(3000, function () {
    console.log('Test server listening on 3000');
  });
}