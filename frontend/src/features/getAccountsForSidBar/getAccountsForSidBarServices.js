import axios from "axios";

const API_URL_GetAccount = 'api/accounts/getAccountsListForSideBar'


const getAccountsList = async (token) => {
    const config = {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }

    const response = await axios.get(API_URL_GetAccount, config)
    return response.data
};


const getAccountsListForSideBar = {
    getAccountsList,
}

export default getAccountsListForSideBar