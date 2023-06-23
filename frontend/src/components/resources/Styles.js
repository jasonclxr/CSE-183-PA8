import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import {grey} from '@mui/material/colors';
import Pagination from '@mui/material/Pagination';

const WhiteBase = styled(Button)(({theme}) => ({
  'color': theme.palette.getContrastText(grey[50]),
  'backgroundColor': grey[50],
  '&:hover': {
    backgroundColor: grey[400],
  },
  'textTransform': 'none',
  'boxShadow': 0,
}));

const RoundBase = styled(Button)(({theme}) => ({
  'color': theme.palette.getContrastText(grey[300]),
  'backgroundColor': grey[300],
  '&:hover': {
    backgroundColor: grey[500],
  },
  'textTransform': 'none',
  'boxShadow': 0,
  'borderRadius': 45,
}));

const WhitePagination = styled(Pagination)(({theme}) => ({
  '& .MuiPaginationItem-root': {
    backgroundColor: '#c7c7c7',
  },
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: 'white',
  },
  '& .MuiPaginationItem-root.Mui-selected': {
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'black',
  },
  '& .MuiPaginationItem-root.Mui-selected:hover': {
    backgroundColor: '#e0e0e0',
  },
  '& .MuiPaginationItem-ellipsis': {
    backgroundColor: '#e4e6eb',
    zIndex: 10000,
  },
}));

export {WhitePagination};

export const WhiteButton = (props) => {
  return (
    <WhiteBase {...props} />
  );
};

export const RoundButton = (props) => {
  return (
    <RoundBase {...props} sx={{
      mb: '10px',
      mx: '3px',
      display: 'flex',
      flexShrink: 0,
    }}/>
  );
};
