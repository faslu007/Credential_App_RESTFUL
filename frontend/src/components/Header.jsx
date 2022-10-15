
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import {Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {logout, reset } from '../features/auth/authSlice'


function Header() {

  const navigate = useNavigate()
  const dispatch =useDispatch()
  const {user} = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (

    <>
    <header className='p-3 text-bg-dark rounded'>
      <div className='container'>
        <div className='d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start'>
          <div className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none'>
          <Link className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none' to='/'>  Credential-Pro </Link>

          <div className="text-end ms-5">
            <button type="button" className="btn btn-outline-light me-2">Login</button>
            <button type="button" className="btn btn-warning">Sign-up</button>
          </div>
          
          </div>

        </div>
        
      </div>

    </header>
    </>
    // <Navbar bg="light" expand="lg">
    //   <Container>
    //     <Navbar.Brand>
    //     <div Variant="float-right text-decoration-none">
    //           <Link  style={{textDecoration: 'none'}} to='/' className='text-dark bg-info rounded p-1'>  Credential-Pro </Link>
    //        </div>
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />

    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav variant="me-auto text-decoration-none">

    //         <div variant="float-end text-decoration-none font-weight-bold">
    //           <Link style={{textDecoration: 'none'}} className='ms-5 headerLinks' to='/'>  Login </Link>
    //        </div>

    //        <div variant="float-end text-decoration-none font-weight-bold">
    //           <Link style={{textDecoration: 'none'}} className='ms-3 headerLinks' to='/register'>  Register </Link>
    //        </div>
            

            
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>

    // <header className="header">
    //     <div className="logo">
    //         <Link to='/'>  Credential-Pro </Link>
    //     </div>

    //     <div>
    //       {user ? (<p id="headerUserName">{user.name}</p>) : null}
    //     </div>
    //     <ul>
    //       {user ? (<li>
    //         <button className="btn" onClick={onLogout}> <FaSignInAlt/> LogOut</button>
               
    //         </li>
            
    //         ) : (<><li>
    //         <Link to='/login'>
    //         <FaSignInAlt/>  Login </Link>
    //         </li>
    //         <li>
    //         <Link to='/register'>
    //         <FaUserAlt/> Register </Link>
    //         </li> </>)}
            
    //     </ul>
    // </header>
  )
}

export default Header
