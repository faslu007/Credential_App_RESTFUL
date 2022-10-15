import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {toast} from 'react-toastify' 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from '../components/Spinner'

import {login, reset} from '../features/auth/authSlice'


function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData;

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.auth)

    useEffect(()=> {
      if (isError) {
        toast.error(message)
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
    const userData = {
      email, password
    }
    dispatch(login(userData))
  }


  if (isLoading) {
    return <Spinner/>
  }



  return ( <> 

    <section className='heading'>

    <div className="row">

      <div className="col-4"></div>
      <div className="col-4 border border-primary rounded border-dark p-3 mt-5 bg-muted ">
      <h1>
         Login
      </h1>
      <p className='loginText'>Please Enter Credentials to Login</p>
      <form onSubmit={onSubmit}> 

      <Form.Group className="mb-3 col-10" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name='email' value={email}  placeholder="enter your email" onChange={onChange} />
      </Form.Group>

      <Form.Group className="mb-3 col-10" controlId="exampleForm.ControlInput1">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name='password' value={password}  placeholder="enter password" onChange={onChange} />
      </Form.Group>

      <Button variant="primary" type='submit' >Login</Button>{' '}


      {/* <div className="form-group">
      <input type="email" className='formControl ' id='email' name='email' value={email} 
        placeholder='enter your email' onChange={onChange}/>
      </div> */}

      {/* <div className="form-group">
      <input type="password" className='formControl' id='password' name='password' value={password} 
        placeholder='enter a password' onChange={onChange}/>
      </div> */}

      {/* <div className="form-group">
        <button type='submit' className='btn btn-block'>Login</button>
      </div> */}

        
      </form>
      </div>

    

      <div className="col-4"></div>
    </div>




      

      
    </section>
   
   
   </>
  )
}

export default Login
