import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify' 
import {FaSignInAlt,} from 'react-icons/fa'
import {verifyOTP, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'




function VerifyOTP() {

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    otp: ''
  })

  const { email, name, otp } = formData;

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth)

    useEffect(()=> {
      if (isError) {
        toast.error(message)
        navigate('/verifyOPT')
      }
      if (isSuccess) {
        navigate('/')
      }
      dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])
  

  const onChange = (e) => 
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))



  const onSubmit = (e) => {
    e.preventDefault()
    
    if (!name || !email ||!otp) {
      toast.error('please add all the fields')
    } else {
      const otpInfo = {
        name, email, otp
      }
      console.log(verifyOTP)
      dispatch(verifyOTP(otpInfo))
    }
   
  }


  if (isLoading) {
    return <Spinner/>
  }



  return ( <> 

    <section className='heading'>
      <h1>
        <FaSignInAlt/> Login
      </h1>
      <p>Please Enter OTP Recieved to your email</p>

      <form onSubmit={onSubmit}> 

   

      <div className="form-group">
      <input type="text" className='formControl' id='name' name='name' value={name} 
        placeholder='Enter your name' onChange={onChange}/>
      </div>  
      
      <div className="form-group">
      <input type="email" className='formControl' id='email' name='email' value={email} 
        placeholder='enter your email' onChange={onChange}/>
      </div>
      
      <div className="form-group">
      <input type="number" className='formControl' id='otp' name='otp' value={otp} 
        placeholder='enter otp recieved to email' onChange={onChange}/>
      </div>

      <div className="form-group">
        <button type='submit' className='btn btn-block'>Verify OTP</button>
      </div>

        
      </form>
    </section>
   
   
   </>
  )
}

export default VerifyOTP