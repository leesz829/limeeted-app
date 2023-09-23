import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  ImagePropTypes,
} from 'react-native';

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
  NiceAuth: {
    type: string;
    phoneNumber: string;
    emailId: string;
    mrktAgreeYn: string;
  };
  Login01: undefined;
  Policy: undefined;
  Signup00: {
    ci: string;
    name: string;
    gender: string;
    mobile: string;
    birthday: string;
    sns_type: string;
    sns_token: string;
    marketing_agree_yn: string;
    memberSeq: Number;
    emailId: string;
  };
  Signup01: {
    memberSeq: Number;
    gender: string;
  };
  Signup02: {
    memberSeq: Number;
    gender: string;
  };
  Signup03: {
    memberSeq: Number;
    gender: string;
    mstImgPath: string;
  };
  Approval: {
    memberSeq: Number;
  };
  SecondAuthPopup: undefined; // 2차 인증 팝업
  SignupPopUp2: undefined;
  CommonPopup: undefined;
  ReportPopup: undefined;
  LivePopup: undefined;
  Introduce: undefined;
  Board0: undefined;
  Preference: undefined;
  PreferencePopup: undefined;
  Profile: undefined;
  Sample: undefined;
  Profile1: {
    isInterViewMove: boolean;
  };
  SecondAuth: undefined;
  Profile2: {
    tgtCode: string;
  };
  StorageProfile: {
    matchSeq: Number;
    tgtMemberSeq: Number;
    type: string;
    matchType: string;
  };
  ItemMatching: undefined;
  ImagePreview: {
    imgList: [];
    orderSeq: Number;
  };
  TutorialSetting: undefined;
  MyDailyView: undefined;
  ProfileImageSetting: undefined;
  StoryRegi: undefined;
  StoryEdit: {
    storyBoardSeq: Number;
    storyType: string;
  };
  StoryDetail: {
    storyBoardSeq: Number;
  };
  StoryActive: undefined;
};

export type BottomParamList = {
  Roby: undefined;
  Message: undefined;
  Cashshop: undefined;
  Storage: {
    headerType: String;
  };
  Live: undefined;
  LiveSearch: undefined;
  Matching: undefined;
  Shop: undefined;
  Story: undefined;
};

export type StackScreenProp = NativeStackNavigationProp<StackParamList>;
export type BottomScreenProp = NativeStackNavigationProp<BottomParamList>;

export enum ColorType {
  white = 'white',
  primary = '#7986ed',
  gray6666 = '#666666',
  grayEEEE = '#eeeeee',
  black0000 = '#000000',
  black2222 = '#222222',
  black3333 = '#333333',
  purple = '#8854d1',
  grayDDDD = '#dddddd',
  grayF8F8 = '#f8f8f8',
  gray8888 = '#888888',
  grayAAAA = '#aaaaaa',
  grayb1b1 = '#b1b1b1',
  red = '#ff0000',
  redF20456 = '#fe0456',
  blue697A = '#697AE6',
  blue7986 = '#7986EE',
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

export const LabelObj = {
  label: '',
  value: '',
};

export const CommonCode = {
  common_code: '',
  group_code: '',
  code_name: '',
  code_memo: '',
  order_seq: '',
  use_yn: '',
};

export const Interview = {
  common_code: '',
  code_name: '',
  answer: '',
  order_seq: '',
};

export const MemberBaseData = {
  member_seq: '',
  kakao_id: '',
  nickname: '',
  name: '',
  comment: '',
  status: '',
  admin_yn: '',
  age: '',
  gender: '',
  phone_number: '',
  member_auth_seq: '',
  birthday: '',
  join_appr_dt: '',
  join_dt: '',
  match_yn: '',
  local_seq1: '',
  local_seq2: '',
  inactive_dt: '',
  rank: '',
  introduce_comment: '',
  business: '',
  job: '',
  job_name: '',
  birth_local: '',
  active_local: '',
  height: '',
  form_body: '',
  religion: '',
  drinking: '',
  smoking: '',
  mst_img_path: ImagePropTypes,
  friend_match_yn: '',
  grade_score: '',
  member_level: '',
  profile_tier: '',
  profile_score: '',
  profile_type: '',
};

export const FileInfo = {
  member_seq: '',
  name: '',
  profile_type: '',
  comment: '',
  gender: '',
  age: '',
  file_seq: '',
  file_path: '',
  file_name: '',
};

export const ProfileImg = {
  url: '',
  member_seq: '',
  name: '',
  age: '',
  comment: '',
  profile_type: '',
};

export const MemberIdealTypeData = {
  ideal_type_seq: '',
  member_seq: '',
  want_local1: '',
  want_local2: '',
  want_age_min: '',
  want_age_max: '',
  want_business1: '',
  want_business2: '',
  want_business3: '',
  want_job1: '',
  want_job2: '',
  want_job3: '',
  want_person1: '',
  want_person2: '',
  want_person3: '',
};

// Live 매칭 회원 기본 정보
export const LiveMemberInfo  = {
  member_seq : ''
  , name : ''
  , gender : ''
  , comment : ''
  , status : ''
  , age : ''
  , approval_profile_seq : ''
};

// Live 매칭 회원 프로필 사진 정보
export const LiveProfileImg  = {
  member_img_seq : ''
  , order_seq : ''
  , img_file_path : ''
  , url : ''
};