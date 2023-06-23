/**
 * @param {object} ctx
 * @return {Array}
 */
export function getDirectory(ctx) {
  const items = ['Marketplace'];
  if (ctx.selectedRootCat !== '') {
    items.push(ctx.selectedRootCat,
      ...ctx.selectedSubCats,
    );
  }
  return items;
}

/**
 * @param {Object} ctx
 * @param {Object} newctx
 */
export async function updateContent(ctx, newctx) {
  const items = await getItems({...ctx, ...newctx});
  if (items !== 404) {
    newctx.listings = items;
    ctx.setState(newctx);
  } else {
    return 404;
  }
}

const getFilters = (ctx) => {
  const filters = {};
  Object.keys(ctx.selectedFilters).forEach((key) => {
    if (ctx.filters[key]) {
      const type = ctx.filters[key].type;
      filters[key] = {type: type};
      const options = ctx.selectedFilters[key];
      if (filters[key].type === 'anyOf') {
        filters[key].options = Object.keys(options).filter((elem) => {
          return options[elem] === true;
        });
      } else if (filters[key].type === 'oneOf') {
        for (const k of Object.keys(options)) {
          if (options[k] === true) {
            filters[key].option = k;
            break;
          }
        }
      } else if (filters[key].type === 'minMax') {
        if (options.min) {
          filters[key].min = parseInt(options.min);
        }
        if (options.max) {
          filters[key].max = parseInt(options.max);
        }
      }
    }
  });
  return filters;
};

const getItems = async (ctx) => {
  const filters = getFilters(ctx);
  const route = getDirectory(ctx);
  return await getItemsCustom(route, filters, ctx.searchInput);
};

const getItemsCustom = async (categories, filters, search) => {
  const sender = {
    category: categories.join('/'),
    filters: filters,
  };
  if (search !== '') {
    sender.search = search;
  }
  return await fetch('/v0/listings', {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(sender),
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).catch(() => {
    return 404;
  });
};

const getCategories = async (items) => {
  const route = items.join('%2F');
  const info = await fetch('/v0/categories?category=' + route, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .catch(() => {
      return 404;
    });
  return info;
};

const getRootInfo = async () => {
  const info = await getCategories(['Marketplace']);
  return info;
};

const setRootCategory = async (newRoot) => {
  const data = await getCategories(['Marketplace', newRoot]);
  if (data !== 404) { // root category exists
    return {
      selectedRootCat: newRoot,
      selectedSubCats: [],
      subCategories: data.subcategories,
      filters: data.filters,
      selectedFilters: {},
      itemBeingViewed: null,
      openFilters: {},
    };
  }
  return 404;
};

const setSubCategory = async (ctx, newSub) => {
  const items = getDirectory(ctx);
  items.push(newSub);
  const data = await getCategories(items);
  if (data !== 404) { // sub category exists
    const subs = ctx.selectedSubCats;
    subs.push(newSub);
    return {
      selectedSubCats: subs,
      subCategories: data.subcategories,
      filters: data.filters,
      selectedFilters: {},
      itemBeingViewed: null,
      openFilters: {},
    };
  }
  return 404;
};

const popToCategory = async (ctx, sub) => {
  const items = getDirectory(ctx);
  const index = items.indexOf(sub);
  if (index === -1) {
    return 404;
  }
  items.length = index + 1;
  const data = await getCategories(items);
  if (data !== 404) {
    if (items.length === 1) {
      // reset the root category
      return {
        selectedRootCat: '',
        selectedSubCats: [],
        subCategories: data.subcategories,
        filters: data.filters,
        selectedFilters: {},
        itemBeingViewed: null,
        openFilters: {},
      };
    } else {
      // reset the sub categories
      const subs = ctx.selectedSubCats;
      const subIndex = subs.indexOf(sub);
      subs.length = subIndex + 1;
      return {
        selectedSubCats: subs,
        subCategories: data.subcategories,
        filters: data.filters,
        selectedFilters: {},
        itemBeingViewed: null,
        openFilters: {},
      };
    }
  }
  return 404;
};

const getItem = async (id) => {
  return await fetch(`/v0/listing?id=${id}`, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }).catch(() => {
    return 404;
  });
};

/*
fetch('/v0/listing', {
        method: 'post',
        headers: new Headers({
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(listing),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          console.log(JSON.stringify(json));
          ctx.closenewlisting();
        })
        .catch((error) => {
          console.log(error);
        });
 */

const getReplies = async (listingid) => {
  const item = localStorage.getItem('user');
  const user = JSON.parse(item);
  const bearerToken = user.accessToken;
  return await fetch(`/v0/replies/${listingid}`, {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
    }),
  }).then((response) => {
    return response.json();
  }).catch(() => {
    return 404;
  });
};

const postReply = async (listingid, message) => {
  const item = localStorage.getItem('user');
  const user = JSON.parse(item);
  const bearerToken = user.accessToken;
  const userid = user.id;
  return await fetch('/v0/replies', {
    method: 'post',
    headers: new Headers({
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(
      {listingid: listingid, userid: userid, message: message}),
  }).then((response) => {
    return response.json();
  });
};

export {postReply, getReplies, getCategories, setRootCategory, getRootInfo,
  setSubCategory, popToCategory, getItems, getItemsCustom, getItem, getFilters};
