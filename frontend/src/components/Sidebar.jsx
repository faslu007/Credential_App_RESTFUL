import React from 'react'
import{useState} from 'react'
import {useSelector, dispatch} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'


function Sidebar() {

    const navigate = useNavigate()

  return (

    <>
    <div className="sidebar">
    <div className="sidebar-items">
            <Link to='/'>  Dashboard </Link>
    </div>

    <div className="sidebar-items">
            <Link to='/AccountsManagement'>  Accounts_Management </Link>
        </div>

    </div>
    </>
   
  )
}

export default Sidebar
