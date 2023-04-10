import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import mbrReducer from './reducers/mbrReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    mbr: mbrReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
