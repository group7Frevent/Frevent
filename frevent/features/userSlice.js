import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
        }
    },
});

export const { addUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
