import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userName: "",
};

export const userSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
});

export const { setUserName } = userSlice.actions;

export default userSlice.reducer;
