const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({ 
        target: 'http://localhost:3010/',
        changeOrigin: true}))
      .use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')))
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll((done) => {
  backend.close(() => { 
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

// Clicks the 'Get Dummy' button and checks the server response is displayed.
// test('Get Dummy', async () => {
//   await page.goto('http://localhost:3000');
//   const label = await page.$('aria/dummy message');
//   let cont = await (await label.getProperty('textContent')).jsonValue();
//   expect(cont).toBe('Click the button!');
//   await page.click('aria/get dummy[role="button"]');
//   await page.waitForFunction(
//     'document.querySelector("label").innerText.includes("Hello CSE183")',
//   );
//   cont = await (await label.getProperty('textContent')).jsonValue();
//   expect(cont.search(/Hello CSE183/)).toEqual(0);
//   expect(cont.search(/Database created/)).toBeGreaterThan(60);
// });

// Helper functions

const getLocalStorage = async () => await page.evaluate(() => {
  return Object.assign({}, window.localStorage);
});

const getAria = async (label) => await page.$(`aria/${label}`);

const waitFor = async (label) => {
  return await page.waitForSelector(`[aria-label="${label}"]`);
}

const waitForSelector = async (label) => {
  return await page.waitForFunction((inp) => {
    return document.querySelector(`${inp}`);
  }, {}, label);
}

const submitForm = async (label) => {
  const form = await getAria(label);
  await form.evaluate(form => form.submit());
}

const changeInput = async (label, input) => {
  return await page.type(`[aria-label="${label}"]`, input);
}

const checkDisappear = async (label) => {
  await page.waitForFunction((query) => {
    return !document.querySelector(`[aria-label="${query}"]`);
  }, {}, label);
}

const clickOn = async (label) => {
  const button = await getAria(label);
  await button.evaluate(b => b.click());
}

// Initial setup check
test('Is it mobile?', async () => {
  await page.goto('http://localhost:3000');
  expect(await getAria('mobile view')).not.toBeNull();
});

test('Does the All Categories button exist?', async () => {
  await page.goto('http://localhost:3000');
  expect(await getAria('mobile view')).not.toBeNull();
  expect(await getAria('All Categories Subcategory')).not.toBeNull();
});

test('Do all the listings show up?', async () => {
  await page.goto('http://localhost:3000');
  expect(await getAria('mobile view')).not.toBeNull();
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
});

test('Do all the root categories show up?', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  await waitFor('Real Estate Root Category');
});

// Basic feature navigation

test('Select vehicle root category', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  await clickOn('Vehicles Root Category');
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
  await waitFor('Cars Subcategory');
  await waitFor('Trucks Subcategory');
});

test('Select Real estate root category', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Real Estate Root Category');
  await clickOn('Real Estate Root Category');
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('2002 Toyota Tacoma Listing');
  await checkDisappear('Go Kart Listing');
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('2013 Toyota Prius Listing');
  await waitFor('Houses Subcategory');
  await waitFor('Apartments Subcategory');
});

test('Take a stroll through marketplace vehicles unlogged in', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  // Marketplace
  await clickOn('Vehicles Root Category');
  // Marketplace / Vehicles
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
  await waitFor('Cars Subcategory');
  await waitFor('Trucks Subcategory');
  await clickOn('Cars Subcategory');
  // Marketplace / Vehicles / Cars
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('2002 Toyota Tacoma Listing');
  await checkDisappear('Go Kart Listing');
  await waitFor('Vehicles Crumb');
  await clickOn('Vehicles Crumb');
  // Marketplace / Vehicles
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await waitFor('Trucks Subcategory');
  await clickOn('Trucks Subcategory');
  // Marketplace / Vehicles / Trucks
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('2013 Toyota Prius Listing');
  await checkDisappear('Go Kart Listing');
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Marketplace Crumb');
  await clickOn('Marketplace Crumb');
  // Marketplace
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
});

test('Take a stroll through marketplace real estate unlogged in', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Real Estate Root Category');
  // Marketplace
  await clickOn('Real Estate Root Category');
  // Marketplace / Real Estate
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('2002 Toyota Tacoma Listing');
  await checkDisappear('Go Kart Listing');
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('2013 Toyota Prius Listing');
  await waitFor('Houses Subcategory');
  await waitFor('Apartments Subcategory');
  await clickOn('Houses Subcategory');
  // Marketplace / Real Estate / Houses
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await waitFor('Real Estate Crumb');
  await clickOn('Real Estate Crumb');
  // Marketplace / Real Estate
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await waitFor('Houses Subcategory');
  await waitFor('Apartments Subcategory');
  await clickOn('Apartments Subcategory');
  // Marketplace / Real Estate / Apartments
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await waitFor('Marketplace Crumb');
  await clickOn('Marketplace Crumb');
  // Marketplace
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
});

test('Check the filters of Vehicles', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  // Marketplace
  await clickOn('Vehicles Root Category');
  // Marketplace / Vehicles
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  // Open filters
  await waitFor('open filters mobile');
  await clickOn('open filters mobile');
  await waitFor('Price Max');
  await waitFor('Price Min');
  await changeInput('Price Max', '1000');
  await waitFor('apply mobile filters');
  await clickOn('apply mobile filters');
  await waitFor('Go Kart Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('2002 Toyota Tacoma Listing');
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('2013 Toyota Prius Listing');
});

