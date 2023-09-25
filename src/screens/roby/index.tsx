import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomParamList, ColorType, ScreenNavigationProp } from '@types';
import {  request_reexamination, peek_member, update_setting, set_member_phone_book, update_additional } from 'api/models';
import { commonStyle, layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { ROUTES, STACK } from 'constants/routes';
import { useLikeList } from 'hooks/useLikeList';
import { useMatches } from 'hooks/useMatches';
import { useUserInfo } from 'hooks/useUserInfo';
import { useProfileImg } from 'hooks/useProfileImg';
import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useDispatch } from 'react-redux';
import { Privacy } from 'screens/commonpopup/privacy';
import { Terms } from 'screens/commonpopup/terms';
import { findSourcePath, ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import LinearGradient from 'react-native-linear-gradient';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Contacts from 'react-native-contacts';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { isEmptyData, formatNowDate } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import { CommaFormat } from 'utils/functions';
import { clearPrincipal } from 'redux/reducers/authReducer';
import { NoticePopup } from 'screens/commonpopup/NoticePopup';
import AsyncStorage from '@react-native-community/async-storage';



const { width, height } = Dimensions.get('window');

/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<BottomParamList, 'Roby'>;
  route: RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  // 공통 팝업
  const { show } = usePopup();

  // 로딩 여부
  const [isLoading, setIsLoading] = useState(false);

  // 클릭 여부
  const [isClickable, setIsClickable] = useState(true);

  // 공지사항 팝업
  const [noticePopupVisible, setNoticePopupVisible] = useState(false);
  const [noticeList, setNoticeList] = useState([]);

  // 회원 기본 정보
  const memberBase = useUserInfo(); //hooksMember.getBase();
  const mbrProfileImgList = useProfileImg();
  const likes = useLikeList();
  const matches = useMatches();

  const [resLikeList, setResLikeList] = useState([]);
  const [matchTrgtList, setMatchTrgtList] = useState([]);
  const [reassessment, setReassessment] = useState(false);
  const [friendMatchYn, setFriendMatchYn] = useState(false);
  const [friendTypeFlag, setFriendTypeFlag] = useState(false);
  
  // ###### 실시간성 회원 데이터 조회
  const getPeekMemberInfo = async () => {
    const body = {
      img_acct_cnt: memberBase?.img_acct_cnt,
      auth_acct_cnt: memberBase?.auth_acct_cnt,
    };
    try {
      const { success, data } = await peek_member(body);
      if (success) {
        if (data.result_code == '0000') {
          dispatch(setPartialPrincipal({
            mbr_base : data.mbr_base
          }));
          setResLikeList(data.res_like_list);
          setMatchTrgtList(data.match_trgt_list);

          // 공지사항 팝업 노출
          let nowDt = formatNowDate().substring(0, 8);
          let endDt = await AsyncStorage.getItem('POPUP_ENDDT_NOTICE');

          if(null == endDt || endDt < nowDt) {
            if(data.popup_bas_list?.length > 0 && isEmptyData(data.popup_bas_list[0]?.popup_detail) && data.popup_bas_list[0]?.popup_detail.length > 0) {
              setNoticeList(data.popup_bas_list[0]?.popup_detail);
              setNoticePopupVisible(true);
            }
          };

        } else {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.',
            confirmCallback: function () {},
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ###### 아는 사람 소개
  const insertMemberPhoneBook = async (phone_book_arr: string, friend_match_flag:string) => {

    const body = {
      phone_book_list: phone_book_arr,
      friend_match_yn : friend_match_flag
    };

    try {
      const { success, data } = await set_member_phone_book(body);
    
      if (success) {
        if (data.result_code != '0000') {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.',
            confirmCallback: function () {},
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // 회원 정보 수정
  const updateMemberInfo = async (type: string, value: string) => {
    let body = {};
    /*
     * 01 : 내 프로필 공개
     * 02 : 아는 사람 제외
     * 03 : 푸시 알림 받기
     */

    // 01 : 내 프로필 공개, 03 : 푸시 알림 받기
    if (type == '01' || type == '03') {
      if(type == '01') {
        body = { match_yn: value, };
      } else if(type == '03') {
        body = { push_alarm_yn: value, };
      }

      const { success, data } = await update_setting(body);
      if (success) {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      }

    }
    // 02 : 아는 사람 제외
    else {
      let tmp_phone_book_arr: string[] = [];

      if (await grantedCheck()) {
        Contacts.getAll().then(contacts => {
          contacts.forEach(contact => {
            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
              console.log(contact.phoneNumbers[0].number); // 첫 번째 전화번호 가져오기
              tmp_phone_book_arr.push(contact.phoneNumbers[0].number);
            }
          });

          insertMemberPhoneBook(tmp_phone_book_arr.toString(), value);
        }).catch(error => {
          // 연락처 가져오기 실패
          console.log(error);
          setFriendTypeFlag(true);
          setFriendMatchYn(false);
          insertMemberPhoneBook("", "Y");
        });
      } else {
        setFriendTypeFlag(true);
        setFriendMatchYn(false);
        show({ title: '아는 사람 제외', content: '기기에서 연락처 접근이 거부된 상태입니다. \n기기의 앱 설정에서 연락처 접근 가능한 상태로 변경해주세요.'});
        insertMemberPhoneBook("", "Y");
      }
    }
  };

  const grantedCheck = async () => {
    let grantedFlag = false;

    try {
      // IOS 위치 정보 수집 권한 요청
      if (Platform.OS === 'ios') {
        grantedFlag = true;
      }
      // AOS 위치 정보 수집 권한 요청
      else if (Platform.OS === 'android') {
        // Check if permission is granted
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          grantedFlag = true;
        }else{
          grantedFlag = false;
        }
      }

      return grantedFlag;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // ############################################################ 프로필 재심사 팝업 활성화
  const profileReexPopupOpen = async () => {
    if(memberBase?.pass_has_amt < 30) {
      show({
        title: '재화 부족',
        content: '보유 재화가 부족합니다.',
        confirmCallback: function () {},
      });
    } else {
      show({
        title: '프로필 재심사',
        content: '프로필 재심사 대기열에 등록하시겠습니까?\n패스 x30',
        cancelCallback: function() {
  
        },
        confirmCallback: function () {
          profileReexProc();
        },
      });
    }
  }

  // ############################################################ 프로필 재심사 실행
  const profileReexProc = async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      try {
        const { success, data } = await request_reexamination();
        if (success) {
          dispatch(setPartialPrincipal({ mbr_base : data.mbr_base }));

          show({
            type: 'RESPONSIVE',
            content: '프로필 재심사가 시작되었습니다.',
          });
  
        } else {
          show({ content: '일시적인 오류가 발생했습니다.' });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
        setIsLoading(false);
      }
    }

  };

  // ####################################################### 팝업 관련 #######################################################

  const [profileReAprPopup, setProfileReAprPopup] = useState(false); // 프로필 재심사 팝업
  const [useReportPopup, setUseReportPopup] = useState(false); // 사용자 신고하기 팝업

  // 내 선호 이성 Pop
  const ideal_modalizeRef = useRef<Modalize>(null);
  const ideal_onOpen = () => {
    ideal_modalizeRef.current?.open();
  };
  const ideal_onClose = () => {
    ideal_modalizeRef.current?.close();
  };

  // 이용약관 팝업
  const terms_modalizeRef = useRef<Modalize>(null);
  const terms_onOpen = () => {
    terms_modalizeRef.current?.open();
  };
  const terms_onClose = () => {
    terms_modalizeRef.current?.close();
  };

  // 개인정보 취급방침 팝업
  const privacy_modalizeRef = useRef<Modalize>(null);
  const privacy_onOpen = () => {
    privacy_modalizeRef.current?.open();
  };
  const privacy_onClose = () => {
    privacy_modalizeRef.current?.close();
  };

  const onPressEditProfile = () => {
    navigation.navigate(STACK.COMMON, { screen: 'Introduce' });
  };
  const onPressMangeProfile = () => {
    navigation.navigate(STACK.COMMON, { screen: 'Profile1' });
  };
  const onPressMangeAccount = () => {
    navigation.navigate(STACK.COMMON, { screen: 'Profile' });
  };
  const onPressPreferneces = () => {
    navigation.navigate(STACK.COMMON, { screen: 'Preference' });
  };
  const onPressCustomerInquiry = () => {
    navigation.navigate(STACK.COMMON, { screen: 'CustomerInquiry' });
  };
  const onPressTutorialSetting = () => {
    navigation.navigate(STACK.COMMON, { screen: 'TutorialSetting' });
  };

  // 나의 데일리 뷰 화면 이동
  const onPressMyDailyView = () => {
    navigation.navigate(STACK.COMMON, { screen: 'MyDailyView' });
  };

  // 보관함 이동
  const onPressStorage = async (loadPage:any) => {
    navigation.navigate(STACK.COMMON, {
      screen: 'Storage',
      params: {
        headerType: 'common',
        loadPage: loadPage,
      },
    });
  };

  // 최근 소식 이동
  const onPressRecent = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'Board0',
    });
  };

  // 가이드 팝업 활성화
  const popupProfileGuideOpen = async () => {
    show({
      type: 'GUIDE',
      guideType: 'ROBY_PROFILE',
      guideSlideYn: 'Y',
      guideNexBtnExpoYn: 'N',
    });
  };

  const popupGradeGuideOpen = async () => {
    show({
      type: 'GUIDE',
      guideType: 'ROBY_GRADE',
      guideSlideYn: 'Y',
      guideNexBtnExpoYn: 'N',
    });
  }

  // ####################################################################################### 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_roby_yn: 'N'
    };
    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      }
    }
  };

  // ######################################################################################## 초기 실행 함수
  useEffect(() => {
    if(isFocus) {
      if(memberBase?.status == 'BLOCK') {
        show({
          title: '서비스 이용 제한 알림',
          content: '서비스 운영정책 위반으로 회원님의 계정상태가\n이용제한 상태로 전환되었습니다.\n문의사항 : cs@limeeted.com',
          confirmCallback: function() {
            dispatch(clearPrincipal());
          }
        });
      } else {
        getPeekMemberInfo();
        setFriendMatchYn(memberBase?.friend_match_yn == 'N' ? true : false);

        // 튜토리얼 팝업 노출
        if(!isEmptyData(memberBase?.tutorial_roby_yn) || memberBase?.tutorial_roby_yn == 'Y') {
          show({
            type: 'GUIDE',
            guideType: 'ROBY',
            guideSlideYn: 'Y',
            guideNexBtnExpoYn: 'Y',
            confirmCallback: function(isNextChk) {
              if(isNextChk) {
                saveMemberTutorialInfo();
              }
            }
          });
        };
      }
    };
  }, [isFocus]);


  return (
    <>
      {isLoading && <CommonLoading />}

      <TopNavigation currentPath={''} theme />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: 'white',
          flexGrow: 1,
        }}
        style={{ backgroundColor: 'white' }} >

        <LinearGradient
          colors={['#89b0fa', '#aaa1f7']}
          style={{
            width: '100%',
            height: 151,
            borderTopWidth: 1,
            borderTopColor: '#00FFFF'
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} />

        <SpaceView pl={16} pr={16}>
          <SpaceView
            mb={48}
            viewStyle={[layoutStyle.alignCenter, { marginTop: -55 }]}>
            
            <SpaceView mb={12}>
              <TouchableOpacity onPress={onPressMyDailyView}>
                <View style={_styles.profileImageWrap}>
                  <Image source={{ uri: properties.img_domain + mbrProfileImgList[0]?.img_file_path }} style={styles.profileImg} />
                </View>
                <View style={styles.profilePenContainer}>
                    <Image source={ICON.searchWhite} style={styles.iconSquareSize(36)} />
                </View>
              </TouchableOpacity>
            </SpaceView>

            <View style={_styles.profileInfoContainer}>
              <Text style={_styles.profileName}>
                {memberBase?.nickname}, {memberBase?.age}
              </Text>
              <Text style={_styles.profileComment}>{memberBase?.comment}</Text>
            </View>

            {memberBase?.auth_acct_cnt > 0 ? (
              <View style={_styles.levelBox}>
                <Text style={_styles.levelText}>
                  LV.{memberBase?.auth_acct_cnt}
                </Text>
              </View>
            ) : null}
          </SpaceView>

          {/* ################################################################################ 프로필 관리 영역 */}
          <View>

            {/* 리밋샵 유입 노출 배너 영역 */}
            {memberBase?.gender == 'W' &&
              <SpaceView mb={12}>

                <LinearGradient
                  colors={['#306FD9', '#306FD9', '#7D1BD2']}
                  start={{ x: 0, y: 5 }}
                  end={{ x: 1, y: 0 }}
                  style={{borderRadius: 15}}>

                  <TouchableOpacity
                    onPress={() => navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_Shop }) }
                    style={{
                      width: '100%',
                      height: 125,
                      borderRadius: 20,
                      position: 'relative',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                    }}>
                    <View>
                      <SpaceView mb={20}>
                        <Text style={_styles.openEventTxt01}><Text style={{color: '#CAAAFF'}}>리밋샵</Text>이 열렸습니다.</Text>
                        <Text style={_styles.openEventTxt02}>교환 가능한 상품을 보러 오세요.</Text>
                      </SpaceView>
                      <SpaceView>
                        <Text style={_styles.openEventLimitTit}>보유 리밋</Text>
                        <Text style={_styles.openEventLimitText}>{CommaFormat(memberBase.mileage_point)}</Text>
                      </SpaceView>
                    </View>
                    <View style={{position: 'absolute', bottom: 10, right: 10}}>
                      <Image source={IMAGE.clothesImg} style={styles.iconSquareSize(60)} />
                    </View>
                  </TouchableOpacity>
                  
                </LinearGradient>
              </SpaceView>
            }

            {/* 대표인상 노출 영역 */}
            {(memberBase?.reex_yn == 'N' && memberBase?.best_face != null) && (
              <View
                style={{
                  width: '100%',
                  height: 95,
                  borderRadius: 20,
                  backgroundColor: memberBase?.gender == 'M' ? '#ECEFFE' : '#FEEFF2',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <SpaceView>
                    <Image source={memberBase?.gender == 'M' ? IMAGE.robyMaleImg : IMAGE.robyFemaleImg} style={{width: '100%', height: 100}} />
                    <SpaceView viewStyle={{position: 'absolute', top: 10, left: 15}}>
                      <CommonText type={'h5'} fontWeight={'700'} textStyle={{marginTop: 3, marginBottom: 5, lineHeight: 18}}>{memberBase?.nickname}님의{'\n'}리미티드 대표 인상</CommonText>
                      <CommonText type={'h5'} fontWeight={'200'} color={memberBase?.gender == 'M' ? '#7986EE' : '#FE0456'} textStyle={{marginTop: 0}}>"{memberBase?.best_face}"</CommonText>
                    </SpaceView>
                  </SpaceView>
              </View>
            )}

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressEditProfile}>
              <Text style={_styles.profileText}>내 소개하기</Text>
              <Image source={ICON.arrow_right} style={styles.iconSize} />
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressMangeProfile}>
              <Text style={_styles.profileText}>프로필 관리</Text>

              <View style={_styles.row}>
                <SpaceView mr={8}>
                  {memberBase?.auth_acct_cnt > 0 && memberBase?.auth_acct_cnt < 10 &&
                    <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {memberBase?.auth_acct_cnt >= 10 && memberBase?.auth_acct_cnt < 15 &&
                    <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level10Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {memberBase?.auth_acct_cnt >= 15 && memberBase?.auth_acct_cnt < 20 &&
                    <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level15Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {memberBase?.auth_acct_cnt >= 20 && memberBase?.auth_acct_cnt < 25 &&
                    <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level20Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {memberBase?.auth_acct_cnt >= 25 && memberBase?.auth_acct_cnt < 30 &&
                    <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level25Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {memberBase?.auth_acct_cnt >= 30 &&
                    <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level30Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                      <Text style={_styles.whiteText}>LV.{memberBase?.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                </SpaceView>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressMangeProfile}>
              <Text style={_styles.profileText}>나에게 관심 있는 이성</Text>
              <View style={_styles.row}>
                <View style={_styles.badge}>
                  <Text style={_styles.badgeText}>36</Text>
                </View>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity> */}

            <View style={_styles.cardContainer}>

              {memberBase?.reex_yn == 'Y' ? (
                <RatingCard
                  title={'프로필 심사중'}
                  //desc={'내 프로필에 ' + memberBase?.profile_eval_cnt + '명의 회원님이\n평가를 남겨 주셨어요.'}
                  desc={'LIVE에서 노출되고 있는 내 프로필을 회원님들이 직접 평가 진행중 이에요.'}
                  value={memberBase?.profile_score}
                  preScore={memberBase?.prev_profile_score}
                  isPennding={true}
                  guideOnPress={popupProfileGuideOpen}
                />
              ) : (
                <RatingCard
                  title={'프로필 평점'}
                  desc={`내 프로필을 평가한\n이성들의 평균 점수 입니다`}
                  value={memberBase?.profile_score}
                  isPennding={reassessment}
                  guideOnPress={popupProfileGuideOpen}
                />
              )}
              <RatingCard
                title={'소셜 평점'}
                desc={
                  memberBase?.social_grade > 9 && '천상계와 신계 그 어딘가의 존재' ||
                  memberBase?.social_grade > 8 && memberBase?.social_grade <= 9 && '미세먼지없이 맑은 하늘 위에 숨쉬는 존재' ||
                  memberBase?.social_grade > 7 && memberBase?.social_grade <= 8 && '쾌청한 하늘 아래 맑은 바닷물과 어울리는 분' ||
                  memberBase?.social_grade > 6 && memberBase?.social_grade <= 7 && '따사로운 햇살이 비치는 꽃길을 걷는 분' ||
                  memberBase?.social_grade > 5 && memberBase?.social_grade <= 6 && '어두운 골목과 화려한 조명의 조화 속에 숨은 사람' ||
                  memberBase?.social_grade > 4 && memberBase?.social_grade <= 5 && '심해로 통하는 어두운 바다에 몸을 담근 자' ||
                  memberBase?.social_grade <= 4 && '깊은 심해를 탐험하는 자'
                }
                value={memberBase?.social_grade.toFixed(1)}
                isPennding={reassessment}
                type={'GRADE'}
                guideOnPress={popupGradeGuideOpen}
              />
            </View>
          </View>

          {memberBase?.reex_yn == 'Y' ? (
            <View style={[_styles.pennding, layoutStyle.mb20]}>
              <Text style={_styles.submitText}>내 프로필 심사 진행중!</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => profileReexPopupOpen()}
              style={_styles.submitBtn}>
              <Text style={_styles.submitText}>내 프로필 재심사</Text>
            </TouchableOpacity>
          )}

          {/* ################################################################################ 보관함 영역 */}
          <SpaceView mt={40}>
            <SpaceView mb={10}>
              <CommonText fontWeight={'700'} type={'h3'}>
                보관함
              </CommonText>
            </SpaceView>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={() => onPressStorage('RES')}
            >
              <Text style={_styles.profileText}>새 관심</Text>
              <View style={_styles.row}>
                <View style={_styles.badge}>
                  <Text style={_styles.badgeText}>{resLikeList?.length}</Text>
                </View>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            {/* <ScrollView horizontal={true}>
              {resLikeList?.map((item, index) => (
                <SpaceView
                  key={`likes-${index}`}
                  viewStyle={styles.circleBox}
                  mr={16}>
                  <Image
                    source={findSourcePath(item.img_file_path)}
                    style={styles.circleBoxImg}
                  />
                </SpaceView>
              ))}
            </ScrollView> */}

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={() => onPressStorage('MATCH')}
            >
              <Text style={_styles.profileText}>새 매칭</Text>
              <View style={_styles.row}>
                <View style={[_styles.badge, { backgroundColor: '#927eff' }]}>
                  <Text style={_styles.badgeText}>{matchTrgtList?.length}</Text>
                </View>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            {/* <ScrollView horizontal={true}>
              {matchTrgtList?.map((item, index) => (
                <SpaceView
                  key={`matches-${index}`}
                  viewStyle={styles.circleBox}
                  mr={16}
                >
                  <Image
                    source={findSourcePath(item.img_file_path)}
                    style={styles.circleBoxImg}
                  />
                </SpaceView>
              ))}
            </ScrollView> */}
          </SpaceView>

          {/* ################################################################################ 보관함 영역 */}
          <SpaceView mt={40}>
            <SpaceView mb={10}>
              <CommonText fontWeight={'700'} type={'h3'}>
                매칭 설정
              </CommonText>
            </SpaceView>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressPreferneces}
            >
              <Text style={_styles.profileText}>내 선호 이성</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled
              style={_styles.manageProfile}>
              <ToolTip
                title={'내 프로필 공개'}
                desc={'내 프로필을 이성들에게 공개할지 설정하는 기능입니다.'}
              />
              <CommonSwich
                callbackFn={(value: boolean) => {
                  updateMemberInfo('01', value ? 'Y' : 'N');
                }}
                isOn={memberBase?.match_yn == 'Y' ? true : false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled
              style={_styles.manageProfile}>
              <ToolTip
                title={'아는 사람 제외'}
                desc={
                  '아는 사람에게 내 프로필을 공개할지 설정할지 하는 기능입니다.' +
                  '\n *기기에서 연락처 접근 권한을 \'허용\'해주셔야 적용됩니다.'
                }
              />
              <CommonSwich
                callbackFn={(value: boolean) => {
                  updateMemberInfo('02', value ? 'N' : 'Y');
                }}
                isOn={friendMatchYn}
                activeTypeFlag={friendTypeFlag}
              />
            </TouchableOpacity>
          </SpaceView>

          {/* ################################################################################ 그 외 기타 */}
          <SpaceView mt={40} mb={40}>
            <SpaceView mb={10}>
              <CommonText fontWeight={'700'} type={'h3'}>
                그 외 기타
              </CommonText>
            </SpaceView>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressRecent}>

              <Text style={_styles.profileText}>최근 소식</Text>
              <View style={_styles.row}>

                {isEmptyData(memberBase?.new_board_cnt) && memberBase?.new_board_cnt > 0 && (
                  <View style={_styles.badge}>
                    <Text style={_styles.badgeText}>{memberBase?.new_board_cnt}</Text>
                  </View>
                )}
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressMangeAccount}>

              <Text style={_styles.profileText}>내 계정 정보</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressCustomerInquiry}>

              <Text style={_styles.profileText}>고객문의</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressTutorialSetting}>

              <Text style={_styles.profileText}>튜토리얼 설정</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled
              style={_styles.manageProfile}>

              <Text style={_styles.profileText}>푸시 알림 받기</Text>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  updateMemberInfo('03', value ? 'Y' : 'N');
                }}
                isOn={memberBase?.push_alarm_yn == 'Y' ? true : false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={terms_onOpen}
            >
              <Text style={_styles.profileText}>이용약관</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={privacy_onOpen}
            >
              <Text style={_styles.profileText}>개인정보 취급방침</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>
          </SpaceView>
        </SpaceView>
      </ScrollView>

      {/* ###############################################
                     내 선호 이성 팝업
         ############################################### */}
      {/* <Modalize
            ref={ideal_modalizeRef}
            adjustToContentHeight={false}
            handleStyle={modalStyle.modalHandleStyle}
            modalStyle={modalStyle.modalContainer}>
            <Preference onCloseFn={ideal_onClose} idealTypeData={member.idealType} />
         </Modalize> */}

      {/* ###############################################
                     프로필 재심사 팝업
         ############################################### */}
      <Modal visible={profileReAprPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                프로필 재심사
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'}>
                프로필 재심사 대기열에 등록하시겠습니까?
              </CommonText>
              <CommonText type={'h5'} color={ColorType.red}>
                패스 x10
              </CommonText>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => setProfileReAprPopup(false)}
              >
                <CommonText fontWeight={'500'}>취소</CommonText>
              </TouchableOpacity>
              <View style={modalStyle.modalBtnline} />
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => profileReexProc()}
              >
                <CommonText fontWeight={'500'} color={ColorType.red}>
                  확인
                </CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ###############################################
                     이용약관 팝업
         ############################################### */}
      <Modalize
        ref={terms_modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        adjustToContentHeight={false}
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView>
              <CommonBtn
                value={'확인'}
                type={'primary'}
                height={60}
								borderRadius={1}
                onPress={terms_onClose}
              />
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h4'}>
                이용약관
              </CommonText>
              <TouchableOpacity onPress={terms_onClose}>
                <Image source={ICON.xBtn2} style={styles.iconSize18} />
              </TouchableOpacity>
            </View>
          </>
        }
      >
        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {/* <SpaceView mb={24}>
            <CommonDatePicker />
          </SpaceView> */}

          <SpaceView mb={24}>
            <Terms />
          </SpaceView>
        </View>
      </Modalize>

      {/* ###############################################
                     개인정보 취급방침 팝업
         ############################################### */}
      <Modalize
        ref={privacy_modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        adjustToContentHeight={false}
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView>
              <CommonBtn
                value={'확인'}
                type={'primary'}
                height={60}
								borderRadius={1}
                onPress={privacy_onClose}
              />
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h4'}>
                개인정보 취급방침
              </CommonText>
              <TouchableOpacity onPress={privacy_onClose}>
                <Image source={ICON.xBtn2} style={styles.iconSize18} />
              </TouchableOpacity>
            </View>
          </>
        }
      >
        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {/* <SpaceView mb={24}>
            <CommonDatePicker />
          </SpaceView> */}

          <SpaceView mb={24}>
            <Privacy />
          </SpaceView>
        </View>
      </Modalize>


      {/* ###############################################
                     공지사항 팝업
      ############################################### */}
      {noticePopupVisible && (
        <NoticePopup
          popupVisible={noticePopupVisible}
          setPopupVIsible={setNoticePopupVisible}
          noticeList={noticeList}
          //etcCallbackFunc={contents.etcCallback}
        />
      )}
    </>
  );
};


