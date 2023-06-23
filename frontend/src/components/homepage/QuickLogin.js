import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {WhiteButton} from '../resources/Styles';
import Context from '../context/Context';

/**
 * @param {object} props
 * @return {object} JSX
 */
function QuickLogin(props) {
  const ctx = React.useContext(Context);
  const sx = {
    m: -1,
    mb: '10px',
    background: '#FFBAB0',
    boxShadow: 0,
  };
  const style = ctx.isDesktop() ? {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  } : {};
  return (
    <Card square={true} sx={sx} style={style}>
      <CardContent>
        <Typography variant='h5' sx={{mb: 0.5}}>
          Buy and sell items locally or have
          something new shipped from stores.
        </Typography>
        <Typography variant='subtitle1'>
          Log in to get the full OpenMRKT experience.
        </Typography>
      </CardContent>
      <CardActions sx={{mx: '10px', mb: 1.5}}>
        <WhiteButton disableElevation={true} variant="contained"
          aria-label='quick login button'
          onClick={() => {
            ctx.toggleLogin(true);
          }}>
          Log In
        </WhiteButton>
        <WhiteButton
          aria-label='quick learn more button'
          disableElevation={true}
          variant="contained"
          sx={{flexGrow: 1}}>
          Learn More
        </WhiteButton>
      </CardActions>
    </Card>
  );
}

export default QuickLogin;
