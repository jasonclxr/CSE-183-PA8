const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

/*
* The following implementations are built off of Professor Harrison's Books
* implementation as well as my assigment 6 implementation
*/
// Build off books example and assignment 6
exports.post = async (req, res) => {
  const alreadydefined =
        await db.getusers(req.body['email'], req.body['phone'] );
  if (alreadydefined) {
    res.status(409).send();
  } else {
    req.body['password'] = bcrypt.hashSync(req.body['password'], 12);
    const id = await db.postNewUser(req.body);
    req.body['id'] = id.id;
    const accessToken = jwt.sign(
      {id: req.body.id,
        email: req.body.email,
      },
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    // might add things below:
    res.status(201).json({
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      accessToken: accessToken});
    // res.status(201).send(req.body);
  }
};

exports.get = async (req, res) => {
  const userpool = await db.getusers(req.query.email, req.query.phone,
    req.query.id);
  if (userpool) {
    res.status(200).json(userpool);
  } else {
    res.status(404).send();
  }
};

