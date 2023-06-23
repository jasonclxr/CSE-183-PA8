const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const listings = require('./listings');
const users = require('./users');
const categories = require('./categories');
const replies = require('./replies');
// const db = require('./db');
const app = express();
const auth = require('./auth');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.post('/authenticate', auth.authenticate);

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

// Your routes go here
// What will we want to get:
// Get listings with category and user query
app.post('/v0/listings', listings.get);
app.post('/v0/listing', auth.check, listings.post);
app.get('/v0/listing', listings.getUnique);
// app.get('/v0/categories', categories.get);
app.post('/v0/user', users.post);
app.get('/v0/user', users.get);
app.get('/v0/categories', categories.getCategoryInfo);

app.post('/v0/replies', auth.check, replies.post);
app.get('/v0/replies/:listingid', auth.check, replies.get);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
