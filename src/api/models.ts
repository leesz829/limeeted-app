import AsyncStorage from '@react-native-community/async-storage';
import { Send } from 'api';
import { FCM_TOKEN } from 'constants/storeKey';
import {
  GET_POINT,
  LIVE_MEMBERS,
  LOGIN,
  MATCHED_MEMBER_PROFILE,
  ME,
  MEMBER_BASE_INFO,
  MEMBER_INTRODUCE_GUIDE,
  MEMBER_PROFILE_ATHENTICATION2,
  MEMBER_REEXAMINATION,
  ORDER,
  PEEK_MATCH_INFO,
  PEEK_MEMBER,
  PROFILEIMAGE_GUIDE,
  PROFILE_ATHENTICATION2,
  REGIST_MATCHING_INFO,
  REGIST_MEMBER_PROFILE_IMAGE,
  REGIST_PROFILE_EVALUATION,
  REPORT,
  RESOLVE_MATCH,
  STORAGE,
  UPDATE_ADDITIONAL,
  UPDATE_INTERVIEW,
  UPDATE_MATCH,
  UPDATE_MATCH_STATUS,
  UPDATE_PREFERENCE,
  UPDATE_PROFILE_ATHENTICATION2,
  UPDATE_PROFILE_IMAGE,
  UPDATE_SETTING,
  COMMON_CODE
} from './route';

//======================== AUTH =======================
//로그인 체크 및 회원정보를 제공한다.
export async function signin(body: { email_id: string; password: string }) {
  const push_token = await AsyncStorage.getItem(FCM_TOKEN);
  return Send(LOGIN, 'POST', { ...body, push_token }, true);
}

//회원가입시 프로필 2차 인증에 대한 정보를 제공한다.
export async function get_profile_secondary_authentication() {
  return Send(PROFILE_ATHENTICATION2, 'POST', undefined, true);
}
//회원가입시 프로필 사진에 대한 정보를 제공한다.
export async function get_profile_imgage_guide() {
  return Send(PROFILEIMAGE_GUIDE, 'POST', undefined, true);
}
//회원가입시 닉네임, 한줄소개, 관심사 정보를 제공한다.
export async function get_member_introduce_guide() {
  return Send(MEMBER_INTRODUCE_GUIDE, 'POST', undefined, true);
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
  return Send(MEMBER_BASE_INFO, 'POST', body, true);
}

//회원 2차 기본정보를 신규 등록한다.
export async function regist_member_secondary_info(body: {
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
  return Send(MEMBER_BASE_INFO, 'POST', body, true);
}

//회원의 프로필 사진을 신규 등록한다.
export async function regist_profile_image(body: {
  img_file01?: FormData;
  img_file02?: FormData;
  img_file03?: FormData;
  img_file04?: FormData;
  img_file05?: FormData;
}) {
  return Send(REGIST_MEMBER_PROFILE_IMAGE, 'POST', body, true);
}

//회원의 닉네임, 한줄소개, 관심사를 신규 등록한다.
export async function regist_introduce(body: {
  nickname: string;
  comment: string;
  interest_list: any;
}) {
  return Send(MEMBER_BASE_INFO, 'POST', body, true);
}

//======================== USER =======================
//회원의 정보를 조회한다.
export async function get_my_info() {
  return Send(ME, 'POST', undefined, true);
}

//회원의 기본 정보를 저장한다.
export async function update_setting(body: {
  nickname: string;
  comment: string;
  match_yn: string;
  use_pass_yn: string;
  friend_mathch_yn: string;
}) {
  return Send(UPDATE_SETTING, 'POST', body, true);
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
  return Send(UPDATE_ADDITIONAL, 'POST', body, true);
}

//회원의 보관함 정보를 조회한다.
export async function get_member_storage() {
  return Send(STORAGE, 'POST', undefined, true);
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
  return Send(UPDATE_PREFERENCE, 'POST', body, true);
}

//회원의 프로필 사진을 저장한다.
export async function update_profile_image(body: {
  img_file01: FormData;
  img_file02: FormData;
  img_file03: FormData;
  img_file04: FormData;
  img_file05: FormData;
  img_del_seq_str: string;
  interview_list_str: string;
}) {
  return Send(UPDATE_PROFILE_IMAGE, 'POST', body, true);
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
  return Send(UPDATE_PROFILE_ATHENTICATION2, 'POST', body, true);
}

//회원의 실시간성 정보를 조회한다.
export async function peek_member(body: {
  img_acct_cnt: number;
  auth_acct_cnt: number;
}) {
  return Send(PEEK_MEMBER, 'POST', body, true);
}

//회원의 프로필 2차 인증 정보 및 인증의 부가 정보를 조회한다.
export async function get_member_profile_authentication() {
  return Send(MEMBER_PROFILE_ATHENTICATION2, 'POST', undefined, true);
}

//회원의 프로필을 재심사 처리한다.
export async function request_reexamination() {
  return Send(MEMBER_REEXAMINATION, 'POST', undefined, true);
}

//회원의 인터뷰 정보를 저장한다.
export async function update_interview(body: any) {
  return Send(UPDATE_INTERVIEW, 'POST', body, true);
}
//회원의 보유 포인트 정보를 조회한다.
export async function get_points() {
  return Send(GET_POINT, 'POST', undefined, true);
}

//======================== PROFILE =======================
//프로필 평가를 신규 등록한다.
export async function regist_profile_evaluation(body: {
  profile_score: string;
  face_code: string;
}) {
  return Send(REGIST_PROFILE_EVALUATION, 'POST', body, true);
}

//======================== MATCH =======================
//매칭 회원의 정보를 조회한다.
export async function get_matched_member(body: { match_seq: number }) {
  return Send(MATCHED_MEMBER_PROFILE, 'POST', body, true);
}
//찐심/관심/거부 매칭 정보를 신규 등록한다.
export async function regist_match_status(body: { active_type: string }) {
  return Send(REGIST_MATCHING_INFO, 'POST', body, true);
}
//매칭 회원을 신고한다.
export async function report_matched_user(body: {
  report_type_code_list: string;
}) {
  return Send(REPORT, 'POST', body, true);
}

//LIVE에서 평가할 프로필을 조회한다.
export async function get_live_members() {
  return Send(LIVE_MEMBERS, 'POST', undefined, true);
}

//매칭 정보를 변경한다.
export async function update_match(body: {
  match_seq: number;
  req_profile_open_yn: string;
  res_profile_open_yn: string;
}) {
  return Send(UPDATE_MATCH, 'POST', body, true);
}
//매칭 상태를 변경한다.
export async function update_match_status(body: {
  match_seq: number;
  match_status: string;
}) {
  return Send(UPDATE_MATCH_STATUS, 'POST', body, true);
}

//매칭 관련 정보를 조회한다.
export async function get_match_info() {
  return Send(PEEK_MATCH_INFO, 'POST', undefined, true);
}
//매칭된 회원의 연락처를 활성화한다.
export async function resolve_match(body: { match_seq: string }) {
  return Send(RESOLVE_MATCH, 'POST', body, true);
}

//======================== ORDER =======================
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

  return Send(ORDER, 'POST', body, true, false);
}



//======================== 공통 =======================

// #### 공통코드 목록을 조회한다.
export async function get_common_code(body: { group_code: string }) {
  return Send(COMMON_CODE, 'POST', body, true);
}