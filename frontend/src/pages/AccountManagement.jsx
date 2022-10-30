import SideBarAndHeader  from '../components/SideBarAndHeader/SideBarAndHeader'
import { useNavigate } from 'react-router-dom'
import AddUserButton from '../components/UserManagementComponents/AddUserButton'



const AccountManagement = () => {

    const user1 = 'James'

  return (
    <div>
        <SideBarAndHeader page='Accounts Management' />
        <AddUserButton/>
    </div>
  )
}

export default AccountManagement
