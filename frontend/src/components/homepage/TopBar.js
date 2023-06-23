import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Context from '../context/Context';
import TextField from '@mui/material/TextField';

const appBar = {
  backgroundColor: 'white',
  position: 'fixed',
  boxShadow: 0,
  margin: 0,
  flexGrow: 0,
  zIndex: (theme) => theme.zIndex.drawer + 1,
};
const button = {
  textTransform: 'none',
  boxShadow: 0,
};

/**
 * @return {object} JSX
 */
function ButtonAppBar() {
  const ctx = React.useContext(Context);
  return (
    <Box>
      <AppBar sx={appBar}>
        <Toolbar>
          <Typography variant="h3" sx={{flexGrow: 1}}>
            <b>OpenMRKT</b>
          </Typography>
          {desktopLogin(ctx.isDesktop(), ctx)}
          {mobileLogin(!ctx.isDesktop(), ctx)}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

/**
 * @param {boolean} isMobile
 * @param {*} ctx
 * @return {object} JSX
 */
function mobileLogin(isMobile, ctx) {
  if (isMobile) {
    return (
      <Button variant="contained" sx={button} size='medium'
        aria-label="topbar login button"
        onClick={()=> {
        // gotta check if theyre in desktop or not
          ctx.toggleLogin(true);
        }}>
        Log In
      </Button>
    );
  }
  return (
    <div></div>
  );
}


/**
 * @param {boolean} isDesktop
 * @param {*} ctx
 * @return {object} JSX
 */
function desktopLogin(isDesktop, ctx) {
  if (isDesktop) {
    // console.log(ctx.Userinfo);
    // console.log(ctx.Password);
    const numberregex = new RegExp(['^\\s*(?:\\+?(\\d{1,3})',
      ')?[-. (]*(\\d{3})[-. )]*',
      '(\\d{3})[-. ]*(\\d{4})',
      '(?: *x(\\d+))?\\s*$'].join(''));
    const emailregex = new RegExp(['^(([^<>()[\\]\\\\',
      '.,;:\\s@"]+(\\.[^<>()[\\]',
      '\\\\.,;:\\s@"]+)*)|(".+"',
      '))@((\\[[0-9]{1,3}\\.[0-9]',
      '{1,3}\\.[0-9]{1,3}\\.[0-9]',
      '{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));
    const onSubmit = (event) => {
      event.preventDefault();
      // console.log(ctx.Userinfo);
      // console.log(ctx.Password);
      if (!(numberregex.test(ctx.Userinfo) ||
            emailregex.test(ctx.Userinfo))) {
        ctx.setvalidinfo(false);
        // console.log('uhoh');
      } else {
        // console.log('authenticating');
        const user = {login: ctx.Userinfo, password: ctx.Password};
        fetch('/authenticate', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw res;
            }
            return res.json();
          })
          .then((json) => {
            localStorage.setItem('user', JSON.stringify(json));
            // console.log(JSON.stringify(json));
            ctx.loginsuccessful();
          })
          .catch((err) => {
          // console.log(err);
          // alert('Error logging in, please try again');
            ctx.setFailedLogin(true);
          });
        // ctx.setvalidinfo(true);
        // ctx.setFailedLogin(!ctx.FailedLogin);
        // ctx.toggleLogin(0);
      }
      // console.log('something was submitted');
    };
    return (
      <form onSubmit={onSubmit}>
        <div>
          <TextField
            aria-label="topbar username input"
            label="Username"
            variant="outlined"
            size="small"
            autoComplete="username"
            sx={{mr: '10px'}}
            onChange={(event) => ctx.setUserinfo(event.target.value)}
            inputProps={{'data-testid': 'Userinfo-input'}}
          />
          <TextField
            aria-label="topbar password input"
            label="Password"
            type="password"
            variant="outlined"
            autoComplete="current-password"
            size="small"
            sx={{mr: '10px'}}
            onChange={(event) => ctx.setPassword(event.target.value)}
            inputProps={{'data-testid': 'Password-input'}}
          />
          <Button variant="contained" type='submit' sx={button} size='medium'
            aria-label="topbar login button">
            Log In
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div></div>
  );
}

export default ButtonAppBar;
