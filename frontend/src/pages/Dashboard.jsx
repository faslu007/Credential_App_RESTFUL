import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

function Dashboard() {

  const { user, isloading } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

  }, [user])

  if(isloading) {
    return <Spinner/>
  }

  return (
    <>
      <SideBarAndHeader page='Dashboard' />
    </>
    
  )
}

export default Dashboard
