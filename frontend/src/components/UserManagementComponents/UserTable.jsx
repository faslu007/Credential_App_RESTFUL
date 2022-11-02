import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper  from '@mui/material/Paper';
import { Typography, Button, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import PopUpForm from './PopUpForm'
import makeStyles from "@material-ui/core/styles/makeStyles";



const UserTable = () => {

    const [openPopup, setOpenPopup] = useState(false)
    const [userForEdit, setUserForEdit] =useState(null)
    const { users } = useSelector((state) => state.users)

  const openInPopUp = user => {
        setOpenPopup(true)
        setUserForEdit({user: user})
  }

  const useStyles = makeStyles({
    tableContainer: {
      overflow: "initial"
    }
  });

  return (
    <div>
      <TableContainer  
        component={Paper} 
        style={{borderRadius: '10px', alignItems:'center',}}>
        <Table 
            
            sx={{ minWidth: 800, height: 'auto' }} 
            aria-label="User Table">
            <TableHead
            >
                <TableRow 
                style={{backgroundColor: '#6699CC', fontWeight: 'bold'}}>
                    <TableCell align="center">
                      <Grid container spacing={2} >
                        <Grid item xs={6}>
                          <GroupIcon fontSize='large' style={{marginLeft: '50px', color: 'white'}}/>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Users
                      </Typography>
                        </Grid>

                      </Grid>
                        
            </TableCell>
            <TableCell align="center">
            <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <EmailIcon fontSize='large' style={{marginLeft: '50px', color: 'white'}}/>
                        </Grid>

                        <Grid item xs={10}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Email
                      </Typography>
                        </Grid>

                      </Grid>
            </TableCell>
            <TableCell align="center">
            <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <Diversity3Icon fontSize='large' style={{marginLeft: '10px', color: 'white'}}/>
                        </Grid>

                        <Grid item xs={10}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Team
                      </Typography>
                        </Grid>

                      </Grid>


            </TableCell>
            <TableCell align="center">
            <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <BadgeIcon fontSize='large' style={{marginLeft: '10px', color: 'white'}}/>
                        </Grid>

                        <Grid item xs={10}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Designation
                      </Typography>
                        </Grid>

                      </Grid>

            </TableCell>
            <TableCell align="center">
            <Grid container spacing={2}>
                        <Grid item xs={2}>
                          <SupervisedUserCircleIcon fontSize='large' style={{marginLeft: '0px', color: 'white'}}/>
                        </Grid>

                        <Grid item xs={10}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Role
                      </Typography>
                        </Grid>

                      </Grid>

            </TableCell>
            <TableCell align="center">
            <Grid container spacing={2} style={{marginLeft: '0px', color: 'white'}}>
                        <Grid item xs={2}>
                          <EditIcon fontSize='large' />
                        </Grid>

                        <Grid item xs={10}>
                          <Typography color='#fafafa' variant='h6'>
                          
                          Edit
                      </Typography>
                        </Grid>

                      </Grid>

            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody >
          {users.map((user) => (
            <TableRow
              hover
              key={users.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row">
                {`${user.firstName} ${user.lastName}  `} 
                
            {user.pendingVerication && 
              <Typography variant='string' fontSize={10} style={{backgroundColor: '#AEAEAE', borderRadius: '10px', padding: '5px'}}>
            Verification Pending
            </Typography>
            }


                
              </TableCell>
              <TableCell align="center">{user.email}</TableCell>
              <TableCell align="center">{user.team}</TableCell>
              <TableCell align="center">{user.designation}</TableCell>
              <TableCell align="center">{user.role}</TableCell>
              <TableCell align="center">
                <Button
                  disabled={user.pendingVerication ? true : false}
                  onClick={()=> {openInPopUp(user)}}
                >
                <EditIcon/>
                </Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

        <PopUpForm 
                  userForEdit={userForEdit}
                  openPopup={openPopup}
                  setOpenPopup={setOpenPopup}
                  title={'Edit User Profile'}
                  >
        </PopUpForm>

    </div>
  )
}

export default UserTable
