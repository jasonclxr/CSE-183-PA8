import React from 'react';
import Context from '../context/Context';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

/**
 * @return {object} JSX
 */
function RegisterPage() {
  const ctx = React.useContext(Context);
  if (ctx.registerPage) {
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
      // console.log(emailregex.test(data.email));
      if (Boolean(ctx.first.length) && Boolean(ctx.last.length) &&
        numberregex.test(ctx.phone) && emailregex.test(ctx.email) &&
        Boolean(ctx.Password.length)) {
        // call make account here
        // console.log('WEINHERE');
        const sender = {
          'name': {
            'First': ctx.first,
            'Last': ctx.last,
          },
          'phone': ctx.phone,
          'email': ctx.email,
          'password': ctx.Password,
        };
        fetch('/v0/user', {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(sender),
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((json) => {
            localStorage.setItem('user', JSON.stringify(json));
            // console.log(JSON.stringify(json));
            ctx.successfulAccountCreation();
          })
          .catch((error) => {
            // console.log(error);
            ctx.setFailedRegister();
          });
      } else {
        ctx.setFailedRegisterFormat();
      }
      // console.log('submited');
    };
      // console.log(failed);
      // console.log();
    // console.log(ctx.isDesktop());
    // const width = ctx.isDesktop() ? '47vw' : '42vw';
    return (
      <div>
        <Typography variant="h2" sx={{flexGrow: 1, color: '#1976d2'}}
          align='center'>
          <b>OpenMKRT</b>
        </Typography>
        <Typography variant="h4" sx={{flexGrow: 1, color: '#1c1e21'}}
          align='center'>
          <b>Create an account</b>
        </Typography>
        <Typography variant="subtitle2"
          sx={{flexGrow: 1, color: '#606770', paddingBottom: '8px'}}
          align='center'>
                It's quick and easy.
        </Typography>
        <Divider/>
        <form onSubmit={onSubmit}>
          <div>
            <TextField
              error = {ctx.emptyfirst ? true: false}
              helperText = {ctx.emptyfirst ? 'First name is empty' : ''}
              placeholder = "First Name"
              variant="filled"
              sx={{paddingLeft: '15px', paddingTop: '10px',
                paddingBottom: '8px',
                minWidth: ctx.isDesktop() ? '47vw' : '42vw',
                maxWidth: ctx.isDesktop() ? '47vw' : '42vw',
                mr: '20px'}}
              onChange={(event) => {
                ctx.setfirstname(event.target.value);
              }}
              inputProps={{'data-testid': 'First-Name-input'}}
            />
            <TextField
              error = {ctx.emptylast ? true: false}
              helperText = {ctx.emptylast ? 'Last name is empty' : ''}
              placeholder = "Last Name"
              variant="filled"
              sx={{paddingTop: '10px', paddingBottom: '8px',
                minWidth: ctx.isDesktop() ? '47vw' : '42vw',
                maxWidth: ctx.isDesktop() ? '47vw' : '42vw'}}
              onChange={(event) => {
                ctx.setlastname(event.target.value);
              }}
              inputProps={{'data-testid': 'Last-Name-input'}}
            />
          </div>
          <div>
            <TextField
              placeholder = "Email"
              variant="filled"
              sx={{paddingLeft: '15px', paddingTop: '10px',
                paddingBottom: '8px',
                minWidth: ctx.isDesktop() ? '47vw' : '42vw',
                maxWidth: ctx.isDesktop() ? '47vw' : '42vw',
                mr: '20px'}}
              onChange={(event) => {
                ctx.setemail(event.target.value);
              }}
              inputProps={{'data-testid': 'Email-input'}}
            />
            <TextField
              placeholder = "Phone number"
              variant="filled"
              sx={{paddingTop: '10px', paddingBottom: '8px',
                minWidth: ctx.isDesktop() ? '47vw' : '42vw',
                maxWidth: ctx.isDesktop() ? '47vw' : '42vw'}}
              onChange={(event) => {
                ctx.setphone(event.target.value);
              }}
              inputProps={{'data-testid': 'Phone-input'}}
            />
          </div>
          <div>
            <TextField
              placeholder = "New Password"
              error = {ctx.emptypassword ? true: false}
              helperText = {ctx.emptypassword ?
                'Password field is empty' : ''}
              variant="filled"
              sx={{paddingLeft: '15px', paddingTop: '10px',
                paddingBottom: '8px',
                minWidth: ctx.isDesktop() ? '96vw' : '89vw',
                maxWidth: ctx.isDesktop() ? '96vw' : '89vw'}}
              onChange={(event) => {
                ctx.setPassword(event.target.value);
              }}
              inputProps={{'data-testid': 'Register-Password-input'}}
            />
          </div>
          <Grid sx={{paddingLeft: '15px', paddingBottom: '15px'}}>
            <Typography variant="subtitle2"
              sx={{flexGrow: 1, color: '#606770'}} align='left'>
                    By clicking sign up you agree to our Terms, Data Policy
                    and Cookies policy. As well as giving us permission to
                    sell your information.
            </Typography>
          </Grid>
          <Button variant="contained"
            sx={{'fontSize': '13px', 'margin': 'auto', 'display': 'flex',
              'minWidth': '40vw', 'maxWidth': '40vw',
              'backgroundColor': '#00a400', '&:hover': {
                backgroundColor: '#00a420'}}} size='medium' type='submit'
            aria-label="Sign Up"
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="h6"
          sx={{flexGrow: 1, color: '#1976d2', paddingTop: '12px',
            paddingBottom: '10px'}}
          align='center' onClick={()=> {
            ctx.toggleRegister(false);
          }}
          aria-label="Back to Login">
                Already have an account?
        </Typography>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}

export default RegisterPage;
