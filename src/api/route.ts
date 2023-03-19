export const MY_ACCOUNT = '/member/selectMemberInfo';
//export const PURCHASE = '/api/return/msg';
export const PURCHASE = '/order/payment';

/**
 * AUTH
 */
export const LOGIN = '/login/loginProc';
export const PROFILE_ATHENTICATION2 = '/join/getProfileSecondAuth';
export const PROFILE_IMAGE_GUIDE = '/join/getProfileImage';
export const MEMBER_INTRODUCE_GUIDE = '/join/getMemberIntro';
export const REGIST_BASE_INFO = '/join/insertMemberInfo';
export const REGIST_MEMBER_PROFILE_IMAGE = '/join/insertMemberProfileImage';
export const REGIST_MEMBER_INTEREST = '/join/insertMemberIntro';
export const REGIST_MEMBER_SECOND_AUTH = '/join/insertMemberSecondAuth';


/**
 * USER
 */
export const ME = '/member/selectMemberInfo';
export const UPDATE_SETTING = '/member/saveMemberBase';
export const UPDATE_ADDITIONAL = '/member/saveMemberAddInfo';
export const STORAGE = '/member/getMemberStorageInfo';
export const UPDATE_PREFERENCE = '/member/saveMemberIdealType';
export const UPDATE_PROFILE = '/member/saveMemberProfile';
export const UPDATE_PROFILE_ATHENTICATION2 = '/member/saveProfileSecondAuth';
export const PEEK_MEMBER = '/member/getRealTimeMemberInfo';
export const MEMBER_PROFILE_ATHENTICATION2 = '/member/getMemberProfileSecondAuth';
export const MEMBER_INTERVIEW = '/member/getMemberInterviewList';
export const MEMBER_INTRODUCE = '/member/getMemberIntroduce';
export const UPDATE_INTERVIEW = '/member/saveMemberInterview';
export const GET_POINT = '/member/getMemberHasPoint';
export const MEMBER_LOGOUT = '/member/logoutProc';
export const SAVE_PROFILE_AUTH = '/member/saveProfileSecondAuth';
export const MEMBER_AUTH_DETAIL = '/member/selectMemberSecondAuthDetailList';
export const UPDATE_PHONE_NUMBER = '/member/modfyMemberPhoneNumber';
export const MEMBER_EXIT = '/member/deleteMyAccount';
export const UPDATE_PASSWORD = '/changePassword/updateNewPassword';
export const EMAILDID_FROM_PHONENUMBER = '/login/selectEmailIdFromPhoneNumber';
export const PASSWORD_FROM_EMAILID = '/login/createMailAndChangePassword';
export const MEMBER_MSG_LIST = '/msg/selectMemberMessageList'


/**
 * PROFILE
 */
export const REGIST_PROFILE_EVALUATION = '/profile/insertProfileAssessment';
export const PROFILE_REEXAMINATION = '/profile/profileReexProc';
export const GET_MEMBER_FACE_RANK = '/profile/getMemberFaceRankList';


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
export const BOARD_LIST = '/board/selectBoardList';
export const NICE_AUTH = '/nice/authToken'