import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, ScrollView, View, TouchableOpacity, ImagePropTypes } from 'react-native';

export type ScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<StackParamList>,
	BottomTabNavigationProp<BottomParamList>
>;

export type RootParamList = {
	BottomNavigation: undefined;
	StackNavigation: undefined;
};

export type StackParamList = {
	Component: undefined; 
	Main: NavigatorScreenParams<BottomParamList>;
	StartPage: undefined;
	Login: undefined;
	Title00: undefined;
	NiceAuth: undefined;
	Login01: undefined;
	Signup00: {
		ci: string;
		name: string;
		gender: string;
		mobile: string;
		birthday: string;
	};
	Signup01: {
		memberSeq: Number;
	};
	Signup02: {
		memberSeq: Number;
		gender: string;
	};
	Signup03: {
		memberSeq: Number;
	};
	Approval: undefined;
	SecondAuthPopup: undefined;	// 2차 인증 팝업
	SignupPopUp2: undefined;
	CommonPopup: undefined;
	ReportPopup: undefined;
	LivePopup: undefined;
	Introduce: {
		member_seq : string;
		introduce_comment : string;
		business : string;
		job : string;
		job_name : string;
		height : string;
		form_body : string;
		religion : string;
		drinking : string;
		smoking : string;
	};
	Board0: undefined;
	Board1: undefined;
	Preference: {
		ideal_type_seq: string;
		want_local1: string;
		want_local2: string;
		want_age_min: string;
		want_age_max: string;
		want_business1: string;
		want_business2: string;
		want_business3: string;
		want_job1: string;
		want_job2: string;
		want_job3: string;
		want_person1: string;
		want_person2: string;
		want_person3: string;
		gender: string;
	};
	PreferencePopup: undefined;
	Profile: {
		nickname : string;
		name: string;
		gender: string;
		age: string;
		phone_number: string;
	};
	Sample: undefined;
	Profile1: {
		imgList: [{
			member_img_seq: Number
			, order_seq: Number
			, file_name: String
			, file_path: String
		}];
		authList: [{
			second_auth_code: string
		}];
		interviewList: [{
			common_code: string
			, code_name: string
			, member_interview_seq: string
			, answer: string
		}];
	};
	SecondAuth: undefined;
	Profile2: undefined;
};

export type BottomParamList = {
	Roby: {
		memberBase: {}
	};
	Mailbox: undefined;
	Cashshop: undefined;
	Storage: {
		resLikeList: [
			[{ req_member_seq : '', img_path : '', dday : Number, special_interest_yn : ''}]
		];
		reqLikeList: [
			[{ req_member_seq : '', img_path : '', dday : Number, special_interest_yn : ''}]
		];
		matchTrgtList: [
			[{ req_member_seq : '', img_path : '', dday : Number, special_interest_yn : ''}]
		];
	};
	Live: undefined;
	LiveSearch: undefined;
	Matching: undefined;
	Shop: undefined;
	StorageProfile: undefined;
};

export type StackScreenProp = NativeStackNavigationProp<StackParamList>;
export type BottomScreenProp = NativeStackNavigationProp<BottomParamList>;

export enum ColorType {
	white = 'white',
	primary = '#7986ed',
	gray6666 = '#666666',
	grayEEEE = '#eeeeee',
	black2222 = '#222222',
	purple = '#8854d1',
	grayDDDD = '#dddddd',
	grayF8F8 = '#f8f8f8',
	gray8888 = '#888888',
	grayAAAA = '#aaaaaa',
	red = '#ff0000',
}

export type WeightType =
	| 'normal'
	| 'bold'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900';

export const LabelObj= {
	label : ''
	, value : ''
}
	


export const CommonCode= {
	common_code : ''
	, group_code : ''
	, code_name : ''
	, code_memo : ''
	, order_seq : ''
	, use_yn : ''
}	

	
export const Interview = {
	code_name : ''
	, answer : ''
	, order_seq : ''
}

export const MemberBaseData = {
	member_seq  : ''
	, kakao_id : ''
	, nickname : ''
	, name : ''
	, comment : ''
	, status : ''
	, admin_yn : ''
	, age : ''
	, gender : ''
	, phone_number : ''
	, profile_tier : ''
	, member_auth_seq : ''
	, birthday : ''
	, join_appr_dt : ''
	, join_dt : ''
	, match_yn : ''
	, local_seq1 : ''
	, local_seq2 : ''
	, inactive_dt : ''
	, rank : ''
	, introduce_comment : ''
	, business : ''
	, job : ''
	, job_name : ''
	, birth_local : ''
	, active_local : ''
	, height : ''
	, form_body : ''
	, religion : ''
	, drinking : ''
	, smoking : ''
	, mst_img_path : ImagePropTypes
	, friend_match_yn : ''
	, profile_score : ''
	, grade_score : ''
}

export const FileInfo= {
	member_seq : ''
	, name : ''
	, profile_type : ''
	, comment : ''
	, gender : ''
	, age : ''
	, file_seq : ''
	, file_path : ''
	, file_name : ''
}	

export const ProfileImg= {
	url: ''
	, member_seq : ''
	, name : ''
	, age : ''
	, comment : '' 
	, profile_type : ''
}

export const MemberIdealTypeData = {
	ideal_type_seq: ''
	, member_seq: ''
	, want_local1: ''
	, want_local2: ''
	, want_age_min: ''
	, want_age_max: ''
	, want_business1: ''
	, want_business2: ''
	, want_business3: ''
	, want_job1: ''
	, want_job2: ''
	, want_job3: ''
	, want_person1: ''
	, want_person2: ''
	, want_person3: ''
}