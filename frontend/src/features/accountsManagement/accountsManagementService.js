import axios from "axios";

const API_URL_Accounts = 'api/accounts/'


const getAllAccounts = async (token) => {
    const config = {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL_Accounts, config)
    return response.data
};



// Create a new User
const createAccount = async (accountData, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.post(API_URL_Accounts, accountData, config)
    return response.data
  }



const accountsManagementServices = {
    getAllAccounts,
    createAccount
}

export default accountsManagementServices