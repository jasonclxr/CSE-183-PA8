import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Context from '../context/Context';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {WhitePagination} from '../resources/Styles';
import {List, Typography, Button,
  ListItemText, ListItem, Divider} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Replies from './Replies';
import {getReplies} from '../Fetch';

/**
 * @return {object} JSX
 */
function ViewItem() {
  const [page, setPage] = React.useState(1);
  const ctx = React.useContext(Context);
  const root = ctx.isDesktop() ? setup.desktop : setup.mobile;
  const handleChange = (event, value) => {
    setPage(value);
  };
  const loggedin = localStorage.getItem('user');
  const items = ['Marketplace'];
  if (ctx.selectedRootCat !== '') {
    items.push(ctx.selectedRootCat, ...ctx.subCategories);
  }
  const breadcrumbs = items.map((elem, i) => {
    return (
      <Typography key={i+1} color="text.secondary" fontSize={14}>
        {elem}
      </Typography>
    );
  });
  const item = ctx.itemBeingViewed;
  if (!ctx.loginPage && !ctx.registerPage && item !== null) {
    return (
      <Box>
        <Drawer
          anchor='bottom'
          open={ctx.itemBeingViewed !== null}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
          }}
        >
          <Box sx={{display: 'flex', ...root.container, height: '100vh'}}
            role='presentation'>
            <Box sx={{...root.cardMedia, position: 'relative'}}>
              <Box sx={{height: '100%', width: '100%', overflow: 'hidden'}}>
                <IconButton sx={{
                  bgcolor: '#e4e6eb',
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  mx: '15px',
                  my: '15px',
                }}
                aria-label='close view item'
                onClick={() => {
                  ctx.noMessage(null, false);
                }}>
                  <CloseIcon />
                </IconButton>
                <CardMedia
                  sx={{
                    filter: 'blur(12px)',
                    my: '-25%',
                    mx: '-25%',
                    height: '150%',
                    width: '150%',
                    zIndex: '1',
                  }}
                  component="img"
                  image={item.images[page - 1]}
                  alt={item.title}
                  loading="eager"
                />
                <CardMedia
                  sx={{
                    ...root.image,
                    objectFit: 'contain',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  component="img"
                  image={item.images[page - 1]}
                  alt={item.title}
                  loading="eager"
                />
              </Box>
              <WhitePagination key='stuff' count={item.images.length}
                size="large" color="primary" page={page} variant='outlined'
                onChange={handleChange}
                sx={{
                  position: 'absolute',
                  ...root.pagination,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              />
            </Box>
            <Box sx={{...root.cardContent}}>
              <Box sx={{
                height: 'calc(100% - 30px)',
                width: 'calc(100% - 30px)',
                m: '15px',
              }}>
                <Typography variant='h4' aria-label={item.title + ' View'}>
                  {item.title}
                </Typography>
                <Typography variant='h5'>
                  {'$' + item.price.toLocaleString()}
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
                <Button variant="contained"
                  startIcon={loggedin ? <ChatIcon /> : ''}
                  sx={{
                    textTransform: 'none',
                    boxShadow: 0,
                    my: '10px',
                    width: '100%',
                  }}
                  size='medium'
                  color='info'
                  aria-label='message / login'
                  onClick={async () => {
                    return (
                      loggedin ?
                        await ctx.setMessageButton(true,
                          await getReplies(ctx.itemBeingViewed.id)) :
                        ctx.toggleLogin(true)
                    );
                  }}>
                  {loggedin ? 'Message' : 'Log in for details'}
                </Button>
                <br/>
                <Typography variant='h5' mb='5px'>
                  Details
                </Typography>
                <List>
                  {Object.keys(item.filters).map((key) => {
                    return (
                      <ListItem key={key} sx={{mx: '-10px', my: '-15px'}}>
                        <HelpOutlineIcon sx={{mr: '10px', fill: '#868686'}}/>
                        <ListItemText>
                          <b>{key}: </b>
                          {item.filters[key]}
                        </ListItemText>
                      </ListItem>
                    );
                  })}
                </List>
                <Divider sx={{my: '10px'}}/>
                <Typography variant='h5' my='10px'>
                  Seller's Description
                </Typography>
                <Typography variant='subtitle1' pb='20px'
                  style={{whiteSpace: 'pre-line'}}>
                  {item.text}
                </Typography>
                <Typography variant='h5' my='10px'>
                  Replies
                </Typography>
                <Divider />
                {
                  loggedin && ctx.messageButton ?
                    <Replies /> :
                    <div>Click 'Message' above or Log in to see replies</div>
                }
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  } else {
    return (
      <div></div>
    );
  }
}

const setup = {
  desktop: {
    image: {maxWidth: '960px', maxHeight: '100%'},
    pagination: {top: '95%'},
    container: {flexDirection: 'row'},
    cardMedia: {height: '100%', width: 'calc(100% - 360px)'},
    cardContent: {height: '100%', width: '360px'},
  },
  mobile: {
    image: {maxWidth: '100%', maxHeight: '400px'},
    pagination: {top: '91%'},
    container: {flexDirection: 'column'},
    cardMedia: {height: '500px', width: '100%'},
    cardContent: {height: 'calc(100% - 500px)', width: '100%'},
  },
};

export default ViewItem;
