import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'


function Dashboard() {

  const navigate = useNavigate()
  
  const {user} = useSelector((state) => state.auth )

  useEffect(() =>{
    if(!user) {
      navigate ('/login')
      
    }
  },  [user, navigate])

  return (
    <div>
      <Sidebar/>

    </div>
  )
}

export default Dashboard
