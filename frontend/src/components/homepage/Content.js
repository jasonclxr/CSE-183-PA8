import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import Box from '@mui/material/Box';
import Context from '../context/Context';
import {getItem} from '../Fetch';

/**
 * @return {object} JSX
 */
function Content() {
  const ctx = React.useContext(Context);
  const margin = ctx.isDesktop() ? '-8px' : '';
  let width = ctx.dimensions.width;
  if (ctx.isDesktop()) {
    width -= 360 - 16;
  }
  const widths = {
    xs: 'calc(50% - 5px)',
    sm: 'calc(33.33% - 7px)',
    md: 'calc(50% - 7px)',
    lg: 'calc(33.33% - 7px)',
    xl: 'calc(25% - 8px)',
  };
  const heights = {
    xs: (width/2 - 10 - 6) + 'px',
    sm: (width/3 - 20 - 6) + 'px',
    md: (width/2 - 10 - 6) + 'px',
    lg: (width/3 - 20 - 6) + 'px',
    xl: (width/4 - 30 - 6) + 'px',
  };
  const titles = ctx.selectedRootCat === '' ? (
    <Typography variant='h5' mb='10px'>
      Today's picks
    </Typography>
  ) : (
    <div></div>
  );

  return (
    <Box mx={margin}>
      {titles}
      <Box display='flex' alignContent='flex-start' flexWrap='wrap'
        sx={{width: '100%', height: '100%'}} gap='10px'>
        {ctx.listings.map((data) => {
          return (
            <Box key={data.id} width={{...widths}}>
              <CardActionArea style={{borderRadius: 10}}
                aria-label={data.title + ' Listing'}
                onClick={async () => {
                  const info = await getItem(data.id);
                  if (info !== 404) {
                    ctx.setViewItem(info);
                  } else {
                    ctx.setState({viewError: true});
                  }
                }}>
                <CardMedia
                  sx={{height: heights}}
                  component="img"
                  image={data.imageURL}
                  alt={data.title}
                  style={{borderRadius: 10}}
                />
                <CardContent sx={{px: 1, py: 1}}>
                  <Typography variant='h5'>
                    {'$' + data.price.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    {data.title}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {data.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default Content;
