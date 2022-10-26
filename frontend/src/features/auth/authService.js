import axios from 'axios'

const API_URL = 'api/users/'
const API_URL_VerifyOTP = 'api/users/verifyOPT'

const register = async (userData) => {
    const response = await axios.post(API_URL, userData);
        console.log(response.data)
    return response.data
};


const verifyOPT = async (userData) => {
    const response = await axios.post(API_URL_VerifyOTP, userData);
        console.log(response.data)
    return response.data
};

const authService = {
    register,
    verifyOPT
};

export default authService