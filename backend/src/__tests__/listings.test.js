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

test('GET All listings', async () => {
  await request.post('/v0/listings')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET All listings that are vehicles', async () => {
  await request.post('/v0/listings')
    .send({'category': 'vehicles'})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET All listings that are vehicles (partial)', async () => {
  await request.post('/v0/listings')
    .send({'category': 'veh'})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

// TODO: Test getting a user,
let testID = '';
/*
INSERT INTO listings (userid, category, creationDate, price, title, text,
  filters, images)
SELECT id, 'Marketplace/Vehicles/Cars', current_date, 8000.00, '2013 Toyota
  Prius',
'This Prius will cut the cost of your commute in half!',
'{"Price": 8000.00, "Body Style": "Sedan"}', '{"images": ["https://www.google.com/imgres?imgurl=https%3A%2F%2Fcars.usnews.com%2Fstatic%2Fimages%2FAuto%2Fizmo%2F354418%2F2013_toyota_prius_angularfront.jpg&imgrefurl=https%3A%2F%2Fcars.usnews.com%2Fcars-trucks%2Ftoyota%2Fprius%2F2013&tbnid=C9hdYwGbWccP5M&vet=12ahUKEwiM4bym4bn0AhUrIDQIHfufAXYQMygAegUIARDIAQ..i&docid=ARGGFwXChO4HKM&w=640&h=480&q=2013%20toyota%20prius&ved=2ahUKEwiM4bym4bn0AhUrIDQIHfufAXYQMygAegUIARDIAQ", "https://www.google.com/imgres?imgurl=https%3A%2F%2Fcars.usnews.com%2Fstatic%2Fimages%2FAuto%2Fizmo%2F354418%2F2013_toyota_prius_dashboard.jpg&imgrefurl=https%3A%2F%2Fcars.usnews.com%2Fcars-trucks%2Ftoyota%2Fprius%2F2013%2Fphotos-interior&tbnid=7_xi6W-XTvmteM&vet=12ahUKEwiF_Oq24bn0AhUsHzQIHX5QCV4QMygAegUIARCxAQ..i&docid=SaZ9ngrA66bUXM&w=640&h=480&q=2013%20toyota%20prius%20interior&ved=2ahUKEwiF_Oq24bn0AhUsHzQIHX5QCV4QMygAegUIARCxAQ", "https://www.google.com/imgres?imgurl=https%3A%2F%2Fcars.usnews.com%2Fstatic%2Fimages%2FAuto%2Fizmo%2F354418%2F2013_toyota_prius_trunk.jpg&imgrefurl=https%3A%2F%2Fcars.usnews.com%2Fcars-trucks%2Ftoyota%2Fprius%2F2013%2Fphotos-exterior%2Ftrunk&tbnid=mev9giQq9aK04M&vet=12ahUKEwi9hJ_A4bn0AhXdAzQIHWFvDn0QMygAegUIARDnAQ..i&docid=-7AqQ-ozsjWI9M&w=640&h=480&q=2013%20toyota%20prius%20trunk&ved=2ahUKEwi9hJ_A4bn0AhXdAzQIHWFvDn0QMygAegUIARDnAQ"]}' FROM users WHERE phone='123-456-7891';

*/
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

test('GET a user for the id', async () => {
  await request.get('/v0/user')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      testID = res.body[0].id;
      newListing.userid = res.body[0].id;
    });
});

// then test getting listings by user
test('GET All listings from user', async () => {
  await request.post('/v0/listings')
    .send({'userid': testID})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET All vehicles from User', async () => {
  await request.post('/v0/listings')
    .send({'userid': testID, 'category': 'vehicles'})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

// Get listing with a search
test('GET All listings matching search', async () => {
  await request.post('/v0/listings')
    .send({'search': 'Toyota'})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(1);
    });
});

// TODO: Test posting a listing
// Need to be able to get a User so I can use 'id'
test('POST a new Listing without being authenticated', async () => {
  await request.post('/v0/listing')
    .send(newListing)
    .expect(401);
});

// let token = "";
let listingID;
test('POST a new Listing with authentication', async () => {
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
      // console.log(data.body);
    });
  await request.post('/v0/listing')
    .set('Authorization', `Bearer ${token}`)
    .send(newListing)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      listingID = data.body.id;
    });
});

// Use a bad id to get posts
test('GET All listings from bad user id', async () => {
  await request.post('/v0/listings')
    .send({'userid': '123e4567-e89b-12d3-a456-426614174000'})
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(0);
    });
});

// Get listing by id
test('GET a listing by its id', async () => {
  await request.get('/v0/listing?id='+listingID)
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

// Get listing with bad id
test('GET a listing by bad id', async () => {
  await request.get('/v0/listing?id=123e4567-e89b-12d3-a456-426614174000')
    .expect(404);
});

// Get listings with filters
test('GET All listings matching filters', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Trucks',
      'filters':
          {'Price': {'type': 'minMax', 'min': 1000, 'max': 3000},
            'Year': {'type': 'minMax', 'min': 2000, 'max': 2008},
            'Color': {'type': 'anyOf', 'options': ['Black', 'White']}},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

// Get listings with bad filters
test('GET All listings with bad filters', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Trucks',
      'filters':
          {'Price': {'type': 'minMax', 'max': 3000},
            'Year': {'type': 'minMax', 'min': 2000},
            'Make': {'type': 'oneOf', 'option': 'Ford'}},
    })
    .expect(404);
});

test('GET All listings matching oneOf filter', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Cars',
      'filters':
          {'Sort By': {'type': 'oneOf', 'option': 'Price: Lowest First'}},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('GET All listings empty filters', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Cars',
      'filters': {},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('GET All listings no options in filter', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Trucks',
      'filters':
          {'Color': {'type': 'anyOf'}},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('GET All listings empty options in filter', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Trucks',
      'filters': {'Color': {'type': 'anyOf', 'options': []}},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('GET All listings matching oneOf filter', async () => {
  await request.post('/v0/listings')
    .send({
      'category': 'Marketplace/Vehicles/Cars',
      'filters':
          {'Sort By': {'type': 'oneOf'}},
    })
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
});

// const newReply = {
//   "listingid": listingID,
//   "userid": testID,
//   "message": "string"
// }

// test('POST a new reply with authentication', async () => {
//   await request.post('/authenticate')
//     .send({'login':'art@gmail.com', 'password': 'password123'})
//     .expect(200)z
//     .expect('Content-Type', /json/)
//     .then((data) => {
//       expect(data).toBeDefined();
//       expect(data.body).toBeDefined();
//       expect(data.body.id).toBeDefined();
//       expect(data.body.name).toBeDefined();
//       expect(data.body.email).toBeDefined();
//       expect(data.body.phone).toBeDefined();
//       expect(data.body.accessToken).toBeDefined();
//       token = data.body.accessToken;
//     });
//   await request.post('/v0/replies')
//     .set('Authorization', `Bearer ${token}`)
//     .send(newReply)
//     .expect(201);
// });
