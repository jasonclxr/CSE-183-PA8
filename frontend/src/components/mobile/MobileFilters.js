import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {Divider, Toolbar} from '@mui/material';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Context from '../context/Context';
import FilterList from '../resources/FilterList';
import IconButton from '@mui/material/IconButton';
import {Button} from '@mui/material';
import {updateContent} from '../Fetch';

/**
 * @return {object} JSX
 */
function MobileFilters() {
  const ctx = React.useContext(Context);
  return (
    <Box>
      <Drawer
        aria-label='mobile filters drawer'
        anchor='bottom'
        open={ctx.viewFilters}
        onClose={() => {
          ctx.toggleFilters(false);
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Box sx={{height: '100vh'}} role='presentation'>
          <Toolbar>
            <Typography variant='h5' sx={{
              color: 'black',
              flexGrow: 1,
              textAlign: 'center',
            }}>
              Filters
            </Typography>
            <IconButton sx={{bgcolor: '#e4e6eb'}}
              aria-label='close mobile filters'
              onClick={() => {
                ctx.toggleFilters(false);
              }} >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider/>
          <FilterList />
          <Divider sx={{mx: '15px', width: 'calc(100% - 30px)'}}/>
          <Button variant="contained"
            sx={{
              textTransform: 'none',
              boxShadow: 0,
              mx: '15px',
              mt: '10px',
              width: 'calc(100% - 30px)',
            }}
            size='medium'
            color='info'
            aria-label='apply mobile filters'
            onClick={() => {
              updateContent(ctx, {
                openFilters: [],
                viewFilters: false,
                selectedFilters:
                  JSON.parse(JSON.stringify(ctx.selectedMobileFilters)),
              });
            }}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MobileFilters;
