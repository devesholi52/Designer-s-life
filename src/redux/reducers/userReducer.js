import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    token: false,
    tokenfunc: false,
    userData: null,
    appState: 'background',
    locationData: null,
    loading: true,
    data: [],
    products: [],
    banners: [],
    error: '',
}

export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeTokenValue: (state, action) => {
            state.token = action.payload;
        },
        setTokenFunction: (state, action) => {
            state.tokenfunc = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userData = action.payload;
        },
        removeDataFromRedux: (state, action) => {
            state.token = false;
            state.tokenfunc = false;
            state.userData = null
        }
    },
});

// Action creators are generated for each case reducer function
export const { changeTokenValue, setTokenFunction, setUserInfo, removeDataFromRedux } = userReducer.actions;

export default userReducer.reducer;