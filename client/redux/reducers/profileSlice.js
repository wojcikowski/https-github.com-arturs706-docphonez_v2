import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    token: null,
    email: null,
    role : null,
    tokenExp: null
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.token = action.payload;
        },
        setEmailAdd: (state, action) => {
            state.email = action.payload;
        },
        setUserRole: (state, action) => {
            state.role = action.payload;
        }, 
        setTokenExp: (state, action) => {
            state.tokenExp = action.payload;
        }
    }
});

export const { setProfile, setEmailAdd, setUserRole, setTokenExp } = profileSlice.actions;

export default profileSlice.reducer;