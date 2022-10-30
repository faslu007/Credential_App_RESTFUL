import {Dialog, 
        DialogTitle, 
        DialogContent,
        Paper,
        Button,
        Typography,
        Grid,
        Box } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';


import AddUserForm from './Form'

const PopUpForm = (props) => {

    
    const { openPopup, setOpenPopup, userForEdit} = props
    
    return (
    <Dialog  BackdropProps={{style: {backgroundColor: 'transparent'}}}
    open={openPopup}
    
    PaperProps={{
        sx: {
          m: 0,
          top: -60,
          left: 0
        }
      }}>

        <DialogTitle>
            <Paper  elevation={4} sx={{  mt: 2 }}>            
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1} sx={{  p: 1 }} direction='row'>
                        <Grid item xs={2}>
                            <PersonAddIcon sx={{  ml: 4 }}
                                color='primary' 
                                fontSize='large' 
                                style={{marginTop: -3}}/>
                        </Grid>

                    <Grid item xs={8}>
                        <Typography 
                            variant='h5'> 
                                {props.title}
                        </Typography>
                    </Grid>

                    <Grid item xs={2}>
                        <Button
                            variant='outlined'
                            onClick={()=>{setOpenPopup(false)}}>
                            <CloseIcon/>
                        </Button>
                    </Grid>
                    </Grid>
                </Box>
            </Paper>
        </DialogTitle>

        <DialogContent style={{marginTop: '0px'}}>

            <AddUserForm userForEdit={userForEdit}/>

        </DialogContent>
    </Dialog>
  )
}

export default PopUpForm
