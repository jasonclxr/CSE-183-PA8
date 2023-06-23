import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Dummy from '../Dummy';

const URL = '/v0/dummy';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.json({message: 'Hello CSE183'}));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 */
test('Button Clickable', async () => {
  render(<Dummy />);
  fireEvent.click(screen.getByText('Get Dummy'));
  await waitFor(() => screen.getByText('Hello CSE183'));
});

/**
 */
test('Handles Server Error', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  render(<Dummy />);
  fireEvent.click(screen.getByText('Get Dummy'));
  await waitFor(() => screen.getByText('ERROR: ', {exact: false}));
});
