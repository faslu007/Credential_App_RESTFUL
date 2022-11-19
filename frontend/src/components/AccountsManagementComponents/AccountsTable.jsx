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
import makeStyles from "@material-ui/core/styles/makeStyles";



const AccountsTable = () => {

  const { accounts } = useSelector((state) => state.accountsManagement)


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
                          
                          Account
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
                          
                          Contact
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
                          
                          Type
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
                          
                          Manage User
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
                          
                          Manage Provider
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

      
  

        {accounts.map((account) => (
          
        

          <TableRow
          hover
          key={account.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell align="center">
              {account.accountName} 
          
          </TableCell>

          <TableCell align="center">{account.active ? 
            <Typography style={{backgroundColor: 'green', borderRadius: '5px'}}> Active </Typography> : <Typography style={{backgroundColor: 'grey', borderRadius: '5px'}}>In-active</Typography> }</TableCell>

          <TableCell align="center">{account.accountType}</TableCell>
         
          <TableCell align="center"><EditIcon/></TableCell>
          <TableCell align="center"><EditIcon/></TableCell>
          <TableCell align="center"><EditIcon/></TableCell>
        </TableRow>
        ))}   

        </TableBody>
      </Table>
    </TableContainer>



    </div>
  )
}

export default AccountsTable
