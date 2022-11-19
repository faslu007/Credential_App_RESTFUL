import * as React from 'react';

import {Dialog, 
    DialogTitle, 
    DialogContent,
    Paper,
    Button,
    Typography,
    Grid,
    TextField,
    Box } from '@mui/material'

import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux'
import { createAccount, resetAccountCreateForm} from '../../features/accountsManagement/accountsManagementSlice'
import Spinner from '../../components/Spinner';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import { getAllUsers, reset } from '../../features/userManagement/userSlice'

import { toast } from 'react-toastify'


const CreateAccntForm = (props) => {

    const dispatch = useDispatch()
    const { users } = useSelector((state) => state.users)
    const { isCreateAccountLoading, isCreateAccountError, message, isCreateAccountSuccess } = useSelector(
      (state) => state.accountsManagement
    )


    useEffect(() => {   
        dispatch(getAllUsers())
    
        return () => {
          dispatch(resetAccountCreateForm())
        }
      }, [])

      useEffect(() => {
        if(isCreateAccountError){
          toast.error(message)
      }

      if(isCreateAccountSuccess){
        toast.success('Account created successfully')
    }


      }, [isCreateAccountError, isCreateAccountSuccess])


    const [formData, setFormData] = useState({
        accountName:'',
        accountType:'',
        primaryContactName: '',
        primaryContactPhone: '',
    })

    const [assignedUsers, setAssignedUsers] = useState([])

    const { accountName, accountType, primaryContactName, primaryContactPhone, } = formData


    
    const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
      }
    
      const onSubmit = (e)=> {
        e.preventDefault()
        assignedUsers.splice(0, assignedUsers.length);
        personName.forEach(
          item => {
              assignedUsers.push(item.substr(item.length - 24))
          }
        )
        formData.assignedUsers = assignedUsers

      dispatch(createAccount(formData))
    };

  



    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };



function getStyles(firstName, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(firstName) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log(personName)
  };


  if (isCreateAccountLoading) {
    return <Spinner />
  };



  return (
    <>
    <Paper elevation={4} style={{padding: '15px', textAlign: 'center',}}>

    <Box sx={{ flexGrow: 1 }} component="form" onSubmit={onSubmit}>
                    <Grid container spacing={1} xs={12}>
                        <Grid item >
                        <TextField
                                sx={{ m: 1, width: 500 }}
                                label='Account Name'
                                type='text'
                                id='accountName'
                                name='accountName' 
                                value={accountName}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                required
                                /> 
                            
                    </Grid>

                <Grid item xs={6}>
                            
                <TextField
                            label='Primary Contact'
                            variant='outlined'
                            size='small'
                            required
                            id='primaryContactName'
                            name='primaryContactName' 
                            value={primaryContactName}
                            onChange={onChange}
                            /> 
                        
                </Grid>


                <Grid item xs={6}>
                            
                <TextField
                            label='Primary Contact Phone'
                            key="phone"
                            variant='outlined'
                            size='small'
                            helperText='Format (123) 456-8765'
                            required
                            id='primaryContactPhone'
                            name='primaryContactPhone' 
                            value={primaryContactPhone}
                            onChange={onChange}
                            /> 
                        
                </Grid>

                <Grid item xs={6}>

                    <FormControl fullWidth size="small" style={{padding: '20px'}}>
                    <InputLabel id="accountType" required>Account Type</InputLabel>
                        <Select
                        labelId="accountType"
                        id='accountType'
                        label='Account Type'
                        name='accountType'
                        value={accountType}
                        onChange={onChange}
                        >
                        <MenuItem value={'Group'}>Group</MenuItem>
                        <MenuItem value={'Facility'}>Facility</MenuItem>
                        </Select>
                </FormControl>
                                        
                </Grid>




                            <Grid item xs={12}>
                            
                            <FormControl sx={{ m: 1, width: 500 }}>
                            <InputLabel id="demo-multiple-chip-label">Users</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value.slice(0, -24)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {users.map((user) => (
            <MenuItem
              key={user.firstName + user.lastName  + user._id}
              value={user.firstName +' ' + user.lastName + ' ' + user._id}
              style={getStyles(user.firstName, personName, theme)}
            >
              {user.firstName +' ' + user.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
                                    
                            </Grid>

                            <Grid item xs={12}>
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{  mb: 2 }}>
                                Submit
                            </Button>

                        </Grid>
                    </Grid>
                </Box>
    </Paper>
    </>
  )
}

export default CreateAccntForm
