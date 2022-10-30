import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'



function Dashboard() {

  const { user } = useSelector((state) => state.auth)
  console.log('dashboard')
  return (
    <>
      <SideBarAndHeader page='Dashboard' />
    </>
    
  )
}

export default Dashboard
