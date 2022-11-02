import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SummarizeIcon from '@mui/icons-material/Summarize';


let  thisPage;




export const mainListItems = (


  <React.Fragment >
    <ListItemButton style={thisPage === 'Dashboard' ? {backgroundColor: "#D8D8D8"} : null}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
        <div className='logo'>
            <Link to='/' style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <ListItemText primary="Dashboard" />
            </Link>            
        </div>      
    </ListItemButton>

    <ListItemButton style={thisPage === 'Accounts' ? {backgroundColor: "#D8D8D8"} : null}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
        <div className='logo'>
            <Link to='/accounts' style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <ListItemText primary="Accounts" />
            </Link>            
        </div>      
    </ListItemButton>

    <ListItemButton  style={thisPage === 'Account Management' ? {backgroundColor: "#D8D8D8"} : null}>
      <ListItemIcon>
        <ApartmentIcon />
      </ListItemIcon>
        <div className='logo'>
            <Link to='/accountsmanagement' style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <ListItemText primary="Account Management" />
               </Link>            
        </div>      
    </ListItemButton>

    <ListItemButton style={thisPage === 'User Management' ? {backgroundColor: "#D8D8D8"} : null}>
      <ListItemIcon>
        <SupervisedUserCircleIcon />
      </ListItemIcon>
        <div className='logo'>
            <Link to='/usermanagement' style={{ color: 'inherit', textDecoration: 'inherit'}} onClick={()=> {}}>
            <ListItemText primary="User Management" />
               </Link>            
        </div>      
    </ListItemButton>

    <ListItemButton style={thisPage === 'Reports' ? {backgroundColor: "#D8D8D8"} : null}>
      <ListItemIcon>
        <SummarizeIcon />
      </ListItemIcon>
        <div className='logo'>
            <Link to='/' style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <ListItemText primary="Reports" />
               </Link>            
        </div>      
    </ListItemButton>

    
    
  </React.Fragment>
);
