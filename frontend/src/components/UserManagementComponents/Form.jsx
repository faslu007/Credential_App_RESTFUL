import {Dialog, 
    DialogTitle, 
    DialogContent,
    Paper,
    Button,
    Typography,
    Grid,
    TextField,
    Box } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux'
import { createUser, resetUserForm, updateUser, resetUpdateUserForm  } from '../../features/userManagement/userSlice'
import Spinner from '../../components/Spinner';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

import { toast } from 'react-toastify'


const AddUserForm = (props) => {

    const dispatch = useDispatch()

    const { isCreateUserLoading, isCreateUserError, isCreateUserSuccess, isUpdateUserLoading, 
        isUpdateUserError, isUpdateUserSuccess,  message } = useSelector(
        (state) => state.users
      )

    const [formData, setFormData] = useState({
        _id: '',
        firstName:'',
        lastName:'',
        email: '',
        role:'',
        organization: '',
        team:'',
        phone: '',
        designation:'',
    })
    const { _id, firstName, lastName, email, role, organization, team,
            phone, designation } = formData

    useEffect(()=> {
        if(props.userForEdit){
            setFormData({
                ...props.userForEdit.user
            })
        }
    }, [])


    useEffect(() => {
        
    if(isUpdateUserError){
        toast.error(message)
    }

    if(isUpdateUserSuccess){
        toast.success('User info has been updated successfully')
    }

    return () => {
        dispatch(resetUpdateUserForm())
      }

    },[isUpdateUserError, isUpdateUserSuccess])



    useEffect(() => {
        if(isCreateUserError){
          toast.error(message)
      }

      if(isCreateUserSuccess){
        toast.success('Account created and sent an email to user for verification')
    }

    return () => {
        dispatch(resetUserForm())
      }
      }, [isCreateUserError, isCreateUserSuccess])


    const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e)=> {
    e.preventDefault()

    if(props.userForEdit) {
        console.log(formData)
        dispatch(updateUser(formData));
    } else {
        dispatch(createUser(formData));
    }
};

if (isCreateUserLoading) {
    return <Spinner />
  }; 

if (isUpdateUserLoading) {
    return <Spinner />
}



  return (
    <>
    <Paper elevation={4} style={{padding: '10px', textAlign: 'center',}}>

    <Box sx={{ flexGrow: 1 }} component="form" onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <TextField
                                label='First Name'
                                type='text'
                                id='firstName'
                                name='firstName' 
                                value={firstName}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                required
                                /> 
                            
                    </Grid>

                    <Grid item xs={6}>
                            
                    <TextField
                            label='Last Name'
                            variant='outlined'
                            id='lastName'
                            name='lastName' 
                            value={lastName}
                            onChange={onChange}
                            size='small'
                            required
                            /> 
                        
                </Grid>

                <Grid item xs={6}>
                            
                <TextField
                            label='Email'
                            variant='outlined'
                            size='small'
                            required
                            id='email'
                            name='email' 
                            value={email}
                            onChange={onChange}
                            /> 
                        
                </Grid>


                <Grid item xs={6}>
                            
                <TextField
                            label='Phone'
                            key="phone"
                            variant='outlined'
                            size='small'
                            helperText='Format (123) 456-8765'
                            required
                            id='phone'
                            name='phone' 
                            value={phone}
                            onChange={onChange}
                            /> 
                        
                </Grid>

                <Grid item xs={6}>
                            
                            <TextField
                                        label='Organization'
                                        variant='outlined'
                                        size='small'
                                        required
                                        id='organization'
                                        name='organization' 
                                        value={organization}
                                        onChange={onChange}
                                        />  
                                    
                            </Grid>

                
                <Grid item xs={6}>
                            
                <TextField
                            label='Designation'
                            variant='outlined'
                            size='small'
                            required
                            id='designation'
                            name='designation' 
                            value={designation}
                            onChange={onChange}
                            />  
                        
                </Grid>

                
                <Grid item xs={6}>
                            
                <TextField
                            label='Team'
                            variant='outlined'
                            size='small'
                            required
                            id='team'
                            name='team' 
                            value={team}
                            onChange={onChange}
                            />  
                        
                </Grid>


                
                <Grid item xs={6}>
                            
                <FormControl fullWidth size="small" style={{padding: '10px'}}>
                    <InputLabel id="userRole-" required>User Role</InputLabel>
                        <Select
                        labelId="userRole-"
                        id="userRole"
                        label="User Role"
                        name='role' 
                        value={role}
                        onChange={onChange}
                        >
                        <MenuItem value={'Admin'}>Admin</MenuItem>
                        <MenuItem value={'User'}>User</MenuItem>
                        <MenuItem value={'ViewOnly'}>View-Only</MenuItem>
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

export default AddUserForm
