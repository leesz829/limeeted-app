import { Slider } from '@miblanchard/react-native-slider';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomParamList, ColorType, ScreenNavigationProp } from '@types';
import { request_reexamination, peek_member, get_board_list, update_setting, set_member_phone_book } from 'api/models';
import { Color } from 'assets/styles/Color';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { STACK } from 'constants/routes';
import * as hooksMember from 'hooks/member';
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
import { myProfile } from 'redux/reducers/authReducer';
import { Privacy } from 'screens/commonpopup/privacy';
import { Terms } from 'screens/commonpopup/terms';
import { findSourcePath, ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import LinearGradient from 'react-native-linear-gradient';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Contacts from 'react-native-contacts';
import { setPartialPrincipal } from 'redux/reducers/authReducer';



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

  const { show } = usePopup(); // 공통 팝업

  const jwtToken = hooksMember.getJwtToken(); // 토큰 추출

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
  
  useEffect(() => {
    getPeekMemberInfo();
    setFriendMatchYn(memberBase?.friend_match_yn == 'N' ? true : false)
  }, [isFocus]);

  // ###### 실시간성 회원 데이터 조회
  const getPeekMemberInfo = async () => {
    const body = {
      img_acct_cnt: memberBase.img_acct_cnt,
      auth_acct_cnt: memberBase.auth_acct_cnt,
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
    console.log('value ::: ' ,value);

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
        dispatch(myProfile());
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

  

  // 별점 이미지 적용
  const showStarImg = (score: number) => {
    let starCnt = score / 2;
    let starIntegerCnt = Math.floor(starCnt);
    let starDecimalScore = score - Math.floor(score);

    console.log('starIntegerCnt :::: ', starIntegerCnt);

    let starImgArr = [];

    for (let i = 1; i <= starIntegerCnt; i++) {
      starImgArr.push(<Image source={ICON.star} style={styles.iconSize24} />);
    }

    if (starDecimalScore) {
      starImgArr.push(
        <Image source={ICON.starHalf} style={styles.iconSize24} />
      );
    }

    return starImgArr;
  };

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
    const { success, data } = await request_reexamination();
    if (success) {
      dispatch(myProfile());

      show({
        title: '알림',
        content: '프로필 재심사가 시작되었습니다.',
        confirmCallback: function () {
          
        },
      });
    } else {
      //show({ content: data.result_msg });

      show({
        title: '알림',
        content: '일시적인 오류가 발생했습니다.',
        confirmCallback: function () {
          
        },
      });
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
  const onPressStorage = async (index:any) => {
    navigation.navigate(STACK.COMMON, {
      screen: 'Storage',
      params: {
        headerType: 'common',
        pageIndex: index,
      },
    });
  };

  const onPressRecent = async () => {
    try {
      const { success, data } = await get_board_list();
      if (success) {
        if (data.result_code == '0000') {
          navigation.navigate(STACK.COMMON, {
            screen: 'Board0',
            params: {
              boardList: data.boardList,
            },
          });
          // 게시판 목록 셋팅
          let boardList = new Array();
        } else {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.',
            confirmCallback: function () {},
          });
        }
      }
    } catch (error) {
      show({
        content: '오류입니다. 관리자에게 문의해주세요.',
        confirmCallback: function () {},
      });
      console.log(error);
    } finally {
    }
  };
  return (
    <>
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
          end={{ x: 1, y: 1 }}></LinearGradient>

        <SpaceView pl={16} pr={16}>
          <SpaceView
            mb={48}
            viewStyle={[layoutStyle.alignCenter, { marginTop: -46 }]}
          >
            <SpaceView mb={8}>
              <TouchableOpacity onPress={onPressEditProfile}>
                <View style={_styles.profileImageWrap}>
                  <Image
                    source={{
                      uri: properties.img_domain + mbrProfileImgList[0].img_file_path,
                    }}
                    style={styles.profileImg}
                  />
                </View>
                <View style={styles.profilePenContainer}>
                    <Image source={ICON.pen} style={styles.iconSize24} />
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
            {memberBase?.reex_yn == 'N' && memberBase?.best_face != null && (
              <>
                <View
                  style={{
                    width: '100%',
                    height: 95,
                    borderRadius: 20,
                    backgroundColor: memberBase.gender == 'M' ? '#ECEFFE' : '#FEEFF2',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <SpaceView>
                      <Image source={memberBase.gender == 'M' ? IMAGE.robyMaleImg : IMAGE.robyFemaleImg} style={{width: '100%', height: 100}} />
                      <SpaceView viewStyle={{position: 'absolute', top: 10, left: 15}}>
                        <CommonText type={'h5'} fontWeight={'700'} textStyle={{marginTop: 3, marginBottom: 5, lineHeight: 18}}>{memberBase?.nickname}님의{'\n'}리미티드 대표 인상</CommonText>
                        <CommonText type={'h5'} fontWeight={'200'} color={memberBase.gender == 'M' ? '#7986EE' : '#FE0456'} textStyle={{marginTop: 0}}>"{memberBase.best_face}"</CommonText>
                      </SpaceView>
                    </SpaceView>
                </View>
              </>
            )}

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressMangeProfile}>
              <Text style={_styles.profileText}>프로필 관리</Text>
              <Image source={ICON.arrow_right} style={styles.iconSize} />
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
                  desc={'내 프로필에 ' + memberBase?.profile_eval_cnt + '명의 회원님이\n평가를 남겨 주셨어요.'}
                  value={memberBase?.profile_score}
                  preScore={memberBase?.prev_profile_score}
                  isPennding={true}
                />
              ) : (
                <RatingCard
                  title={'프로필 평점'}
                  desc={`내 프로필을 평가한\n이성들의 평균 점수 입니다`}
                  value={memberBase?.profile_score}
                  isPennding={reassessment}
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
              />
            </View>
          </View>

          {memberBase?.reex_yn == 'Y' ? (
            <View style={[_styles.pennding, layoutStyle.mb20]}>
              <Text style={_styles.submitText}>내 프로필을 심사중이에요!</Text>
            </View>
          ) : (
            <TouchableOpacity
            onPress={() => profileReexPopupOpen()}
              style={_styles.submitBtn}>
              <Text style={_styles.submitText}>내 프로필 재심사</Text>
            </TouchableOpacity>
          )}

          {/* ################################################################################ 보관함 영역 */}
          <View style={{ marginTop: 16 }}>
            <CommonText fontWeight={'700'} type={'h3'}>
              보관함
            </CommonText>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={() => onPressStorage(0)}
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
              onPress={() => onPressStorage(2)}
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
          </View>

          <SpaceView mb={48}>
            <View style={{ marginTop: 20 }}>
              <CommonText fontWeight={'700'} type={'h3'}>
                매칭 설정
              </CommonText>
            </View>

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

          <SpaceView mb={40}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h3'}>
                그 외 기타
              </CommonText>
            </SpaceView>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressRecent}
            >
              <Text style={_styles.profileText}>최근 소식</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressMangeAccount}
            >
              <Text style={_styles.profileText}>내 계정 정보</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={_styles.manageProfile}
              onPress={onPressCustomerInquiry}
            >
              <Text style={_styles.profileText}>고객문의</Text>
              <View style={_styles.row}>
                <Image source={ICON.arrow_right} style={styles.iconSize} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
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
    </>
  );
};

const _styles = StyleSheet.create({
  profileImageWrap: {
    width: 116,
    height: 116,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#7986ee',
    borderRadius: 60,
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
    borderStyle: 'solid',
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
    marginRight: 4,
    textAlign: 'center',
  },
  badgeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
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
});
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

function RatingCard({ title, desc, value, preScore, isPennding }) {
  return (
    <View style={ratingCard.cardStyle}>
      <Text style={ratingCard.cardTitle}>{title}</Text>

      <View style={ratingCard.middleBox}>
        {typeof preScore != 'undefined' && preScore != null && preScore != 0.0 &&
          <View style={ratingCard.preScoreArea}><Text style={ratingCard.preScoreText}>지난 평점 {preScore}</Text></View>
        }

        <Text style={isPennding ? ratingCard.pendingText : ratingCard.ratingText}>
          {value}
        </Text>
        {isPennding ? (
          <>
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
          <Rating
            readonly
            imageSize={22.7}
            style={{ marginTop: 10 }}
            ratingCount={5}
            jumpValue={0}
            startingValue={Math.floor(value) / 2}
          />
        )}
      </View>
      <View>
        <Text style={ratingCard.desc}>{desc}</Text>
        <RedDot />
      </View>
    </View>
  );
}
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
});