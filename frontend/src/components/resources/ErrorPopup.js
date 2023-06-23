import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Context from '../context/Context';
import {Button} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  maxWidth: '80%',
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 3,
};

/**
 * @return {Object}
 */
export default function BasicModal() {
  const ctx = React.useContext(Context);
  const handleClose = () => ctx.setState({viewError: false});
  return (
    <Modal
      open={ctx.viewError}
      aria-label='error window'
    >
      <Box sx={style}>
        <Typography variant="h3" component="h2">
          Oops!
        </Typography>
        <Typography sx={{mt: 1}}>
          Looks like there was an error. Try again.
        </Typography>
        <Button
          aria-label='close error window'
          sx={{
            textTransform: 'none',
            boxShadow: 0,
            width: '100%',
            pt: '10px',
          }}
          size='medium'
          color='info'
          onClick={handleClose}>
          OK
        </Button>
      </Box>
    </Modal>
  );
}
