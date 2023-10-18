import AsyncStorage from '@react-native-community/async-storage';
import { send } from 'api';
import { FCM_TOKEN } from 'constants/storeKey';
import {
  GET_POINT,
  LIVE_MEMBERS,
  LOGIN,
  MEMBER_LOGOUT,
  DAILY_MATCHED_INFO,
  MATCHED_MEMBER_INFO,
  MEMBER_APPLY_ITEM_INFO,
  ME,
  MEMBER_INTRODUCE_GUIDE,
  MEMBER_PROFILE_ATHENTICATION2,
  MEMBER_INTERVIEW,
  MEMBER_INTRODUCE,
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
  BOARD_DETAIL_VIEW,
  GET_MEMBER_FACE_RANK,
  GET_MEMBER_PROFILE_INFO,
  NICE_AUTH,
  UPDATE_PHONE_NUMBER,
  UPDATE_PASSWORD,
  MEMBER_EXIT,
  MEMBER_SLEEP,
  SEARCH_EMAIL_ID,
  SEARCH_PASSWORD,
  CREATE_TEMP_PASSWORD,
  ORDER,
  ORDER_GOODS,
  ORDER_AUCT,
  ORDER_HISTORY,
  ITEM_LIST,
  USE_ITEM,
  USE_PASS_ITEM_ALL,
  POINT_HISTORY,
  PRODUCT_LIST,
  PRODUCT_AUCT,
  PRODUCT_AUCT_DETAIL,
  PRODUCT_BM,
  BANNER_LIST,
  MEMBER_MSG_LIST,
  INSERT_MEMBER_INQUIRY,
  EVENT_CASHBACK_PAY,
  EVENT_CASHBACK_DETAIL,
  EVENT_CASHBACK_RECEIVE,
  EVENT_RECEIVE,
  CHECK_REPORT,
  CHECK_REPORT_CONFIRM,
  GET_SECOND_AUTH,
  INSERT_MEMBER_PHONE_BOOK,
  GET_APP_VERSION,
  DELETE_MEMBER_PROFILE_IMAGE,
  FIRST_MATCH_PASS_ADD,
  SAVE_PROFILE_AUTH_COMMENT,
  SAVE_MEMBER_INTRODUCE,
  DAILY_MATCH_ADD_OPEN,
  GET_MEMBER_CHK,
  GET_MEMBER_APPROVAL,
  POPUP_EVENT_LIST,
  UPDATE_MEMBER_MASTER_IMAGE,
  MATCH_CHECK_ALL,
  UPDATE_JOIN_MASTER_IMAGE,
  JOIN_CANCEL,
  POPUP_LIST,
  SHOP_MAIN,
  SAVE_STORY_BOARD,
  GET_STORY_DETAIL,
  SAVE_STORY_REPLY,
  SAVE_STORY_LIKE,
  GET_STORY_ACTIVE,
  GET_STORY_LIKE_LIST,
  GET_STORY_BOARD_LIST,
  SAVE_STORY_VOTE_MEMBER,
  PROFILE_OPEN,
  GET_MATCH_DETAIL,
} from './route';

/* ========================================================================================================
==================================================== AUTH
======================================================================================================== */
//로그인 체크 및 회원정보를 제공한다.
export async function signin(body: { 
  email_id: string;
  password: string;
  sleepPassYn: string;
}) {
  const push_token = await AsyncStorage.getItem(FCM_TOKEN);
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(LOGIN, 'POST', { ...body, push_token, inventory_connect_dt }, true, false);
}
//회원가입시 프로필 2차 인증에 대한 정보를 제공한다.
export async function get_profile_secondary_authentication(body: {
  member_seq: any;
  second_auth_code: string;
}) {
  return send(PROFILE_ATHENTICATION2, 'POST', body, false, false);
}
//회원가입시 프로필 사진에 대한 정보를 제공한다.
export async function get_profile_imgage_guide(body: { member_seq: any }) {
  return send(PROFILE_IMAGE_GUIDE, 'POST', body, false, false);
}
//회원가입시 닉네임, 한줄소개, 관심사 정보를 제공한다.
export async function get_member_introduce_guide(body: { member_seq: any }) {
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
  device_gubun?: string;
  marketing_agree_yn?: string;
}) {
  const push_token = await AsyncStorage.getItem(FCM_TOKEN);
  return send(REGIST_BASE_INFO, 'POST', { ...body, push_token }, false, false);
}

