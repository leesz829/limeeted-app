import AsyncStorage from '@react-native-community/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get_my_info } from 'api/models';
import storeKey from 'constants/storeKey';
import SplashScreen from 'react-native-splash-screen';
import { PrincipalProps } from 'redux/types/authReducesTypes';
import { JWT_TOKEN } from 'constants/storeKey';


export const myProfile = createAsyncThunk<PrincipalProps>(
  'auth/principal',
  async () => {
    try {
      // const { success, data } = await get_my_info();
      const { success, data } = await get_my_info();

      if (success) {
        if(data.result_code == '0000') {
          return data;
        } else {
          return undefined;
        }        
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    } finally {
      
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    principal: undefined,
  },
  reducers: {
    setPrincipal: (state, action) => {
      state.principal = action.payload;
    },
    setPartialPrincipal: (state, action) => {
      state.principal = { ...state.principal, ...action.payload };
    },
    clearPrincipal: (state) => {
      AsyncStorage.removeItem(JWT_TOKEN);
      state.principal = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(myProfile.pending, () => {})
      .addCase(myProfile.fulfilled, (state, action) => {
        state.principal = action.payload;
      })
      .addCase(myProfile.rejected, () => {});
  },
  // extraReducers: {
  // 	[myProfile.fulfilled.type]: (state, action) => {
  // 		state.principal = action.payload;
  // 	},
  // },
});

export const { setPrincipal, clearPrincipal, setPartialPrincipal } =
  authSlice.actions;

export default authSlice.reducer;
