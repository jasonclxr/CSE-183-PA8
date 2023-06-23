import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Drawer from '@mui/material/Drawer';
import Context from '../context/Context';
import Toolbar from '@mui/material/Toolbar';
import {Box} from '@mui/system';
import Typography from '@mui/material/Typography';
import SearchBar from './Search';
import Divider from '@mui/material/Divider';
import CategoryList from '../resources/CategoryList';
import Crumbs from '../resources/Crumbs';
import FilterList from '../resources/FilterList';

const width = 360;

/**
 * @return {object} JSX
 */
function Sidebar() {
  const ctx = React.useContext(Context);
  if (ctx.isDesktop()) {
    const addFilters = ctx.selectedRootCat !== '' ? (
      <Box>
        <Divider sx={{mx: '15px', backgroundColor: '#ced0d4'}}/>
        <Typography variant='h5' sx={{
          color: 'black', mx: '15px', mt: '10px', mb: '-5px'}}>
          <b>Filters</b>
        </Typography>
        <FilterList />
      </Box>
    ) : (
      <div></div>
    );
    return (
      <Box>
        <Drawer variant="permanent" anchor="left" sx={{
          width: width,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {width: width, boxSizing: 'border-box'},
        }}>
          <Toolbar sx={{boxShadow: 3}}/>
          <List>
            <ListItem key='breadcrumbs'>
              <Crumbs />
            </ListItem>
            <ListItem key='searchbar'>
              <Box sx={{width: '100%'}}>
                <SearchBar />
              </Box>
            </ListItem>
          </List>
          {addFilters}
          <Divider sx={{mx: '15px', backgroundColor: '#ced0d4'}}/>
          <Typography variant='h5' sx={{
            color: 'black', mx: '15px', mt: '15px', mb: '-5px'}}>
            <b>Categories</b>
          </Typography>
          <CategoryList />
        </Drawer>
      </Box>
    );
  }
  return <div></div>;
}

export default Sidebar;
