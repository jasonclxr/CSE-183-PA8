const {Pool} = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.getListings = async (body) => {
  const values = [];
  let select = 'SELECT * FROM Listings WHERE 1=1';
  // console.log(body);
  if (Boolean(Object.keys(body).length)) {
    let valuelength = 1;
    if (body.id) {
      select += ` AND id = $${valuelength}`;
      valuelength = valuelength + 1;
      values.push(body.id);
    }
    if (body.userid) {
      select += ` AND userid = $${valuelength}`;
      valuelength = valuelength + 1;
      values.push(body.userid);
    }
    if (body.search) {
      select += ` AND title ilike $${valuelength}`;
      valuelength = valuelength + 1;
      values.push('%' + body.search + '%');
    }
    if (body.category) {
      select += ` AND category ilike $${valuelength} `;
      valuelength = valuelength + 1;
      values.push('%' + body.category + '%');
    }

    // Used for getting the category from the database for filtering(if exists)
    const cat = body.category ? body.category : 'Marketplace';
    // console.log('cat: ' + cat);
    let filters = '';
    const getCategoryInfo = `SELECT * FROM categories WHERE 1=1 ` +
    ` AND category = $1`;
    const catquery = {
      text: getCategoryInfo,
      values: [cat],
    };
    const {rows} = await pool.query(catquery);
    // console.log(rows);
    if (rows.length != 0) {
      filters = rows[0].filters.filters;
      // console.log(filters)
      // console.log(rows[0]);
    }
    if (body.filters) {
      if (Boolean(Object.keys(body.filters).length)) {
        // console.log('why must you hurt me Jason');
        // console.log(body.filters);
        const keys = Object.keys(body.filters);
        // console.log(keys);

        for (let i = 0; i < keys.length; i++) { // where price is one of keys,
          // IF FILTER DOES NOT EXIST RETURN 404
          if (!filters.hasOwnProperty(keys[i])) {
            return 404;
          }
          switch (body.filters[keys[i]]['type']) {
          case 'minMax':
            // console.log(keys[i]);
            // console.log(body.filters[keys[i]]);
            // console.log(filters[keys[i]]);
            const max = body.filters[keys[i]].max;
            const min = body.filters[keys[i]].min;
            if (min) {
              select += (filters[keys[i]].min + `$${valuelength}`);
              valuelength = valuelength + 1;
              values.push(min);
            }
            if (max) {
              select += (filters[keys[i]].max + `$${valuelength}`);
              valuelength = valuelength + 1;
              values.push(max);
            }
            break;
          }
        }
        for (let i = 0; i < keys.length; i++) { // where price is one of keys,
          // IF FILTER DOES NOT EXIST RETURN 404
          switch (body.filters[keys[i]]['type']) {
          case 'anyOf':
            if (body.filters[keys[i]].options) {
              for (let j = 0; j < body.filters[keys[i]].options.length; j++) {
                if (j == 0) {
                  select += (' AND ( ' +
                    filters[keys[i]].options[body.filters[keys[i]].options[j]]);
                } else {
                  select += (' OR ' +
                    filters[keys[i]].options[body.filters[keys[i]].options[j]]);
                }
              }
              if (body.filters[keys[i]].options.length != 0) {
                select += ' )';
              }
            }
            break;
          }
        }
        for (let i = 0; i < keys.length; i++) { // where price is one of keys,
          // IF FILTER DOES NOT EXIST RETURN 404
          switch (body.filters[keys[i]]['type']) {
          case 'oneOf':
            // console.log(keys[i]);
            if (body.filters[keys[i]].option) {
              select += (' ' +
                filters[keys[i]].options[body.filters[keys[i]].option]);
            }
            break;
          }
        }
      }
    }
  }
  // console.log(select);
  // console.log(values);
  const query = {
    text: select,
    values: values,
  };
  const {rows} = await pool.query(query);
  // if (rows.length == 0) {
  //   return 404;
  // }
  const listings = [];
  if (body.id) {
    for (const row of rows) {
      listings.push({
        'id': row['id'],
        'userid': row['userid'],
        'category': row['category'],
        'creationDate': row['creationdate'],
        'price': Number(row['price']),
        'title': row['title'],
        'text': row['text'],
        'filters': row['filters'],
        'images': row['images'].images,
      });
    }
  } else {
    for (const row of rows) {
      listings.push({
        'id': row['id'],
        'userid': row['userid'],
        'category': row['category'],
        'creationDate': row['creationdate'],
        'price': Number(row['price']),
        'title': row['title'],
        'text': row['text'],
        'filters': row['filters'],
        'imageURL': row['images'].images[0],
      });
    }
  }
  return listings;
};

