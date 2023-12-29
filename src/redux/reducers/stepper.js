import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    stepNumber: 1,
    currentScreenName: 'PaymentScreen'
}

export const stepperReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateStep: (state, action) => {
            state.stepNumber = action.payload;
        },
        updateScreenName: (state, action) => {
            state.currentScreenName = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateStep, updateScreenName } = stepperReducer.actions;

export default stepperReducer.reducer;