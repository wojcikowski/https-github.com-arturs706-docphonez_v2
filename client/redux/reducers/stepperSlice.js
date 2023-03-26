import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setCurrentStep } = stepperSlice.actions;

export default stepperSlice.reducer;