exports.postNewUser = async (user) => {
  // const hashedpassword = bcrypt.hashSync(user['password'], 12);
  // can change 12 to anything
  const insert =
  'insert into users ( name, email, phone, password )' +
  ' values ( $1, $2, $3, $4 ) returning id';
  const query = {
    text: insert,
    // values: [user['name'], user['email'], user['phone'], hashedpassword],
    values: [user['name'], user['email'], user['phone'], user['password']],
  };
  const {rows} = await pool.query(query);
  // return rows.length == 1 ? rows[0] : undefined;
  return rows[0];
};

exports.getusers = async (email, phone, id) => {
  // const hashedpassword = bcrypt.hashSync(user['password'], 12);
  // can change 12 to anything

  let select = 'SELECT * FROM users WHERE 1=1 ';
  // 'select * from users ';
  const values = [];
  let reference = 1;
  if (email || phone || id) {
    select += 'and (';
  }
  if (email) {
    select += `email ~* $${reference} `;
    reference = reference + 1;
    values.push(email);
  }
  if (phone) {
    if (reference == 1) {
      select += `phone = $${reference} `;
    } else {
      select += `or phone = $${reference} `;
    }
    reference = reference + 1;
    values.push(phone);
  }
  if (id) {
    if (reference == 1) {
      select += `id = $${reference} `;
    } else {
      select += `or id = $${reference} `;
    }
    reference = reference + 1;
    values.push(id);
  }
  if (email || phone || id) {
    select += ')';
  }
  // console.log(select);
  const query = {
    text: select,
    values: values,
  };
  // console.log(select);
  const {rows} = await pool.query(query);
  return rows.length != 0 ? rows : undefined;
};

// Request body should have: id, category, price, title, text, imageUrl
exports.postListing = async (body) => {
  const postDate = new Date();
  // body.filters.creationdate = postDate ASK about this
  const insert = 'INSERT INTO Listings(userid, category, creationdate, price,' +
  ' title, text, filters, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ' +
  'returning id';
  const query = {
    text: insert,
    values: [
      body.userid,
      body.category,
      postDate,
      body.price,
      body.title,
      body.text,
      body.filters,
      {'images': body.images},
    ],
  };
  const {rows} = await pool.query(query);
  return ({
    'id': rows[0].id,
    'userid': body.userid,
    'category': body.category,
    'creationDate': postDate,
    'price': body.price,
    'title': body.title,
    'text': body.text,
    'filters': body.filters,
    'images': body.images,
  });
};

exports.getValidUser = async (login, password) => {
  // const hashedpassword = bcrypt.hashSync(user['password'], 12);
  // can change 12 to anything
  const select = 'select * from users ' +
  'WHERE (email ~* $1 or phone = $1)';
  const query = {
    text: select,
    values: [login],
  };
  // console.log(query);
  const {rows} = await pool.query(query);
  if (rows.length !=0) {
    // console.log(rows[0]);
    if (bcrypt.compareSync(password, rows[0].password)) {
      return rows[0];
    }
  }
  return undefined;
};


exports.getCategoryInfo = async (category) => {
  const select = 'select filters, subcategories' +
   ' from Categories where LOWER(category) = LOWER($1)';
  const query = {
    text: select,
    values: [category],
  };
  const {rows} = await pool.query(query);
  if (rows.length <= 0) {
    return 404;
  } else {
    return rows[0];
  }
};

exports.getReplies = async (listingid) => {
  const select = 'select u.name, r.message, r.messageDate from Listings l, ' +
    'Replies r, Users u where r.listingid = $1 and r.listingid = l.id and ' +
    'r.userid = u.id ORDER BY r.messageDate DESC';
  const query = {
    text: select,
    values: [listingid],
  };
  const {rows} = await pool.query(query);
  const arr = [];
  for (let i = 0; i < rows.length; ++i) {
    arr.push(rows[i]);
  }
  return rows;
};

exports.postReply = async (body) => {
  const insert = `INSERT INTO Replies(listingid, userid, message, messageDate` +
    `) VALUES ($1, $2, $3, current_date) returning *`;
  const query = {
    text: insert,
    values: [body.listingid, body.userid, body.message],
  };
  const {rows} = await pool.query(query);
  return rows[0];
};
