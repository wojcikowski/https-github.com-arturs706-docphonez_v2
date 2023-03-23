import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/reducers/cartSlice'
import authReducer from '../redux/reducers/authSlice'
import loginReducer from '../redux/reducers/loginSlice'
import { HYDRATE } from 'next-redux-wrapper'


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    login: loginReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [HYDRATE],
      },
    }),
})