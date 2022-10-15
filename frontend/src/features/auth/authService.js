import axios from 'axios';

const API_URL = '/api/users';

const API_VerifyOTP = 'http://localhost:5000/api/users/verifyOPT'



// register user 
const register = async (userData) => {
    const response = await axios.post(API_URL, userData) 

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
};

// register verifyOTP 
const verifyOTP = async (userOTPInfo) => {
    const response = await axios.post(API_VerifyOTP, userOTPInfo) 

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
};

// login user 
const login = async (userData) => {

    const response = await axios.post('http://localhost:5000/api/users/login', userData) 

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
};


//logout
const logout = () => {
    console.log('I worked')
    localStorage.removeItem('user')
}

const authService = {
    register,
    verifyOTP,
    logout,
    login
};

export default authService