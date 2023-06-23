import React from 'react';
import HomePage from './homepage/HomePage';
import MobileCategories from './mobile/MobileCategories';
import Provider from './context/Provider';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@emotion/react';
import MobileFilter from './mobile/MobileFilters';
import ViewItem from './viewitem/ViewItem';
import LoginPage from './login/Login';
import RegisterPage from './login/Register';
import {BrowserRouter, Switch} from 'react-router-dom';
import ErrorPopup from './resources/ErrorPopup';


const theme = createTheme({
  typography: {
    fontFamily: `"Trebuchet MS", "Helvetica", sans-serif`,
    h3: {
      fontSize: 28,
      fontWeight: 900,
      color: '#1876f2',
    },
    h4: {
      fontSize: 28,
      fontWeight: 900,
      color: '#1d1f23',
    },
    h5: {
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#1d1f23',
    },
    h6: {
      fontSize: 16,
      fontWeight: 900,
      lineHeight: 1.2,
      color: '#1d1f23',
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.3,
      color: '#1d1f23',
    },
    button: {
      fontWeight: 600,
    },
    body2: {
      color: '#868686',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    },
  },
});

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <ThemeProvider theme={theme}>
          <Provider>
            <ErrorPopup />
            <MobileFilter />
            <MobileCategories />
            <HomePage />
            <ViewItem />
            <LoginPage />
            <RegisterPage />
          </Provider>
        </ThemeProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
