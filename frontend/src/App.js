import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import OTPVerify from './pages/OTPVerify';
import SignIn from './pages/login';
import  UserManagement  from "./pages/UserManagement";
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts'
import AccountManagement from './pages/AccountManagement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
    <Router>
      <div className='container'>
        <Routes>
          <Route path='/login' element={<SignIn/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/verifyotp' element={<OTPVerify/>}/>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/accounts' element={<Accounts/>}/>
          <Route path='/accountsmanagement' element={<AccountManagement/>}/>
          <Route path='/usermanagement' element={<UserManagement/>}/>
          <Route path='/reports' element={<></>}/>
        </Routes>
      </div>
    </Router>
    
    <ToastContainer />
    </>
  );
}

export default App;
