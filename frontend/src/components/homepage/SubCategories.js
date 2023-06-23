import * as React from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '../resources/Crumbs';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {RoundButton} from '../resources/Styles';
import Context from '../context/Context';
import {setSubCategory, getItems} from '../Fetch';

const flexContainer = {
  display: 'flex',
  flexDirection: 'row',
  mt: '10px',
  mb: '0px',
};
const sx = {
  m: -1,
  my: '15px',
  borderColor: 'black',
  boxShadow: 0,
};

/**
 * @return {object} JSX
 */
function SubCategories() {
  const ctx = React.useContext(Context);
  if (!ctx.isDesktop()) {
    let cats = [];
    if (ctx.selectedRootCat !== '') {
      cats = ctx.subCategories;
    } else {
      cats = ['All Categories'];
    }
    return (
      <Box>
        <Breadcrumbs />
        <Box sx={{...flexContainer, overflow: 'auto'}}>
          {cats.map((text) => {
            return (
              <RoundButton
                key={text}
                aria-label={text + ' Subcategory'}
                onClick={async () => {
                  if (ctx.selectedRootCat !== '') {
                    const elems = await setSubCategory(ctx, text);
                    const items = await getItems({...ctx, ...elems});
                    if (elems !== 404 && items !== 404) {
                      elems.listings = items;
                      ctx.setState(elems);
                    } else {
                      ctx.setState({viewError: true});
                    }
                  } else {
                    ctx.toggleCats(true);
                  }
                }}>{text}</RoundButton>
            );
          })}
        </Box>
      </Box>
    );
  } else if (ctx.selectedRootCat !== '' && ctx.subCategories.length !== 0) {
    return (
      <Card square={true} sx={sx} style={{borderRadius: 10}}>
        <CardContent>
          <Typography variant='h5' sx={{mb: 0.5}}>
            Shop by Category
          </Typography>
        </CardContent>
        <CardActions>
          <Box sx={{...flexContainer, mt: '-10px', flexWrap: 'wrap'}}>
            {ctx.subCategories.map((text) => {
              return (
                <RoundButton
                  key={text}
                  aria-label={text + ' Subcategory'}
                  onClick={async () => {
                    const elems = await setSubCategory(ctx, text);
                    const items = await getItems({...ctx, ...elems});
                    if (elems !== 404 && items !== 404) {
                      elems.listings = items;
                      ctx.setState(elems);
                    } else {
                      ctx.setState({viewError: true});
                    }
                  }}>
                  {text}
                </RoundButton>
              );
            })}
          </Box>
        </CardActions>
      </Card>
    );
  } else {
    return <div></div>;
  }
}

export default SubCategories;
