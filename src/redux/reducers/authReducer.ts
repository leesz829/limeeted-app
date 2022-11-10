import AsyncStorage from '@react-native-community/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get_my_info } from 'api/models';

interface PrincipalProps {
	friend_match_yn: string;
	gender: string;
	profile_tier: string;
	mst_img_path: string;
	smoking: string;
	nickname: string;
	profile_score: number;
	height: string;
	introduce_comment: string;
	drinking: string;
	business: string;
	form_body: string;
	kakao_id: string;
	member_seq: number;
	religion: string;
	member_level: number;
	job_name: string;
	name: string;
	comment: string;
	phone_number: string;
	join_dt: string;
	job: string;
	match_yn: string;
	join_status: string;
	age: string;
	status: string;
}

export const myProfile = createAsyncThunk<PrincipalProps>('auth/principal', async () => {
	try {
		// const { success, data } = await get_my_info();
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

export const { setPrincipal, clearPrincipal } = authSlice.actions;

export default authSlice.reducer;
