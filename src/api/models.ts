import AsyncStorage from '@react-native-community/async-storage';
import { send, send_file } from 'api';
import { FCM_TOKEN } from 'constants/storeKey';
import {
  GET_POINT,
  LIVE_MEMBERS,
  LOGIN,
  MEMBER_LOGOUT,
  DAILY_MATCHED_INFO,
  MATCHED_MEMBER_INFO,
  ME,
  MEMBER_INTRODUCE_GUIDE,
  MEMBER_PROFILE_ATHENTICATION2,
  MEMBER_INTERVIEW,
  MEMBER_INTRODUCE,
  ORDER,
  PEEK_MEMBER,
  PROFILE_IMAGE_GUIDE,
  PROFILE_ATHENTICATION2,
  PROFILE_REEXAMINATION,
  REGIST_BASE_INFO,
  REGIST_MATCHING_INFO,
  REGIST_MEMBER_PROFILE_IMAGE,
  REGIST_PROFILE_EVALUATION,
  REGIST_MEMBER_INTEREST,
  REGIST_MEMBER_SECOND_AUTH,
  REPORT,
  RESOLVE_MATCH,
  STORAGE,
  UPDATE_ADDITIONAL,
  UPDATE_INTERVIEW,
  UPDATE_MATCH,
  UPDATE_MATCH_STATUS,
  UPDATE_PREFERENCE,
  UPDATE_PROFILE_ATHENTICATION2,
  UPDATE_PROFILE,
  UPDATE_SETTING,
  COMMON_CODE,
  SAVE_PROFILE_AUTH,
  MEMBER_AUTH_DETAIL,
  BOARD_LIST,
  GET_MEMBER_FACE_RANK,
  NICE_AUTH,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
  MEMBER_EXIT,
} from './route';

/* ========================================================================================================
==================================================== AUTH
======================================================================================================== */
//로그인 체크 및 회원정보를 제공한다.
export async function signin(body: { email_id: string; password: string }) {
  const push_token = await AsyncStorage.getItem(FCM_TOKEN);
  return send(LOGIN, 'POST', { ...body, push_token }, true, false);
}
//회원가입시 프로필 2차 인증에 대한 정보를 제공한다.
export async function get_profile_secondary_authentication(body: { member_seq: any; second_auth_code: string;}) {
  return send(PROFILE_ATHENTICATION2, 'POST', body, false, false);
}
//회원가입시 프로필 사진에 대한 정보를 제공한다.
export async function get_profile_imgage_guide(body: { member_seq: any; }) {
  return send(PROFILE_IMAGE_GUIDE, 'POST', body, false, false);
}
//회원가입시 닉네임, 한줄소개, 관심사 정보를 제공한다.
export async function get_member_introduce_guide(body: { member_seq: any; }) {
  return send(MEMBER_INTRODUCE_GUIDE, 'POST', body, false, false);
}
//회원의 기본정보를 신규 등록한다.
export async function regist_member_base_info(body: {
  email_id: string;
  password: string;
  name: string;
  gender: string;
  phone_number: string;
  ci: string;
  birthday: string;
  sns_type?: string;
  sns_token?: string;
}) {
  return send(REGIST_BASE_INFO, 'POST', body, false, false);
}

//회원의 프로필 사진을 신규 등록한다.
export async function regist_profile_image(body: {
  member_seq : number;
  file_list : any;
  img_del_seq_str: string;
}) {
  return send(REGIST_MEMBER_PROFILE_IMAGE, 'POST', body, false, false);
}

//회원의 닉네임, 한줄소개, 관심사를 신규 등록한다.
export async function regist_introduce(body: {
  member_seq: number;
  nickname: string;
  comment: string;
  interest_list: any;
}) {
  return send(REGIST_MEMBER_INTEREST, 'POST', body, false, false);
}

//회원의 2차 인증정보를 신규 등록한다.
export async function regist_second_auth(body: {
  member_seq: number;
  file_list: any;
}) {
  return send(REGIST_MEMBER_SECOND_AUTH, 'POST', body, false, false);
}


