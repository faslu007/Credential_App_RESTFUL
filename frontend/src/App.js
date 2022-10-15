import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/dashboard';
import Register from './pages/register'
import VerifyOTP from './pages/verifyOTP'
import Login from './pages/login'
import AccountsManagement from './pages/accountsManagement'
import Header from './components/Header';


function App() {
  return (
    <> 
      <Router>
        <div className='container'>
          < Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/verifyOPT' element={<VerifyOTP />} />
            <Route path='/AccountsManagement' element={<AccountsManagement />} />
          </Routes>

         </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
