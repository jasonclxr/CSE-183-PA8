import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Context from '../context/Context';
import {postReply, getReplies} from '../Fetch';

let replies = [];
let counter = 0;

/**
 * @return {*} Replies to this given post
 */
export default function Replies() {
  const [data, setdata] = React.useState({
    message: '',
  });
  const ctx = React.useContext(Context);
  replies = ctx.currentReplies;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (data.message.length > 0) {
      postReply(ctx.itemBeingViewed.id, data.message);
      await ctx.setCurrentReplies(await getReplies(ctx.itemBeingViewed.id));
    }
  };

  return (
    <div>
      <nav aria-label="replies">
        <List style={{overflow: 'auto', maxHeight: '30vh'}}>
          {replies.map((reply) => {
            counter += 1;
            return (
              <ListItem key={'reply' + counter}>
                <ListItemText
                  secondary={`${reply.name.first} ${
                    reply.name.last
                  }, ${handleDate(reply.messagedate)}`}
                  primary={`${reply.message}`}
                />
              </ListItem>
            );
          })}
        </List>
      </nav>
      <form onSubmit={onSubmit}>
        <TextField
          aria-label="write message"
          placeholder="Send Reply"
          helperText={'Please enter a message'}
          variant="filled"
          sx={{
            paddingLeft: '15px',
            paddingTop: '10px',
            paddingBottom: '8px',
            minWidth: '140px',
            maxWidth: '600px',
            float: 'left',
          }}
          onChange={(event) => setdata({message: event.target.value})}
          inputProps={{'data-testid': 'write message'}}
        />
        <Button
          variant="contained"
          sx={{
            'fontSize': '13px',
            'margin': 'auto',
            'display': 'flex',
            'float': 'left',
            'marginTop': '30px',
            'backgroundColor': '#1976d2',
            '&:hover': {
              backgroundColor: '#1976da',
            },
          }}
          type="submit"
          aria-label="send message"
        >
          Send
        </Button>
      </form>
    </div>
  );
}

/**
 * @param {*} date when the email was received
 * @return {*} a string denoting the date
 */
function handleDate(date) {
  const today = new Date();
  const compDate = new Date(date);
  const lastYear = new Date();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  lastYear.setFullYear(today.getFullYear() - 1);
  if (
    today.getMonth() === compDate.getMonth() &&
    today.getFullYear() === compDate.getFullYear() &&
    today.getDate() === compDate.getDate()
  ) {
    // This formatting is from:
    // https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    return (
      ('0' + compDate.getHours()).slice(-2) +
      ':' +
      ('0' + compDate.getMinutes()).slice(-2)
    );
  } else if (compDate > lastYear) {
    const returnDate =
      compDate.getDate() < 10 ? '0' + compDate.getDate() : compDate.getDate();
    return months[compDate.getMonth()] + ' ' + returnDate;
  } else {
    return compDate.getFullYear();
  }
}
