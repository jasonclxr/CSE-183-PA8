import {render, fireEvent, screen,
  waitForElementToBeRemoved, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App from '../App';
import * as Fetch from '../Fetch';
import {setNarrow, setWide} from './common';
const data = require('./data.json');

const server = setupServer(
  rest.post('/v0/listings', (req, res, ctx) => {
    return res(ctx.json(data.Listings['Marketplace/Vehicles']));
  }),
  rest.get('/v0/categories', (req, res, ctx) => {
    const categoryQuery = req.url.searchParams.get('category');
    return res(ctx.json(data.Categories[categoryQuery]));
  }),
  rest.get('/v0/listing', (req, res, ctx) => {
    const idQuery = req.url.searchParams.get('id');
    return res(ctx.json(data.ListingData[idQuery]));
  }),
  rest.post('/authenticate', (req, res, ctx) => {
    return res(ctx.json({
      id: '0e2ea340-6591-4877-84cf-550856f9a59c',
      name: {'last': 'Martirosyan', 'first': 'Artyom'},
      email: 'art@gmail.com',
      phone: '123-456-7890',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC' +
      'I6ImQ0MmQyZTIyLWVmZTctNDJkZC04YjZiLTA5MTdhMzQ1ODg2OCIsImVtYWlsIjo' +
      'iYXJ0QGdtYWlsLmNvbSIsImlhdCI6MTYzODA3MzE3MiwiZXhwIjoxNjM4MDc0OTcyfQ.' +
      '-2sbJrCDXBncgJDtc-uc-DOmtL82CwbF31xJesguM1A'}));
  }),
  rest.post('/v0/user', (req, res, ctx) => {
    return res(ctx.json({
      id: '0e2ea340-6591-4877-84cf-550856f9a59c',
      name: {'last': 'Martirosyan', 'first': 'Artyom'},
      email: 'art@gmail.com',
      phone: '123-456-7890',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC' +
      'I6ImQ0MmQyZTIyLWVmZTctNDJkZC04YjZiLTA5MTdhMzQ1ODg2OCIsImVtYWlsIjo' +
      'iYXJ0QGdtYWlsLmNvbSIsImlhdCI6MTYzODA3MzE3MiwiZXhwIjoxNjM4MDc0OTcyfQ.' +
      '-2sbJrCDXBncgJDtc-uc-DOmtL82CwbF31xJesguM1A'}));
  }),
);

const missingElement = async (labelText) => {
  return await waitForElementToBeRemoved(() => {
    return screen.queryByLabelText(labelText);
  });
};

const getElement = async (labelText) => {
  return await waitFor(() => {
    return screen.getByLabelText(labelText);
  });
};

beforeAll(() => server.listen());
beforeEach(() => localStorage.clear());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());

// HOMEPAGE
test('Confirm desktop view', async () => {
  render(<App />);
  screen.getByLabelText('desktop view');
});

// Content.js
test('Click example listing desktop', async () => {
  render(<App />);
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('close view item'));
});

test('Click example listing mobile', async () => {
  // did this just to check 100% branch coverage
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('close view item'));
});

