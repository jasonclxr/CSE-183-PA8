const db = require('./db');

exports.get = async (req, res) => {
  const listings = await db.getListings(req.body);
  if (listings == 404) {
    res.status(404).send();
  } else {
    res.status(200).json(listings);
  }
};

// Request body should have: id, category, price, title, text, imageUrl
exports.post = async (req, res) => {
  const newListing = await db.postListing(req.body);
  res.status(201).send(newListing);
};

exports.getUnique = async (req, res) => {
  // console.log('so far so good');
  const listings = await db.getListings({'id': req.query.id});
  // console.log(listings);
  if (listings.length == 0) {
    res.status(404).send();
  } else {
    const userinfo = await db.getusers( 0, 0, listings[0].userid);
    // console.log(userinfo);
    listings[0].name = userinfo[0].name;
    // console.log(listings[0]);
    res.status(200).json(listings[0]);
  }
};