{/* #######################################################################################################
##################### RatingCard 영역
####################################################################################################### */}

function RatingCard({ title, desc, value, preScore, isPennding, guideOnPress }) {

  return (
    <View style={ratingCard.cardStyle}>
      <TouchableOpacity style={{flexDirection: 'row'}} onPress={guideOnPress}>
        <Text style={ratingCard.cardTitle}>{title}</Text>
        <Image source={ICON.question} style={[styles.iconSize16, {marginTop: 4, marginLeft: 6}]} />
      </TouchableOpacity>

      <View style={ratingCard.middleBox}>
        {/* {typeof preScore != 'undefined' && preScore != null && preScore != 0.0 &&
          <View style={ratingCard.preScoreArea}><Text style={ratingCard.preScoreText}>지난 평점 {preScore}</Text></View>
        } */}

        <SpaceView mb={15}>
          <Text style={isPennding ? ratingCard.pendingText : ratingCard.ratingText}>
            {isPennding ? preScore : value}
          </Text>
        </SpaceView>
        {isPennding ? (
          <>
              <View style={[ratingCard.scoreContainer, { left: value == 0 ? -10 : value * 10 - 15 + '%' }]}>
                <Text style={ratingCard.scoreText}>{value}</Text>
                <View style={ratingCard.triangle}></View>
              </View>
              <Slider
                value={value / 10}
                animateTransitions={false}
                renderThumbComponent={() => null}
                maximumTrackTintColor={'#8854d2'}
                minimumTrackTintColor={'#8854d2'}
                containerStyle={ratingCard.sliderContainer}
                trackStyle={ratingCard.sliderTrack}
                trackClickable={false}
                disabled
              />
              <View style={ratingCard.gageContainer}>
                <Text style={ratingCard.gageText}>0</Text>
                <Text style={ratingCard.gageText}>5</Text>
                <Text style={ratingCard.gageText}>10</Text>
              </View>
          </>
        ) : (
          <>
            {isEmptyData(value) && (
              <Rating
                readonly
                imageSize={20.7}
                style={{ marginTop: 10 }}
                ratingCount={5}
                jumpValue={0}
                startingValue={Math.floor(value) / 2}
              />
            )}
          </>
        )}
      </View>
      <View>
        <Text style={ratingCard.desc}>{desc}</Text>
        <RedDot />
      </View>
    </View>
  );
};

