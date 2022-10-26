import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link} from 'react-router-dom'


function Header() {
  return (
    <div className='header'>
        <div className='logo'>
            <Link to='/'> Dashboard </Link>            
        </div>

        <ul>
            <li>
                <FaSignInAlt/>
                <Link to='/login'>Login </Link>
            </li>
            <li>
                <FaUser/>
                <Link to='/register'>Register </Link>
            </li>
        </ul>
      
    </div>
  )
}

export default Header
