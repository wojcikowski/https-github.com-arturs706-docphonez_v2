import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';


const initialState = {
    user: user,
    role: role,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isAuth: getAuthFromCookie() ? getAuthFromCookie() : false
};
