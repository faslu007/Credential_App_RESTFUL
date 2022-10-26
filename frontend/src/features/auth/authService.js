import axios from 'axios'

const API_URL = 'api/users/'
const API_URL_VerifyOTP = 'api/users/verifyOPT'
const API_URL_Login = 'api/users/login'

const register = async (userData) => {
    const response = await axios.post(API_URL, userData);

    return response.data
};


const verifyOPT = async (userData) => {
    const response = await axios.post(API_URL_VerifyOTP, userData);

    return response.data
};

const login = async (userData) => {
    const response = await axios.post(API_URL_Login, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    return response.data
};

const authService = {
    register,
    verifyOPT,
    login
};

export default authService