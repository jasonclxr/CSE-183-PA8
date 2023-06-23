const db = require('./db');

exports.getCategoryInfo = async (req, res) => {
  const info = await db.getCategoryInfo(req.query.category);
  if (info == 404) {
    return res.status(404).send();
  }
  const listingInformation = {
    filters: info.filters.filters,
    subcategories: info.subcategories.subcategories,
  };
  for (const [, data] of Object.entries(listingInformation.filters)) {
    if (data.options) {
      data.options = Object.keys(data.options);
    }
  }
  res.status(200).json(listingInformation);
};
