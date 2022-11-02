import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import PopUpForm from '../components/UserManagementComponents/PopUpForm'
import { Button, Paper } from '@mui/material'
import { getAllUsers, reset } from '../features/userManagement/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner';
import UserTable from '../components/UserManagementComponents/UserTable'
import { toast } from 'react-toastify'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';




const UserManagement = () => {

  const [openPopup, setOpenPopup] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

    if (!user) {
      navigate('/login')
    }



  const { isLoading, isError, message } = useSelector(
    (state) => state.users
  )




  useEffect(() => {
    if(isError){
      toast.error(message)
  }

    dispatch(getAllUsers())

    return () => {
      dispatch(reset())
    }
  }, [isError])

  if (isLoading) {
    return <Spinner />
  };    

  return (
    <div>
        <SideBarAndHeader page='User Management' />


      <Button color='primary' 
              variant='contained' 
              style={{left: 1320, marginTop: -630, position: 'fixed'}}
              onClick={()=> setOpenPopup(true)}
              >
                <PersonAddAltIcon style={{marginRight: 4}}/>

              Add User
      </Button>

      



      <Paper 
        elevation='3'
        variant="contained"
        style={{ height: 'auto', width: 'auto', marginLeft: '240px', marginTop: '-570px', padding: '25px', }}
        >
            <UserTable/>

        </Paper>

        <PopUpForm 
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title={'Create a new User'}
        >
        </PopUpForm>
    </div>
  )
}

export default UserManagement
