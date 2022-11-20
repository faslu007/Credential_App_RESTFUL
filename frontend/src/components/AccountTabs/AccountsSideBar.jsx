


import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';import DraftsIcon from '@mui/icons-material/Drafts';
import { FixedSizeList } from 'react-window';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

import { useSelector, useDispatch } from 'react-redux'



const AccountsSideBar = () => {

    const { accounts } = useSelector((state) => state.accountsList)


  return (
    <div>



<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      style={{maxHeight: 600, overflow: 'auto'}}>
      <nav aria-label="main mailbox folders">
        <List style={{maxHeight: '100%', overflow: 'auto'}}>

            {accounts.map((account) => (
                <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {account.accountType === 'Facility' ? <CorporateFareIcon color="primary" /> : <LocalHospitalIcon color="primary"/> }
                  </ListItemIcon>
                  <ListItemText  
                  primaryTypographyProps={{fontSize: '12px',}}
                  > {account.accountName} </ListItemText>
                </ListItemButton>


                {/* <ListItemButton>
                  <ListItemIcon>
                    {account.accountType === 'Facility' ? <CorporateFareIcon color="primary" /> : <LocalHospitalIcon color="primary"/> }
                  </ListItemIcon>
                  <ListItemText  
                  primaryTypographyProps={{fontSize: '12px',}}
                  > {account.accountName} </ListItemText>
                </ListItemButton> */}

              </ListItem>

            ))}

        </List>
      </nav>
      <Divider />

    </Box>
      
    </div>
  )
}

export default AccountsSideBar
