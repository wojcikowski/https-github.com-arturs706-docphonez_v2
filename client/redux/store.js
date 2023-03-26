import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/reducers/cartSlice'
import profileReducer from '../redux/reducers/profileSlice'
import { HYDRATE } from 'next-redux-wrapper'
import stepperReducer from '../redux/reducers/stepperSlice';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    profile: profileReducer,
    stepper: stepperReducer
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [HYDRATE],
      },
    }),
})