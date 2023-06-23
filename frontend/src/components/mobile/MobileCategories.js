import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Divider, Toolbar} from '@mui/material';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Context from '../context/Context';
import CategoryList from '../resources/CategoryList';
import IconButton from '@mui/material/IconButton';

/**
 * @return {object} JSX
 */
function MobileCategories() {
  const ctx = React.useContext(Context);
  return (
    <Drawer
      aria-label='mobile categories drawer'
      anchor='bottom'
      open={ctx.viewCats}
      onClose={() => {
        ctx.toggleCats(false);
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <Box role='presentation'>
        <Toolbar>
          <Typography variant='h5' sx={{
            color: 'black',
            flexGrow: 1,
            textAlign: 'center',
          }}>
            Select Category
          </Typography>
          <IconButton aria-label='close mobile categories'
            sx={{bgcolor: '#e4e6eb'}} onClick={() => {
              ctx.toggleCats(false);
            }} >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Divider/>
        <CategoryList />
      </Box>
    </Drawer>
  );
}

export default MobileCategories;
