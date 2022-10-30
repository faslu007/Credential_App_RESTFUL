import axios from 'axios'

const API_URL_GetAllUsers = 'api/users/getallusers'
const API_URL_CreateUser = 'api/users/registerUser'
const API_URL_UpdateUser = 'api/users/updateUser/'


// Get user goals
const getAllUsers = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axios.get(API_URL_GetAllUsers, config)
    return response.data
  }

// Create a new User
const createUser = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL_CreateUser, userData, config)
  return response.data
}

//Update user record
const updateUser = async (userData, token) => {

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.patch(API_URL_UpdateUser + userData._id, userData, config)
  console.log(response)
  return response.data
}


const userService = {
    getAllUsers,
    createUser,
    updateUser
    
};

export default userService