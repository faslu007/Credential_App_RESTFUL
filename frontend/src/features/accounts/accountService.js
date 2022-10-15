import axios from 'axios'


// Create new goal
const createAccount = async (accountData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  
    const response = await axios.post('http://localhost:5000/api/accounts/', accountData, config)
  
    return response.data
  };


  const goalService = {
    createAccount,
  } 

export default goalService
