import { useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { register, reset }  from '../features/auth/authSlice'


function Register() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        password2: '',
        organization: '',
        team: '',
        designation: ''

      })
    
      const { firstName, lastName, email, phone, password, password2,
        organization, team, designation } = formData
    
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
          navigate('/verifyOTP')
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
    
        if (password !== password2) {
          toast.error('Passwords do not match')
        } else {
          const userData = {
            firstName, lastName, email, phone, password, password2,
        organization, team, designation
          }
    
          dispatch(register(userData))
        }
      }
    
      if (isLoading) {
        return <Spinner />
      }

    return (
    <>
        <section className='heading'>
            <h1>
                <FaUser/> Register
            </h1>
            <p>
                Please create an account!
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
                <input type="text" className='form-control' id='phone' 
                name='phone' value={phone} placeholder='Enter your phone' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='password' 
                name='password' value={password} placeholder='Enter your password' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='password2' 
                name='password2' value={password2} placeholder='Confirm Password' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='organization' 
                name='organization' value={organization} placeholder='Enter your organization' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='team' 
                name='team' value={team} placeholder='Enter your team' 
                onChange={onChange}/>
            </div>

            <div className="form-group">
                <input type="text" className='form-control' id='designation' 
                name='designation' value={designation} placeholder='Enter your designation' 
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

export default Register
