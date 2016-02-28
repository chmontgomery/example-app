var should = require('should'),
  request = require('supertest');

describe('index', () => {

  it('should show index page', (done) => {
    request(require('../src/app')())
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

  it('should return 200 from _health', (done) => {
    request(require('../src/app')())
      .get('/_health')
      .expect(200, done);
  });

  it('should show error page', (done) => {
    request(require('../src/app')())
      .get('/this-path-does-not-exist')
      .expect('Content-Type', /text\/html/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        res.error.should.be.ok;
        done()
      });
  });

  it('should show error page in prod', (done) => {
    process.env.NODE_ENV = 'production';
    request(require('../src/app')())
      .get('/this-path-does-not-exist')
      .expect('Content-Type', /text\/html/)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        res.error.should.be.ok;
        done()
      });
  });

  afterEach(() => {
    process.env.NODE_ENV = '';
  });

});
