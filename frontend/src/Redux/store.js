import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userProfile';   

const store = configureStore({
  reducer: {
    userProfile: userReducer,   
  },
});

export default store;
