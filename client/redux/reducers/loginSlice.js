"use client"; // this is a client component 👈🏽

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import jwt_decode from 'jwt-decode';
import loginService from './loginService';



//create a function to get the cart from the cookie if it exists
export const getCartFromCookie = () => {
    if (hasCookie('userisloggedin')) {
        const decoded = jwt_decode(getCookie('userisloggedin'));
        const user = decoded.sub;
        const role = decoded.role;
        const exp = decoded.exp;
        return { user, role, exp };
    } else {
      return [];
    }
  };




const user = getCartFromCookie().user ? getCartFromCookie().user : null;
const role = getCartFromCookie().role ? getCartFromCookie().role : null;
const exp = getCartFromCookie().exp ? getCartFromCookie().exp : null;
const isExpired = exp ? (Date.now() / 1000) > exp : false;

export const getAuthFromCookie = () => {
    if (hasCookie('isAuth') && !isExpired) {
        return getCookie('isAuth');
    } else {
        deleteCookie('isAuth');
        return false;
    }
};

//create a function to set the cart to the cookie
// export const setCartFromCookie = (userdetails) => {
//     setCookie('userisloggedin', JSON.stringify(userdetails));
// };

const initialState = {
    user: user,
    role: role,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    isAuth: getAuthFromCookie() ? getAuthFromCookie() : false
};

export const login = createAsyncThunk('auth/login', async (userdata, thunkAPI) => {
    try {
        return await loginService.login(userdata);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const loginSlice = createSlice({
    name : 'login',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = null;
            state.role = null;
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
        setIsAuth: (state, action) => {
            state.isAuth = action.payload;
        }
        
    },
    extraReducers: (builder) => {
        builder.addCase('auth/login/pending', (state) => {
            state.isLoading = true;

        })
        builder.addCase('auth/login/fulfilled', (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuth = true;
            // deleteCookie('userisloggedin')
            // setCookie('userisloggedin', action.payload.access_token, {maxAge: 60 * 6 * 24 });
            // setCookie('isAuth', true)

        })
        builder.addCase('auth/login/rejected', (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;

        })
    }
});

export const { reset, setIsAuth } = loginSlice.actions;
export default loginSlice.reducer;