test('Check the filters of Real Estate', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Real Estate Root Category');
  // Marketplace
  await clickOn('Real Estate Root Category');
  // Marketplace / Real Estate
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  // Open filters
  await waitFor('open filters mobile');
  await clickOn('open filters mobile');
  await waitFor('Buying Options Filter');
  await clickOn('Buying Options Filter');
  await waitFor('All Option');
  await waitFor('Buy Option');
  await waitFor('Rent Option');
  await clickOn('Rent Option');
  await waitFor('apply mobile filters');
  await clickOn('apply mobile filters');
  await checkDisappear('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
});

test('Check the filters of Vehicles/Cars', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  // Marketplace
  await clickOn('Vehicles Root Category');
  // Marketplace / Vehicles
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  // Open filters
  await waitFor('open filters mobile');
  await clickOn('open filters mobile');
  await waitFor('Price Max');
  await waitFor('Price Min');
  await changeInput('Price Max', '1000');
  await waitFor('apply mobile filters');
  await clickOn('apply mobile filters');
  await waitFor('Go Kart Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('2002 Toyota Tacoma Listing');
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('2013 Toyota Prius Listing');
});

test('Check the filters of Real Estate/Apartments', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Real Estate Root Category');
  // Marketplace
  await clickOn('Real Estate Root Category');
  // Marketplace / Real Estate
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await waitFor('Houses Subcategory');
  await waitFor('Apartments Subcategory');
  await clickOn('Apartments Subcategory');
  // Marketplace / Real Estate / Apartments
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  // Open filters
  await waitFor('open filters mobile');
  await clickOn('open filters mobile');
  await waitFor('Beds Max');
  await waitFor('Beds Min');
  await changeInput('Beds Min', '3');
  await waitFor('apply mobile filters');
  await clickOn('apply mobile filters');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await waitFor('open filters mobile');
  await clickOn('open filters mobile');
  await waitFor('Baths Min');
  await waitFor('Baths Max');
  await changeInput('Baths Min', '2');
  await waitFor('apply mobile filters');
  await clickOn('apply mobile filters');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
});

test('Test the search functionality', async () => {
  await page.goto('http://localhost:3000');
  await clickOn('All Categories Subcategory');
  await waitFor('Vehicles Root Category');
  await clickOn('Vehicles Root Category');
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
  await waitFor('Cars Subcategory');
  await waitFor('Trucks Subcategory');
  await waitFor('search bar');
  await changeInput('search bar', 'toyota');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('2013 Toyota Prius Listing');
  await checkDisappear('2019 Ford F-150 Listing');
  await checkDisappear('Go Kart Listing');
  await checkDisappear('2015 Honda Odyssey Listing');
  await checkDisappear('A Big Pile of Dirt Listing');
  await checkDisappear('Robbies house Listing');
  await checkDisappear('Meder St Mansion Listing');
  await checkDisappear('Its an apartment yo Listing');
  await checkDisappear('Hilltop Apartment Listing');
});

test('Try logging in with an already created account', async () => {
  await page.goto('http://localhost:3000');
  await waitFor('All Categories Subcategory');
  await waitFor('topbar login button');
  await clickOn('topbar login button');
  await waitFor('Login Username');
  await waitFor('Login Password');
  await changeInput('Login Username', 'art@gmail.com');
  await changeInput('Login Password', 'password123');
  await waitFor('login form');
  await submitForm('login form');
  // Check if we returned to the homescreen
  await waitFor('2019 Ford F-150 Listing');
  await waitFor('2002 Toyota Tacoma Listing');
  await waitFor('Go Kart Listing');
  await waitFor('2015 Honda Odyssey Listing');
  await waitFor('2013 Toyota Prius Listing');
  await waitFor('A Big Pile of Dirt Listing');
  await waitFor('Robbies house Listing');
  await waitFor('Meder St Mansion Listing');
  await waitFor('Its an apartment yo Listing');
  await waitFor('Hilltop Apartment Listing');
});

test('Try seeing replies while not logged in', async () => {
  await page.goto('http://localhost:3000');
  // Click on a listing
  await waitFor('2019 Ford F-150 Listing');
  await clickOn('2019 Ford F-150 Listing');
  await waitFor('message / login');
  await clickOn('message / login');
  await waitFor('Login Username');
});

// test('Try logging in with an already created account', async () => {
//   await page.goto('http://localhost:3000');
//   await waitFor('topbar login button');
//   await clickOn('topbar login button');
//   await waitFor('Login Username');
//   await waitFor('Login Password');
//   await changeInput('Login Username', 'art@gmail.com');
//   await changeInput('Login Password', 'password123');
//   await waitFor('login form');
//   await submitForm('login form');
//   // See if replies is there
//   await waitFor('2019 Ford F-150 Listing');
//   await clickOn('2019 Ford F-150 Listing');
//   await waitFor('message / login');
//   await clickOn('message / login');
//   await waitFor('replies');
// });