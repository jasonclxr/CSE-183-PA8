const jwt = require('jsonwebtoken');
const db = require('./db');

const secrets = require('./secrets');

exports.authenticate = async (req, res) => {
  const {login, password} = req.body;
  // console.log(login);
  // console.log(password);
  // const hashpassword = bcrypt.hashSync(password, 12);
  const user = await db.getValidUser(login, password);
  //    const user = users.find((user) => {
  //      return user.email === email &&
  //      bcrypt.compareSync(password, user.password);
  //    });
  // console.log(user);
  if (user) {
    const accessToken = jwt.sign(
      {id: user.id,
        email: user.email,
      },
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
      // might add things below:
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      accessToken: accessToken});
  } else {
    res.status(401).send('Username or password incorrect');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
