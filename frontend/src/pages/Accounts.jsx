import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { useNavigate } from 'react-router-dom'
import AddUserButton from '../components/UserManagementComponents/AddUserButton'



const Accounts = () => {

    const user1 = 'James'

  return (
    <div>
        <SideBarAndHeader page='Account' />
        <AddUserButton/>
    </div>
  )
}

export default Accounts