//회원의 프로필 사진을 신규 등록한다.
export async function regist_profile_image(body: {
  member_seq: number;
  file_list: any;
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
  introduce_comment: string;
}) {
  return send(REGIST_MEMBER_INTEREST, 'POST', body, false, false);
}

//회원의 2차 인증정보를 신규 등록한다.
export async function regist_second_auth(body: {
  member_seq: number;
  file_list: any;
  auth_code: string;
  auth_comment: string;
}) {
  return send(REGIST_MEMBER_SECOND_AUTH, 'POST', body, false, false);
}

// 회원 존재여부를 체크한다.
export async function get_member_chk(body: {
  push_token: string;
}) {
  return send(GET_MEMBER_CHK, 'POST', body, false, false);
}

// 회원의 가입심사진행 정보를 조회한다.
export async function get_member_approval(body: {
  member_seq: number;
}) {
  return send(GET_MEMBER_APPROVAL, 'POST', body, false, false);
}

// 아이디 찾기
export async function search_email_id(body: {
  phone_number: string;
}) {
  return send(SEARCH_EMAIL_ID, 'POST', body, false, false);
}

// 비밀번호 찾기
export async function search_password(body: { 
  email_id: string 
}) {
  return send(SEARCH_PASSWORD, 'POST', body, false, false);
}

// 비밀번호 찾기
export async function create_temp_password(body: { 
  email_id: string 
  phone_number: string
}) {
  return send(CREATE_TEMP_PASSWORD, 'POST', body, false, false);
}

// 2차 인증정보 조회
export async function get_second_auth(body: {
  member_seq: any;
}) {
  return send(GET_SECOND_AUTH, 'POST', body, true, false);
}

//회원의 프로필 사진을 삭제한다.
export async function delete_profile_image(body: {
  member_seq: number;
  img_del_seq_str: string;
}) {
  return send(DELETE_MEMBER_PROFILE_IMAGE, 'POST', body, false, false);
}

// 회원의 대표 사진을 변경한다.
export async function update_join_master_image(body: {
  member_seq: number;
  member_img_seq: number;
}) {
  return send(UPDATE_JOIN_MASTER_IMAGE, 'POST', body, false, false);
}

// 회원 가입을 철회한다.
export async function join_cancel(body: {
  member_seq: number;
}) {
  return send(JOIN_CANCEL, 'POST', body, false, false);
}


/* ========================================================================================================
==================================================== USER
======================================================================================================== */
//회원의 정보를 조회한다.
export async function get_my_info() {
  const push_token = await AsyncStorage.getItem(FCM_TOKEN);
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(ME, 'POST', { push_token, inventory_connect_dt }, true, false);
}

//회원의 기본 정보를 저장한다.
export async function update_setting(body: {
  nickname: string;
  comment: string;
  match_yn: string;
  use_pass_yn: string;
  friend_mathch_yn: string;
  recommender: string;
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
  tutorial_daily_yn: string;
	tutorial_live_yn: string;
	tutorial_roby_yn: string;
	tutorial_profile_yn: string;
	tutorial_shop_yn: string;
	tutorial_subscription_item_yn: string;
	tutorial_package_item_yn: string;
}) {
  return send(UPDATE_ADDITIONAL, 'POST', body, true, false);
}

