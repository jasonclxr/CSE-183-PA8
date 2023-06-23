import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import App from '../App';
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
  rest.get('/v0/replies/:listingid', (req, res, ctx) => {
    return res(ctx.json([
      {
        name: {first: 'Robbie', Last: 'Radzville'},
        message: 'test string',
        messagedate: '2020-11-29T08:11:21.000Z',
      },
      {
        name: {first: 'Robbie', Last: 'Radzville'},
        message: 'Can you deliver?',
        messagedate: '2021-09-09T08:11:21.000Z',
      },
      {
        name: {first: 'Robbie', Last: 'Radzville'},
        message: 'Can you deliver?',
        messagedate: '2021-11-29T08:11:21.000Z',
      },
      {
        name: {first: 'Robbie', Last: 'Radzville'},
        message: 'Great price!',
        messagedate: new Date(),
      },
    ]));
  }),
  rest.post('/v0/replies', (req, res, ctx) => {
    return res(ctx.json([
      {
        listingid: '545e5e25-5116-4cef-9b46-9238bfca0540',
        userid: '6a749dbf-a0a6-4466-a514-6d1a05771873',
        message: 'test string',
        messagedate: '2021-11-29T08:11:21.000Z',
      },
    ]));
  }),
);

// const missingElement = async (labelText) => {
//   return await waitForElementToBeRemoved(() => {
//     return screen.queryByLabelText(labelText);
//   });
// };

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

test('Click message button to get to login screen', async () => {
  render(<App />);
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('message / login'));
});

test('Click message button to see replies', async () => {
  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({
    id: '0e2ea340-6591-4877-84cf-550856f9a59c',
    name: {'last': 'Martirosyan', 'first': 'Artyom'},
    email: 'art@gmail.com',
    phone: '123-456-7890',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC' +
    'I6ImQ0MmQyZTIyLWVmZTctNDJkZC04YjZiLTA5MTdhMzQ1ODg2OCIsImVtYWlsIjo' +
    'iYXJ0QGdtYWlsLmNvbSIsImlhdCI6MTYzODA3MzE3MiwiZXhwIjoxNjM4MDc0OTcyfQ.' +
    '-2sbJrCDXBncgJDtc-uc-DOmtL82CwbF31xJesguM1A'}));
  render(<App />);
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('message / login'));
  await getElement('replies');
  screen.getByText('test string');
});

test('Enter message and submit', async () => {
  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({
    id: '0e2ea340-6591-4877-84cf-550856f9a59c',
    name: {'last': 'Martirosyan', 'first': 'Artyom'},
    email: 'art@gmail.com',
    phone: '123-456-7890',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC' +
    'I6ImQ0MmQyZTIyLWVmZTctNDJkZC04YjZiLTA5MTdhMzQ1ODg2OCIsImVtYWlsIjo' +
    'iYXJ0QGdtYWlsLmNvbSIsImlhdCI6MTYzODA3MzE3MiwiZXhwIjoxNjM4MDc0OTcyfQ.' +
    '-2sbJrCDXBncgJDtc-uc-DOmtL82CwbF31xJesguM1A'}));
  render(<App />);
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('message / login'));
  await getElement('replies');
  const message = screen.getByTestId('write message');
  fireEvent.change(message, {target: {value: 'Hello'}});
  fireEvent.click(await getElement('send message'));
});

test('Submit black message', async () => {
  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({
    id: '0e2ea340-6591-4877-84cf-550856f9a59c',
    name: {'last': 'Martirosyan', 'first': 'Artyom'},
    email: 'art@gmail.com',
    phone: '123-456-7890',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC' +
    'I6ImQ0MmQyZTIyLWVmZTctNDJkZC04YjZiLTA5MTdhMzQ1ODg2OCIsImVtYWlsIjo' +
    'iYXJ0QGdtYWlsLmNvbSIsImlhdCI6MTYzODA3MzE3MiwiZXhwIjoxNjM4MDc0OTcyfQ.' +
    '-2sbJrCDXBncgJDtc-uc-DOmtL82CwbF31xJesguM1A'}));
  render(<App />);
  fireEvent.click(await getElement('2019 Ford F-150 Listing'));
  await getElement('2019 Ford F-150 View');
  fireEvent.click(await getElement('message / login'));
  fireEvent.click(await getElement('send message'));
});
