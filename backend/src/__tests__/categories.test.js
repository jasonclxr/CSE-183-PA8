const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('GET subcategories and filters of marketplace', async () => {
  await request.get('/v0/categories?category=Marketplace%2FVehicles')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.subcategories.length).toBe(2);
    });
});

test('GET bad category', async () => {
  await request.get('/v0/categories?category=beep-boop-bad-category')
    .expect(404);
});
