var request = require('supertest');
var app = require('./server');

describe('Test koa-format', function () {
  it('GET /abc with version 1.1.0', function (done) {
    request(app.callback())
      .get('/abc')
      .set('version', '1.1.0')
      .expect(404)
      .expect('version', 1)
      .end(done);
  });
  it('GET /abc with version 2', function (done) {
    request(app.callback())
      .get('/abc')
      .set('version', 2)
      .expect(404)
      .expect('version', 2)
      .end(done);
  });
  it('GET /abc without version', function (done) {
    request(app.callback())
      .get('/abc')
      .expect(404)
      .expect('version', 1)
      .end(done);
  });
  it('POST /signup', function (done) {
    request(app.callback())
      .post('/signup')
      .send({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .expect({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .end(done);
  });
  it('POST /signup with version 2', function (done) {
    request(app.callback())
      .post('/signup')
      .set('version', 2)
      .send({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .expect('version', 2)
      .expect({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .end(done);
  });
  it('POST /signup return 500', function (done) {
    request(app.callback())
      .post('/signup')
      .expect(500)
      .end(done);
  });
  it('PUT /signup', function (done) {
    request(app.callback())
      .put('/signup')
      .set('version', 2)
      .send({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .expect('version', 2)
      .expect({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .end(done);
  });
  it('POST /signup password !== repassword', function (done) {
    request(app.callback())
      .post('/signup')
      .send({email: 'nswbmw1992@gmail.com', password: "123", repassword: "123456"})
      .expect(400, 'password not match!')
      .end(done);
  });
  it('POST /signup password is number', function (done) {
    request(app.callback())
      .post('/signup')
      .send({email: 'nswbmw1992@gmail.com', password: 123456, repassword: "123456"})
      .expect({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .end(done);
  });
  it('POST /signup normalizeEmail', function (done) {
    request(app.callback())
      .post('/signup')
      .send({email: 'nswbmw1992+noreply@gmail.com', password: "123456", repassword: "123456"})
      .expect({email: 'nswbmw1992@gmail.com', password: "123456", repassword: "123456"})
      .end(done);
  });
});