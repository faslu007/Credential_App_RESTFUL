import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { Button, Paper } from '@mui/material'
import AccountsTable from '../components/AccountsManagementComponents/AccountsTable'
import { getAllAccounts } from '../features/accountsManagement/accountsManagementSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';import PopUpForm from '../components/AccountsManagementComponents/CreateAccountPopup'
import Spinner from '../components/Spinner';


const AccountManagement = () => {

  const dispatch = useDispatch()

  const { accounts } = useSelector((state) => state.accountsManagement)


  const { isLoading, isError, message } = useSelector(
    (state) => state.accountsManagement
  )

  const [openPopup, setOpenPopup] = useState(false)



  useEffect(()=> {
    if(isError) {
      toast.error(message)
    }

    dispatch(getAllAccounts())
  },[]) 


  
  if (isLoading) {
    return <Spinner />
  };

  

  return (
    <>
        <SideBarAndHeader page='Accounts Management' />
        <Button color='primary' 
              variant='contained' 
              style={{left: 1320, marginTop: -630, position: 'fixed'}}
              onClick={()=> setOpenPopup(true)}
              >
                <CorporateFareIcon style={{marginRight: 4}}/>

              Add Account
      </Button>

        <Paper 
        elevation='3'
        variant="contained"
        style={{ height: 'auto', width: 'auto', marginLeft: '240px', marginTop: '-610px', padding: '25px', }}
        >

          <AccountsTable/>

        </Paper>

        <PopUpForm 
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title={'Create new Account'}
        >
        </PopUpForm>


    </>
  )
}

export default AccountManagement
