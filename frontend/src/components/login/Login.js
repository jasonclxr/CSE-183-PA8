import React from 'react';
import Context from '../context/Context';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
/**
 * @return {object} JSX
 */
function LoginPage() {
  const ctx = React.useContext(Context);
  const [showPassword, setshow] = React.useState(false);
  if (ctx.loginPage) {
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
      if (!(numberregex.test(ctx.Userinfo) ||
            emailregex.test(ctx.Userinfo))) {
        ctx.setvalidinfo(false);
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
      /* else if (ctx.Validinfo) {
          ctx.setFailedLogin(!ctx.FailedLogin);
      } else {
          ctx.setvalidinfo(true);
      } */
    };
    // console.log(ctx.Userinfo);
    // console.log(ctx.Password);
    return (
      <React.Fragment>
        <Typography variant="h4" sx={{flexGrow: 1, color: '#1976d2'}}
          align='center'>
          <b>OpenMKRT</b>
        </Typography>
        <form aria-label='login form' onSubmit={onSubmit}>
          <div>
            <TextField
              error = {ctx.Validinfo ? (ctx.FailedLogin ?
                true : false) : true}
              label = {ctx.Validinfo ? (ctx.FailedLogin ?
                'Error' : '') : 'Error'}
              helperText = {ctx.Validinfo ? (ctx.FailedLogin ?
                'Incorrect password or username' : '') :
                'Enter a valid email address or phone number'}
              placeholder = "Mobile number or email"
              variant="filled"
              fullWidth
              sx={{paddingTop: '4px', paddingBottom: '8px'}}
              onChange={(event) => ctx.setUserinfo(event.target.value)}
              inputProps={{
                'data-testid': 'Login-Userinfo-input',
                'aria-label': 'Login Username',
              }}
            />
            <TextField
              error = {ctx.FailedLogin ? true : false}
              label= {ctx.FailedLogin ? 'Error' : ''}
              helperText= {ctx.FailedLogin ?
                'Incorrect password or username' : ''}
              placeholder = "Password"
              variant="filled"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              sx={{paddingBottom: '8px'}}
              onChange={(event) => ctx.setPassword(event.target.value)}
              inputProps={{
                'data-testid': 'Login-Password-input',
                'aria-label': 'Login Password',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setshow(!showPassword)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button variant="contained" type='submit' size='medium'
            fullWidth aria-label= "Login button">
                Log in
          </Button>
        </form>
        <Typography sx={{flexGrow: 1, color: '#1976d2', paddingTop: '15px'}}
          align='center'>
                    Forgot password?
        </Typography>
        <Divider spacing={3}
          sx={{paddingTop: '25px', paddingBottom: '25px'}}>
                Or
        </Divider>
        <Button variant="contained"
          sx={{'fontSize': '10px', 'margin': 'auto', 'display': 'flex',
            'minWidth': '50vw', 'maxWidth': '50vw',
            'backgroundColor': '#00a400', '&:hover': {
              backgroundColor: '#00a420'}}}
          size='medium' onClick={()=> {
            ctx.toggleRegister(true);
          }}
          aria-label="Create a new account"
        >
                Create a new account
        </Button>
      </React.Fragment>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default LoginPage;
