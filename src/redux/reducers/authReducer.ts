import AsyncStorage from '@react-native-community/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get_my_info } from 'api/models';

export const myProfile = createAsyncThunk('auth/principal', async () => {
	try {
		const { success, data } = await get_my_info();

		if (success) {
			return data;
		} else {
			return undefined;
		}
	} catch (err) {
		return undefined;
	}
});

export const authSlice = createSlice({
	name: 'auth',
	initialState: {
		principal: undefined,
	},
	reducers: {
		setPrincipal: (state, action) => {
			state.principal = action.payload;
		},
		clearPrincipal: (state) => {
			AsyncStorage.removeItem('jwt-token');
			state.principal = undefined;
		},
	},
	extraReducers: {
		[myProfile.fulfilled.type]: (state, action) => {
			state.principal = action.payload;
		},
	},
});

export const { setPrincipal, clearPrincipal } = authSlice.actions;

export default authSlice.reducer;
