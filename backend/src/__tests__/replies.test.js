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

let testUserID;
// let testUserID2;
test('GET a user for the id', async () => {
  await request.get('/v0/user')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      testUserID = res.body[0].id;
      // testUserID2 = res.body[1].id;
    });
});

let testListingID;
test('GET A listing id to test with', async () => {
  await request.post('/v0/listings')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      testListingID = res.body[0].id;
    });
});

test('POST a new reply with authentication', async () => {
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'password123'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.name).toBeDefined();
      expect(data.body.email).toBeDefined();
      expect(data.body.phone).toBeDefined();
      expect(data.body.accessToken).toBeDefined();
      token = data.body.accessToken;
    });
  const newReply = {
    'listingid': testListingID,
    'userid': testUserID,
    'message': 'string',
  };
  await request.post('/v0/replies')
    .set('Authorization', `Bearer ${token}`)
    .send(newReply)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});

test('GET Replies for a listing', async () => {
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'password123'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.name).toBeDefined();
      expect(data.body.email).toBeDefined();
      expect(data.body.phone).toBeDefined();
      expect(data.body.accessToken).toBeDefined();
      token = data.body.accessToken;
    });
  await request.get('/v0/replies/'+testListingID)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});

test('GET Replies for a bad listing', async () => {
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'password123'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.name).toBeDefined();
      expect(data.body.email).toBeDefined();
      expect(data.body.phone).toBeDefined();
      expect(data.body.accessToken).toBeDefined();
      token = data.body.accessToken;
    });
  await request.get('/v0/replies/123e4567-e89b-12d3-a456-426614174000')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(0);
    });
});
