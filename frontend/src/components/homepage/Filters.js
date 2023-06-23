import React from 'react';
import Context from '../context/Context';
import {Button} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {Box} from '@mui/system';
import RoomIcon from '@mui/icons-material/Room';

/**
 * @param {object} props
 * @return {object} JSX
 */
function Filters(props) {
  const ctx = React.useContext(Context);
  return !ctx.isDesktop() && ctx.selectedRootCat !== '' ? (
    <Box {...props} display='flex' flexDirection='row' gap='5px' >
      <Button variant="contained"
        sx={{
          textTransform: 'none',
          boxShadow: 0,
        }}
        size='medium'
        color='info'
        aria-label='open location filter mobile'
        startIcon={<RoomIcon />}>
        Santa Cruz • 40 mi
      </Button>
      <Button variant="contained"
        sx={{
          textTransform: 'none',
          boxShadow: 0,
        }}
        size='medium'
        color='info'
        aria-label='open filters mobile'
        onClick={() => {
          ctx.setState({
            viewFilters: true,
            selectedMobileFilters:
              JSON.parse(JSON.stringify(ctx.selectedFilters)),
          });
        }}
        startIcon={<FilterListIcon />}>
        Filters
      </Button>
    </Box>
  ) : (
    <div></div>
  );
}

export default Filters;
