import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '../components/Sidebar'
import CreateAccountForm from '../components/CreateAccountForm'


function AccountsManagement() {

    // const [formData, setFormData] = useState({
    //     accountName: '',
    //     accountType: '',
    //     assignedUsers: [],
    //   })
    
    // const { accountName, accountType, assignedUsers } = formData;

    // const dispatch = useDispatch()
   

    // const {account, isLoading, isError, isSuccess, message} = useSelector(
    //     (state) => state.account)
    


        const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth )
  
    useEffect(() =>{
      if(!user) {
        navigate ('/login')
        
      }
    },  [user, navigate])
  
    return (
        <>
        <Sidebar/>

        <CreateAccountForm />
       
      
        </>
     
    )
  }
  
  export default AccountsManagement