import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logInStart: (state) => {
            state.loading = true;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        logInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    }
});

export const { logInStart, logInSuccess, logInFailure, logOut } = userSlice.actions;

export default userSlice.reducer;