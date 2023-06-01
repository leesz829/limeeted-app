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
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
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
import InterviewRender from 'component/InterviewRender';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { RadioCheckBox_3 } from 'component/RadioCheckBox_3';
import { useUserInfo } from 'hooks/useUserInfo';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';



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
      console.log('data ::: ' , data.use_item.FREE_CONTACT);
      
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
    console.log('checkReportType ::::: ' , checkReportType);
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

    console.log('special_interest_yn :::: ', data.match_base.special_interest_yn);
    
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
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <CommonHeader title={
          (() => {
            if(props.route.params.type == 'REQ') return '내가 받은 관심';
            else if(props.route.params.type == 'RES') return '내가 보낸 관심';
            else if(props.route.params.type == 'MATCH') return '성공 매칭';
          })()
        } />

        {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}
        <View>

          {/* ###### 이미지 indicator */}
          <View style={_styles.pagingContainer}>
            {data?.profile_img_list.map((item, index) => {
              return item.status == 'ACCEPT' && (
                <View style={_styles.dotContainerStyle} key={'dot' + index}>
                  <View style={[_styles.pagingDotStyle, index == currentIndex && _styles.activeDot]} />
                </View>
              )
            })}
          </View>

          <FlatList
            data={data?.profile_img_list}
            renderItem={RenderItem}
            onScroll={handleScroll}
            horizontal
            pagingEnabled
          />

          <View style={_styles.absoluteView}>
            <View style={_styles.badgeContainer}>

              {/* ############# 인증 레벨 노출 */}
              {data?.match_member_info?.auth_acct_cnt > 0 && data?.match_member_info?.auth_acct_cnt < 10 &&
                <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {data?.match_member_info?.auth_acct_cnt >= 10 && data?.match_member_info?.auth_acct_cnt < 15 &&
                <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level10Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {data?.match_member_info?.auth_acct_cnt >= 15 && data?.match_member_info?.auth_acct_cnt < 20 &&
                <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level15Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {data?.match_member_info?.auth_acct_cnt >= 20 && data?.match_member_info?.auth_acct_cnt < 25 &&
                <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level20Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {data?.match_member_info?.auth_acct_cnt >= 25 && data?.match_member_info?.auth_acct_cnt < 30 &&
                <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level25Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {data?.match_member_info?.auth_acct_cnt >= 30 &&
                <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level30Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{data?.match_member_info?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {/* ############# 프로필 평점 노출 */}
              {data.match_member_info.profile_score < 6.0 &&
                <LinearGradient colors={['#FF7EA6', '#FF7EA6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score5Icon} style={[_styles.scoreBadgeImg, {width: 12, height: 12}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {data.match_member_info.profile_score >= 6.0 && data.match_member_info.profile_score < 7.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score6Icon} style={[_styles.scoreBadgeImg, {width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {data.match_member_info.profile_score >= 7.0 && data.match_member_info.profile_score < 8.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreKingIcon} style={[_styles.scoreBadgeImg, {width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {data.match_member_info.profile_score >= 8.0 && data.match_member_info.profile_score < 9.0 &&
                <LinearGradient colors={['#FE0456', '#FF82AB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreKingIcon} style={[_styles.scoreBadgeImg, {width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {data.match_member_info.profile_score >= 9.0 && data.match_member_info.profile_score < 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E6DF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreKingIcon} style={[_styles.scoreBadgeImg, {width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {data.match_member_info.profile_score >= 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E41E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreDiamondIcon} style={[_styles.scoreBadgeImg, {width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{data.match_member_info.profile_score}</Text>
                </LinearGradient>
              }

              {/* 고평점 이성 소개받기 구독 아이템 표시 */}
              {/* <View style={styles.redBadge}>
                <Image source={ICON.whiteCrown} style={styles.crownIcon} />
                <Text style={styles.whiteText}>{data.match_member_info?.profile_score}</Text>
              </View> */}
            </View>

            {/* {data.distance_val != null && 
              <View style={_styles.distanceContainer}>
                <Image source={ICON.marker} style={_styles.markerIcon} />
                <Text style={_styles.regionText}>{data.distance_val}Km</Text>
              </View>
            } */}

            <View style={_styles.nameContainer}>
              <Text style={_styles.nameText}>{data.match_member_info?.nickname}, {data.match_member_info?.age}</Text>
              <Image source={ICON.checkICon} style={_styles.checkIcon} />
            </View>

            <View style={_styles.distanceContainer}>
              <Text style={_styles.regionText}>{data.match_member_info?.comment}</Text>
            </View>

            <View style={_styles.buttonsContainer}>
              {/* <TouchableOpacity onPress={() => { popupActive('pass'); }}>
                <Image source={ICON.closeCircle} style={_styles.smallButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { popupActive('sincere'); }}>
                <Image source={ICON.ticketCircle} style={_styles.largeButton} />
              </TouchableOpacity >

              <TouchableOpacity onPress={() => { popupActive('interest'); }} style={_styles.freePassContainer}>
                <Image source={ICON.heartCircle} style={_styles.largeButton} />
              </TouchableOpacity> */}

              {/* 마킹 버튼 */}
              {/* <TouchableOpacity>
                <Image source={ICON.starCircle} style={styles.smallButton} />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* <SpaceView viewStyle={[styles.container, {paddingLeft: 17, paddingRight: 45}]}> */}
        <SpaceView viewStyle={[styles.container, {paddingLeft: 20}]}>

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

          {/* 프로필 인증 */}
          <ProfileAuth level={data.match_member_info.auth_acct_cnt} data={data.second_auth_list} />

          {/* 추가 정보 */}
          {((data.match_member_info.height != null && data.match_member_info.height != '') || (data.match_member_info.form_body_type != null && data.match_member_info.form_body_type != '') ||
          (data.match_member_info.job_name != null && data.match_member_info.job_name != '') || (data.match_member_info.religion_type != null && data.match_member_info.religion_type != '') ||
          (data.match_member_info.drink_type != null && data.match_member_info.drink_type != '') || (data.match_member_info.smoke_type != null && data.match_member_info.smoke_type != '')) &&
            <SpaceView>
              <Text style={_styles.title}>추가 정보</Text>
              <SpaceView mt={20} viewStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {data.match_member_info.height != null && data.match_member_info.height != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addHeightIcon} style={{width:11, height:16, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}><Text style={_styles.addItemAreaTextBold}>{data.match_member_info.height}</Text>cm</Text>
                  </View>
                }

                {data.match_member_info.form_body_type != null && data.match_member_info.form_body_type != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addCategoryIcon} style={{width:16, height:16, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}>{data.match_member_info.form_body_type}</Text>
                  </View>
                }

                {data.match_member_info.job_name != null && data.match_member_info.job_name != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addFlagIcon} style={{width:11, height:16, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}>{data.match_member_info.job_name}</Text>
                  </View>
                }

                {data.match_member_info.religion_type != null && data.match_member_info.religion_type != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addPlayIcon} style={{width:17, height:20, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}>{data.match_member_info.religion_type}</Text>
                  </View>
                }

                {data.match_member_info.drink_type != null && data.match_member_info.drink_type != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addWineIcon} style={{width:13, height:20, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}>{data.match_member_info.drink_type}</Text>
                  </View>
                }

                {data.match_member_info.smoke_type != null && data.match_member_info.smoke_type != '' &&
                  <View style={_styles.addItemArea}>
                    <Image source={ICON.addSmokeIcon} style={{width:20, height:13, marginRight: 10}} />
                    <Text style={_styles.addItemAreaText}>{data.match_member_info.smoke_type}</Text>
                  </View>
                }
                
              </SpaceView>
            </SpaceView>
          }

          <Text style={_styles.title}>프로필 활동지수</Text>

          <View style={_styles.profileActivePannel}>
            <Text style={_styles.profileEverageText}>프로필 평점</Text>
            <Text style={_styles.profileActiveText1}>
              <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
                {data.match_member_info.nickname}
              </Text>
              님의 리미티드 대표 인상
            </Text>
            <Text style={_styles.profileActiveText2}>{data.match_member_info.best_face}</Text>
            <View style={_styles.sliderContainer}>
              <Text style={_styles.sliderText}>프로필 평점 {data.match_member_info.profile_score}</Text>
              <Slider
                value={data.match_member_info.profile_score/10}
                animateTransitions={true}
                renderThumbComponent={() => null}
                maximumTrackTintColor={ColorType.purple}
                minimumTrackTintColor={ColorType.purple}
                containerStyle={_styles.sliderContainerStyle}
                trackStyle={_styles.sliderThumbStyle}
                trackClickable={false}
                disabled
              />
              <View style={_styles.gageContainer}>
                <Text style={_styles.gageText}>0</Text>
                <Text style={_styles.gageText}>5</Text>
                <Text style={_styles.gageText}>10</Text>
              </View>
            </View>
          </View>

          <View style={_styles.socialContainer}>
            <Text style={_styles.socialEverageText}>소셜 평점</Text>
            <Text style={[_styles.socialText1, { fontFamily: 'AppleSDGothicNeoEB00' }]}>
              {data.match_member_info?.social_grade > 9 && '천상계와 신계 그 어딘가의 존재'}
              {data.match_member_info?.social_grade > 8 && data.match_member_info?.social_grade <= 9 && '미세먼지없이 맑은 하늘 위에 숨쉬는 존재'}
              {data.match_member_info?.social_grade > 7 && data.match_member_info?.social_grade <= 8 && '쾌청한 하늘 아래 맑은 바닷물과 어울리는 분'}
              {data.match_member_info?.social_grade > 6 && data.match_member_info?.social_grade <= 7 && '따사로운 햇살이 비치는 꽃길을 걷는 분'}
              {data.match_member_info?.social_grade > 5 && data.match_member_info?.social_grade <= 6 && '어두운 골목과 화려한 조명의 조화 속에 숨은 사람'}
              {data.match_member_info?.social_grade > 4 && data.match_member_info?.social_grade <= 5 && '심해로 통하는 어두운 바다에 몸을 담근 자'}
              {data.match_member_info?.social_grade <= 4 && '깊은 심해를 탐험하는 자'}
            </Text>
            {/* <Text style={styles.socialText1}>매칭되면</Text>
            <Text style={styles.socialText1}>
              <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
                후회하지 않을듯한
              </Text>{' '}
              느낌이 들어요
            </Text> */}
            <View style={_styles.sliderContainer}>
              <Text style={_styles.sliderText}>소셜 평점 {data.match_member_info.social_grade}</Text>
              <Slider
                value={data.match_member_info.social_grade/10}
                animateTransitions={true}
                renderThumbComponent={() => null}
                maximumTrackTintColor={'#fe0456'}
                minimumTrackTintColor={'#ff9fbe'}
                containerStyle={_styles.socialSliderContainerStyle}
                trackStyle={_styles.socialSliderThumbStyle}
                trackClickable={false}
                disabled
              />
              <View style={_styles.gageContainer}>
                <Text style={_styles.gageText}>0</Text>
                <Text style={_styles.gageText}>5</Text>
                <Text style={_styles.gageText}>10</Text>
              </View>
            </View>
          </View>

          {/* 인터뷰 영역 */}
          <SpaceView mt={30}>
            <InterviewRender data={data?.interview_list} />
          </SpaceView>

          {/* 신고하기 영역 */}
          <TouchableOpacity onPress={() => { report_onOpen(); }}>
            <View style={_styles.reportButton}>
              <Text style={_styles.reportTextBtn}>신고 및 차단하기</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{ height: 50 }} />

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
  absoluteView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: width * 0.15,
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
    //backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginRight: 5,
  },
  scoreBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`,
    marginRight: 5,
    paddingHorizontal: 5,
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
  yellowText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FDFFD8',
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
    marginTop: 10,
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
  },
  pagingContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 18,
  },
  pagingDotStyle: {
    width: 19,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  pagingContainerStyle: {
    paddingTop: 16,
  },
  dotContainerStyle: {
    marginRight: 2,
    marginLeft: 2,
  },
  addItemArea: {
    borderWidth: 1,
    borderColor: '#A6A9C5',
    borderRadius: 20,
    width: width / 3.5,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    marginBottom: 8,
  },
  addItemAreaText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    color: '#7986EE',
    width: '60%',
    textAlign: 'center',
  },
  addItemAreaTextBold: {
    fontSize: 18,
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


const styles_m = StyleSheet.create({
  profileContainer: {
    backgroundColor: Color.grayF8F8,
    borderRadius: 16,
    padding: 24,
    marginRight: 0,
    paddingBottom: 30,
  },
  iconSize: {
    width: 48,
    height: 48,
  },
  textCenter: { textAlign: 'center' },
});