function RedDot() {
  return (
    <View
      style={{
        width: 4,
        height: 4,
        backgroundColor: '#ff7979',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
        left: -5,
      }}
    />
  );
}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  profileImageWrap: {
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#7986ee',
    borderRadius: 80,
    padding: 3,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  profileInfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#262626',
  },
  profileComment: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#cccccc',
    marginTop: 10,
    paddingHorizontal: 25,
  },
  levelBox: {
    width: 46,
    height: 19,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 7,
  },
  levelText: {
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#adadad',
  },
  manageProfile: {
    height: 62,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 11,
  },
  profileText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646467',
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  badge: {
    borderRadius: 15,
    backgroundColor: '#ff7e8c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 12,
    textAlign: 'center',
  },
  badgeText: {
    width: 15,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    marginTop: 16,
  },

  submitBtn: {
    width: `100%`,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#7986ee',
    marginTop: 16,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  pennding: {
    width: `100%`,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#fe0456',
    marginTop: 16,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  submitText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  rowTextHalfLeft: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#4B4B4B',
    width: '40%',
    paddingVertical: 5,
  },
  rowTextHalfRight: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#4B4B4B',
    width: '60%',
    paddingVertical: 5,
  },

  openEventTxt01: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    color: '#fff',
  },
  openEventTxt02: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#fff',
  },
  openEventLimitTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#CAAAFF',
  },
  openEventLimitText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 24,
    color: '#D5DF4B',
    lineHeight: 28,
  },

  authBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginRight: 5,
  },
  authBadgeImg: {
    marginLeft: -5,
    marginRight: -2,
    marginTop: -2
  },
  authBadgeImg02: {
    marginLeft: -9,
    marginRight: -4,
    marginTop: -3
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },

});

