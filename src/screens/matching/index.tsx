import {
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BottomParamList,
  ColorType,
  CommonCode,
  Interview,
  MemberBaseData,
  ProfileImg,
  ScreenNavigationProp,
} from '@types';
import {
  get_daily_matched_info,
  regist_match_status,
  report_matched_user,
} from 'api/models';
import { Color } from 'assets/styles/Color';

import { BarGrap } from 'component/BarGrap';
import { CommonBtn } from 'component/CommonBtn';
import { CommonCheckBox } from 'component/CommonCheckBox';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import { usePopup } from 'Context';
import * as hooksMember from 'hooks/member';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { modalStyle } from 'assets/styles/Styles';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { NotificationActionResponse } from 'react-native-notifications/lib/dist/interfaces/NotificationActionResponse';
import { SimpleGrid } from 'react-native-super-grid';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { MatchSearch } from 'screens/matching/MatchSearch';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<BottomParamList, 'Roby'>;
  route: RouteProp<BottomParamList, 'Roby'>;
}

export default function Matching(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const scrollRef = useRef();

  const { show } = usePopup(); // 공통 팝업

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
    report_code_list: [],
    safe_royal_pass: Number,
  });

  // 신고목록
  const [reportTypeList, setReportTypeList] = useState([
    { text: '', value: '' },
  ]);

  // 선택된 신고하기 타입
  const [checkReportType, setCheckReportType] = useState(['']);

  // 신고 Pop
  const report_modalizeRef = useRef<Modalize>(null);
  const report_onOpen = () => {
    report_modalizeRef.current?.open();
  };
  const report_onClose = () => {
    report_modalizeRef.current?.close();
  };

  // ################################################################ 초기 실행 함수
  useEffect(() => {
    if (isFocus) {
      // 데일리 매칭 정보 조회
      getDailyMatchInfo();
    }
  }, [isFocus]);

  // ############################################################ 데일리 매칭 정보 조회
  const getDailyMatchInfo = async () => {
    try {
      const { success, data } = await get_daily_matched_info();

      if (success) {
        if (data.result_code == '0000') {
          setData(data);
        } else {
          show({ content: '시스템 오류입니다.\n관리자에게 문의해 주세요!' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  /* #############################################
	##### 거부/찐심/관심 팝업 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	############################################# */
  const popupActive = (activeType: string) => {
    if (activeType == 'interest') {
      show({
				title: '관심 보내기',
				content: '패스를 소모하여 관심을 보내시겠습니까?\n패스 x5' ,
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType);
				}
			});
    } else if (activeType == 'sincere') {
      show({
				title: '찐심 보내기',
				content: '보유 찐심\nx' + data?.safe_royal_pass ,
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType);
				}
			});
    } else if (activeType == 'pass') {
      show({
				title: '매칭 취소',
				content: '이성을 거부하시겠습니까?' ,
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType);
				}
			});
    }
  };

  // ############################################################ 찐심/관심/거부 저장
  const insertMatchInfo = async (activeType: string) => {

    const body = {
      active_type: activeType,
      res_member_seq: data.match_member_info.member_seq,
    };
    try {
      const { success, data } = await regist_match_status(body);

      if(success) {
        if(data.result_code == '0000') {
          dispatch(myProfile());
          getDailyMatchInfo();
          //setIsLoad(false);
        } else if (data.result_code == '6010') {
          show({ content: '보유 패스가 부족합니다.' });
          return false;
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################ 사용자 신고하기 - 신고사유 체크 Callback 함수
  const reportCheckCallbackFn = (reportType: string, check: boolean) => {
    if (check) {
      checkReportType.push(reportType);
      setCheckReportType(
        checkReportType.filter((e, index) => checkReportType.indexOf(e) === index && e)
      );
    } else {
      setCheckReportType(
        checkReportType.filter((e) => e != reportType && e)
      );
    }
  };

  // ############################################################ 사용자 신고하기 - 팝업 활성화
  const popupReport = () => {
    if (!checkReportType.length) {
      show({ content: '신고항목을 선택해주세요.' });
      return false;
    } else {
      report_onOpen();
    }
  };

  // ############################################################ 사용자 신고하기 등록
  const insertReport = async () => {

    const body = {
      report_type_code_list: checkReportType.join(),
      report_member_seq: data.memberBase.member_seq
    };
    try {
      const { success, data } = await report_matched_user(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        }

        show({ content: '신고 처리 되었습니다.' });

        setCheckReportType([]);
        //setReportPopup(false);
        getDailyMatchInfo();
        //setIsLoad(false);

        // 스크롤 최상단 이동
        /* scrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        }); */
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }

  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <TopNavigation currentPath={'LIMEETED'} />

      {/* ####################################################################################
      ####################### 상단 영역
      #################################################################################### */}
      <View>
        <FlatList
          data={data?.profile_img_list}
          renderItem={RenderItem}
          horizontal
          pagingEnabled
        />

        <View style={styles.absoluteView}>
          <View style={styles.badgeContainer}>
            <View style={styles.authBadge}>
              <Text style={styles.whiteText}>인증 완료</Text>
            </View>
            <View style={styles.redBadge}>
              <Image source={ICON.whiteCrown} style={styles.crownIcon} />
              <Text style={styles.whiteText}>{data.match_member_info?.profile_score}</Text>
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{data.match_member_info?.nickname}, {data.match_member_info?.age}</Text>
            <Image source={ICON.checkICon} style={styles.checkIcon} />
          </View>
          {/* <View style={styles.distanceContainer}>
            <Image source={ICON.marker} style={styles.markerIcon} />
            <Text style={styles.regionText}>경기도 수원시 12.9Km</Text>
          </View> */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={() => { popupActive('pass'); }}>
              <Image source={ICON.closeCircle} style={styles.smallButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { popupActive('sincere'); }}>
              <Image source={ICON.ticketCircle} style={styles.largeButton} />
            </TouchableOpacity >
            <TouchableOpacity onPress={() => { popupActive('interest'); }} style={styles.freePassContainer}>
              <Image source={ICON.heartCircle} style={styles.largeButton} />
              <View style={styles.freePassBage}>
                <Text style={styles.freePassText}>자유이용권 ON</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={ICON.starCircle} style={styles.smallButton} />
            </TouchableOpacity>
          </View>
        </View>

        {/* <AbsoluteView member={data.match_member_info}  /> */}
      </View>

      <View style={styles.padding}>
        {/* 부스트 */}
        {data.match_member_info.boost_yn === 'Y' && (
          <View style={styles.boostPannel}>
            <View style={styles.boostBadge}>
              <Text style={styles.boostBadgeText}>BOOST</Text>
            </View>
            <Text style={styles.boostTitle}>부스터 회원을 만났습니다.</Text>
            <Text style={styles.boostDescription}>
              관심이나 찐심을 보내면 소셜 평점 보너스가 부여됩니다.
            </Text>
          </View>
        )}
        
        {/* 프로필 인증 */}
        <ProfileAuth data={data.second_auth_list} />

        {data.interest_list.length > 0 && (
          <>
            <Text style={styles.title}>방배동아이유님의 관심사</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
              {data.interest_list.map((item, index) => {
                const isOn = true;
                return (
                  <View style={styles.interestItem(isOn)}>
                    <Text style={styles.interestText(isOn)}>{item.code_name}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <Text style={styles.title}>프로필 활동지수</Text>
        <View style={styles.profileActivePannel}>
          <Text style={styles.profileEverageText}>프로필 평점</Text>
          <Text style={styles.profileActiveText1}>
            리미티드에 퍼진{' '}
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              {data.match_member_info.nickname}
            </Text>
            님의 인상
          </Text>
          <Text style={styles.profileActiveText2}>{data.match_member_info.face_code_name}</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderText}>프로필 평점 {data.match_member_info.profile_score}</Text>
            <Slider
              value={data.match_member_info.profile_score/10}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={ColorType.purple}
              minimumTrackTintColor={ColorType.purple}
              containerStyle={styles.sliderContainerStyle}
              trackStyle={styles.sliderThumbStyle}
              trackClickable={false}
            />
            <View style={styles.gageContainer}>
              <Text style={styles.gageText}>0</Text>
              <Text style={styles.gageText}>5</Text>
              <Text style={styles.gageText}>10</Text>
            </View>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialEverageText}>내 소셜 평점</Text>
          <Text style={styles.socialText1}>매칭되면</Text>
          <Text style={styles.socialText1}>
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              후회하지 않을듯한
            </Text>{' '}
            느낌이 들어요
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderText}>소셜 평점 {data.match_member_info.social_grade}</Text>
            <Slider
              value={data.match_member_info.social_grade/10}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={'#fe0456'}
              minimumTrackTintColor={'#ff9fbe'}
              containerStyle={styles.socialSliderContainerStyle}
              trackStyle={styles.socialSliderThumbStyle}
              trackClickable={false}
            />
            <View style={styles.gageContainer}>
              <Text style={styles.gageText}>0</Text>
              <Text style={styles.gageText}>5</Text>
              <Text style={styles.gageText}>10</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => { report_onOpen(); }}>
          <View style={styles.reportButton}>
            <Text style={styles.reportText}>신고하기</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />


      {/* ###############################################
                        사용자 신고하기 팝업
            ############################################### */}
      <Modalize
        ref={report_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            사용자 신고하기
          </CommonText>
          <TouchableOpacity onPress={report_onClose}>
            <Image source={ICON.xBtn} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>

        <View style={modalStyle.modalBody}>
          <SpaceView mb={13}>
            <CommonText textStyle={[styles.reportText, {color: ColorType.black0000}]}>신고사유를 알려주시면 더 좋은{'\n'}리미티드를 만드는데 도움이 됩니다.</CommonText>
          </SpaceView>

          <SpaceView mb={24}>
            {data.report_code_list.length &&
              data.report_code_list.map((i, index) => (
                <CommonCheckBox
                  label={i.code_name}
                  value={i.common_code}
                  key={index + '_' + i.common_code}
                  callBackFunction={reportCheckCallbackFn}
                />
              ))}
          </SpaceView>

          <SpaceView mb={16}>
            <CommonBtn
              value={'신고하기'}
              onPress={popupReport}
              type={'black'}
              height={59} 
              fontSize={19}
            />
          </SpaceView>
        </View>
      </Modalize>

    </ScrollView>
    
  );
}
/**
 * 이미지 렌더링
 */
function RenderItem({ item }) {
  const url = findSourcePath(item?.img_file_path);
  return (
    <View>
      <Image
        source={url}
        style={{
          width: width,
          height: height * 0.7,
          borderRadius: 20,
        }}
      />
    </View>
  );
}

/**
 *  이미지 위 정보들
 */
function AbsoluteView(data:any) {
  return (
    <View style={styles.absoluteView}>
      <View style={styles.badgeContainer}>
        <View style={styles.authBadge}>
          <Text style={styles.whiteText}>인증 완료</Text>
        </View>
        <View style={styles.redBadge}>
          <Image source={ICON.whiteCrown} style={styles.crownIcon} />
          <Text style={styles.whiteText}>{data.member?.profile_score}</Text>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{data.member?.nickname}, {data.member?.age}</Text>
        <Image source={ICON.checkICon} style={styles.checkIcon} />
      </View>
      <View style={styles.distanceContainer}>
        <Image source={ICON.marker} style={styles.markerIcon} />
        <Text style={styles.regionText}>경기도 수원시 12.9Km</Text>
      </View> 
      <View style={styles.buttonsContainer}>
        <TouchableOpacity>
          <Image source={ICON.closeCircle} style={styles.smallButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.ticketCircle} style={styles.largeButton} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.freePassContainer}>
          <Image source={ICON.heartCircle} style={styles.largeButton} />
          <View style={styles.freePassBage}>
            <Text style={styles.freePassText}>자유이용권 ON</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.starCircle} style={styles.smallButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const styles = StyleSheet.create({
  absoluteView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -width * 0.15,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: '8%',
    zIndex: 1,
  },
  badgeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    // justifyContent: `center`,
  },
  authBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    // lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 20,
  },
  redBadge: {
    width: 43,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#fe0456',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-around',
    marginLeft: 4,
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  crownIcon: {
    width: 12.7,
    height: 8.4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginTop: 10,
  },
  checkIcon: {
    width: 15,
    height: 15,
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  markerIcon: {
    width: 13,
    height: 17.3,
  },
  regionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  smallButton: {
    width: width * 0.2,
    height: width * 0.2,
  },
  largeButton: {
    width: width * 0.3,
    height: width * 0.3,
  },
  freePassContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freePassBage: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ef486d',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freePassText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ed4771',
  },
  padding: {
    paddingHorizontal: 20,
    marginTop: width * 0.2,
  },
  boostPannel: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f6f7fe',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  boostBadge: {
    width: 54,
    borderRadius: 7.5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  boostBadgeText: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  boostTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#262626',
  },
  boostDescription: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#8e8e8e',
  },

  levelText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  interestItem: (isOn) => {
    return {
      borderRadius: 5,
      backgroundColor: isOn ? 'white' : '#f7f7f7',
      paddingHorizontal: 15,
      paddingVertical: 9,
      marginLeft: 3,
      marginTop: 3,
      borderColor: isOn ? '#7986ee' : '#f7f7f7',
      borderWidth: 1,
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'AppleSDGothicNeoR00',
      fontSize: 12,
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 22,
      letterSpacing: 0,
      textAlign: 'left',
      color: isOn ? '#7986ee' : '#b1b1b1',
    };
  },
  profileActivePannel: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ebedfc',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  profileEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#697ae6',
  },
  profileActiveText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 4,
  },
  profileActiveText2: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#5d6ae2',
    marginTop: 10,
  },
  sliderContainer: {
    marginTop: 26,
    alignItems: 'flex-start',
  },
  sliderText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#b7b7b7',
  },
  sliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
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
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#d0d0d0',
  },
  socialContainer: {
    borderRadius: 20,
    backgroundColor: '#feeff2',
    width: '100%',
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  socialEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#fe0456',
  },
  socialText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#1c1c1c',
  },
  socialSliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fe0456',
  },
  socialSliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  reportButton: {
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#363636',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 20,
  },
  reportText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});

const interest = [
  {
    code_name: '공연보기',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '해외축구',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '집에서 영화보기',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '캠핑',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '동네산책',
    common_code: 'CONC_06_00',
  },

  {
    interest_seq: 454,
    code_name: '반려견과 함께',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '인스타그램',
    common_code: 'CONC_06_00',
  },
];
interface auth {
  member_auth_seq: number;
  auth_level: number;
  auth_status: string;
  code_name: string;
  member_seq: number;
  common_code: string;
}