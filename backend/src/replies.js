const db = require('./db');

exports.get = async (req, res) => {
  const replies = await db.getReplies(req.params.listingid);
  res.status(200).json(replies);
};

exports.post = async (req, res) => {
  const newReply = await db.postReply(req.body);
  res.status(201).send(newReply);
};
