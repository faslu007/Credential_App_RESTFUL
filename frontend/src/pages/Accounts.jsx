import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import { useState, useEffect } from 'react';
import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { getAllAccounts, reset } from '../features/getAccountsForSidBar/getAccountsForSidBarSlices'
import { useSelector, useDispatch } from 'react-redux'

import AccountsSideBar from '../components/AccountTabs/AccountsSideBar'



const Accounts = () => {


  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(getAllAccounts())
    return () => {
      dispatch(reset())
    }
  }, [])





    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));

  return (

    <>

    <div>
        <SideBarAndHeader page='Account' />

        <div style={{marginTop: '-650px', marginLeft: '17%'  ,width: '82%', backgroundColor: '#E7EBF0', padding: '3px', position: 'fixed'}}>
          <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
          <Grid item xs={2}>
            <Item>

              <AccountsSideBar/>
            </Item>
          </Grid>
          <Grid item xs={10}>
            <Item>xs=4</Item>
          </Grid>
        </Grid>
      </Box>

        </div>
    </div>
    </>
   
  )
}

export default Accounts
