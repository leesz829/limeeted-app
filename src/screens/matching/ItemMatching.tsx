import {
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  StackParamList,
  ColorType,
  ScreenNavigationProp,
} from '@types';
import {
  get_item_matched_info,
  regist_match_status,
  report_matched_user,
  report_check_user,
  report_check_user_confirm,
} from 'api/models';
import { ROUTES, STACK } from 'constants/routes';

import CommonHeader from 'component/CommonHeader';
import { CommonBtn } from 'component/CommonBtn';
import { RadioCheckBox_3 } from 'component/RadioCheckBox_3';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';

import { useEffect, useRef, useState } from 'react';
import { modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import {
  Dimensions,
  FlatList,
  Image,
  
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { useDispatch } from 'react-redux'; 
import { myProfile } from 'redux/reducers/authReducer';
import { findSourcePath, ICON, IMAGE } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
import { formatNowDate} from 'utils/functions';
import { Watermark } from 'component/Watermark';
import VisualImage from 'component/match/VisualImage';
import AddInfo from 'component/match/AddInfo';
import ProfileActive from 'component/match/ProfileActive';
import InterviewRender from 'component/match/InterviewRender';
import SincerePopup from 'screens/commonpopup/sincerePopup';
import MemberIntro from 'component/match/MemberIntro';


const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<StackParamList, 'ItemMatching'>;
  route: RouteProp<StackParamList, 'ItemMatching'>;
}

export default function ItemMatching(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { show } = usePopup(); // 공통 팝업

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [isCardIndex, setIsCardIndex] = useState(0);

  // 본인 데이터
  const memberBase = useUserInfo();

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
    report_code_list: [],
    safe_royal_pass: Number,
    use_item: {},
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
  const getItemMatchedInfo = async () => {
    try {
    
      if(props.route.params.profile_member_seq_list.split(',').length <= isCardIndex){
        navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
      }

      const body = {
        match_member_seq: props.route.params.profile_member_seq_list.split(',')[isCardIndex].toString()
      }

      const { success, data } = await get_item_matched_info(body);
      setIsCardIndex(isCardIndex + 1);
      
      if (success) {
        if (data.result_code == '0000') {
          //setData(data);

          const auth_list = data?.second_auth_list.filter(item => item.auth_status == 'ACCEPT');
          setData({
            match_member_info: data?.match_member_info,
            profile_img_list: data?.profile_img_list,
            second_auth_list: auth_list,
            interview_list: data?.interview_list,
            interest_list: data?.interest_list,
            report_code_list: data?.report_code_list,
            safe_royal_pass: data?.safe_royal_pass,
            use_item: data?.use_item,
          });

          if(data?.match_member_info == null || data?.profile_img_list?.length == 0) {
            setIsLoad(false);
            setIsEmpty(true);
          } else {
            setIsLoad(true);
          }          
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

  /* #############################################
	##### 거부/찐심/관심 팝업 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	############################################# */
  const popupActive = (activeType: string) => {
    if (activeType == 'interest') {
      let title = '관심 보내기';
      let content = '패스를 소모하여 관심을 보내시겠습니까?\n패스 x15';

      // 관심 자유이용권 사용시
      if(typeof data.use_item != 'undefined' && typeof data.use_item.FREE_LIKE != 'undefined') {
        let endDt = data?.use_item?.FREE_LIKE?.end_dt;
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
      if(typeof data.use_item != 'undefined' && typeof data.use_item.WISH != 'undefined') {
        let endDt = data?.use_item?.WISH?.end_dt;
        if(endDt < formatNowDate()) {
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
      res_member_seq: data.match_member_info.member_seq,
      special_level: special_level,
    };
    try {
      const { success, data } = await regist_match_status(body);

      if(success) {
        if(data.result_code == '0000') {
          dispatch(myProfile());
          getItemMatchedInfo();
          setIsLoad(false);
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
      report_member_seq: data.match_member_info.member_seq,
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
        getItemMatchedInfo();
        setIsLoad(false);

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

  // ############################################################ 유저 제제대상 체크
  const checkUserReport = async () => {

    const body = {
      report_member_seq: data.match_member_info.member_seq
    };

    try {
      const { success, data } = await report_check_user(body);
      if(success) {
        if(data.report_cnt < 10) return false;
        
        show({ 
          title: '제제 알림'
          , content: '<이용 약관>에 근거하여 회원 제제 상태로 전환되었습니다.\n상대에 대한 배려를 당부드려요'
          , confirmCallback : reportCheckUserConfirm() });
        /*
        confirmCallback: Function | undefined;
        cancelCallback: Function | undefined;
        */
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  const reportCheckUserConfirm = () => {
    const body = {
      report_member_seq: data.match_member_info.member_seq
    };
    report_check_user_confirm(body);
  }


  // ################################################################ 초기 실행 함수
  useEffect(() => {
    if(isFocus) {
      checkUserReport();
      setIsEmpty(false);
      // 데일리 매칭 정보 조회
      getItemMatchedInfo();
    }
  }, [isFocus]);


  return (
    data.profile_img_list.length > 0 && isLoad ? (
      <>
        <CommonHeader title={'프로필 카드 ( ' + (isCardIndex) + ' / ' + props.route.params.profile_member_seq_list.split(',').length +' )'} />

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

          {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}
          <View>

            {/* ############################################################## 상단 이미지 영역 */}
            <VisualImage imgList={data?.profile_img_list} memberData={data?.match_member_info} />

            {/* ######################### 버튼 영역 */}
            <View style={styles.absoluteView}>
              <View style={styles.buttonsContainer}>

                {/* ######### 거절 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('pass'); }}>
                  <Image source={ICON.closeCircle} style={styles.smallButton} />
                </TouchableOpacity>

                {/* ######### 관심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('interest'); }} style={styles.freePassContainer}>
                  <Image source={ICON.passCircle} style={styles.largeButton} />

                  {/* ############ 부스터 아이템  */}
                  {data?.use_item != null && data?.use_item?.FREE_LIKE && data?.use_item?.FREE_LIKE?.use_yn == 'Y' &&
                    <View style={styles.freePassBage}>
                      <Text style={styles.freePassText}>자유이용권 ON</Text>
                    </View>
                  }
                </TouchableOpacity>

                {/* ######### 찐심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('sincere'); }}>
                  <Image source={ICON.royalPassCircle} style={styles.largeButton} />
                </TouchableOpacity >

                {/* ######### 찜하기 버튼 */}
                {data?.match_member_info?.zzim_yn == 'Y' && (
                  <TouchableOpacity onPress={() => { popupActive('zzim'); }}>
                    <Image source={ICON.zzimIcon} style={styles.smallButton} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

          </View>

          <View style={styles.padding}>

            {/* ############################################################## 부스트 회원 노출 영역 */}
            {data?.match_member_info?.boost_yn === 'Y' && (
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
            
            {/* ############################################################## 프로필 인증 영역 */}
            <ProfileAuth level={data.match_member_info.auth_acct_cnt} data={data.second_auth_list} isButton={false} />

            {/* ############################################################## 관심사 영역 */}
            {/* {data.interest_list.length > 0 && (
              <>
                <Text style={styles.title}>{data.match_member_info.nickname}님의 관심사</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 13, marginBottom: 10 }}>
                  {data.interest_list.map((item, index) => {
                    const isOn = true;
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
            <ProfileActive memberData={data?.match_member_info} />

            {/* ############################################################## 소개 */}
            <MemberIntro memberData={data?.match_member_info} imgList={data?.profile_img_list} interestList={data?.interest_list} />

            {/* ############################################################## 인터뷰 영역 */}
            <SpaceView mt={30}>
              <InterviewRender title={data?.match_member_info?.nickname + '님을\n알려주세요!'} dataList={data?.interview_list} />
            </SpaceView>
            
            {/* ############################################################## 신고하기 영역 */}
            <TouchableOpacity onPress={() => { report_onOpen(); }}>
              <View style={styles.reportButton}>
                <Text style={styles.reportTextBtn}>신고 및 차단하기</Text>
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
                textStyle={[styles.reportText, {color: ColorType.black0000}]}
                type={'h5'}>
                신고사유를 알려주시면 더 좋은 리미티드를{'\n'}만드는데 도움이 됩니다.</CommonText>
            </SpaceView>

            <SpaceView>
              <RadioCheckBox_3
                  items={data.report_code_list}
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
        <CommonHeader title={'프로필 카드 ( ' + (isCardIndex) + ' / ' + props.route.params.profile_member_seq_list.split(',').length +' )'} />
        {isEmpty ? (
          <View
            style={[
              layoutStyle.alignCenter,
              layoutStyle.justifyCenter,
              layoutStyle.flex1,
              {backgroundColor: 'white', paddingBottom: 90},
            ]}>
            <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
              <Image source={IMAGE.logoMark} style={{width: 48, height: 48}} />
            </SpaceView>
            <View style={[layoutStyle.alignCenter]}>
              <CommonText type={'h4'} textStyle={[layoutStyle.textCenter, commonStyle.fontSize16, commonStyle.lineHeight23]}>
                프로필 카드 이용이 마감되었어요.
              </CommonText>
            </View>
          </View>
        ) : (
          <View
            style={[
              layoutStyle.alignCenter,
              layoutStyle.justifyCenter,
              layoutStyle.flex1,
              {backgroundColor: 'white', paddingBottom: 90},
            ]}>
            <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
              {/* <Image source={GIF_IMG.faceScan} style={styles.iconSize48} /> */}
              <Image source={IMAGE.logoMark} style={{width: 48, height: 48}} />
            </SpaceView>
            <View style={layoutStyle.alignCenter}>
              <CommonText type={'h4'}>프로필 카드 매칭 회원을 찾고 있어요.</CommonText>
            </View>
          </View>
        )}
      </>
    )
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
});
