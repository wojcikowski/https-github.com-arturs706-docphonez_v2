import axios from 'axios';
import { setCookie, getCookie} from 'cookies-next';


const API_URL = 'http://localhost:10000/api/v1/';


const login = async (userData) => {
    //add also origin header to the request that is sent to the server
    const response = await axios.post(API_URL + 'login', userData)

    // const response = await axios.post(API_URL + 'login', userData, {withCredentials: true})
    //add also origin header to the request
    // if (response.data) {
    //     setCookie('userisloggedin', JSON.stringify(response.data), {maxAge: 60 * 6 * 24 });
    // }
    return response.data;
};

const loginService = {
    login
};

export default loginService;