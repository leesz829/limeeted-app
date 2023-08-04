import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BottomParamList,
  ColorType,
  CommonCode,
  MemberBaseData,
  ProfileImg,
  ScreenNavigationProp,
} from '@types';
import {
  get_daily_matched_info,
  regist_match_status,
  report_matched_user,
  report_check_user,
  report_check_user_confirm,
  update_additional,
  daily_match_add_open,
} from 'api/models';
import { Color } from 'assets/styles/Color';
import { BarGrap } from 'component/BarGrap';
import { CommonBtn } from 'component/CommonBtn';
import { CommonCheckBox } from 'component/CommonCheckBox';
import { RadioCheckBox_3 } from 'component/RadioCheckBox_3';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
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
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE, GIF_IMG } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
import { formatNowDate} from 'utils/functions';
import { Watermark } from 'component/Watermark';
import SincerePopup from 'screens/commonpopup/sincerePopup';
import Carousel from 'react-native-snap-carousel';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import VisualImage from 'component/match/VisualImage';
import AddInfo from 'component/match/AddInfo';
import ProfileActive from 'component/match/ProfileActive';
import InterviewRender from 'component/match/InterviewRender';
import MemberIntro from 'component/match/MemberIntro';
import { isEmptyData } from 'utils/functions';
import { STACK } from 'constants/routes';
import AsyncStorage from '@react-native-community/async-storage';



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

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // 본인 데이터
  const memberBase = useUserInfo(); //hooksMember.getBase();

  // 매칭 회원 관련 데이터
  const [matchData, setMatchData] = useState<any>({
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
    report_code_list: [],
    safe_royal_pass: Number,
    use_item: {},
    refuse_list: [],
    add_list: [],
  });

  // 신고목록
  const [reportTypeList, setReportTypeList] = useState([
    { text: '', value: '' },
  ]);

  // 선택된 신고하기 타입
  const [checkReportType, setCheckReportType] = useState('');

  // 신고 Pop
  const report_modalizeRef = useRef<Modalize>(null);
  const report_onOpen = () => {
    report_modalizeRef.current?.open();
    setCheckReportType('');
  };

  const report_onClose = () => {
    report_modalizeRef.current?.close();
    setCheckReportType('');
  };

  // 이미지 스크롤 처리
  /* const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
  }; */

  // 팝업 목록
  let popupList = [];
  let isPopup = true;

  // ################################################################ 찐심 모달 관련

  // 찐심 보내기 모달 visible
  const [sincereModalVisible, setSincereModalVisible] = useState(false);

  // 찐심 닫기 함수
  const sincereCloseModal = () => {
    setSincereModalVisible(false);
  };

  // 찐심 보내기 함수
  const sincereSend = (level:number) => {
    insertMatchInfo('sincere', level);
    setSincereModalVisible(false);
  }

  // ############################################################ 데일리 매칭 정보 조회
  const getDailyMatchInfo = async (isPopupShow:boolean) => {

    // 기존 데이터 존재 여부
    let ordMemberSeq = matchData?.match_member_info?.member_seq;

    try {
      const body = {
        gender: memberBase.gender
      }
      const { success, data } = await get_daily_matched_info(body);
      //console.log('get_daily_matched_info data :::: ', data.use_item.FREE_LIKE);
      
      if (success) {
        if (data.result_code == '0000') {

          const auth_list = data?.second_auth_list.filter(item => item.auth_status == 'ACCEPT');
          setMatchData({
            match_member_info: data?.match_member_info,
            profile_img_list: data?.profile_img_list,
            second_auth_list: auth_list,
            interview_list: data?.interview_list,
            interest_list: data?.interest_list,
            report_code_list: data?.report_code_list,
            safe_royal_pass: data?.safe_royal_pass,
            use_item: data?.use_item,
            refuse_list: data?.refuse_list,
            add_list: data?.profile_add_list,
          });

          if(data?.match_member_info == null) {
            setIsLoad(false);
            setIsEmpty(true);
          } else {
            setIsLoad(true);
          }

          // 이벤트 팝업 노출
          if(data.popup_list?.length > 0) {
            popupList = data.popup_list;

            // 튜토리얼 팝업 닫혀있는 경우 호출
            if(isPopupShow) {
              popupShow();
            }
          };

        } else {
          setIsLoad(false);
          setIsEmpty(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################ 팝업 활성화
  const popupShow = async () => {
    if(popupList.length > 0 && isPopup) {
      let type = popupList[0].type;  // 팝업 유형
      let nowDt = formatNowDate().substring(0, 8);
      let endDt = await AsyncStorage.getItem('POPUP_ENDDT_' + type);

      if(null == endDt || endDt < nowDt) {
        show({
          type: 'EVENT',
          eventType: 'EVENT',
          eventPopupList: popupList,
          confirmCallback: async function(isNextChk) {
            if(isNextChk) {
              // 팝업 종료 일시 Storage 저장
              await AsyncStorage.setItem('POPUP_ENDDT_' + type, nowDt);
              isPopup = false;
            }
          },
          etcCallback: async function(pop_bas_seq, sub_img_path, index) {
            navigation.navigate(STACK.COMMON, { 
              screen: 'EventDetail',
              params: {
                index: index,
                view_type: 'MATCH',
              }
            });
          },
        });
      }
    }
  };


  /* #######################################################################
	##### 거부/찐심/관심 팝업 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	####################################################################### */
  const popupActive = (activeType: string) => {
    if (activeType == 'interest') {
      let title = '관심 보내기';
      let content = '패스를 소모하여 관심을 보내시겠습니까?\n패스 x15';

      // 관심 자유이용권 사용시
      if(typeof matchData.use_item != 'undefined' && typeof matchData.use_item.FREE_LIKE != 'undefined') {
        let endDt = matchData?.use_item?.FREE_LIKE?.end_dt;
        if(endDt > formatNowDate()) {
          title = '관심 보내기';
          content = '관심 보내기 자유이용권 사용중\n패스 소모없이 관심을 보냅니다.';
        } else {
          title = '부스팅 만료';
          content = '관심 보내기 자유이용권(1일) 아이템의 구독기간이 만료된 상태입니다.\n패스 15개가 소모됩니다.';
        }
      }

      show({
				title: title,
				content: content,
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType, 0);
				}
			});
    } else if (activeType == 'sincere') {
      setSincereModalVisible(true);

    } else if (activeType == 'pass') {
      show({
				title: '매칭 취소',
				content: '매칭을 취소하고 다음 프로필 카드를 확인 하시겠습니까?' ,
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType, 0);
				}
			});
    } else if(activeType == 'zzim') {

      // 찜하기 사용시
      if(typeof matchData.use_item != 'undefined' && typeof matchData.use_item.WISH != 'undefined') {
        let nowDate = formatNowDate();
        let endDt = matchData?.use_item?.WISH?.end_dt;
        if(Number(endDt) < Number(formatNowDate())) {
          show({
            title: '찜하기 이용권 만료',
            content: '찜하기 이용권 아이템의 구독기간이 만료된 상태입니다.',
          });
        } else {
          insertMatchInfo(activeType, 0);
        }
      }
    }

  };

  // ############################################################ 찐심/관심/거부 저장
  const insertMatchInfo = async (activeType: string, special_level: number) => {
    const body = {
      active_type: activeType,
      res_member_seq: matchData.match_member_info?.member_seq,
      special_level: special_level,
    };

    try {
      const { success, data } = await regist_match_status(body);

      if(success) {
        if(data.result_code == '0000') {
          dispatch(myProfile());
          getDailyMatchInfo();
          setIsLoad(false);

          if(activeType == 'zzim') {
            show({
              type: 'RESPONSIVE',
              content: '찜하기가 성공되었습니다.\n보관함에서 찜한 이성을 확인해 주세요.',
            });
          }

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
  const reportCheckCallbackFn = (value: string) => {
    setCheckReportType(value);
  };

  // ############################################################ 사용자 신고하기 - 팝업 활성화
  const popupReport = () => {
    if (!checkReportType) {
      show({ content: '신고항목을 선택해주세요.' });
      return false;
    } else {
      insertReport();
    }
  };

  // ############################################################ 사용자 신고하기 등록
  const insertReport = async () => {
    
    const body = {
      report_type_code: checkReportType,
      report_member_seq: matchData.match_member_info?.member_seq,
    };
    
    try {
      const { success, data } = await report_matched_user(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        }

        show({ content: '신고 처리 되었습니다.' });

        setCheckReportType('');
        getDailyMatchInfo();
        setIsLoad(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  // ############################################################ 유저 제제대상 체크
  const checkUserReport = async () => {

    const body = {
      report_member_seq: matchData.match_member_info?.member_seq
    };

    try {
      const { success, data } = await report_check_user(body);
      if(success) {
        if(data.report_cnt < 10) return false;
        
        show({
          title: '제제 알림',
          content: '<이용 약관>에 근거하여 회원 제제 상태로 전환되었습니다.\n상대에 대한 배려를 당부드려요',
          confirmCallback : reportCheckUserConfirm() 
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  const reportCheckUserConfirm = () => {
    const body = {
      report_member_seq: matchData.match_member_info?.member_seq
    };
    report_check_user_confirm(body);
  };

  // ############################################################ 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_daily_yn: 'N'
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

  // ################################################################ 스킵 회원 다시 보기
  const refuseMatchReplay = async (match_seq: number, member_seq: number) => {
    let memberSeqList = [];
    memberSeqList.push(member_seq);

    navigation.navigate(STACK.COMMON, {
      screen: 'ItemMatching'
      , params : {
        type: 'DAILY_REPLAY',
        memberSeqList: memberSeqList,
        matchSeq: match_seq,
      }
    });
  };

  // ################################################################ 프로필 카드 추가 팝업
  const profileCardOpenPopup = async () => {

    if(memberBase?.pass_has_amt >= 20 && matchData.add_list?.length > 0) {
      show({
        title: '프로필 카드 열어보기',
        content: '새로운 프로필 카드 1개를 오픈 합니다.',
        subContent: '패스 x20',
        confirmCallback: function() {
          if(memberBase?.pass_has_amt >= 20) {
            profileCardOpen();
          }
        },
        cancelCallback: function() {
  
        },
      });
    } else {
      show({ content: '보유 패스가 부족합니다.' });
    }
  };

  // ################################################################ 프로필 카드 추가
  const profileCardOpen = async () => {

    const body = {
      trgt_member_seq: matchData.add_list[0].member_seq
    };
    try {
      const { success, data } = await daily_match_add_open(body);
      if(success) {
        dispatch(myProfile());

        let memberSeqList = [];
        memberSeqList.push(matchData.add_list[0].member_seq);

        navigation.navigate(STACK.COMMON, {
          screen: 'ItemMatching'
          , params : {
            type: 'PROFILE_CARD_ADD',
            memberSeqList: memberSeqList,
            matchSeq: data.match_seq,
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  // ################################################################ 초기 실행 함수
  useEffect(() => {
    if(isFocus) {
      checkUserReport();
      setIsEmpty(false);
      
      let isPopupShow = true;

      // 튜토리얼 팝업 노출
      if(!isEmptyData(memberBase?.tutorial_daily_yn) || memberBase?.tutorial_daily_yn == 'Y') {
        isPopupShow = false;

        show({
          type: 'GUIDE',
          guideType: 'DAILY',
          guideSlideYn: 'Y',
          guideNexBtnExpoYn: 'Y',
          confirmCallback: function(isNextChk) {
            if(isNextChk) {
              saveMemberTutorialInfo();
            }
            popupShow();
          }
        });
      };

      // 데일리 매칭 정보 조회
      getDailyMatchInfo(isPopupShow);
    };
  }, [isFocus]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // 스크롤 최상단 이동
        scrollRef.current?.scrollTo({y: 0, animated: false});
        setIsLoad(false);
        setIsEmpty(false);
      };
    }, []),
  );

  return (
    matchData.profile_img_list.length > 0 && isLoad ? (
      <>
        <TopNavigation currentPath={'LIMEETED'} />

        <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: 'white' }}>

          {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}
          <View>

            {/* ############################################################## 상단 이미지 영역 */}
            <VisualImage imgList={matchData?.profile_img_list} memberData={matchData?.match_member_info} isButton={true} />

            {/* ######################### 버튼 영역 */}
            <View style={_styles.absoluteView}>
              <View style={_styles.buttonsContainer}>

                {/* ######### 거절 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('pass'); }}>
                  <Image source={ICON.closeCircle} style={_styles.smallButton} />
                </TouchableOpacity>

                {/* ######### 관심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('interest'); }} style={_styles.freePassContainer}>
                  <Image source={ICON.passCircle} style={_styles.largeButton} />

                  {/* 부스터 아이템  */}
                  {matchData?.use_item != null && matchData?.use_item?.FREE_LIKE && matchData?.use_item?.FREE_LIKE?.use_yn == 'Y' &&
                    <View style={_styles.freePassBage}>
                      <Text style={_styles.freePassText}>자유이용권 ON</Text>
                    </View>
                  }
                </TouchableOpacity>

                {/* ######### 찐심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('sincere'); }}>
                  <Image source={ICON.royalPassCircle} style={_styles.largeButton} />
                </TouchableOpacity>

                {/* ######### 찜하기 버튼 */}
                {matchData?.match_member_info?.zzim_yn == 'Y' && (
                  <TouchableOpacity onPress={() => { popupActive('zzim'); }}>
                    <Image source={ICON.zzimIcon} style={_styles.smallButton} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 퍼블 화면 */}
            {/* <AbsoluteView member={data.match_member_info}  /> */}
          </View>

          <View style={_styles.padding}>

            {/* ############################################################## 부스트 회원 노출 영역 */}
            {matchData?.match_member_info?.boost_yn === 'Y' && (
              <View style={_styles.boostPannel}>
                <View style={_styles.boostBadge}>
                  <Text style={_styles.boostBadgeText}>BOOST</Text>
                </View>
                <Text style={_styles.boostTitle}>부스터 회원을 만났습니다.</Text>
                <Text style={_styles.boostDescription}>
                  관심이나 찐심을 보내면 소셜 평점 보너스가 부여됩니다.
                </Text>
              </View>
            )}
            
            {/* ############################################################## 프로필 인증 영역 */}
            {matchData.second_auth_list.length > 0 ? (
              <ProfileAuth level={matchData.match_member_info.auth_acct_cnt} data={matchData.second_auth_list} isButton={false} />
            ) : (
              <SpaceView mt={10} viewStyle={_styles.authNoDataArea}>
                <SpaceView mb={8}><Text style={_styles.authNoDataTit}>프로필 인증없이 가입한 회원입니다.</Text></SpaceView>
                <SpaceView><Text style={_styles.authNoDataSubTit}>프로필 인증은 직업, 학업, 소득, 자산, SNS, 차량 등의 인증 항목을 의미합니다.</Text></SpaceView>
              </SpaceView>
            )}

            {/* ############################################################## 관심사 영역 */}
            {/* {data.interest_list.length > 0 && (
              <>
                <Text style={styles.title}>{data.match_member_info.nickname}님의 관심사</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 13, marginBottom: 10 }}>
                  {data.interest_list.map((item, index) => {
                    const isOn = item.dup_chk == 0 ? false : true;
                    return (
                      <View key={index} style={styles.interestItem(isOn)}>
                        <Text style={styles.interestText(isOn)}>{item.code_name}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )} */}

            {/* ############################################################## 추가 정보 영역 */}
            {/* <AddInfo memberData={data?.match_member_info} /> */}

            {/* ############################################################## 프로필 활동지수 영역 */}
            <ProfileActive memberData={matchData?.match_member_info} />

            {/* ############################################################## 소개 */}
            <MemberIntro memberData={matchData?.match_member_info} imgList={matchData?.profile_img_list} interestList={matchData?.interest_list} />

            {/* ############################################################## 인터뷰 영역 */}
            <SpaceView mt={30}>
              <InterviewRender title={matchData?.match_member_info?.nickname + '님을\n알려주세요!'} dataList={matchData?.interview_list} />
            </SpaceView>

            {/* ############################################################## 신고하기 영역 */}
            <TouchableOpacity onPress={() => { report_onOpen(); }}>
              <View style={_styles.reportButton}>
                <Text style={_styles.reportTextBtn}>신고 및 차단하기</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* ##################################################################################
                    사용자 신고하기 팝업
        ################################################################################## */}
        <Modalize
          ref={report_modalizeRef}
          adjustToContentHeight={false}
          handleStyle={modalStyle.modalHandleStyle}
          modalStyle={[modalStyle.modalContainer, {borderRadius: 0, borderTopLeftRadius: 50, borderTopRightRadius: 50}]}
          modalHeight={500}
          FooterComponent={
            <>
              <SpaceView>
                <CommonBtn value={'신고 및 차단하기'} 
                      type={'black'}
                      height={59} 
                      fontSize={19}
                      borderRadius={1}
                      onPress={popupReport}/>
              </SpaceView>
            </>
          }>

          <View style={modalStyle.modalHeaderContainer}>
            <CommonText fontWeight={'700'} type={'h3'}>
              사용자 신고 및 차단하기
            </CommonText>
            <TouchableOpacity onPress={report_onClose}>
              <Image source={ICON.xBtn2} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>

          <View style={[modalStyle.modalBody, {paddingBottom: 0, paddingHorizontal: 30}]}>
            <SpaceView mb={13} viewStyle={{borderBottomWidth: 1, borderColor: '#e0e0e0', paddingBottom: 20}}>
              <CommonText 
                textStyle={[_styles.reportText, {color: ColorType.black0000}]}
                type={'h5'}>
                신고사유를 알려주시면 더 좋은 리미티드를{'\n'}만드는데 도움이 됩니다.</CommonText>
            </SpaceView>

            <SpaceView>
              <RadioCheckBox_3
                  items={matchData.report_code_list}
                  callBackFunction={reportCheckCallbackFn}
              />
            </SpaceView>
          </View>
        </Modalize>

        {/* ##################################################################################
                    찐심 보내기 팝업
        ################################################################################## */}
        <SincerePopup
          isVisible={sincereModalVisible}
          closeModal={sincereCloseModal}
          confirmFunc={sincereSend}
        />
      </>
    ) : (
      <>
        <TopNavigation currentPath={'LIMEETED'} />
        {isEmpty ? (
          <>
            <View style={[layoutStyle.justifyCenter, layoutStyle.flex1, {backgroundColor: 'white'} ]}>
              <SpaceView mb={50} viewStyle={[layoutStyle.alignCenter]}>
                <CommonText type={'h4'} textStyle={_styles.emptyText}>
                  오늘 소개하여 드린 <Text style={{color: '#7986EE'}}>데일리 뷰</Text>가 마감되었어요.{"\n"}
                  <Text style={{color: '#7986EE'}}>데일리 뷰</Text>에서 제공해드릴 프로필 카드는 {"\n"}운영 정책에 따라 다양하게 늘려나갈 예정입니다.
                </CommonText>

                <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={IMAGE.logoIcon03} style={{width: 230, height: 230}} />
                </View>

                <View style={{position: 'absolute', top: -50, left: 75}}><Image source={IMAGE.heartImg01} style={{width: 40, height: 40}} /></View>
                <View style={{position: 'absolute', top: 80, right: 75}}><Image source={IMAGE.heartImg01} style={{width: 40, height: 40}} /></View>
              </SpaceView>


              {/* {matchData.add_list?.length > 0 && 
                <SpaceView mt={40} viewStyle={_styles.profileAddArea}>
                  <Text style={_styles.profileAddText}>20 패스로 열어볼 수 있는 프로필 카드가 더 준비되어 있어요.</Text>

                  <TouchableOpacity onPress={() => { profileCardOpenPopup(); }} style={{width: '100%'}}>
                    <Text style={_styles.profileAddBtn}>프로필 카드 열어보기</Text>
                  </TouchableOpacity>
                </SpaceView>
              } */}

              {matchData.refuse_list.length > 0 &&
                <SpaceView mt={65} viewStyle={_styles.refuseArea}>
                  <Text style={_styles.refuseAreaTit}>데일리 뷰 다시보기</Text>

                  <SpaceView mt={10} viewStyle={_styles.refuseListArea}>
                    {matchData.refuse_list.map((item, index) => {
                      const url = findSourcePath(item?.mst_img_path);
                      return (
                        <>
                          <TouchableOpacity key={index} onPress={() => { refuseMatchReplay(item?.match_seq, item?.res_member_seq); }}>
                            <SpaceView viewStyle={_styles.refuseItem}>
                              <Image source={url} style={_styles.refuseImg} />
                            </SpaceView>
                          </TouchableOpacity>
                        </>
                      );
                    })}
                  </SpaceView>
                </SpaceView>
              }
            </View>
          </>
        ) : (
          <View
            style={[
              layoutStyle.alignCenter,
              layoutStyle.justifyCenter,
              layoutStyle.flex1,
              {backgroundColor: 'white', paddingBottom: 90},
            ]}>
            <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
              {/* <Image source={GIF_IMG.faceScan} style={{width: 48, height: 48}} /> */}
              <Image source={GIF_IMG.loadingNewIcon} style={styles.iconSquareSize(48)} />
            </SpaceView>
            <View style={layoutStyle.alignCenter}>
              <CommonText type={'h4'}>다음 매칭 회원을 찾고 있어요.</CommonText>
            </View>
          </View>
        )}
      </>
    )
  );

  /**
   * 이미지 렌더링
   */
  function RenderItem({ item }) {
    const url = findSourcePath(item?.img_file_path);
    return (
      <>
        {item.status == 'ACCEPT' &&
          <View>
            <Image
              source={url}
              style={{
                width: width,
                height: height * 0.7,
                borderRadius: 20,
              }}
            />
            <Watermark value={memberBase?.phone_number}/>
          </View>
        }
      </>
    );
  }
}

/**
 *  이미지 위 정보들
 */
function AbsoluteView(data:any) {
  return (
    <View style={_styles.absoluteView}>
      <View style={_styles.badgeContainer}>
        <View style={_styles.authBadge}>
          <Text style={_styles.whiteText}>인증 완료</Text>
        </View>
        <View style={_styles.redBadge}>
          <Image source={ICON.whiteCrown} style={_styles.crownIcon} />
          <Text style={_styles.whiteText}>{data.member?.profile_score}</Text>
        </View>
      </View>
      <View style={_styles.nameContainer}>
        <Text style={_styles.nameText}>{data.member?.nickname}, {data.member?.age}</Text>
        <Image source={ICON.checkICon} style={_styles.checkIcon} />
      </View>
      <View style={_styles.distanceContainer}>
        <Image source={ICON.marker} style={_styles.markerIcon} />
        <Text style={_styles.regionText}>경기도 수원시 12.9Km</Text>
      </View> 
      <View style={_styles.buttonsContainer}>
        <TouchableOpacity>
          <Image source={ICON.closeCircle} style={_styles.smallButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.ticketCircle} style={_styles.largeButton} />
        </TouchableOpacity>
        <TouchableOpacity style={_styles.freePassContainer}>
          <Image source={ICON.heartCircle} style={_styles.largeButton} />
          <View style={_styles.freePassBage}>
            <Text style={_styles.freePassText}>자유이용권 ON</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.starCircle} style={_styles.smallButton} />
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

const _styles = StyleSheet.create({
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
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    marginTop: width * 0.15,
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
  interestItem: (isOn) => {
    return {
      borderRadius: 5,
      backgroundColor: isOn ? 'white' : '#f7f7f7',
      paddingHorizontal: 15,
      paddingVertical: 4,
      marginRight: 6,
      marginBottom: 6,
      borderColor: isOn ? '#697AE6' : '#f7f7f7',
      borderWidth: 1,
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'AppleSDGothicNeoR00',
      fontSize: 12,
      lineHeight: 22,
      letterSpacing: 0,
      color: isOn ? '#697AE6' : '#b1b1b1',
    };
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
  reportTextBtn: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  reportText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 17,
    textAlign: 'left',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  profileAddArea: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8E9AEB',
    borderStyle: 'dotted',
    borderRadius: 6,
    marginHorizontal: 25,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: -30,
  },
  profileAddText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#7986EE',
    marginBottom: 20,
  },
  profileAddBtn: {
    backgroundColor: '#697AE6',
    borderRadius: 6,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 8,
  },
  refuseArea: {
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  refuseAreaTit: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 14,
    color: '#7986EE',
  },
  refuseListArea: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  refuseItem: {
    width: 55,
    height: 55,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#697AE6',
    borderRadius: 80,
    alignItems: `center`,
    justifyContent: `center`,
    marginRight: 8,
    marginBottom: 6,
  },
  refuseImg: {
    width: 48,
    height: 48,
    borderRadius: 80,
  },
  authNoDataArea: {
    width: '100%',
    backgroundColor: '#ffffff', 
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#8E9AEB', 
    borderStyle: 'dotted',
  },
  authNoDataTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#7986EE',
    textAlign: 'center',
  },
  authNoDataSubTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    color: '#C3C3C8',
    textAlign: 'center',
  },
});


