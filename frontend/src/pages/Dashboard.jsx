import React from 'react'
import Header from '../components/Header'
import { useSelector, useDispatch } from 'react-redux'



function Dashboard() {

  const { user } = useSelector((state) => state.auth)
  console.log('dashboard')
  return (
    <>
    <Header/>
    <div>

      {user ? <p>{user.userName}</p> : null}
    
      <h1>DashBoard</h1>
    </div>
    </>
    
  )
}

export default Dashboard
