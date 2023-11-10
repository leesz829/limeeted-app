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

export const GET_MEMBER_CHK = '/join/getMemberChk';
export const GET_MEMBER_APPROVAL = '/join/getMemberApprovalInfo';

export const SEARCH_EMAIL_ID = '/login/searchEmailId';
export const SEARCH_PASSWORD = '/login/searchPassword';
export const CREATE_TEMP_PASSWORD = '/login/createTempPassword';
export const GET_SECOND_AUTH = '/join/getMemberSecondAuth';
export const DELETE_MEMBER_PROFILE_IMAGE = '/join/deleteMemberProfileImage';
export const UPDATE_JOIN_MASTER_IMAGE = '/join/updateMemberMasterImage'
export const JOIN_CANCEL = '/join/joinCancel'


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
export const MEMBER_SLEEP = '/member/updateMemberSleep';
export const UPDATE_PASSWORD = '/changePassword/updateNewPassword';
export const MEMBER_MSG_LIST = '/msg/selectMemberMessageList'
export const INSERT_MEMBER_INQUIRY = '/customerInquiry/insertCustomerInquiry'
export const CHECK_REPORT = '/member/selectCheckReport';
export const CHECK_REPORT_CONFIRM = '/member/updateCheckReportConfirm';
export const INSERT_MEMBER_PHONE_BOOK = '/member/insertMemberPhoneBook';
export const MEMBER_APPLY_ITEM_INFO = '/item/selectMemberApplyItemList';
export const SAVE_MEMBER_INTRODUCE = '/member/saveMemberIntroduce'
export const UPDATE_MEMBER_MASTER_IMAGE = '/member/updateMemberMasterImage'

/**
 * PROFILE
 */
export const REGIST_PROFILE_EVALUATION = '/profile/insertProfileAssessment';
export const PROFILE_REEXAMINATION = '/profile/profileReexProc';
export const GET_MEMBER_FACE_RANK = '/profile/getMemberFaceRankList';
export const GET_MEMBER_PROFILE_INFO = '/profile/getMemberProfileData';
export const SAVE_PROFILE_AUTH_COMMENT = '/profile/saveSecondAuthComment';

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
export const FIRST_MATCH_PASS_ADD = '/match/firstMatchPassAddProc';
export const DAILY_MATCH_ADD_OPEN = '/match/profileCardAddOpen';
export const MATCH_CHECK_ALL = '/match/matchCheckAllProc';
export const PROFILE_OPEN = '/match/profileOpen';
export const GET_MATCH_DETAIL = '/match/getMatchInfoDetail';
export const GET_DAILY_MATCH_LIST = '/match/getDailyMatchList';

/**
 * ORDER
 */
export const ORDER = '/order/payment';
export const ORDER_GOODS = '/order/prod/goodsPayment';
export const ORDER_AUCT = '/order/prod/auctPayment';
export const ORDER_HISTORY = '/order/prod/selectOrderHistory';

/**
 * ITEM
 */
export const ITEM_LIST = '/item/selectinventoryList';
export const USE_ITEM = '/item/useItem';
export const USE_PASS_ITEM_ALL = '/item/usePassItemAll';

/**
 * POINT
 */
export const POINT_HISTORY = '/prod/selectMobileProdList';

/**
 * PRODUCT
 */
export const SHOP_MAIN = '/prod/shopMain';
export const PRODUCT_LIST = '/prod/selectMobileProdList';
export const PRODUCT_AUCT = '/prod/selectAuctProdList';
export const PRODUCT_AUCT_DETAIL = '/prod/selectAuctProdDetail';
export const PRODUCT_BM = '/bm/selectItemList';

/**
 * 베너
 */
export const BANNER_LIST = '/banner/selectBannerList';

/**
 * 이벤트
 */
export const EVENT_CASHBACK_PAY = '/event/selectEventIndex';
export const EVENT_CASHBACK_DETAIL = '/event/selectEventDetail';
export const EVENT_CASHBACK_RECEIVE = '/event/receiveItem';
export const EVENT_RECEIVE = '/event/eventReceive';
export const POPUP_EVENT_LIST = '/event/selectPopupEventList';

/**
 * COMMON
 */
export const COMMON_CODE = '/common/selectGroupCodeList';
export const BOARD_LIST = '/board/selectBoardList';
export const BOARD_DETAIL_VIEW = '/board/boardDetailView';
export const NICE_AUTH = '/nice/authToken';
export const GET_APP_VERSION = '/login/getAppVersion';

/**
 * 팝업
 */
export const POPUP_LIST = '/popup/selectPopList';

/**
 * 스토리
 */
export const GET_STORY_BOARD_LIST = '/story/getStoryBoardList';
export const SAVE_STORY_BOARD = '/story/saveStoryBoard';
export const GET_STORY_DETAIL = '/story/getStoryDetail';
export const SAVE_STORY_LIKE = '/story/saveStoryLike';
export const SAVE_STORY_REPLY = '/story/saveStoryReply';
export const GET_STORY_ACTIVE = '/story/getStoryActive';
export const GET_STORY_LIKE_LIST = '/story/getStoryLikeList';
export const SAVE_STORY_VOTE_MEMBER = '/story/saveStoryVoteMember';
export const STORY_PROFILE_SECRET_PROC = '/story/profileSecretProc';

