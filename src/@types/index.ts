import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

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
	Signup0: {
		kakaoId: string;
		name: string;
	};
	Signup1: {
		memberSeq: Number;
	};
	SignupPopUp: undefined;
	Signup02: {
		memberSeq: Number;
	};
	Signup03: {
		memberSeq: Number;
	};
	Approval: undefined;
	SignupPopUp2: undefined;
	CommonPopup: undefined;
	ReportPopup: undefined;
	LivePopup: undefined;
	Introduce: {
		memberSeq: Number;
		comment: String;
		jobName: String;
		height: String;
	};
	Board0: undefined;
	Board1: undefined;
	Preference: undefined;
	Profile: undefined;
	Sample: undefined
};

export type BottomParamList = {
	Roby: {
		memberSeq: Number;
		name: String;
		age: Number;
		comment : String;
		jobName: String;
		height: String;
		mstImg: undefined;
	};
	Mailbox: undefined;
	Cashshop: undefined;
	Storage: undefined;
	Live: undefined;
	LiveSearch: undefined;
	Matching: undefined;
	Profile1: undefined;
	Profile2: undefined;
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
