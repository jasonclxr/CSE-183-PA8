import * as React from 'react';
import List from '@mui/material/List';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import Context from '../context/Context';
import {Box} from '@mui/system';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {ListItem} from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {updateContent} from '../Fetch';

/**
 * @param {object} props
 * @return {object} JSX
 */
function FilterList(props) {
  const ctx = React.useContext(Context);
  const get = ctx.viewFilters ? 'selectedMobileFilters' :
    'selectedFilters';
  return (
    <List dense {...props} sx={{mx: '10px'}}>
      {
        Object.keys(ctx.filters).sort((a, b) => {
          return ctx.filters[a].order - ctx.filters[b].order;
        }).map((key) => {
          const data = ctx.filters[key];
          if (data.type === 'oneOf' || data.type === 'anyOf') {
            const buttonStyle = data.type === 'oneOf' ? ({
              icon: (<RadioButtonUncheckedIcon />),
              checkedIcon: (<RadioButtonCheckedIcon />),
            }) : ({});
            return (
              <Box key={key}>
                <ListItemButton style={{borderRadius: 10}}
                  aria-label={key + ' Filter'}
                  onClick={() => {
                    ctx.handleOpenFilter(key);
                  }}
                  sx={{py: '10px'}}>
                  <ListItemText primary={
                    <Typography variant='h6'>
                      {key}
                    </Typography>
                  } />
                  {ctx.openFilters[key] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={ctx.openFilters[key]} timeout="auto"
                  unmountOnExit>
                  <List dense disablePadding sx={{ml: '15px'}}>
                    {data.options.map((option) => {
                      const open = !!ctx[get][key] &&
                      !!ctx[get][key][option];
                      return (
                        <ListItemButton key={option}
                          aria-label={option + ' Option'}
                          sx={{pl: 4}} onClick={() => {
                            const newContext = ctx.handleSelectedFilter(
                              option,
                              key,
                              data.type,
                              null,
                            );
                            if (ctx.isDesktop()) {
                              updateContent(ctx, newContext);
                            } else {
                              ctx.setState(newContext);
                            }
                          }} style={{borderRadius: 10}}>
                          <ListItemText primary={
                            <Typography variant='h6'>
                              {option}
                            </Typography>
                          } />
                          <ListItemIcon>
                            <Checkbox
                              edge="end"
                              {...buttonStyle}
                              checked={open}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          } else if (data.type === 'minMax') {
            let min = '';
            let max = '';
            if (ctx[get][key]) {
              if (ctx[get][key].min) {
                min = ctx[get][key].min;
              }
              if (ctx[get][key].max) {
                max = ctx[get][key].max;
              }
            }
            return (
              <ListItem key={key}>
                <ListItemText disableTypography sx={{mb: '-2px'}}
                  secondary={
                    <Box sx={{pt: '4px', display: 'inline-flex'}}>
                      <TextField
                        label="Min"
                        defaultValue={min}
                        variant="outlined"
                        size="small"
                        type="number"
                        sx={{width: '45%'}}
                        inputProps={{
                          'inputMode': 'numeric',
                          'pattern': '[0-9]*',
                          'aria-label': key + ' Min',
                        }}
                        onChange={async (event) => {
                          const newContext = ctx.handleSelectedFilter(
                            'min',
                            key,
                            data.type,
                            event.target.value,
                          );
                          if (ctx.isDesktop()) {
                            updateContent(ctx, newContext);
                          } else {
                            ctx.setState(newContext);
                          }
                        }}
                      />
                      <ListItemText sx={{
                        color:
                      '#1d1f23',
                        textAlign: 'center',
                        pt: '5px',
                      }}>
                      to
                      </ListItemText>
                      <TextField
                        label="Max"
                        defaultValue={max}
                        variant="outlined"
                        size="small"
                        type="number"
                        sx={{width: '45%'}}
                        inputProps={{
                          'inputMode': 'numeric',
                          'pattern': '[0-9]*',
                          'aria-label': key + ' Max',
                        }}
                        onChange={async (event) => {
                          const newContext = ctx.handleSelectedFilter(
                            'max',
                            key,
                            data.type,
                            event.target.value,
                          );
                          if (ctx.isDesktop()) {
                            updateContent(ctx, newContext);
                          } else {
                            ctx.setState(newContext);
                          }
                        }}
                      />
                    </Box>
                  }>
                  <Typography variant='h6'>
                    {key}
                  </Typography>
                </ListItemText>
              </ListItem>
            );
          }
          return (<div key={key}></div>);
        })}
    </List>
  );
}

export default FilterList;
