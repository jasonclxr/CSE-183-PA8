import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Context from '../context/Context';
import {getItems} from '../Fetch';

/**
 * @param {object} props
 * @return {object} JSX
 */
function Content(props) {
  const ctx = React.useContext(Context);
  return (
    <Box {...props}>
      <TextField
        sx={{width: '100%'}}
        label='Search Marketplace'
        variant='filled'
        defaultValue={ctx.searchInput}
        onChange={async (event) => {
          const elems = {searchInput: event.target.value};
          const items = await getItems({...ctx, ...elems});
          if (items !== 404) {
            elems.listings = items;
            ctx.setState(elems);
          } else {
            ctx.setState({viewError: true});
          }
        }}
        inputProps={{
          'aria-label': 'search bar',
        }}
        InputProps={{
          type: 'search',
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default Content;
