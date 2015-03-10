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