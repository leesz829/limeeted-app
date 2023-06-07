import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Dimensions
} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import CommonHeader from 'component/CommonHeader';
import {
  ColorType,
  ScreenNavigationProp,
  BottomParamList,
  Interview,
  ProfileImg,
  FileInfo,
  MemberBaseData,
  CommonCode,
  LabelObj,
  StackParamList,
} from '@types';
import { Color } from 'assets/styles/Color';
import { ViualSlider } from 'component/ViualSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import { Modalize } from 'react-native-modalize';
import {
    get_member_apply_item_info
    , get_matched_member_info
    , resolve_match
    , report_matched_user
    , update_match_status
    , first_match_pass_add
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
            console.log('FREE_CONTACT ::: ', data.use_item.FREE_CONTACT);
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
          setData(data);

          // 튜토리얼 팝업 노출
          if(data?.match_base.first_match_yn == 'Y') {
            show({
              type: 'GUIDE',
              guideType: 'STORAGE_GUIDE',
              guideSlideYn: 'N',
              guideNexBtnExpoYn: 'N',
              confirmCallback: function(isNextChk) {
                console.log('dddd');
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
          match_status: status
        };
        try {
          const { success, data } = await update_match_status(body);
          if(success) {
            if(data.result_code == '0000') {
              dispatch(myProfile());
              navigation.navigate(STACK.TAB, {
                screen: 'Storage',
              });
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
        }

        show({ content: '차단 및 신고 처리가 완료 되었습니다.' });
        report_onClose();

        navigation.navigate(STACK.TAB, {
          screen: 'Storage',
        });
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
              navigation.navigate(STACK.TAB, {
                screen: 'Storage',
              });
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
          if(props.route.params.type == 'REQ') return '내가 받은 관심';
          else if(props.route.params.type == 'RES') return '내가 보낸 관심';
          else if(props.route.params.type == 'MATCH') return '성공 매칭';
        })()
      } />

      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}
        <View>

          {/* ############################################################## 상단 이미지 영역 */}
          <VisualImage imgList={data?.profile_img_list} memberData={data?.match_member_info} />
          
        </View>

        <SpaceView viewStyle={[styles.container, commonStyle.paddingHorizontal15]}>

          {/* ############################################## 받은 관심 */}
          {props.route.params.type == 'REQ' ? (
            <>
              <SpaceView viewStyle={[styles.rowStyle]}>
                <View style={{marginRight: 3, flex: 1}}>
                  <CommonBtn
                    value={'거절'}
                    width={'100%'}
                    height={45}
                    borderRadius={13}
                    onPress={() => {
                      updateMatchStatus('REFUSE');
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CommonBtn
                    value={'수락'}
                    type={'primary'}
                    width={'100%'}
                    height={45}
                    borderRadius={13}
                    onPress={() => {
                      updateMatchStatus('ACCEPT');
                    }}
                  />
                </View>
              </SpaceView>
            </>
          ) : null}

          {/* ############################################## 보낸 관심 */}
          {props.route.params.type == 'RES' ? (
            <>
              <SpaceView viewStyle={styles.textContainer}>
                <SpaceView mb={8}>
                  <Image source={ICON.wait} style={styles.iconSize48} />
                </SpaceView>
                <CommonText fontWeight={'700'}>매칭 대기중</CommonText>
                <CommonText
                  fontWeight={'500'}
                  color={'#ACACAC'}
                  textStyle={[layoutStyle.textCenter, {marginTop: 5}]}
                >
                  상대방이 회원님의 <Text style={{color: '#7986EE'}}>관심</Text>을 두고 고민중 인가봐요.
                </CommonText>
              </SpaceView>
            </>
          ) : null}

          {/* ############################################## 성공 매칭 */}
          {props.route.params.type == 'MATCH' ? (
            <>
              <SpaceView viewStyle={_styles.matchSuccArea}>
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
                    <SpaceView viewStyle={{marginBottom: 15}}>
                      <CommonText
                        type={'h5'}
                        fontWeight={'200'}
                        color={'#fff'}
                        textStyle={[layoutStyle.textCenter, {backgroundColor: '#FE0456', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5}]}>
                        {data.match_member_info.phone_number}
                      </CommonText>
                    </SpaceView>
                  </>
                ) : (
                  <>
                    <SpaceView viewStyle={{marginBottom: 15}}>
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

        <View style={_styles.padding}>

          {/* ############################################################## 프로필 인증 영역 */}
          <ProfileAuth level={data.match_member_info.auth_acct_cnt} data={data.second_auth_list} isButton={false} />

          
          {/* ############################################################## 관심사 영역 */}
          {data.interest_list.length > 0 && (
            <>
              <Text style={_styles.title}>{data.match_member_info.nickname}님의 관심사</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 10 }}>
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
          )}

          {/* ############################################################## 추가 정보 영역 */}
          <AddInfo memberData={data?.match_member_info} />

          {/* ############################################################## 프로필 활동지수 영역 */}
          <ProfileActive memberData={data?.match_member_info} />

          {/* ############################################################## 인터뷰 영역 */}
          <SpaceView mt={30}>
            <InterviewRender title={'인터뷰'} dataList={data?.interview_list} />
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

      {/* ###############################################
                        사용자 신고하기 팝업
            ############################################### */}
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

            <SpaceView mb={24}>
              <RadioCheckBox_3
                  items={data.report_code_list}
                  callBackFunction={reportCheckCallbackFn}
              />
            </SpaceView>
          </View>
        </Modalize>

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
      paddingVertical: 5,
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
});
