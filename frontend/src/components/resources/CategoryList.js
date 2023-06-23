import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {ListItemAvatar, Avatar} from '@mui/material';
import Typography from '@mui/material/Typography';
import Context from '../context/Context';
import {setRootCategory, getItems} from '../Fetch';

/**
 * @param {object} props
 * @return {object} JSX
 */
function CategoryList(props) {
  const ctx = React.useContext(Context);
  return (
    <List dense {...props} sx={{mx: '10px'}}>
      {ctx.rootCategories.map((data) => (
        <ListItem button key={data} style={{borderRadius: 10}}
          onClick={async () => {
            const elems = await setRootCategory(data);
            const items = await getItems({...ctx, ...elems});
            if (elems !== 404 && items !== 404) {
              elems.viewCats = false;
              elems.listings = items;
              ctx.setState(elems);
            } else {
              ctx.setState({viewError: true});
            }
          }}
          aria-label={data + ' Root Category'}>
          <ListItemAvatar sx={{ml: '-10px'}}>
            <Avatar sx={{bgcolor: '#e4e6eb'}}>
              <HelpOutlineIcon sx={{fill: '#1d1f23'}}/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={
            <Typography variant='h6'>
              {data}
            </Typography>
          } />
        </ListItem>
      ))}
    </List>
  );
}

export default CategoryList;
