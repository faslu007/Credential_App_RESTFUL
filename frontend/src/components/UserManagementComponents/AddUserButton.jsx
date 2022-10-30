import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const AddUserButton = () => {
  return (
    <div>
      <Button variant="contained"
                style={{marginLeft: 1350, marginTop: -1250,}}>
                    <PersonAddAltIcon style={{marginRight: 4}}/>
                     Add User</Button>
    </div>
  )
}

export default AddUserButton

