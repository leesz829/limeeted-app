import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Image, ScrollView, View, TouchableOpacity, StyleSheet, Modal, Text, Dimensions } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import CommonHeader from 'component/CommonHeader';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { ViualSlider } from 'component/ViualSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import { Modalize } from 'react-native-modalize';
import {
    get_member_apply_item_info
    , get_matched_member_info
    , resolve_match
    , report_matched_user
    , update_match_status
    , first_match_pass_add
    , regist_match_status
} from 'api/models';
import { usePopup } from 'Context';
import { ROUTES, STACK } from 'constants/routes';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { RadioCheckBox_3 } from 'component/RadioCheckBox_3';
import { useUserInfo } from 'hooks/useUserInfo';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import VisualImage from 'component/match/VisualImage';
import AddInfo from 'component/match/AddInfo';
import ProfileActive from 'component/match/ProfileActive';
import InterviewRender from 'component/match/InterviewRender';
import MemberIntro from 'component/match/MemberIntro';
import { formatNowDate, isEmptyData} from 'utils/functions';
import InterestSendPopup from 'screens/commonpopup/InterestSendPopup';
import SincereSendPopup from 'screens/commonpopup/SincereSendPopup';
import Clipboard from '@react-native-clipboard/clipboard';



/* ################################################################################################################
###################################################################################################################
###### 매칭 상대 프로필 상세
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StorageProfile'>;
  route: RouteProp<StackParamList, 'StorageProfile'>;
}

const { width, height } = Dimensions.get('window');

export const StorageProfile = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const { show } = usePopup();  // 공통 팝업
  const dispatch = useDispatch();

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(
    props.route.params.matchSeq != null ? false : true
  );

  // 본인 데이터
  const memberBase = useUserInfo();

  // 매칭 번호
  const matchSeq = props.route.params.matchSeq;

  // 대상 회원 번호
  const tgtMemberSeq = props.route.params.tgtMemberSeq;

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    match_base: {},
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    report_code_list: [],
    interest_list: [],
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
  };

  const report_onClose = () => {
    report_modalizeRef.current?.close();
  };

  // 본인 보유 아이템 정보
  const [freeContactYN, setFreeContactYN] = useState('N');

  // 전화번호 복사 여부
  const [isCopyHpState, setIsCopyHpState] = useState(true);

  // ################################################################ 관심 및 찐심 보내기 관련
  const [message, setMessage] = useState('');

  const [interestSendModalVisible, setInterestSendModalVisible] = useState(false); // 관심 보내기 모달 visible
  const [sincereSendModalVisible, setSincereSendModalVisible] = useState(false); // 찐심 보내기 모달 visible
  const [sincereModalVisible, setSincereModalVisible] = useState(false); // 찐심 레벨 선택 모달 visible

  // 관심 보내기 모달 닫기
  const interestSendCloseModal = () => {
    setInterestSendModalVisible(false);
  };

  // 관심 보내기
  const interestSend = (message:string) => {
    insertMatchInfo('interest', 0, message);
    setInterestSendModalVisible(false);
    setMessage('');
  };

  // 찐심 보내기 모달 닫기
  const sincereSendCloseModal = () => {
    setSincereSendModalVisible(false);
  };

  // 찐심 보내기
  const sincereSend = (level:number, message:string) => {
    insertMatchInfo('sincere', level, message);
    setSincereSendModalVisible(false);
    setMessage('');
  };
  

  // ################################################################ 초기 실행 함수
  // ##### 첫 렌더링
  useEffect(() => {
    if(isFocus) {
      selectMatchMemberInfo();
      selectMemberApplyItemInfo();
    }
  }, [isFocus]);

  const selectMemberApplyItemInfo = async () => {

    try {
      const { success, data } = await get_member_apply_item_info();
      
      if(success) {
        if (data.result_code == '0000') {
          if(data.use_item.FREE_CONTACT){
            setFreeContactYN('Y');
          }else{
            setFreeContactYN('N')
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  
  }

  // ############################################################ 매칭 회원 정보 조회
  const selectMatchMemberInfo = async () => {
    const body = {
      match_seq: matchSeq
    };
    try {
      const { success, data } = await get_matched_member_info(body);

      if(success) {
        if (data.result_code == '0000') {

          const auth_list = data?.second_auth_list.filter(item => item.auth_status == 'ACCEPT');
          setData({
            match_base: data?.match_base,
            match_member_info: data?.match_member_info,
            profile_img_list: data?.profile_img_list,
            second_auth_list: auth_list,
            interview_list: data?.interview_list,
            interest_list: data?.interest_list,
            report_code_list: data?.report_code_list,
          });

          // 튜토리얼 팝업 노출
          if(data?.match_base.first_match_yn == 'Y') {
            show({
              type: 'GUIDE',
              guideType: 'STORAGE_GUIDE',
              guideSlideYn: 'N',
              guideNexBtnExpoYn: 'N',
              confirmCallback: function(isNextChk) {
                procFirstMatchPassAdd();
              }
            });
          };
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoad(true);
    }
  };

  // ############################################################ 매칭 상태 변경(수락, 거절)
  const updateMatchStatus = async (status: any) => {
    show({ 
      content: status == 'ACCEPT' ? '매칭을 수락하시나요?' : '다음 기회로 미룰까요?' ,
      cancelCallback: function() {
        
      },
      confirmCallback: async function() {
        const body = {
          match_seq: matchSeq,
          match_status: status,
        };
        try {
          const { success, data } = await update_match_status(body);
          if(success) {
            if(data.result_code == '0000') {

              if(status == 'ACCEPT') {
                navigation.navigate(STACK.TAB, {
                  screen: 'Storage',
                  params: {
                    headerType: '',
                    loadPage: 'MATCH',
                  },
                });
              } else {
                navigation.goBack();
              }
            } else {
              show({ content: '오류입니다. 관리자에게 문의해주세요.' });
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
        }
      }
    });
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
      report_member_seq: data.match_member_info.member_seq
    };
    try {
      const { success, data } = await report_matched_user(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        };

        report_onClose();

        show({
          type: 'RESPONSIVE',
          content: '차단 및 신고 처리가 완료 되었습니다.',
        });

        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    } finally {

    }
  };

  // ############################################################ 연락처 열기 팝업 활성화
  const hpOpenPopup = async () => {    
    let tmpContent = '현재 보고 계신 프로필의 연락처를 확인하시겠어요?\n패스 x' + (data.match_base.special_interest_yn == 'Y' ? '40' : '100');
    let subContent = '';

    if('Y' == freeContactYN){
      tmpContent = '현재 보고 계신 프로필의 연락처를 확인하시겠어요? \n';
      subContent = '연락처 프리오퍼 사용중';
    }

    show({ 
      title: '연락처 공개',
      content: tmpContent,
      subContent: subContent,
      cancelCallback: function() {

      },
      confirmCallback: function() {
        goHpOpen();
      },
    });
  }

  // ############################################################ 연락처 열기
  const goHpOpen = async () => {
    const body = {
      match_seq: data.match_base.match_seq
    };
    try {
      const { success, data } = await resolve_match(body);

      if(success) {
        if (data.result_code == '0000') {
          dispatch(myProfile());
        } else if(data.result_code == '5000') {
          show({
            title: '연락처 열람 알림',
            content: '이미 열람된 연락처 입니다.\n보관함 이동 후 다시 조회 해주세요.',
            confirmCallback: function () {
              navigation.goBack();
            },
          });
        } else {
          show({
            title: '재화 부족',
            content: '보유 재화가 부족합니다.',
            confirmCallback: function () {},
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      selectMatchMemberInfo();
    }
  };

  // ############################################################ 최초 매칭 성공 패스 포인트 지급처리
  const procFirstMatchPassAdd = async () => {
    const body = {
      match_seq: matchSeq,
    };
    try {
      const { success, data } = await first_match_pass_add(body);
      if(success) {
        if(data.result_code == '0000') {
          dispatch(myProfile());
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  /* #######################################################################
	##### 거부/찐심/관심 팝업 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	####################################################################### */
  const popupActive = (activeType: string) => {
    if (activeType == 'interest') {
      setInterestSendModalVisible(true);

      /* let title = '관심 보내기';
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
			}); */

    } else if (activeType == 'sincere') {
      setSincereSendModalVisible(true);
      //setSincereModalVisible(true);

    } else if (activeType == 'pass') {
      //navigation.goBack();
      
      show({
				title: '보관함 삭제',
				content: '매칭을 취소하고 보관함에서 삭제하시겠습니까?',
        cancelCallback: function() {

        },
				confirmCallback: function() {
          insertMatchInfo(activeType, 0);
				}
			});
    }
    
  };

  // ############################################################ 찐심/관심/거부 저장
  const insertMatchInfo = async (activeType: string, special_level: number, message: string) => {
    let body = {
      active_type: activeType,
      res_member_seq: data.match_member_info.member_seq,
      special_level: special_level,
      message: message,
    };

    if(props.route.params.type == 'ZZIM' || props.route.params.type == 'LIVE') {
      body.match_seq = matchSeq;
    };

    try {
      const { success, data } = await regist_match_status(body);

      if(success) {
        if(data.result_code == '0000') {
          setIsLoad(false);

          navigation.navigate(STACK.TAB, {
            screen: 'Storage',
            params: {
              pageIndex: 0,
              loadPage: 'REQ',
            },
          });
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

  // ############################################################ 매칭 회원 정보 조회
  const onCopyPress = async (value: string) => {
    try {
      await Clipboard.setString(value);
      show({
        type: 'RESPONSIVE',
        content: '클립보드에 복사되었습니다.',
      });

      setIsCopyHpState(false);

      const timer = setTimeout(() => {
        setIsCopyHpState(true);
      }, 3500);
    } catch(e) {
      console.log('e ::::::: ' , e);
    };
  };


  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
  };




  // ############################################################ 팝업 관련
  //const [hpOpenPopup, setHpOpenPopup] = useState(false); // 연락처 열기 팝업

  return isLoad ? (
    <>
      <CommonHeader title={
        (() => {
          if(props.route.params.type == 'RES') return '내가 받은 관심';
          else if(props.route.params.type == 'REQ') return '내가 보낸 관심';
          else if(props.route.params.type == 'MATCH') return '성공 매칭'
          else if(props.route.params.type == 'ZZIM') return '찜한 프로필'
          else if(props.route.params.type == 'LIVE' && props.route.params.matchType == 'LIVE_RES') return '받은 고평점 LIVE'
          else if(props.route.params.type == 'LIVE' && props.route.params.matchType == 'LIVE_REQ') return '보낸 고평점 LIVE';
        })()
      } />

      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}
        <SpaceView viewStyle={{zIndex: 1}}>

          {/* ############################################################## 상단 이미지 영역 */}
          <VisualImage 
            imgList={data?.profile_img_list} 
            memberData={data?.match_member_info} 
            isButton={props.route.params.type == 'ZZIM' || props.route.params.type == 'LIVE' ? true : false} 
            isAnimation={props.route.params.type == 'RES'} />

          {/* ######################### 버튼 영역(찜 상태인 경우 활성화) */}
          {(props.route.params.type == 'ZZIM' || props.route.params.type == 'LIVE') &&
            <View style={_styles.absoluteView}>
              <View style={_styles.buttonsContainer}>

                {/* ######### 거절 버튼 */}
                {props.route.params.type != 'LIVE' &&
                  <TouchableOpacity onPress={() => { popupActive('pass'); }}>
                    <Image source={ICON.closeCircle} style={_styles.smallButton} />
                  </TouchableOpacity>
                }

                {/* ######### 관심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('interest'); }} style={_styles.freePassContainer}>
                  <Image source={ICON.passCircle} style={_styles.largeButton} />

                  {/* 부스터 아이템  */}
                  {data?.use_item != null && data?.use_item?.FREE_LIKE && data?.use_item?.FREE_LIKE?.use_yn == 'Y' &&
                    <View style={_styles.freePassBage}>
                      <Text style={_styles.freePassText}>자유이용권 ON</Text>
                    </View>
                  }
                </TouchableOpacity>

                {/* ######### 찐심 버튼 */}
                <TouchableOpacity onPress={() => { popupActive('sincere'); }}>
                  <Image source={ICON.royalPassCircle} style={_styles.largeButton} />
                </TouchableOpacity>
              </View>
            </View>
          }
          
        </SpaceView>

        <SpaceView viewStyle={[styles.container, commonStyle.paddingHorizontal15]}>

          {/* ############################################## 받은 관심 */}
          {props.route.params.type == 'RES' ? (
            <>
              <SpaceView mb={-30} viewStyle={[styles.rowStyle]}>

                {data.match_base.special_interest_yn == 'Y' ? (
                  <>
                    <View style={{marginRight: 3, flex: 0.6}}>
                      <TouchableOpacity onPress={() => updateMatchStatus('REFUSE') } style={_styles.specialRefuseBtn}>
                        <Text style={_styles.specialRefuseText}>거절</Text>
                        <Text style={_styles.specialAcceptDesc}>다음주 소셜 평점에 약간의{'\n'}페널티가 발생합니다.</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                      <LinearGradient
                        colors={['#F5138C', '#F97FF1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{borderRadius: 10, overflow: 'hidden'}}>

                        <TouchableOpacity onPress={() => updateMatchStatus('ACCEPT') } style={_styles.specialAcceptBtn}>
                          <Text style={_styles.specialAcceptText}>수락</Text>
                          <Text style={_styles.specialAcceptDesc}>보너스 리밋이 제공됩니다.</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{marginRight: 3, flex: 1}}>
                      <TouchableOpacity onPress={() => updateMatchStatus('REFUSE') } style={_styles.refuseBtn}>
                        <Text style={_styles.acceptBtnText}>거절</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                      <LinearGradient
                        colors={['#8AACF8', '#7986EE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{borderRadius: 10, overflow: 'hidden'}}>

                        <TouchableOpacity onPress={() => updateMatchStatus('ACCEPT') } style={_styles.acceptBtn}>
                          <Text style={_styles.acceptBtnText}>수락</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                  </>
                )}
              </SpaceView>
            </>
          ) : null}

          {/* ############################################## 보낸 관심 */}
          {props.route.params.type == 'REQ' ? (
            <>
              <SpaceView mb={-20} viewStyle={{padding: 24, alignItems: 'center', borderRadius: 10, backgroundColor: '#F6F7FE'}}>
                <SpaceView>
                  <Image source={ICON.loveLetterIcon} style={styles.iconSquareSize(64)} />
                </SpaceView>
                <CommonText fontWeight={'700'}>매칭 대기중</CommonText>
                <CommonText type={'h5'} fontWeight={'500'} color={'#ACACAC'} textStyle={[layoutStyle.textCenter, {marginTop: 5}]}>
                  상대방이 회원님의 <Text style={{color: '#7986EE'}}>관심</Text>을 두고 고민중 인가봐요.
                </CommonText>
              </SpaceView>
            </>
          ) : null}

          {/* ############################################## 성공 매칭 */}
          {props.route.params.type == 'MATCH' ? (
            <>
              <SpaceView mb={-20} viewStyle={_styles.matchSuccArea}>
                <SpaceView mb={8} viewStyle={{alignItems: 'center'}}>
                  <Image source={ICON.match_succ_icon} style={{width: 30, height: 30}} />
                </SpaceView>

                <SpaceView mb={16} viewStyle={{alignItems: 'center'}}>
                  <CommonText type={'h4'} fontWeight={'700'}>
                    {data.match_member_info?.nickname}님과 매칭 성공!
                  </CommonText>
                </SpaceView>

                {(data.match_base.res_member_seq == memberBase.member_seq && data.match_base.res_phone_open_yn == 'Y') ||
                (data.match_base.req_member_seq == memberBase.member_seq && data.match_base.req_phone_open_yn == 'Y') ? (
                  <>
                    <TouchableOpacity
                      disabled={!isCopyHpState}
                      style={{marginBottom: 5}}
                      onPress={() => { onCopyPress(data.match_member_info.phone_number); }}>

                      <CommonText
                        type={'h5'}
                        fontWeight={'200'}
                        color={'#fff'}
                        textStyle={[layoutStyle.textCenter, {backgroundColor: '#FE0456', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5, overflow: 'hidden'}]}>
                        {data.match_member_info.phone_number}
                      </CommonText>
                    </TouchableOpacity>

                    <Text style={_styles.clipboardCopyDesc}>연락처를 터치하면 클립보드에 복사되요.</Text>
                  </>
                ) : (
                  <>
                    <SpaceView mb={15}>
                      <CommonBtn
                        value={'연락처 확인하기'}
                        type={'red'}
                        width={150}
                        height={40}
                        borderRadius={10}
                        onPress={() => {
                          hpOpenPopup();
                        }}
                      />
                    </SpaceView>
                  </>
                )}
              </SpaceView>
            </>
          ) : null}

        </SpaceView>

        <SpaceView mt={40} viewStyle={_styles.padding}>

          {/* ############################################################## 메시지 영역 */}
          {(props.route.params.type == 'RES' && isEmptyData(data.match_base.message)) && (
            <SpaceView mt={5} mb={10} viewStyle={_styles.messageArea}>
              <Text style={_styles.messageTit(data.match_base.special_interest_yn == 'Y')}>메시지</Text>
              <Text style={_styles.messageText}>"{data.match_base.message}"</Text>
            </SpaceView>
          )}

          {/* ############################################################## 프로필 인증 영역 */}
          {data.second_auth_list.length > 0 ? (
            <ProfileAuth level={data.match_member_info.auth_acct_cnt} data={data.second_auth_list} isButton={false} />
          ) : (
            <SpaceView mt={10} viewStyle={_styles.authNoDataArea}>
              <SpaceView mb={8}><Text style={_styles.authNoDataTit}>프로필 인증없이 가입한 회원입니다.</Text></SpaceView>
              <SpaceView><Text style={_styles.authNoDataSubTit}>프로필 인증은 직업, 학업, 소득, 자산, SNS, 차량 등의 인증 항목을 의미합니다.</Text></SpaceView>
            </SpaceView>
          )}

          
          {/* ############################################################## 관심사 영역 */}
          {/* {data.interest_list.length > 0 && (
            <>
              <Text style={_styles.title}>{data.match_member_info.nickname}님의 관심사</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 13, marginBottom: 10 }}>
                {data.interest_list.map((item, index) => {
                  const isOn = item.dup_chk == 0 ? false : true;
                  return (
                    <View style={_styles.interestItem(isOn)}>
                      <Text style={_styles.interestText(isOn)}>{item.code_name}</Text>
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
            <View style={_styles.reportButton}>
              <Text style={_styles.reportTextBtn}>신고 및 차단하기</Text>
            </View>
          </TouchableOpacity>

        </SpaceView>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ###############################################
                        사용자 신고하기 팝업
            ############################################### */}
      <Modalize
          ref={report_modalizeRef}
          adjustToContentHeight={false}
          handleStyle={modalStyle.modalHandleStyle}
          modalStyle={[modalStyle.modalContainer, {borderRadius: 0, borderTopLeftRadius: 50, borderTopRightRadius: 50}]}
          modalHeight={550}
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

            <SpaceView mb={24}>
              <RadioCheckBox_3
                  items={data.report_code_list}
                  callBackFunction={reportCheckCallbackFn}
              />
            </SpaceView>
          </View>
        </Modalize>

        {/* ##################################################################################
                    관심 보내기 팝업
        ################################################################################## */}
        <InterestSendPopup
          isVisible={interestSendModalVisible}
          closeModal={interestSendCloseModal}
          confirmFunc={interestSend}
        />

        {/* ##################################################################################
                    찐심 보내기 팝업
        ################################################################################## */}
        <SincereSendPopup
          isVisible={sincereSendModalVisible}
          closeModal={sincereSendCloseModal}
          confirmFunc={sincereSend}
        />

    </>
  ) : null;
};








{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
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
  padding: {
    paddingHorizontal: 20,
    marginTop: 10,
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
  matchSuccArea: {
    backgroundColor: '#F6F7FE',
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ed4771',
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
  clipboardCopyDesc: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#707070',
    marginBottom: 7,
  },
  specialAcceptBtn: {
    height: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
  },
  specialAcceptText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 20,
    color: '#ffffff',
  },
  specialAcceptDesc: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  specialRefuseBtn: {
    height: 65,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  specialRefuseText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#ffffff',
  },
  acceptBtn: {
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#ffffff',
  },
  refuseBtn: {
    height: 45,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageArea: {
    backgroundColor: '#F6F7FE',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageTit: (isSpecial:boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoH00',
      fontSize: 10,
      color: '#fff',
      backgroundColor: !isSpecial ? '#7986EE' : '#FE0456',
      borderRadius: 50,
      overflow: 'hidden',
      paddingHorizontal: 12,
      paddingVertical: 1,
      marginBottom: 15,
    };
  },
  messageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#646464',
    marginBottom: 5,
  },


});