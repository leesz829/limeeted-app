import AsyncStorage from '@react-native-community/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get_my_info, get_login_chk } from 'api/models';

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

// 회원 정보
export const memberInfo = createAsyncThunk<PrincipalProps>('mbr/base', async () => {
	/* try {
		const { success, data } = await get_my_info();

		if (success) {
			return { base: data};
		} else {
			return undefined;
		}
	} catch (err) {
		return undefined;
	} */

	return undefined;
});

export const mbrSlice = createSlice({
	name: 'mbr',
	initialState: {
		jwtToken: undefined,
		memberSeq: undefined,
		base: undefined,
		profileImg: undefined,
		secondAuth: undefined,
		idealType: undefined,
		interview: undefined,
	},
	reducers: {
		setJwtToken: (state, action) => {
			state.jwtToken = action.payload;
		},
		setMemberSeq: (state, action) => {
			state.memberSeq = action.payload;
		},
		setBase: (state, action) => {
			state.base = action.payload;
		},
		setProfileImg: (state, action) => {
			state.profileImg = action.payload;
		},
		setSecondAuth: (state, action) => {
			state.secondAuth = action.payload;
		},
		setIdealType: (state, action) => {
			state.idealType = action.payload;
		},
		setInterview: (state, action) => {
			state.interview = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(memberInfo.pending, () => {})
			.addCase(memberInfo.fulfilled, (state, action) => {
				state.base = action.payload.base;
				state.profileImg = action.payload.profileImg;
			})
			.addCase(memberInfo.rejected, () => {});
	},
});

export const {
	setJwtToken,
	setMemberSeq,
	setBase,
	setProfileImg,
	setSecondAuth,
	setIdealType,
	setInterview,
} = mbrSlice.actions;

export default mbrSlice.reducer;
