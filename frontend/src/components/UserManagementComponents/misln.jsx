// import {Dialog, 
//     DialogTitle, 
//     DialogContent,
//     Paper,
//     Button,
//     Typography,
//     Grid,
//     TextField,
//     Box } from '@mui/material'
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';

// import { useSelector, useDispatch } from 'react-redux'

// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import CloseIcon from '@mui/icons-material/Close';


// const PopUpForm = (props) => {


// const { openPopup, setOpenPopup, userForEdit} = props

// const [formData, setFormData] = useState({
//     _id: '',
//     firstName:'',
//     lastName:'',
//     email: '',
//     role:'',
//     organization: '',
//     team:'',
//     phone: '',
//     designation:'',
// })

// const { _id, firstName, lastName, email, role, organization, team,
//         phone, designation } = formData

// const dispatch = useDispatch()

// let user

// // useEffect(()=> {
// //     if(userForEdit) {
// //         user = userForEdit.user
// //         console.log(user.lastName)
// //     }
// // }, [userForEdit])

// const onChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }))
//   }

// const onSubmit = (e)=> {
//     e.preventDefault()
//     console.log(formData)
// }




// const Item = styled(Grid)(({ theme }) => ({
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   }));


// return (
// <Dialog  BackdropProps={{style: {backgroundColor: 'transparent'}}}
// open={openPopup}

// PaperProps={{
//     sx: {
//       m: 0,
//       top: -60,
//       left: 0
//     }
//   }}>

//     <DialogTitle>
//         <Paper  elevation={4} sx={{  mt: 2 }}>            
//             <Box sx={{ flexGrow: 1 }}>
//                 <Grid container spacing={1} sx={{  p: 1 }} direction='row'>
//                     <Grid item xs={2}>
//                         <PersonAddIcon sx={{  ml: 4 }}
//                             color='primary' 
//                             fontSize='large' 
//                             style={{marginTop: -3}}/>
//                     </Grid>

//                 <Grid item xs={8}>
//                     <Typography 
//                         variant='h5'> 
//                             Create a new User 
//                     </Typography>
//                 </Grid>

//                 <Grid item xs={2}>
//                     <Button
//                         variant='outlined'
//                         onClick={()=>{setOpenPopup(false)}}>
//                         <CloseIcon/>
//                     </Button>
//                 </Grid>
//                 </Grid>
//             </Box>
//         </Paper>
//     </DialogTitle>

//     <DialogContent style={{marginTop: '0px'}}>
//         <Paper  elevation={4}>
//             <Box component="form" onSubmit={onSubmit} noValidate sx={{ flexGrow: 1 }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                         <Item>
                            // <TextField
                            //     label='First Name'
                            //     type='text'
                            //     id='firstName'
                            //     name='firstName' 
                            //     value={firstName}
                            //     onChange={onChange}
                            //     variant='outlined'
                            //     size='small'
                                
                            //     required
                            //     /> 
//                         </Item>
//                 </Grid>
    
//                 <Grid item xs={6}>
                    <Item>
                        {/* <TextField
                            label='Last Name'
                            variant='outlined'
                            id='lastName'
                            name='lastName' 
                            value={lastName}
                            onChange={onChange}
                            size='small'
                            required
                            />  */}
                    </Item>
//                 </Grid>

//                 <Grid item xs={6}>
//                     <Item>
                    // <TextField
                    //         label='Email'
                    //         variant='outlined'
                    //         size='small'
                    //         required
                    //         id='email'
                    //         name='email' 
                    //         value={email}
                    //         onChange={onChange}
                    //         /> 
//                     </Item>
//                 </Grid>

//                 <Grid item xs={6}>
//                 <Item>
                // <TextField
                //             label='Phone'
                //             key="phone"
                //             variant='outlined'
                //             size='small'
                //             helperText='Format (123) 456-8765'
                //             required
                //             id='phone'
                //             name='phone' 
                //             value={phone}
                //             onChange={onChange}
                //             /> 
//                 </Item>
//                 </Grid>
//                 <Grid item xs={6}>
//                 <Item>
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
//                 </Item>
//                 </Grid>
//                 <Grid item xs={6}>
//                 <Item>
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
//                 </Item>
//                 </Grid>
//                 <Grid item xs={6}>
//                     <Item>
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
//                     </Item>
//                 </Grid>
//                 <Grid item xs={6}>
//                 <Item>
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
//                 </Item>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Item>
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             sx={{  mb: 2 }}>
//                             Submit
//                         </Button>
//                     </Item>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </Paper>
//     </DialogContent>
// </Dialog>
// )
// }

// export default PopUpForm
