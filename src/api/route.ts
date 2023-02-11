export const MY_ACCOUNT = '/member/selectMemberInfo';
//export const PURCHASE = '/api/return/msg';
export const PURCHASE = '/order/payment';

/**
 * AUTH
 */
export const LOGIN = '/login/loginProc';
export const PROFILE_ATHENTICATION2 = '/join/getProfileSecondAuth';
export const PROFILEIMAGE_GUIDE = '/join/getProfileImage';
export const MEMBER_INTRODUCE_GUIDE = '/join/getMemberIntro';
export const MEMBER_BASE_INFO = '/join/insertMemberInfo';
export const REGIST_MEMBER_PROFILE_IMAGE = '/join/insertMemberProfileImage';

/**
 * USER
 */

export const ME = '/member/selectMemberInfo';
export const UPDATE_SETTING = '/member/saveMemberBase';
export const UPDATE_ADDITIONAL = '/member/saveMemberAddInfo';
export const STORAGE = '/member/getMemberStorageInfo';
export const UPDATE_PREFERENCE = '/member/saveMemberIdealType';
export const UPDATE_PROFILE_IMAGE = '/member/saveProfileImage';
export const UPDATE_PROFILE_ATHENTICATION2 = '/member/saveProfileSecondAuth';
export const PEEK_MEMBER = '/member/getRealTimeMemberInfo';
export const MEMBER_PROFILE_ATHENTICATION2 =
  '/member/getMemberProfileSecondAuth';

export const MEMBER_REEXAMINATION = '/member/profileReexProc';
export const UPDATE_INTERVIEW = '/member/saveMemberInterview';
export const GET_POINT = '/member/getMemberHasPoint';

/**
 * PROFILE
 */

export const REGIST_PROFILE_EVALUATION = '/profile/insertProfileAssessment';

/**
 * MATCHING
 */
export const DAILY_MATCHED_INFO = '/match/getDailyMatchInfo';
export const REGIST_MATCHING_INFO = '/match/insertMatchInfo';
export const REPORT = '/match/insertReport';
export const LIVE_MEMBERS = '/match/selectLiveMatchTrgt';
export const MATCHED_MEMBER_INFO = '/match/selectMatchMemberInfo';
export const UPDATE_MATCH = '/match/updateMatchInfo';
export const UPDATE_MATCH_STATUS = '/match/updateMatchStatus';
export const RESOLVE_MATCH = '/match/procMatchMemberHpOpen';

/**
 * ORDER
 */
export const ORDER = '/order/payment';

/**
 * COMMON
 */

export const COMMON_CODE = '/common/selectGroupCodeList';