/* ========================================================================================================
==================================================== USER
======================================================================================================== */
//회원의 정보를 조회한다.
export async function get_my_info() {
  return send(ME, 'POST', undefined, true, false);
}

//회원의 기본 정보를 저장한다.
export async function update_setting(body: {
  nickname: string;
  comment: string;
  match_yn: string;
  use_pass_yn: string;
  friend_mathch_yn: string;
}) {
  return send(UPDATE_SETTING, 'POST', body, true, false);
}

//회원의 부가 정보를 저장한다.
export async function update_additional(body: {
  comment: string;
  business: string;
  job: string;
  job_name: string;
  height: string;
  form_body: string;
  religion: string;
  drinking: string;
  smoking: string;
}) {
  return send(UPDATE_ADDITIONAL, 'POST', body, true, false);
}

//회원의 보관함 정보를 조회한다.
export async function get_member_storage() {
  return send(STORAGE, 'POST', undefined, true, false);
}
//회원의 선호이성 정보를 저장한다.
export async function update_prefference(body: {
  ideal_type_seq: number;
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
}) {
  return send(UPDATE_PREFERENCE, 'POST', body, true, false);
}

//회원의 프로필을 저장한다.
export async function update_profile(body: {
  file_list: any;
  img_del_seq_str: string;
  interview_list_str: string;
}) {
  return send(UPDATE_PROFILE, 'POST', body, true, false);
}

//회원의 프로필 2차 인증 정보를 저장한다.
export async function update_profile_authentication(body: {
  job_name?: string;
  edu_ins?: string;
  instagram_id?: string;
  vehicle?: string;
  job_file?: FormData;
  edu_file?: FormData;
  income_file?: FormData;
  asset_file?: FormData;
  sns_file?: FormData;
  vehicle_file?: FormData;
}) {
  return send(UPDATE_PROFILE_ATHENTICATION2, 'POST', body, true, false);
}

//회원의 실시간성 정보를 조회한다.
export async function peek_member(body: {
  img_acct_cnt: number;
  auth_acct_cnt: number;
}) {
  return send(PEEK_MEMBER, 'POST', body, true, false);
}

//회원의 프로필 2차 인증 정보 및 인증의 부가 정보를 조회한다.
export async function get_member_profile_authentication() {
  return send(MEMBER_PROFILE_ATHENTICATION2, 'POST', undefined, true, false);
}

//회원의 인터뷰 정보를 저장한다.
export async function update_interview(body: any) {
  return send(UPDATE_INTERVIEW, 'POST', body, true, false);
}

//회원의 보유 포인트 정보를 조회한다.
export async function get_points() {
  return send(GET_POINT, 'POST', undefined, true, false);
}

//회원의 인터뷰 목록을 조회한다.
export async function get_member_interview(body: {
  use_yn: string;
  disp_yn: string;
}) {
  return send(MEMBER_INTERVIEW, 'POST', body, true, false);
}

//회원의 소개 정보를 조회한다.
export async function get_member_introduce(body: {
  group_code: string;
}) {
  return send(MEMBER_INTRODUCE, 'POST', body, true, false);
}

// 회원 로그아웃 한다.
export async function member_logout() {
  return send(MEMBER_LOGOUT, 'POST', undefined, true, false);
}

// 회원 2차 인증 상세 목록을 조회한다.
export async function get_member_second_detail(body: {
  second_auth_code : any;
}) {
  return send(MEMBER_AUTH_DETAIL, 'POST', body, true, false);
}

// 회원 2차 인증을 저장한다.
export async function save_profile_auth(body: {
  file_list : any;
}) {
  return send(SAVE_PROFILE_AUTH, 'POST', body, true, false);
}

// 회원의 전화번호를 저장한다.
export async function update_phone_number(body: {
  phone_number: string;
  ci: string;
}) {
  return send(UPDATE_PHONE_NUMBER, 'POST', body, true, false);
}

// 회원의 비밀번호를 수정한다.
export async function update_member_password(body: {
  old_password: string;
  new_password: string;
}) {
  return send(UPDATE_PASSWORD, 'POST', body, true, false);
}