//회원의 보관함 정보를 조회한다.
export async function get_member_storage() {
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(STORAGE, 'POST', { inventory_connect_dt }, true, false);
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
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(PEEK_MEMBER, 'POST', { ...body, inventory_connect_dt }, true, false);
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
export async function get_member_introduce(body: { group_code: string }) {
  return send(MEMBER_INTRODUCE, 'POST', body, true, false);
}

// 회원 로그아웃 한다.
export async function member_logout() {
  return send(MEMBER_LOGOUT, 'POST', undefined, true, false);
}

// 회원 2차 인증 상세 목록을 조회한다.
export async function get_member_second_detail(body: {
  second_auth_code: any;
}) {
  return send(MEMBER_AUTH_DETAIL, 'POST', body, true, false);
}

// 회원 2차 인증을 저장한다.
export async function save_profile_auth(body: { 
  file_list: any;
  auth_code: string;
  auth_comment: string;
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

// 회원 휴면 전환 한다.
export async function update_member_sleep() {
  return send(MEMBER_SLEEP, 'POST', undefined, true, false);
}

// 회원의 메시지 목록을 조회한다.
export async function get_member_message_list() {
  return send(MEMBER_MSG_LIST, 'POST', undefined, true, false);
}

// 회원 문의를 등록합니다.
export async function insert_member_inquiry(body: {
  title: string;
  contents: string;
}) {
  return send(INSERT_MEMBER_INQUIRY, 'POST', body, true, false);
}

//회원 신고 경고를 위한 신고 횟수 조회
export async function report_check_user(body: {
  report_member_seq: number;
}) {
  return send(CHECK_REPORT, 'POST', body, true, false);
}

//회원 신고 경고 유저 확인
export async function report_check_user_confirm(body: {
  report_member_seq: number;
}) {
  return send(CHECK_REPORT_CONFIRM, 'POST', body, true, false);
}

// 회원의 소개 정보를 저장한다.
export async function save_member_introduce(body: {
  comment: string;
  business: string;
  job: string;
  height: string;
  form_body: string;
  religion: string;
  drinking: string;
  smoking: string;
  interest_list: any;
  introduce_comment: string;
}) {
  return send(SAVE_MEMBER_INTRODUCE, 'POST', body, true, false);
}

// 회원의 대표 사진을 변경한다.
export async function update_member_master_image(body: {
  member_img_seq: number;
}) {
  return send(UPDATE_MEMBER_MASTER_IMAGE, 'POST', body, true, false);
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
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(PROFILE_REEXAMINATION, 'POST', { inventory_connect_dt }, true, false);
}

// 회원 프로필 인상 순위를 조회한다.
export async function get_member_face_rank() {
  return send(GET_MEMBER_FACE_RANK, 'POST', undefined, true, false);
}

// 회원 프로필 정보를 조회한다.
export async function get_member_profile_info() {
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(GET_MEMBER_PROFILE_INFO, 'POST', { inventory_connect_dt }, true, false);
}

// 회원 문의를 등록합니다.
export async function save_profile_auth_comment(body: {
  member_auth_seq: any;
  auth_comment: any;
}) {
  return send(SAVE_PROFILE_AUTH_COMMENT, 'POST', body, true, false);
}


/* ========================================================================================================
==================================================== MATCH
======================================================================================================== */
// 데일리 매칭 정보를 조회한다.
export async function get_daily_matched_info(body: {
  gender: string;
}) {
  return send(DAILY_MATCHED_INFO, 'POST', body, true, false);
}

// 데일리 매칭 정보를 조회한다.
export async function get_item_matched_info(body: {
  match_member_seq: string;
}) {
  return send(DAILY_MATCHED_INFO, 'POST', body, true, false);
}

//찐심/관심/거부 매칭 정보를 신규 등록한다.
export async function regist_match_status(body: {
  active_type: string;
  res_member_seq: number;
  special_level: number;
  match_seq: number;
  //message: string;
}) {
  return send(REGIST_MATCHING_INFO, 'POST', body, true, false);
}

//매칭 회원을 신고한다.
export async function report_matched_user(body: {
  report_type_code: string;
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

//매칭된 회원의 기본 정보를 조회한다.
export async function get_member_apply_item_info() {
  return send(MEMBER_APPLY_ITEM_INFO, 'POST', undefined, true, false);
}

//최초 매칭 성공시 패스를 지급한다.
export async function first_match_pass_add(body: {
  match_seq: number;
}) {
  return send(FIRST_MATCH_PASS_ADD, 'POST', body, true, false);
}

// 데일리 매칭 추가 프로필 카드를 공개한다.
export async function daily_match_add_open(body: {
  trgt_member_seq: number;
}) {
  return send(DAILY_MATCH_ADD_OPEN, 'POST', body, true, false);
}

// 매칭을 전체 확인 처리한다.
export async function match_check_all(body: {
  type: string;
}) {
  return send(MATCH_CHECK_ALL, 'POST', body, true, false);
}

// 상대 회원 프로필을 열람한다.
export async function profile_open(body: {
  type: string;
  trgt_member_seq: number;
}) {
  return send(PROFILE_OPEN, 'POST', body, true, false);
}

// 매칭 상세 정보를 조회한다.
export async function get_match_detail(body: {
  type: string;
  match_member_seq: number;
  match_seq: number;
}) {
  return send(GET_MATCH_DETAIL, 'POST', body, true, false);
}



/* ========================================================================================================
==================================================== ORDER
======================================================================================================== */

//인앱 상품 주문
export async function purchase_product(params: {
  device_gubun: string;
  buy_price: string;
  item_name: string;
  item_code: string;
  result_msg: string;
  result_code: string;
  acknowledged: string,
  package_name: string,
  product_id: string,
  purchase_state: string,
  purchase_time: string,
  purchase_token: string,
  quantity: string,
  transaction_id: string,
}) {
  const {
    device_gubun,
    buy_price,
    item_name,
    item_code,
    result_msg,
    result_code,
    acknowledged,
    package_name,
    product_id,
    purchase_state,
    purchase_time,
    purchase_token,
    quantity,
    transaction_id,
  } = params;
  //const receiptDataJson = JSON.parse(receiptData);

  const body = {
    'api-key': 'U0FNR09CX1RPS0VOXzAx',
    device_gubun: device_gubun,
    buy_price: buy_price,
    item_name: item_name,
    item_code: item_code,
    result_msg: result_msg,
    result_code: result_code,
    acknowledged: acknowledged,
    package_name: package_name,
    product_id: product_id,
    purchase_state: purchase_state,
    purchase_time: purchase_time,
    purchase_token: purchase_token,
    quantity: quantity,
    transaction_id: transaction_id,
  };

  return send(ORDER, 'POST', body, true, false);
}

//재고 상품 주문
export async function order_goods(body: {
  prod_seq: string;
  modify_seq: string;
  buy_price: string;
  mobile_os: string;
}) {
  return send(ORDER_GOODS, 'POST', body, true, false);
}

//경매상품 주문
export async function order_auct(body: {
  prod_seq: string;
  modify_seq: string;
  req_bid_price: string;
  now_buy_yn: string;
  mobile_os: string;
}) {
  return send(ORDER_AUCT, 'POST', body, true, false);
}

//회원 주문 목록 조회
export async function get_order_list(body: {

}) {
  return send(ORDER_HISTORY, 'POST', body, true, false);
}

/* ========================================================================================================
==================================================== ITEM
======================================================================================================== */

//인벤토리 보유 아이템 목록 조회
export async function get_my_items(body: {
  cate_group_code: string;
}) {
  return send(ITEM_LIST, 'POST', body, true, false);
}

//아이템 사용
export async function use_item(body: { 
  item_category_code: string;
  cate_group_code: string;
  cate_common_code: string;
  inventory_seq: any;
}) {
  return send(USE_ITEM, 'POST', body, true, false);
}

// 패스 아이템 전체 사용
export async function use_pass_item_all() {
  return send(USE_PASS_ITEM_ALL, 'POST', undefined, true, false);
}

/* ========================================================================================================
==================================================== POINT
======================================================================================================== */

//포인트 내역 조회
export async function get_point_history() {
  return send(POINT_HISTORY, 'POST', undefined, true, false);
}

/* ========================================================================================================
==================================================== PRODUCT
======================================================================================================== */

// 상점 메인 정보를 조회한다.
export async function get_shop_main(body: {
  banner_type: string;
}) {
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(SHOP_MAIN, 'POST', { ...body, inventory_connect_dt}, true, false);
}

// 티아라샵 재고형 상품목록 조회
export async function get_product_list() {
  return send(PRODUCT_LIST, 'POST', undefined, true, false);
}

// 경매 상품 목록 조회
export async function get_auct_product() {
  return send(PRODUCT_AUCT, 'POST', undefined, true, false);
}

// 경매 상품 상세 조회
export async function get_auct_detail(body: {
  prod_seq: string;
  modify_seq: string;
}) {
  return send(PRODUCT_AUCT_DETAIL, 'POST', body, true, false);
}

// BM 상품 조회
export async function get_bm_product(body: { item_type_code: string }) {
  return send(PRODUCT_BM, 'POST', body, true, false);
}

/* ========================================================================================================
==================================================== 배너
======================================================================================================== */

//배너 목록 조회
export async function get_banner_list(body: { 
  banner_type: string;
}) {
  const inventory_connect_dt = await AsyncStorage.getItem('INVENTORY_CONNECT_DT');
  return send(BANNER_LIST, 'POST', { ...body, inventory_connect_dt}, true, false);
}

/* ========================================================================================================
==================================================== 이벤트
======================================================================================================== */

// 캐시백 이벤트 금액 정보 조회
export async function get_cashback_pay_info() {
  return send(EVENT_CASHBACK_PAY, 'POST', undefined, true, false);
}

// 캐시백 이벤트 템플릿 상세 정보 조회
export async function get_cashback_detail_info() {
  return send(EVENT_CASHBACK_DETAIL, 'POST', undefined, true, false);
}

// 캐시백 이벤트 아이템 수령
export async function cashback_item_receive(body: {
  event_tmplt_seq: string;
}) {
  return send(EVENT_CASHBACK_RECEIVE, 'POST', body, true, false);
}

// 이벤트 보상을 처리한다.
export async function event_receive(body: {
  event_seq: number;
  reward_dup_yn: string;
}) {
  return send(EVENT_RECEIVE, 'POST', body, true, false);
}

// 팝업 이벤트 목록을 조회한다.
export async function get_popup_event_list(body: {
  view_type: string;
}) {
  return send(POPUP_EVENT_LIST, 'POST', body, true, false);
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

// #### 최근소식 상세를 본다.
export async function board_detail_view(body: { 
  board_seq: number 
}) {
  return send(BOARD_DETAIL_VIEW, 'POST', body, true, false);
}

// #### 나이스 인증 모듈을 실행한다.
export async function nice_auth(body: {
  auth_type: string;
}) {
  return send(NICE_AUTH, 'POST', body, false, false);
}

//회원의 실시간성 정보를 조회한다.
export async function set_member_phone_book(body: {
  phone_book_list: string;
  friend_match_yn: string;
}) {
  return send(INSERT_MEMBER_PHONE_BOOK, 'POST', body, true, false);
}

// 앱 버전 정보를 조회한다.
export async function get_app_version(body: {
  device_type: string;
}) {
  return send(GET_APP_VERSION, 'POST', body, true, false);
}


/* ========================================================================================================
==================================================== 팝업
======================================================================================================== */

// 팝업 목록을 조회한다.
export async function get_popup_list(body: { 
  pop_type: string;
}) {
  return send(POPUP_LIST, 'POST', body, true, false);
};



/* ========================================================================================================
==================================================== 스토리
======================================================================================================== */

// 스토리 게시글 목록을 조회한다.
export async function get_story_board_list(body: { 
  load_type: string;
  page_num: number;
}) {
  return send(GET_STORY_BOARD_LIST, 'POST', body, true, false);
};

// 스토리 게시글을 저장한다.
export async function save_story_board(body: {
  story_board_seq: number;
  story_type: string;
  contents: string;
  img_file_list: any;
  img_del_seq_str: string;
  vote_list: any;
  vote_end_type: string;
}) {
  return send(SAVE_STORY_BOARD, 'POST', body, true, false);
};

// 스토리 게시글 상세 정보를 조회한다.
export async function get_story_detail(body: {
  story_board_seq: number;
}) {
  return send(GET_STORY_DETAIL, 'POST', body, true, false);
};

// 스토리 댓글을 저장한다.
export async function save_story_reply(body: {
  story_reply_seq: number;
  story_board_seq: number;
  reply_contents: string;
  group_seq: number;
  depth: number;
}) {
  return send(SAVE_STORY_REPLY, 'POST', body, true, false);
};

// 스토리 좋아요를 저장한다.
export async function save_story_like(body: {
  type: string;
  story_board_seq: number;
  story_reply_seq: number;
}) {
  return send(SAVE_STORY_LIKE, 'POST', body, true, false);
};

// 스토리 활동 정보를 조회한다.
export async function get_story_active(body: {
  
}) {
  return send(GET_STORY_ACTIVE, 'POST', body, true, false);
};

// 스토리 좋아요 목록을 조회한다.
export async function get_story_like_list(body: {
  
}) {
  return send(GET_STORY_LIKE_LIST, 'POST', body, true, false);
};

// 스토리 투표 회원을 저장한다.
export async function save_story_vote_member(body: {
  story_board_seq: number;
  story_vote_seq: number;
}) {
  return send(SAVE_STORY_VOTE_MEMBER, 'POST', body, true, false);
};