const ratingCard = StyleSheet.create({
  cardStyle: {
    width: (width - 40) / 2,
    height: 264,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  cardTitle: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#aaabbf',
  },
  middleBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: `center`,
  },
  ratingText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 41,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646467',
  },
  pendingText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 41,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 12,
  },
  desc: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#aaabbf',
    height: 40
    
  },
  sliderContainer: {
    width: '100%',
    marginTop: 13,
    height: 20,
    borderRadius: 13,
    backgroundColor: ColorType.primary,
  },
  sliderTrack: {
    height: 20,
    borderRadius: 13,
    backgroundColor: ColorType.grayDDDD,
  },
  gageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#AAABBF',
  },
  myImpressionContainer: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
  },
  preScoreArea: {
    position: 'absolute',
    top: 3,
    left: 0,
  },
  preScoreText: {
    backgroundColor: '#FE0456',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: ColorType.white,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FE0456',
    overflow: 'hidden',
  },
  profileScoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    transform: [{ translateY: 15 }], // 수직 중앙 정렬을 위한 translateY
    alignItems: 'center',
  },
  scoreText: {
    backgroundColor: '#151515',
    color: ColorType.white,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#151515',
    overflow: 'hidden',
  },
  triangle: {
    marginTop: -2,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151515',
    transform: [{ rotate: '180deg' }],
  },
});