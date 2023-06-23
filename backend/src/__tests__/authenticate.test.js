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

test('succesful login', async () => {
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
      // console.log(data.body);
    });
});

test('Failed login with bad password', async () => {
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'passwoajfhs'})
    .expect(401);
});

test('Failed login with bad email', async () => {
  await request.post('/authenticate')
    .send({'login': 'beepboopbademail@gmail.com', 'password': 'passwoajfhs'})
    .expect(401);
});

test('POST a new Listing with authentication', async () => {
  let testID;
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
      testID = data.body.id;
    });
  const newListing = {
    'userid': testID,
    'category': 'Marketplace/Vehicles',
    'price': 2000,
    'title': '2004 Subaru Outback',
    'text': 'Like new 2004 Subaru Outback, only 201,835 miles. ' +
      'Works great in the snow.',
    'filters': {'Price': 2000, 'Year': 2004, 'Body Style': 'Hatchback'},
    'images': ['https://smartcdn.prod.postmedia.digital/driving/wp-content/uploads/2019/12/2004-subaru-outback-wagon-ll-bean-edition.jpg'],
  };
  await request.post('/v0/listing')
    .set('Authorization', `Bearer ${token}`)
    .send(newListing)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
    });
});

test('POST a new Listing with bad authentication', async () => {
  let testID;
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'password123'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.accessToken).toBeDefined();
      token = data.body.accessToken;
      testID = data.body.id;
    });
  const newListing = {
    'userid': testID,
    'category': 'Marketplace/Vehicles',
    'price': 2000,
    'title': '2004 Subaru Outback',
    'text': 'Like new 2004 Subaru Outback, only 201,835 miles. ' +
      'Works great in the snow.',
    'filters': {'Price': 2000, 'Year': 2004, 'Body Style': 'Hatchback'},
    'images': ['https://smartcdn.prod.postmedia.digital/driving/wp-content/uploads/2019/12/2004-subaru-outback-wagon-ll-bean-edition.jpg'],
  };
  await request.post('/v0/listing')
    .set('Authorization', `Bearer `)
    .send(newListing)
    .expect(403);
});

test('POST a new Listing with no authentication', async () => {
  let testID;
  await request.post('/authenticate')
    .send({'login': 'art@gmail.com', 'password': 'password123'})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.accessToken).toBeDefined();
      token = data.body.accessToken;
      console.log(token);
      testID = data.body.id;
    });
  const newListing = {
    'userid': testID,
    'category': 'Marketplace/Vehicles',
    'price': 2000,
    'title': '2004 Subaru Outback',
    'text': 'Like new 2004 Subaru Outback, only 201,835 miles. ' +
      'Works great in the snow.',
    'filters': {'Price': 2000, 'Year': 2004, 'Body Style': 'Hatchback'},
    'images': ['https://smartcdn.prod.postmedia.digital/driving/wp-content/uploads/2019/12/2004-subaru-outback-wagon-ll-bean-edition.jpg'],
  };
  const badAuthentication = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg' +
    'xMjI5ZTQ0LTNiZGQtNGJlMC1iZDRjLWEwYTU2NWI3NTBiOCIsImVtYWlsIjoiYXJ0QGdtYWl' +
    'sLmNvbSIsImlhdCI6MTYzODEyODA3NywiZXhwIjoxNjM4MTI5ODc3fQ.lBn7QDCuj1431Xc6' +
    'FDhc3f7SbXyyaJbbciZ42zkm1oZ';
  await request.post('/v0/listing')
    .set('Authorization', `Bearer ${badAuthentication}`)
    .send(newListing)
    .expect(403);
});
