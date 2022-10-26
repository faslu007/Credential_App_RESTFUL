import { useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { verifyOPT, reset }  from '../features/auth/authSlice'


function OTPVerify() {
    console.log('loginnnnn')

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        otp: '',


      })
    
      const { firstName, lastName, email, otp } = formData
    
      const navigate = useNavigate()
      const dispatch = useDispatch()
    
      const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
      )
    
      useEffect(() => {
        if (isError) {
          toast.error(message)
        }
    
        if (isSuccess || user) {
          navigate('/')
        }
    
        dispatch(reset())
      }, [user, isError, isSuccess, message, navigate, dispatch])
    
      const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
      }
    
      const onSubmit = (e) => {
        e.preventDefault()
    
        if (!firstName || !lastName || !otp) {
          toast.error('Passwords all all the fields')
        } else {
          const userData = {
            firstName, lastName, email, otp
          }
    
          dispatch(verifyOPT(userData))
        }
      }
    
      if (isLoading) {
        return <Spinner />
      }

    return (
    <>
        <section className='heading'>
            <h1>
                <FaUser/> Verify OTP
            </h1>
            <p>
                Verify your email with the OTP recieved!
            </p>
        </section>

        <section className='form'>
           
        <form onSubmit={onSubmit}> 
            <div className="form-group">
            
                <input type="text" className='form-control' id='firstName' 
                name='firstName' value={firstName} placeholder='Enter your First Name' 
                onChange={onChange}/>
            
            </div>

            <div className="form-group">
           
                <input type="text" className='form-control' id='lastName' 
                name='lastName' value={lastName} placeholder='Enter your Last Name' 
                onChange={onChange}/>
            
            </div>


            <div className="form-group">
                <input type="text" className='form-control' id='email' 
                name='email' value={email} placeholder='Enter your email' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='otp' 
                name='otp' value={otp} placeholder='Enter your phone' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <button type='submit' className='btn btn-block'> Register</button>
            </div>
        </form>

        <div style={{height: 10}}></div>
            

        </section>
    </>
  )
}

export default OTPVerify
