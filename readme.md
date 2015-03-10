## koa-format

A koa middleware format `this.request` and `this.response`.

### Install

    npm i koa-format --save
    
### Usage

    format(formatSchema, options)

- formatSchema: {Object} schema object.
- options: {Object}
  - debug: {Boolean} whether to print compiled `formatSchema`.

### Example

**app.js**

```
var koa = require('koa');
var bodyparser = require('koa-bodyparser');
var format = require('..');
var formatSchema = require('./format');

var app = koa();

app.use(bodyparser());
app.use(format(formatSchema, {debug: true}));

app.listen(3000, function () {
  console.log('listening on 3000');
});
```

**format.js**

```
var validator = require('validator');

module.exports = {
  "/(.*)": {
    "request": {
      "header.version": function setRequestVersion(version) {
        return parseInt(version) || 1;
      }
    },
    "response": {
      "header.version": function setResponseVersion() {
        return this.request.header.version;
      }
    }
  },
  "(POST|put) /signup": {
    "request": {
      "body": {
        "email": validator.normalizeEmail,
        "password": validator.toString,
        "repassword": function throwError(repassword) {
          if (repassword !== this.request.body.password) {
            this.throw(400, 'password not match!');
          } else {
            return repassword;
          }
        }
      }
    },
    "response": {
      "body": function setResponseBody() {
        return this.request.body;
      }
    }
  }
}
```
**NB**: when use body-parser middleware (like: koa-bodyparser) before `koa-format`, you could configure 'body' field in 'request'.

see [test](https://github.com/nswbmw/koa-format/test/test.js) for more details.

Maybe you are interested in [koa-scheme](https://www.npmjs.com/package/koa-scheme).

### Test

   npm test

### License

MIT