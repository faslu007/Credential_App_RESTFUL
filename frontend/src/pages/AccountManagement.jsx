import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { useNavigate } from 'react-router-dom'
import AddUserButton from '../components/UserManagementComponents/AddUserButton'
import { Button, Paper } from '@mui/material'
import AccountsTable from '../components/AccountsManagementComponents/AccountsTable'
import { getAllAccounts } from '../features/accountsManagement/accountsManagementSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'



const AccountManagement = () => {

  const dispatch = useDispatch()

  const { accounts } = useSelector((state) => state.accountsManagement)


  const { isLoading, isError, message } = useSelector(
    (state) => state.accountsManagement
  )



  useEffect(()=> {
    if(isError) {
      toast.error(message)
    }

    dispatch(getAllAccounts())
  },[]) 

  return (
    <>
        <SideBarAndHeader page='Accounts Management' />
        <AddUserButton/>

        <Paper 
        elevation='3'
        variant="contained"
        style={{ height: 'auto', width: 'auto', marginLeft: '240px', marginTop: '-610px', padding: '25px', }}
        >

          <AccountsTable/>

        </Paper>


    </>
  )
}

export default AccountManagement
