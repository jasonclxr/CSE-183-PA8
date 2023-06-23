import * as React from 'react';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import {WhiteButton} from './Styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Context from '../context/Context';
import Box from '@mui/material/Box';
import {popToCategory, getItems} from '../Fetch';

/**
 * @param {*} props
 * @return {object} JSX
 */
function Crumbs(props) {
  const ctx = React.useContext(Context);
  const items = ['Marketplace'];
  if (ctx.selectedRootCat !== '') {
    items.push(ctx.selectedRootCat, ...ctx.selectedSubCats);
  }
  const breadcrumbs = items.map((elem, i) => {
    if (i + 1 === items.length ) {
      return (
        <div key={i+1} aria-label={elem + ' CrumbText'}>
          <Typography color="text.secondary" fontSize={14}>
            {elem}
          </Typography>
        </div>
      );
    } else {
      // dont forget to handle the click
      return (
        <Link underline="hover" key={i+1}
          color="text.secondary" fontSize={14}
          aria-label={elem + ' Crumb'}
          role="alert"
          onClick={async () => {
            const elems = await popToCategory(ctx, elem);
            const items = await getItems({...ctx, ...elems});
            if (elems !== 404 && items !== 404) {
              elems.listings = items;
              ctx.setState(elems);
            } else {
              ctx.setState({viewError: true});
            }
          }}>
          {elem}
        </Link>
      );
    }
  });
  const button = ctx.isDesktop() ? (
    <div aria-label={items[items.length - 1] + ' Title'}>
      <Typography variant='h5'
        sx={{lineHeight: 1.2, fontSize: 24, p: '0px'}}>
        <b>{items[items.length - 1]}</b>
      </Typography>
    </div>
  ) : (
    ctx.selectedRootCat === '' ? (<div></div>) : (
      <WhiteButton size='large' variant="h5"
        aria-label={items[items.length - 1] + ' Crumb Category'}
        endIcon={<ArrowDropDownCircleIcon />}
        sx={{lineHeight: 1.2, fontSize: 24, p: '0px'}}
        onClick={() => {
          ctx.toggleCats(true);
        }}>
        <b>{items[items.length - 1]}</b>
      </WhiteButton>
    )
  );
  const crumbs = (ctx.selectedRootCat === '' ? (<div></div>) : (
    <Breadcrumbs mb='-4px' separator="›" aria-label="breadcrumb">
      {breadcrumbs}
    </Breadcrumbs>
  ));
  return (
    <Box {...props}>
      {crumbs}
      {button}
    </Box>
  );
}

export default Crumbs;
