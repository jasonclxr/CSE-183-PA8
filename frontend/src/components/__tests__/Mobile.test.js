import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App from '../App';
import {setNarrow} from './common';
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

const getElement = async (labelText) => {
  return await waitFor(() => {
    return screen.getByLabelText(labelText);
  });
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// MobileCategories.js
test('All Categories button clickable', async () => {
  render(<App />);
  setNarrow();
  await getElement('All Categories Subcategory');
});

// Test closing with escape and x button
test('Close Mobile Categories with x button', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('close mobile categories'));
});

test('Click Vehicles root category on mobile', async () => {
  render(<App />);
  setNarrow();
  screen.getByLabelText('mobile view');
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('Cars Subcategory'));
});

test('Open Mobile Filters', async () => {
  render(<App />);
  setNarrow();
  screen.getByLabelText('mobile view');
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('open filters mobile'));
});

test('Mobile Filters x button', async () => {
  render(<App />);
  setNarrow();
  screen.getByLabelText('mobile view');
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('open filters mobile'));
  fireEvent.click(await getElement('close mobile filters'));
});

test('Mobile Filters apply filters button', async () => {
  render(<App />);
  setNarrow();
  screen.getByLabelText('mobile view');
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('open filters mobile'));
  fireEvent.click(await getElement('close mobile filters'));
});

test('Escape from mobile categories', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.keyDown(await getElement('mobile categories drawer'), {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    charCode: 27,
  });
});

test('Escape from mobile filters', async () => {
  render(<App />);
  setNarrow();
  fireEvent.click(await getElement('All Categories Subcategory'));
  fireEvent.click(await getElement('Vehicles Root Category'));
  fireEvent.click(await getElement('open filters mobile'));
  fireEvent.keyDown(await getElement('mobile filters drawer'), {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    charCode: 27,
  });
});

test('Register page clicking sign up with blank test boxes', async () => {
  render(<App />);
  localStorage.clear();
  setNarrow();
  fireEvent.click(await getElement('quick login button'));
  await waitFor(() => screen.getByText('Forgot password?'));
  fireEvent.click(await getElement('Create a new account'));
  await waitFor(() => screen.getByText('Create an account'));
  fireEvent.click(await getElement('Sign Up'));
  await waitFor(() => screen.getByText('Create an account'));
  localStorage.clear();
});

test('Register page clicking sign up with valid text boxes successful',
  async () => {
    render(<App />);
    setNarrow();
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
    setNarrow();
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
    setNarrow();
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
    await waitFor(() => screen.getByText('Create an account'));
    localStorage.clear();
  });

