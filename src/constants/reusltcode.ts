export const SUCCESS = "0000";
export const ERROR = "9999";
export const NODATA = "9998";
export const PARAM_ERROR = "9997";

export const LOGIN_EMPTY = "0001";    // 일치하는 회원이 없음
export const LOGIN_WAIT = "0002";     // 가입진행 및 가입승인 대기상태 회원
export const LOGIN_REFUSE = "0003";   // 반려회원
export const LOGIN_EXIT = "0004";     // 탈퇴회원
export const SANCTIONS = "0005";     // 제재회원
export const LOGIN_BLOCK = "0006";     // 신고회원
export const PASSWORD_ERROR = "0010";     // 패스워드 틀림



export default {
  SUCCESS,
  ERROR,
  NODATA,
  PARAM_ERROR,
  LOGIN_EMPTY,
  LOGIN_WAIT,
  LOGIN_REFUSE,
  LOGIN_EXIT,
  SANCTIONS,
  PASSWORD_ERROR,
};
