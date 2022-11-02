import axios from "axios";

const API_URL_GetAllAccounts = 'api/accounts/'


const getAllAccounts = async (token) => {
    const config = {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL_GetAllAccounts, config)
    return response.data
};

const accountsManagementServices = {
    getAllAccounts
}

export default accountsManagementServices