test('Click on listing after its broken', async () => {
  render(<App />);
  setWide();
  server.use(
    rest.get('/v0/listing', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('error window');
});

// Filters.js

// HomePage.js
test('Click login button to hide home page', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('topbar login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
});

// QuickLogin.js
test('Click quick login button', async () => {
  render(<App />);
  setWide();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
});

// Search.js
test('Put some input in the search bar on desktop', async () => {
  render(<App />);
  setWide();
  const input = screen.getByLabelText('search bar');
  fireEvent.change(input, {target: {value: 'Toyota'}});
  await getElement('2002 Toyota Tacoma Listing');
  await getElement('2013 Toyota Prius Listing');
});

test('Put some input in the search bar broken server', async () => {
  render(<App />);
  setWide();
  const input = screen.getByLabelText('search bar');
  server.use(
    rest.post('/v0/listings', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.change(input, {target: {value: 'Toyota'}});
  await getElement('error window');
});

test('Put some input in the search bar on mobile', async () => {
  render(<App />);
  setNarrow();
  const input = screen.getByLabelText('search bar');
  fireEvent.change(input, {target: {value: 'Toyota'}});
  await getElement('2002 Toyota Tacoma Listing');
  await getElement('2013 Toyota Prius Listing');
});

// Sidebar.js

// SubCategories.js

// TopBar.js
test('Desktop Click top bar login button without inputting anything',
  async () => {
    render(<App />);
    setWide();
    fireEvent.click(await getElement('topbar login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
  });


test('Desktop top bar input user info and password and press login successful',
  async () => {
    render(<App />);
    localStorage.clear();
    setWide();
    const ui = await waitFor(() => screen.getByTestId('Userinfo-input'));
    fireEvent.change(ui, {target: {value: 'art@gmail.com'}});
    const pw = await waitFor(() => screen.getByTestId('Password-input'));
    fireEvent.change(pw, {target: {value: 'password123'}});
    const thing = await getElement('topbar login button');
    fireEvent.click(thing);
    screen.getByLabelText('desktop view');
    localStorage.clear();
  });

test('Desktop top bar input user info and password press login unsuccessful',
  async () => {
    render(<App />);
    localStorage.clear();
    server.use(
      rest.post('/authenticate', (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );
    setWide();
    const ui = await waitFor(() => screen.getByTestId('Userinfo-input'));
    fireEvent.change(ui, {target: {value: 'art@gmail.com'}});
    const pw = await waitFor(() => screen.getByTestId('Password-input'));
    fireEvent.change(pw, {target: {value: 'password123'}});
    const thing = await getElement('topbar login button');
    fireEvent.click(thing);
    await waitFor(() => screen.getByText('Forgot password?'));
    localStorage.clear();
  });

// Login.js
test('Click login button on login page without filling in anything',
  async () => {
    render(<App />);
    localStorage.clear();
    setWide();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    fireEvent.click(await getElement('Login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    localStorage.clear();
  });

test('Click/Hover hide password button on login page', async () => {
  render(<App />);
  localStorage.clear();
  setWide();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
  fireEvent.mouseDown(await getElement('toggle password visibility'));
  fireEvent.click(await getElement('toggle password visibility'));
  localStorage.clear();
});

test('Click login on login page after filling both user info unsuccessful',
  async () => {
    render(<App />);
    localStorage.clear();
    server.use(
      rest.post('/authenticate', (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );
    setWide();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    const ui = await waitFor(() => screen.getByTestId('Login-Userinfo-input'));
    fireEvent.change(ui, {target: {value: 'art@gmail.com'}});
    const pw = await waitFor(() => screen.getByTestId('Login-Password-input'));
    fireEvent.change(pw, {target: {value: 'password123'}});
    fireEvent.click(await getElement('Login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    localStorage.clear();
  });

test('Click login button on login page after filling both user info successful',
  async () => {
    render(<App />);
    localStorage.clear();
    setWide();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    const ui = await waitFor(() => screen.getByTestId('Login-Userinfo-input'));
    fireEvent.change(ui, {target: {value: 'art@gmail.com'}});
    const pw = await waitFor(() => screen.getByTestId('Login-Password-input'));
    fireEvent.change(pw, {target: {value: 'password123'}});
    fireEvent.click(await getElement('Login button'));
    await waitFor(() => screen.getByText('Marketplace'));
    localStorage.clear();
  });

// Register.js
test('Going from login page to create new account page', async () => {
  render(<App />);
  setWide();
  localStorage.clear();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
  fireEvent.click(await getElement('Create a new account'));
  await waitFor(() => screen.getByText('Create an account'));
  localStorage.clear();
});

test('Going from login page to create new account page, then back to login',
  async () => {
    render(<App />);
    setWide();
    localStorage.clear();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    fireEvent.click(await getElement('Create a new account'));
    await waitFor(() => screen.getByText('Create an account'));
    fireEvent.click(await getElement('Back to Login'));
    await waitFor(() => screen.getByText('Forgot password?'));
    localStorage.clear();
  });

test('Register page clicking sign up with blank test boxes', async () => {
  render(<App />);
  setWide();
  localStorage.clear();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
  fireEvent.click(await getElement('Create a new account'));
  await waitFor(() => screen.getByText('Create an account'));
  fireEvent.click(await getElement('Sign Up'));
  await waitFor(() => screen.getByText('Create an account'));
  localStorage.clear();
});

test('Register page clicking sign up with invalid text boxes', async () => {
  render(<App />);
  localStorage.clear();
  setWide();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
  fireEvent.click(await getElement('Create a new account'));
  await waitFor(() => screen.getByText('Create an account'));
  const first = await waitFor(() => screen.getByTestId('First-Name-input'));
  fireEvent.change(first, {target: {value: 'Jim'}});
  const last = await waitFor(() => screen.getByTestId('Last-Name-input'));
  fireEvent.change(last, {target: {value: 'Hawkins'}});
  const email = await waitFor(() => screen.getByTestId('Email-input'));
  fireEvent.change(email, {target: {value: 'JimHaw'}});
  const phone = await waitFor(() => screen.getByTestId('Phone-input'));
  fireEvent.change(phone, {target: {value: '12312312342739127838912321'}});
  const password = await waitFor(() =>
    screen.getByTestId('Register-Password-input'));
  fireEvent.change(password, {target: {value: 'Treasure Planet'}});

  fireEvent.click(await getElement('Sign Up'));
  await waitFor(() => screen.getByText('Create an account'));
  localStorage.clear();
});

test('Register page clicking sign up with valid text boxes successful',
  async () => {
    render(<App />);
    setWide();
    localStorage.clear();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    fireEvent.click(await getElement('Create a new account'));
    await waitFor(() => screen.getByText('Create an account'));
    const first = await waitFor(() => screen.getByTestId('First-Name-input'));
    fireEvent.change(first, {target: {value: 'Jim'}});
    const last = await waitFor(() => screen.getByTestId('Last-Name-input'));
    fireEvent.change(last, {target: {value: 'Hawkins'}});
    const email = await waitFor(() => screen.getByTestId('Email-input'));
    fireEvent.change(email, {target: {value: 'JimHawkins@gmail.com'}});
    const phone = await waitFor(() => screen.getByTestId('Phone-input'));
    fireEvent.change(phone, {target: {value: '1231231234'}});
    const password = await waitFor(
      () => screen.getByTestId('Register-Password-input'),
    );
    fireEvent.change(password, {target: {value: 'Treasure Planet'}});

    fireEvent.click(await getElement('Sign Up'));
    await waitFor(() => screen.getByText('Marketplace'));
    localStorage.clear();
  });

test('Register page clicking sign up with valid text boxes unsuccessful 409',
  async () => {
    render(<App />);
    localStorage.clear();
    server.use(
      rest.post('/v0/user', (req, res, ctx) => {
        return res(ctx.status(409));
      }),
    );
    setWide();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    fireEvent.click(await getElement('Create a new account'));
    await waitFor(() => screen.getByText('Create an account'));
    const first = await waitFor(() => screen.getByTestId('First-Name-input'));
    fireEvent.change(first, {target: {value: 'Jim'}});
    const last = await waitFor(() => screen.getByTestId('Last-Name-input'));
    fireEvent.change(last, {target: {value: 'Hawkins'}});
    const email = await waitFor(() => screen.getByTestId('Email-input'));
    fireEvent.change(email, {target: {value: 'JimHawkins@gmail.com'}});
    const phone = await waitFor(() => screen.getByTestId('Phone-input'));
    fireEvent.change(phone, {target: {value: '1231231234'}});
    const password = await waitFor(() =>
      screen.getByTestId('Register-Password-input'));
    fireEvent.change(password, {target: {value: 'Treasure Planet'}});

    fireEvent.click(await getElement('Sign Up'));
    await waitFor(() => screen.getByText('Create an account'));
    localStorage.clear();
  });

test('Register page clicking sign up with valid text boxes unsuccessful 404',
  async () => {
    render(<App />);
    localStorage.clear();
    server.use(
      rest.post('/v0/user', (req, res, ctx) => {
        return res(ctx.status(400));
      }),
    );
    setWide();
    fireEvent.click(await getElement('quick login button'));
    await waitFor(() => screen.getByText('Forgot password?'));
    fireEvent.click(await getElement('Create a new account'));
    await waitFor(() => screen.getByText('Create an account'));
    const first = await waitFor(() => screen.getByTestId('First-Name-input'));
    fireEvent.change(first, {target: {value: 'Jim'}});
    const last = await waitFor(() => screen.getByTestId('Last-Name-input'));
    fireEvent.change(last, {target: {value: 'Hawkins'}});
    const email = await waitFor(() => screen.getByTestId('Email-input'));
    fireEvent.change(email, {target: {value: 'JimHawkins@gmail.com'}});
    const phone = await waitFor(() => screen.getByTestId('Phone-input'));
    fireEvent.change(phone, {target: {value: '1231231234'}});
    const password = await waitFor(() =>
      screen.getByTestId('Register-Password-input'));
    fireEvent.change(password, {target: {value: 'Treasure Planet'}});

    fireEvent.click(await getElement('Sign Up'));
    await waitFor(() => screen.getByText('Create an account'));
    localStorage.clear();
  });


// MobileCategories.js

// MobileFilters.js

// CategoryList.js
test('Check root categories show up', async () => {
  render(<App />);
  setWide();
  await getElement('Vehicles Root Category');
  await getElement('Real Estate Root Category');
});

test('Click Vehicles root category', async () => {
  render(<App />);
  setWide();
  fireEvent.click(await getElement('Vehicles Root Category'));
  await getElement('Cars Subcategory');
});

test('Navigate to the cars subcategory on mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  fireEvent.click(await getElement('open filters mobile'));
  fireEvent.click(await getElement('close mobile filters'));
});

test('Navigate to the cars subcategory on desktop', async () => {
  render(<App />);
  setWide();
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('Cars CrumbText');
  fireEvent.click(await getElement('Marketplace Crumb'));
  await getElement('Marketplace Title');
});

test('Click subcategories on broken server desktop', async () => {
  render(<App />);
  setWide();
  fireEvent.click(await getElement('Vehicles Root Category'));
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('error window');
});

test('Click subcategories on broken server mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('error window');
});

test('Click root category on broken server mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.click(await getElement('Vehicles Root Category'));
  await getElement('error window');
});

// Crumbs.js
test('Nav to cars and back to vehicles on mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('Cars CrumbText');
  fireEvent.click(await getElement('Vehicles Crumb'));
  await getElement('Cars Subcategory');
  await getElement('Vehicles Crumb Category');
});

test('Use crumbs on broken server mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('Cars CrumbText');
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  fireEvent.click(await getElement('Vehicles Crumb'));
  await getElement('error window');
  setTimeout(fireEvent.click, 0, await getElement('close error window'));
  await missingElement('error window');
});

test('Cars->Vehicles with category popup mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  await getElement('Cars CrumbText');
  fireEvent.click(await getElement('Cars Crumb Category'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  await getElement('Vehicles Crumb Category');
});

// FilterList.js
test('Apply some filters on mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('open filters mobile'));
  // mobile filters are open
  fireEvent.click(await getElement('Sort By Filter'));
  fireEvent.click(await getElement('Recommended Option'));

  const max = await getElement('Price Max');
  fireEvent.change(max, {target: {value: '15000'}});
  const min = await getElement('Price Min');
  fireEvent.change(min, {target: {value: '1000'}});

  fireEvent.click(await getElement('apply mobile filters'));
});

test('Apply some filters on desktop', async () => {
  render(<App />);
  setWide();
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  fireEvent.click(await getElement('Sort By Filter'));
  fireEvent.click(await getElement('Recommended Option'));
  fireEvent.click(await getElement('Body Style Filter'));
  fireEvent.click(await getElement('Sedan Option'));
  fireEvent.click(await getElement('Minivan Option'));
  fireEvent.click(await getElement('Minivan Option'));

  const max = await getElement('Price Max');
  fireEvent.change(max, {target: {value: '15000'}});
  const min = await getElement('Price Min');
  fireEvent.change(min, {target: {value: '1000'}});
});

test('Apply some more filters on mobile', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
  fireEvent.click(await getElement('open filters mobile'));
  // mobile filters are open
  fireEvent.click(await getElement('Sort By Filter'));
  fireEvent.click(await getElement('Recommended Option'));
  fireEvent.click(await getElement('Body Style Filter'));
  fireEvent.click(await getElement('Sedan Option'));

  const min = await getElement('Price Min');
  fireEvent.change(min, {target: {value: '1000'}});

  fireEvent.click(await getElement('apply mobile filters'));
});

// Styles.js

// ViewItem.js
test('Sign in, view item, message them', async () => {
  render(<App />);
  localStorage.clear();
  setWide();
  const ui = await waitFor(() => screen.getByTestId('Userinfo-input'));
  fireEvent.change(ui, {target: {value: 'art@gmail.com'}});
  const pw = await waitFor(() => screen.getByTestId('Password-input'));
  fireEvent.change(pw, {target: {value: 'password123'}});
  fireEvent.click(await getElement('topbar login button'));
  screen.getByLabelText('desktop view');
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('Go to next page'));
  fireEvent.click(await getElement('Go to next page'));
  fireEvent.click(await getElement('message / login'));
});

test('Prompt login when viewing item', async () => {
  render(<App />);
  localStorage.clear();
  setWide();
  screen.getByLabelText('desktop view');
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('message / login'));

  // finish this by checking
});


// Fetch.js
test('Fetch bad categories', async () => {
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const res1 = await Fetch.getCategories(['Marketplace']);
  expect(res1).toBe(404);
  const res2 = await Fetch.setRootCategory(['Vehicles']);
  expect(res2).toBe(404);
});

test('Fetch bad listing', async () => {
  server.use(
    rest.get('/v0/listing', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.getItem('545e5e25-5116-4cef-9b46-9238bfca0540');
  expect(value).toBe(404);
});

test('Fetch bad listings', async () => {
  server.use(
    rest.post('/v0/listings', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.getItemsCustom(
    ['Marketplace', 'Vehicles', 'Cars'],
    {},
    'Toyota Tacoma',
  );
  expect(value).toBe(404);
});

test('Fetch pop to bad category #1', async () => {
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.popToCategory({
    selectedRootCat: 'Vehicles',
    selectedSubCats: ['Cars'],
  }, 'BadCategory');
  expect(value).toBe(404);
});

test('Fetch bad pop to category #2', async () => {
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.popToCategory({
    selectedRootCat: 'Vehicles',
    selectedSubCats: ['Cars'],
  }, 'Marketplace');
  expect(value).toBe(404);
});

test('Sim. bad subcategory', async () => {
  server.use(
    rest.get('/v0/categories', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.setSubCategory({
    selectedRootCat: 'Vehicles',
    selectedSubCats: [],
  }, 'Carss');
  expect(value).toBe(404);
});

test('Sim. bad updateContent 1', async () => {
  server.use(
    rest.post('/v0/listings', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.updateContent({
    selectedRootCat: 'Vehicles',
    selectedSubCats: [],
    selectedFilters: {},
    filters: {},
    searchInput: '',
  }, {});
  expect(value).toBe(404);
});

test('Sim. bad updateContent 2', async () => {
  server.use(
    rest.post('/v0/listings', (req, res, ctx) => {
      return res(
        ctx.status(500),
      );
    }),
  );
  const value = await Fetch.getItems({
    selectedRootCat: 'Vehicles',
    selectedSubCats: ['Cars'],
    selectedFilters: data.Filters.selectedFilters,
    filters: data.Filters.filters,
    searchInput: '',
  });
  expect(value).toBe(404);
});
