import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/reducers/cartSlice'
import authReducer from '../redux/reducers/authSlice'
// import profileReducer from '../redux/reducers/profileSlice'
import { HYDRATE } from 'next-redux-wrapper'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    // profile: profileReducer
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [HYDRATE],
      },
    }),
})