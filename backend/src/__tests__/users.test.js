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

// Get all users
test('GET All users', async () => {
  await request.get('/v0/user')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

// Get user by email
test('GET user by email', async () => {
  await request.get('/v0/user?email=art%40gmail.com')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name.first).toBe('Artyom');
    });
});

// Get user by phone
let artID;
test('GET user by phone', async () => {
  await request.get('/v0/user?phone=123-456-7890')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name.first).toBe('Artyom');
      artID = res.body[0].id;
    });
});

// Get user by id
test('GET user by id', async () => {
  await request.get('/v0/user?id='+artID)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name.first).toBe('Artyom');
    });
});

// Get user by phone and id
test('GET user by phone id', async () => {
  await request.get('/v0/user?phone=123-456-7890&id='+artID)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name.first).toBe('Artyom');
    });
});

// Get user by bad id
test('GET user by bad id', async () => {
  await request.get('/v0/user?id=123e4567-e89b-12d3-a456-426614174000')
    .expect(404);
});

// Post a new user
const newUser = {
  'name': {'First': 'Jason', 'Last': 'Blecman'},
  'phone': '123-456-7892',
  'email': 'jsonb@gmail.com',
  'password': 'SuperSecurePassword123',
};
test('Post new user', async () => {
  await request.post('/v0/user')
    .send(newUser)
    .expect(201)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.name.First).toBe('Jason');
    });
});

// Try posting a user that already exists
test('Post user that already exists', async () => {
  await request.post('/v0/user')
    .send(newUser)
    .expect(409);
});
