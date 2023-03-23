"use client"; // this is a client component 👈🏽

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const register = createAsyncThunk('auth/register', async (yserdata, thunkAPI) => {
    try {
        return await authService.register(yserdata);
    } catch (error) {
        console.log(error)
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
        })
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});


export const { reset } = userSlice.actions;
export default userSlice.reducer;