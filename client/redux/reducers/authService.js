import axios from 'axios';
// import { getCookie, hasCookie, setCookie } from 'cookies-next';


const API_URL = 'http://localhost:10000/api/v1/';

//register user

const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData)

    // if (response.data) {
    //     setCookie('user', JSON.stringify(response.data), {maxAge: 60 * 6 * 24 });
    // }
    return response.data;
};

const authService = {
    register
};

export default authService;