// 회원 탈퇴를 한다.
export async function update_member_exit() {
  return send(MEMBER_EXIT, 'POST', undefined, true, false);
}



/* ========================================================================================================
==================================================== PROFILE
======================================================================================================== */
// 프로필 평가를 신규 등록한다.
export async function regist_profile_evaluation(body: {
  profile_score: string;
  face_code: string;
}) {
  return send(REGIST_PROFILE_EVALUATION, 'POST', body, true, false);
}

// 프로필 재심사를 진행한다.
export async function request_reexamination() {
  return send(PROFILE_REEXAMINATION, 'POST', undefined, true, false);
}

// 회원 프로필 인상 순위를 조회한다.
export async function get_member_face_rank() {
  return send(GET_MEMBER_FACE_RANK, 'POST', undefined, true, false);
}


/* ========================================================================================================
==================================================== MATCH
======================================================================================================== */
// 데일리 매칭 정보를 조회한다.
export async function get_daily_matched_info() {
  return send(DAILY_MATCHED_INFO, 'POST', undefined, true, false);
}

//찐심/관심/거부 매칭 정보를 신규 등록한다.
export async function regist_match_status(body: { 
  active_type: string;
  res_member_seq: number;
}) {
  return send(REGIST_MATCHING_INFO, 'POST', body, true, false);
}

//매칭 회원을 신고한다.
export async function report_matched_user(body: {
  report_type_code_list: string;
  report_member_seq: number;
}) {
  return send(REPORT, 'POST', body, true, false);
}

//LIVE에서 평가할 프로필을 조회한다.
export async function get_live_members() {
  return send(LIVE_MEMBERS, 'POST', undefined, true, false);
}

//매칭 정보를 변경한다.
export async function update_match(body: {
  match_seq: number;
  req_profile_open_yn: string;
  res_profile_open_yn: string;
}) {
  return send(UPDATE_MATCH, 'POST', body, true, false);
}

//매칭 상태를 변경한다.
export async function update_match_status(body: {
  match_seq: number;
  match_status: string;
}) {
  return send(UPDATE_MATCH_STATUS, 'POST', body, true, false);
}

//매칭된 회원의 연락처를 활성화한다.
export async function resolve_match(body: { match_seq: string }) {
  return send(RESOLVE_MATCH, 'POST', body, true, false);
}

//매칭된 회원의 기본 정보를 조회한다.
export async function get_matched_member_info(body: { match_seq: number }) {
  return send(MATCHED_MEMBER_INFO, 'POST', body, true, false);
}


/* ========================================================================================================
==================================================== ORDER
======================================================================================================== */

//주문을 처리한다.

export async function purchase_product(
  device_gubun: any,
  buy_price: any,
  item_name: any,
  item_code: any,
  result_msg: any,
  result_code: any,
  receiptData: any
) {
  const receiptDataJson = JSON.parse(receiptData);

  const body = {
    'api-key': 'U0FNR09CX1RPS0VOXzAx',
    device_gubun: device_gubun,
    buy_price: buy_price,
    item_name: item_name,
    item_code: item_code,
    result_msg: JSON.stringify(result_msg),
    result_code: result_code,
    acknowledged: receiptDataJson.acknowledged,
    packageName: receiptDataJson.packageName,
    productId: receiptDataJson.productId,
    purchaseState: receiptDataJson.purchaseState,
    purchaseTime: receiptDataJson.purchaseTime,
    purchaseToken: receiptDataJson.purchaseToken,
    quantity: receiptDataJson.quantity,
  };

  return send(ORDER, 'POST', body, true, false);
}


/* ========================================================================================================
==================================================== 공통
======================================================================================================== */

// #### 공통코드 목록을 조회한다.
export async function get_common_code(body: { group_code: string }) {
  return send(COMMON_CODE, 'POST', body, true, false);
}

// #### 최근소식 목록을 조회한다.
export async function get_board_list() {
  return send(BOARD_LIST, 'POST', undefined, true, false);
}

// #### 나이스 인증 모듈을 실행한다.
export async function nice_auth() {
  return send(NICE_AUTH, 'POST', undefined, false, false);
}