import { ColorType, BottomParamList, ScreenNavigationProp } from '@types';
import { commonStyle, styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { Wallet } from 'component/TopNavigation';
import * as React from 'react';
import {
  //Image,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground,
  FlatList,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useState, useRef } from 'react';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import * as dataUtils from 'utils/data';
import { useDispatch } from 'react-redux';
import { get_member_storage, update_match, match_check_all } from 'api/models';
import { useMemberseq } from 'hooks/useMemberseq';
import { usePopup } from 'Context';
import { STACK } from 'constants/routes';
import CommonHeader from 'component/CommonHeader';
import { myProfile } from 'redux/reducers/authReducer';
import Carousel from 'react-native-snap-carousel';
import ToggleSwitch from 'toggle-switch-react-native';
import { Color } from 'assets/styles/Color';
import { isEmptyData } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import { BlurView } from "@react-native-community/blur";
import { setPartialPrincipal } from 'redux/reducers/authReducer';
//import Modal from 'react-native-modal';
import Image from 'react-native-fast-image';
import AuthLevel from 'component/common/AuthLevel';
import ProfileGrade from 'component/common/ProfileGrade';




/* ################################################################################################################
###### 보관함
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<BottomParamList, 'Storage'>;
  route: RouteProp<BottomParamList, 'Storage'>;
}

const { width, height } = Dimensions.get('window');

export const Storage = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocusStorage = useIsFocused();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [isClickable, setIsClickable] = useState(true); // 클릭 여부

  const { show } = usePopup();  // 공통 팝업

  const memberSeq = useMemberseq(); // 회원번호

  const tabScrollRef = useRef();

  const { route } = props;
  const params = route.params;
  const pageIndex = 0;
  const loadPage = params?.loadPage || 'RES';
  const dataRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [btnStatus, setBtnStatus] = useState(true);
  const [btnStatus1, setBtnStatus1] = useState(true);
  const [btnStatus2, setBtnStatus2] = useState(true);

  const [isSpecialVisible, setIsSpecialVisible] = React.useState(false);
  const [isLiveResVisible, setIsLiveResVisible] = React.useState(true);
  const [isLiveReqVisible, setIsLiveReqVisible] = React.useState(true);

  const [isProfileOpenVisible, setIsProfileOpenVisible] = React.useState(false);
  const [profileOpenMessage, setProfileOpenMessage] = React.useState('');

  // 프로필 열기 데이터
  const [profileOpenData, setProfileOpenData] = React.useState({
    match_seq: 0,
    nickname: '',
    message: '',
    tgt_member_seq: 0,
    type: '',
    match_type: '',
  });


  /* ################################################
   ######## Storage Data 구성
   ######## - resLikeList : 내가 받은 관심 목록
   ######## - reqLikeList : 내가 받은 관심 목록
   ######## - matchTrgtList : 내가 받은 관심 목록
   #################################################*/
  const [dataStorage, setDataStorage] = React.useState<any>({
    resLikeList: [],
    reqLikeList: [],
    matchTrgtList: [],
    zzimTrgtList: [],
    liveHighList: [],
    resSpecialCnt: 0,
    reqSpecialCnt: 0,
    matchSpecialCnt: 0,
    zzimItemUseYn: 'N',
  });

  // 탭 목록
  const [tabs, setTabs] = React.useState([
    {
      type: 'RES',
      title: '받은 관심',
      color: '#FF7E8C',
      data: [],
      isNew: false,
      isSpecialExists: false,
    },
    {
      type: 'REQ',
      title: '보낸 관심',
      color: '#697AE6',
      data: [],
      isNew: false,
      isSpecialExists: false,
    },
    {
      type: 'MATCH',
      title: '성공 매칭',
      color: '#8669E6',
      data: [],
      isNew: false,
      isSpecialExists: false,
    },
    {
      type: 'ZZIM',
      title: '찜 목록',
      color: '#69C9E6',
      data: [],
      isNew: false,
      isSpecialExists: false,
    },
    {
      type: 'LIVE',
      title: 'LIVE',
      color: '#FFC100',
      data: [],
      isNew: false,
      isSpecialExists: false,
    },
  ]);

  // ################################################################################# 보관함 정보 조회
  const getStorageData = async (isReal:boolean) => {
    setIsLoading(true);

    try {
      const { success, data } = await get_member_storage();
      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        } else {

          // ##### 회원 기본 정보 갱신
          dispatch(setPartialPrincipal({ mbr_base : data.mbr_base }));

          // ##### 보관함 데이터 구성
          let tabsData = [];

          let resLikeListData = [];
          let reqLikeListData = [];
          let matchTrgtListData = [];
          let zzimTrgtListData = [];
          let liveHighListData = [];
          let zzimItemUseYn = data.zzim_item_use_yn;

          let resSpecialCnt = 0;
          let reqSpecialCnt = 0;
          let matchSpecialCnt = 0;

          resLikeListData = dataUtils.getStorageListData(
            data.res_like_list
          );

          reqLikeListData = dataUtils.getStorageListData(
            data.req_like_list
          );

          matchTrgtListData = dataUtils.getStorageListData(
            data.match_trgt_list
          );

          if(typeof data.zzim_trgt_list != 'undefined') {
            zzimTrgtListData = dataUtils.getStorageListData(
              data.zzim_trgt_list
            );
          };

          liveHighListData = dataUtils.getStorageListData(
            data.live_high_list
          );

          resLikeListData.map(({ special_interest_yn }: { special_interest_yn: any }) => {
            if(special_interest_yn == 'Y') { resSpecialCnt = resSpecialCnt+1; }
          });

          reqLikeListData.map(({ special_interest_yn }: { special_interest_yn: any }) => {
            if(special_interest_yn == 'Y') { reqSpecialCnt = reqSpecialCnt+1; }
          });

          matchTrgtListData.map(({ special_interest_yn }: { special_interest_yn: any }) => {
            if(special_interest_yn == 'Y') { matchSpecialCnt = matchSpecialCnt+1; }
          });


          // tabs 데이터 구성
          tabsData = [
            {
              type: 'RES',
              title: '받은 관심',
              color: '#FF7E8C',
              data: resLikeListData,
              isNew: data.res_new_yn == 'Y' ? true : false,
              isSpecialExists: resSpecialCnt > 0 ? true : false,
            },
            {
              type: 'REQ',
              title: '보낸 관심',
              color: '#697AE6',
              data: reqLikeListData,
              isNew: false,
              isSpecialExists: reqSpecialCnt > 0 ? true : false,
            },
            {
              type: 'MATCH',
              title: '성공 매칭',
              color: '#8669E6',
              data: matchTrgtListData,
              isNew: data.succes_new_yn == 'Y' ? true : false,
              isSpecialExists: matchSpecialCnt > 0 ? true : false,
            },
          ];

          if(zzimItemUseYn == 'Y') {
            tabsData.push({
              type: 'ZZIM',
              title: '찜 목록',
              color: '#69C9E6',
              data: zzimTrgtListData,
              isNew: false,
            });
          };

          if(liveHighListData.length > 0) {
            tabsData.push({
              type: 'LIVE',
              title: 'LIVE',
              color: '#FFC100',
              data: liveHighListData,
              isNew: data.live_res_new_yn == 'Y' ? true : false,
            });
          };


          let tmpResSpecialCnt = 0;
          let tmpReqSpecialCnt = 0;
          let tmpMatchSpecialCnt = 0;

          if(data?.res_like_list.length > 0) {
            data?.res_like_list.map(({ special_interest_yn } : { special_interest_yn: any }) => {
                if (special_interest_yn == 'Y') {
                  tmpResSpecialCnt++;
                }
              }
            );
          };

          if(data?.req_like_list.length > 0) {
            data?.req_like_list.map(({ special_interest_yn }: { special_interest_yn: any }) => {
                if (special_interest_yn == 'Y') {
                  tmpReqSpecialCnt++;
                }
              }
            );
          };

          if(data?.match_trgt_list.length > 0) {
            data?.match_trgt_list.map(({ special_interest_yn }: { special_interest_yn: any }) => {
                if (special_interest_yn == 'Y') {
                  tmpMatchSpecialCnt++;
                }
              }
            );
          };

          setDataStorage({
            ...dataStorage,
            resLikeList: resLikeListData,
            reqLikeList: reqLikeListData,
            matchTrgtList: matchTrgtListData,
            zzimTrgtList: zzimTrgtListData,
            liveHighList: liveHighListData,
            resSpecialCnt: tmpResSpecialCnt,
            reqSpecialCnt: tmpReqSpecialCnt,
            matchSpecialCnt: tmpMatchSpecialCnt,
            zzimItemUseYn: zzimItemUseYn,
          });

          setTabs(tabsData);

          if(!isReal) {
            if(loadPage == 'ZZIM' || loadPage == 'LIVE') {
              if((loadPage == 'ZZIM' && zzimItemUseYn != 'Y') || (loadPage == 'LIVE' && data.live_high_list.length == 0)) {
                onPressDot(0);
              } else {
                if(loadPage == 'ZZIM') {
                  onPressDot(3);
                } else if(loadPage == 'LIVE') {
                  if(zzimItemUseYn != 'Y') {
                    onPressDot(3);
                  } else {
                    onPressDot(4);
                  }
                }
              }
            } else if(loadPage == 'REQ') {
              onPressDot(1);
            } else {
              tabs.map((item: any, index) => {
                if(item.type == loadPage) {
                  onPressDot(index);
                }
              });
            };
  
            navigation.setParams({ loadPage: 'RES' });
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ################################################################################# 프로필 열람 팝업 활성화
  const popupProfileOpen = async (
    match_seq: any,
    tgt_member_seq: any,
    type: any,
    profile_open_yn: any,
    member_status: any,
    match_type: any,
    special_interest_yn: any,
    message: any,
    nickname: any,
  ) => {
    
    if(member_status != 'ACTIVE') {
      let msg = '최근에 휴면 또는 탈퇴를 하신 회원이에요.';
      
      if(member_status == 'APPROVAL') {
        msg = '해당 회원은 가입심사 대기중 회원이에요.';
      } else if(member_status == 'BLOCK' || member_status == 'RESTRICT') {
        msg = '해당 회원은 계정이 정지된 회원이에요.';
      }

      show({
        title: '프로필 열람 실패',
        content: msg,
      });

      return;
    };
    
    // 찐심인 경우 열람통과
    if (special_interest_yn == 'N' && profile_open_yn == 'N') {
      setProfileOpenMessage(message);
      setIsProfileOpenVisible(true);

      setProfileOpenData({
        ...profileOpenData,
        match_seq: match_seq,
        nickname: nickname,
        message: message,
        tgt_member_seq: tgt_member_seq,
        type: type,
        match_type: match_type,
      });

    } else {
      navigation.navigate(STACK.COMMON, { screen: 'StorageProfile', params: {
        matchSeq: match_seq,
        tgtMemberSeq: tgt_member_seq,
        type: type,
        matchType: match_type,
      } });

      navigation.setParams({ loadPage: type });
    }
  };

  // ################################################################################# 프로필 열람 이동
  const goProfileOpen = async (match_seq:any, tgt_member_seq:any, type:any, match_type:any) => {
    let req_profile_open_yn = '';
    let res_profile_open_yn = '';

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      if (type == 'REQ' || match_type == 'LIVE_REQ') {
        req_profile_open_yn = 'Y';
      } else if (type == 'RES' || match_type == 'LIVE_RES') {
        res_profile_open_yn = 'Y';
      }
  
      const body = {
        match_seq: match_seq,
        req_profile_open_yn: req_profile_open_yn,
        res_profile_open_yn: res_profile_open_yn,
      };
  
      try {
        const { success, data } = await update_match(body);
        if(success) {
          if (data.result_code == '0000') {
            dispatch(myProfile());
            setIsProfileOpenVisible(false);
            navigation.navigate(STACK.COMMON, {
              screen: 'StorageProfile', 
              params: {
                matchSeq: match_seq,
                tgtMemberSeq: tgt_member_seq,
                type: type,
                matchType: match_type
              }
            });
  
            navigation.setParams({ loadPage: type });
  
          } else if (data.result_code == '6010') {
            show({ content: '보유 패스가 부족합니다.' });
            return false;
          } else {
            console.log(data.result_msg);
            show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
        setIsLoading(false);
      }
    }
  };

  // 라이브 탭 활성
  const onLiveTab = (type:string) => {
    if(type == 'RES') {
      setIsLiveResVisible(isLiveResVisible ? false : true);
    } else if(type == 'REQ') {
      setIsLiveReqVisible(isLiveReqVisible ? false : true);
    }
  };

  // ######################################################################################## 모두 확인 처리
  const allCheck = async (type:string) => {
    const body = {
      type: type
    };

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      try {
        const { success, data } = await match_check_all(body);
        if(success) {
          if (data.result_code == '0000') {
            getStorageData(true);
          } else {
            console.log(data.result_msg);
            show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
        //setIsLoading(false);
      }
    }
  };

  // ######################################################################################## 초기 실행 함수
  React.useEffect(() => {
    if(isFocusStorage) {
      getStorageData(isEmptyData(params?.loadPage) ? false : true);
    }
  }, [isFocusStorage]);

  useFocusEffect(
    React.useCallback(() => {

      return () => {
        if(isEmptyData(props.route.params?.loadPage)) {
          //navigation.setParams({ headerType: '', loadPage: 'RES' });
          //setCurrentIndex(0);
        };
      };
    }, []),
  );

  // #######################################################################################################
  const onPressDot = async (index:any, type:any) => {
    if(isEmptyData(dataRef?.current)) {
      setCurrentIndex(index);
      //dataRef?.current?.snapToItem(index);
      //dataRef?.current?.scrollToIndex({index:2});
    };
  };

  // 이미지 스크롤 처리
  /* const handleScroll = async (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
  }; */

  React.useEffect(() => {
    if(currentIndex == 0 || currentIndex == 1) {
      tabScrollRef?.current?.scrollTo({x:0, animated:true});
    } else if(currentIndex > 2) {
      tabScrollRef?.current?.scrollToEnd({animated: true});
    }
  }, [currentIndex]);


  /* ################################################################################ 보관함 아이템 렌더링 */
  const StorageRenderItem = React.memo(({ item, index, type, tabColor }) => {
    const matchType = item.match_type; // 매칭 유형
    const matchStatus = item.match_status; // 매칭 상태

    let isShow = true;  // 노출 여부
    let tgt_member_seq = '';
    let profile_open_yn = 'N';
    let isBlur = false;

    // 노출 여부 설정
    if(type == 'REQ' || type == 'RES' || type == 'MATCH') {
      if(isSpecialVisible && item.special_interest_yn == 'N') {
        isShow = false;
      }
    } else if(type == 'LIVE') {
      if((matchType == 'LIVE_RES' && !isLiveResVisible) || (matchType == 'LIVE_REQ' && !isLiveReqVisible)) {
        isShow = false;
      }
    }

    // 대상 회원 번호, 프로필 열람 여부 설정
    if(type == 'RES' || matchType == 'LIVE_RES') {
      tgt_member_seq = item.req_member_seq;
      profile_open_yn = item.res_profile_open_yn;

      if(item.res_profile_open_yn == 'N') {
        isBlur = true;
      };

    } else if(type == 'REQ' || matchType == 'LIVE_REQ') {
      tgt_member_seq = item.res_member_seq;
      profile_open_yn = 'Y';

    } else if(type == 'MATCH' || type == 'ZZIM') {
      if (item.req_member_seq != memberSeq) {
        tgt_member_seq = item.req_member_seq;
      } else {
        tgt_member_seq = item.res_member_seq;
      };
      profile_open_yn = 'Y';
    };

    return (
      <>
        {isShow && 

          <TouchableOpacity
            style={[{borderRadius: 15, overflow: 'hidden', marginBottom: 12, marginRight: 13}/* , index%2 == 0 && {marginRight: 14} */]}
            disabled={matchStatus == 'REFUSE'}
            onPress={() => {
              popupProfileOpen(
                item.match_seq,
                tgt_member_seq,
                type,
                profile_open_yn,
                item.member_status,
                matchType,
                item.special_interest_yn,
                item.message,
                item.nickname,
              );
            }}>

            {/* 이미지 영역 */}
            <View>
              <Image source={item.img_path} style={_styles.renderItemContainer} />
            </View>

            {/* 상단 영역 */}
            <View style={_styles.renderItemTopContainer}>
              <View style={{flexDirection: 'row', alignItems: 'center', height: 25}}>
                {type == 'ZZIM' ? (
                  <Image style={_styles.renderItemTopIcon} source={ICON.zzimCircle} />
                ) : (
                  <>
                    {type == 'LIVE' ? (
                      <>
                        {isEmptyData(item.req_profile_score) &&
                          <View style={_styles.liveScoreArea(item.match_type)}>
                            <Text style={_styles.liveScoreText(item.match_type)}>★ {item.req_profile_score}</Text>
                          </View>
                        }
                      </>
                    ) : (
                      <>
                        <Image style={_styles.renderItemTopIcon} source={item.special_interest_yn == 'N' ? ICON.passCircle : ICON.royalPassCircle} />
                        {isEmptyData(item?.special_level) && <Text style={_styles.levelText(isBlur)}>Lv.{item.special_level}</Text>}
                      </>
                    )}
                  </>
                )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>

                {(((type == 'RES' || matchType == 'LIVE_RES') && item.res_check_yn == 'N') || (matchType == 'MATCH_REQ' && item.req_success_check_yn == 'N')) && (
                  <View style={_styles.newDotted(tabColor)} />
                )}
                <Text style={[_styles.renderItemTopText]}>
                  {item.keep_end_day > 0 ? item.keep_end_day + '일 남음' : '오늘까지'}
                </Text>
              </View>

            </View>

            {/* 하단 영역 */}
            <View style={[_styles.renderItemBottomContainer]}>
              <View style={{flexDirection: 'row', marginBottom: -2, justifyContent: 'space-between'}}>

                {/* ############# 인증 레벨 노출 */}
                <AuthLevel authAcctCnt={item.auth_acct_cnt} type={'SMALL'} />

                {/* ############# 프로필 평점 노출 */}
                <ProfileGrade profileScore={item.profile_score} type={'SMALL'} />

              </View>

              <Text style={_styles.renderItemBottomTextName}>{item.nickname}, {item.age}</Text>

                {/* {isEmptyData(item.job_name) && isEmptyData(item.height) && 
                  <Text style={_styles.renderItemBottomTextSpec}>
                    {item.job_name} {isEmptyData(item.height) && item.height + 'cm'}
                  </Text>
                } */}
            </View>

            {(item.special_interest_yn == 'N' && isBlur) && (
              <>
                <View style={_styles.reqRenderItem}>
                  <Text style={_styles.reqRenderItemText}>터치하고 열어보기</Text>
                </View>

                <BlurView 
                  style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
                  blurType='dark'
                  blurAmount={5} />
              </>
            )}

            {/* 매칭 거절 표시 */}
            {matchStatus == 'REFUSE' &&
              <View style={_styles.refuseArea}>
                <View style={_styles.refuseAreaTextArea}>
                  <Text style={_styles.refuseAreaText}>매칭실패</Text>
                </View>
              </View>
            }

          </TouchableOpacity>
        }
      </>
    );

  });



  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    // 새로고침을 시작할 때 호출되는 함수
    //setIsRefreshing(true);

    // 여기에서 데이터를 새로고침하거나 API 호출을 수행하세요.
    // 새로운 데이터를 가져온 후 setData로 업데이트합니다.

    // 데이터를 업데이트한 후 새로고침 상태를 false로 설정합니다.
    //setIsRefreshing(false);
  };

  return (
    <>
      {isLoading && <CommonLoading />}

      <View style={_styles.root}>
        {/* <CommonHeader title={tabs[currentIndex].title} right={<Wallet theme />} /> */}

        {props.route.params?.headerType == 'common' ? (
          <CommonHeader title={'보관함'} />
        ) : (
          <TopNavigation currentPath={''} />
        )}

        {/* ####################################################################################################
        ##################################### 탭 Indicator
        #################################################################################################### */}
        <SpaceView mb={6}>
          <ScrollView 
            horizontal 
            ref={tabScrollRef}
            showsHorizontalScrollIndicator={false} 
            style={_styles.topContainer}>

            <View style={_styles.dotContainer}>
              {tabs.map((item, index) => (
                <>
                  <SpaceView key={index} pt={10}>
                    <TouchableOpacity onPress={() => { onPressDot(index); }}>
                      <View style={[_styles.tabItem(index === currentIndex, item.color)]}>
                        <Text style={_styles.tabItemText}>{item.title} | {item.data.length}</Text>
                      </View>
                    </TouchableOpacity>
                    {item.isNew && ( <View style={_styles.newIcon(item.color)} /> )}
                  </SpaceView>
                </>
              ))}
            </View>
          </ScrollView>
        </SpaceView>
        
        {/* ####################################################################################################
        ##################################### 배너 영역
        #################################################################################################### */}
        <SpaceView mt={5} mb={6} viewStyle={_styles.bannerArea}>
          <View>
            <Text style={_styles.bannerText01}>관심과 찐심은 직진이에요.</Text>
            <Text style={_styles.bannerText02}>
              관심을 수락하면 상대방이 <Text style={{color: '#FFC100'}}>내 연락처를 열람</Text>할 수 있어요.{'\n'}
              호감 가는 사람의 관심과 찐심을 받아 주세요.
            </Text>
          </View>
          <View style={{position: 'absolute', right: 10, bottom: 8}}>
            <Image source={ICON.loveIcon} style={styles.iconSquareSize(35)} />
          </View>
        </SpaceView>

        {/* ####################################################################################################
        ##################################### 설정 영역
        #################################################################################################### */}
        {(tabs[currentIndex]?.type != 'ZZIM' && tabs[currentIndex]?.data.length > 0) &&
          <SpaceView mt={7} mb={3} pl={22} pr={22}>
            <View style={[_styles.row, {minHeight: 30}]}>
              {(tabs[currentIndex].type != 'LIVE' && tabs[currentIndex]?.data.length > 0) &&
                <>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={_styles.showText}>찐심만 보기</Text>
                    <ToggleSwitch
                      isOn={isSpecialVisible}
                      onColor={Color.primary}
                      offColor={Color.grayDDDD}
                      size="small"
                      onToggle={(isOn) => setIsSpecialVisible(isOn) }
                    />
                  </View>
                </>
              }

              {tabs[currentIndex]?.type == 'LIVE' &&
                <View style={_styles.liveTabArea}>
                  <TouchableOpacity onPress={() => { onLiveTab('RES'); }} style={_styles.liveTabItem(isLiveResVisible, 'RES')}>
                    <Text style={_styles.liveTabText(isLiveResVisible, 'RES')}>받은 LIVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { onLiveTab('REQ'); }} style={_styles.liveTabItem(isLiveReqVisible, 'REQ')}>
                    <Text style={_styles.liveTabText(isLiveReqVisible, 'REQ')}>보낸 LIVE</Text>
                  </TouchableOpacity>
                </View>
              }

              {((tabs[currentIndex]?.type == 'RES' || tabs[currentIndex]?.type == 'MATCH' || tabs[currentIndex]?.type == 'LIVE') && tabs[currentIndex]?.data.length > 0) && (
                <>
                  {tabs[currentIndex]?.isNew ? (
                    <TouchableOpacity onPress={() => { allCheck(tabs[currentIndex]?.type); }} style={_styles.checkArea}>
                      <Image source={ICON.checkOnIcon} style={styles.iconSquareSize(17)} />
                      <Text style={_styles.checkAreaText('#333333')}>{tabs[currentIndex]?.type == 'MATCH' ? '성공 매칭을' : '새 관심들을'} 모두 확인했어요.</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={_styles.checkArea}>
                      <Image source={ICON.checkOffIcon} style={styles.iconSquareSize(17)} />
                      <Text style={_styles.checkAreaText('#D5D5D5')}>{tabs[currentIndex]?.type == 'MATCH' ? '성공 매칭을' : '새 관심들을'} 모두 확인했어요.</Text>
                    </View>
                  )}
                </>
              )}
              
            </View>
          </SpaceView>
        }

        {/* ####################################################################################################
        ##################################### 아이템 슬라이드 영역
        #################################################################################################### */}
        <SpaceView mt={10}>
          <Carousel
            ref={dataRef}
            data={tabs}
            firstItem={currentIndex}
            //onSnapToItem={setCurrentIndex}
            onBeforeSnapToItem={setCurrentIndex}
            //activeAnimationType={'spring'}
            sliderWidth={width}
            itemWidth={width}
            pagingEnabled
            renderItem={({item, index}) => {
              const type = item.type;
              const color = item.color;

              return (
                <>
                  {(tabs[currentIndex]?.type == type && !isLoading) &&
                    <View key={'storage_' + index}>
                      {item.data.length == 0 ? (
                        <SpaceView viewStyle={_styles.noData}>
                          <Text style={_styles.noDataText}>{item.title}이 없습니다.</Text>
                        </SpaceView>
                      ) : (
                        <>
                          {(isSpecialVisible && !item.isSpecialExists && item.type != 'ZZIM' && item.type != 'LIVE') ? (
                            <SpaceView viewStyle={_styles.noData}>
                              <Text style={_styles.noDataText}>찐심이 없습니다.</Text>
                            </SpaceView>
                          ) : (
                            <>
                              <ScrollView 
                                showsVerticalScrollIndicator={false} 
                                style={{width: '100%', height: height-250}}
                                /*refreshControl={
                                  <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    // progressViewOffset={} // 이 속성을 사용하여 새로고침 진행 표시기 위치를 조정할 수 있습니다.
                                    // size={} // 새로고침 진행 표시기의 크기를 조정할 수 있습니다.
                                    // tintColor={} // 새로고침 진행 표시기의 색상을 변경할 수 있습니다.
                                    title={'새로고침'} // 새로고침 진행 표시기 아래에 표시될 텍스트를 설정할 수 있습니다.
                                  >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, position: 'absolute', top: 0, }}>
                                      {isRefreshing && <ActivityIndicator size="large" color="#0000ff" />}
                                      {isRefreshing && <Text>새로고침 중...</Text>}
                                    </View>
                                  </RefreshControl>
                                }*/>

                                <View style={_styles.imageWarpper}>
                                  <FlatList
                                    //style={_styles.itemWrap}
                                    contentContainerStyle={_styles.itemWrap}
                                    data={item.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    //numColumns={2} // 2열로 표시하도록 설정
                                    //initialNumToRender={6}
                                    //maxToRenderPerBatch={6}
                                    //windowSize={10}
                                    removeClippedSubviews={true}
                                    getItemLayout={(data, index) => (
                                      {
                                          length: (width - 54) / 2,
                                          offset: ((width - 54) / 2) * index,
                                          index
                                      }
                                    )}
                                    renderItem={({ item: innerItem, index: innerIndex }) => {
                                      return (
                                        <View key={index}>
                                          <StorageRenderItem item={innerItem} index={innerIndex} type={type} tabColor={color} />
                                        </View>
                                      )
                                    }}
                                  />
                                </View>

                                <View style={{ height: 130 }} />
                              </ScrollView>
                            </>
                          )}
                        </>
                      )}
                    </View>
                  }
                </>
              )
            }}
          />
        </SpaceView>
      </View>

      {/* ####################################################################################################
      ##################################### 프로필 열람 팝업
      #################################################################################################### */}
      <Modal visible={isProfileOpenVisible} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalHeader]}>
              <CommonText fontWeight={'700'} type={'h5'} color={'#676767'}>프로필 열람</CommonText>
            </SpaceView>

            <SpaceView viewStyle={[modalStyle.modalBody]}>
              {isEmptyData(profileOpenData.message) && (
                <SpaceView mt={-5} mb={10} viewStyle={_styles.openPopupMessageArea}>
                  <Text style={_styles.openPopupMessageTit}>{profileOpenData.nickname}님의 메시지</Text>

                  <ScrollView style={{maxHeight: 100}} showsVerticalScrollIndicator={false}>
                    <Text style={_styles.openPopupMessageText}>"{profileOpenData.message}"</Text>
                  </ScrollView>
                </SpaceView>
              )}

              <SpaceView mt={7} viewStyle={_styles.openPopupDescArea}>
                <Text style={_styles.openPopupDescText}>상대방의 프로필을 열람 하시겠습니까?</Text>
                <SpaceView mt={5} viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={styles.iconSquareSize(25)} source={ICON.passCircle} resizeMode={'contain'} />
                  <Text style={_styles.openPopupDescIcon}>X 15</Text>
                </SpaceView>
              </SpaceView>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: Color.grayD6D3D3, borderBottomLeftRadius: 20}]}
                onPress={() => { setIsProfileOpenVisible(false); }}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>취소하기</CommonText>
              </TouchableOpacity>

              <View style={modalStyle.modalBtnline} />

              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomRightRadius: 20}]}
                onPress={() => { goProfileOpen(profileOpenData.match_seq, profileOpenData.tgt_member_seq, profileOpenData.type, profileOpenData.match_type); }}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>확인하기</CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};



{/* ######################################################################################################
################################################ Style 영역 ##############################################
###################################################################################################### */}

const _styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    height: height,
    width: width,
  },
  itemWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'flex-start',
  },
  topContainer: {
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  dotContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 9,
    height: 9,
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  showText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginRight: 8,
  },
  imageWarpper: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    //paddingHorizontal: 21,
    paddingLeft: 21,
  },
  renderItemContainer: {
    width: (width - 54) / 2,
    height: (width - 54) / 2,
    borderRadius: 15,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    overflow: 'hidden',
  },
  renderItemTopContainer: {
    position: 'absolute',
    flexDirection: `row`,
    alignItems: 'center',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    top: 5,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  renderItemTopIcon: {
    width: 25,
    height: 25,
    marginRight: 1,
  },
  renderItemTopZzimIcon: {
    width: 20,
    height: 20,
    marginRight: 1,
  },
  renderItemTopText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginRight: 3,
  },
  renderItemBottomContainer: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: `center`,
    left: 10,
    bottom: 10,
  },
  renderItemBottomTextName: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginTop: 2,
  },
  renderItemBottomTextSpec: {
    opacity: 0.86,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  levelText: (isBlur: boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: 13,
      color: '#fff',
      backgroundColor: isBlur ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
      paddingHorizontal: isBlur ? 8 : 0,
      paddingVertical: isBlur ? 1 : 0,
      borderRadius: isBlur ? 10 : 0,
      overflow: 'hidden',
      textAlign: 'center',
    }
  },
  tabItem: (isOn: boolean, itemColor: string) => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      height: 25,
      borderRadius: 20,
      marginRight: 5,
      backgroundColor: isOn ? itemColor : '#ECECEC',
    }
  },
  tabItemText: {
    fontSize: 14,
    fontFamily: 'AppleSDGothicNeoEB00',
    color: ColorType.white,
    letterSpacing: 0,
    textAlign: 'left',
  },
  noData: {
    paddingHorizontal: 20,
    height: height - 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#646467',
  },
  reqRenderThumb: {
    width: '100%', 
    height: '100%', 
    backgroundColor: '#fff', 
    opacity: 0.9,
  },
  reqRenderItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', 
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  reqRenderItemText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'AppleSDGothicNeoB00',
    marginTop: '70%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 13,
    paddingVertical: 2,
    borderRadius: 15,
    overflow: 'hidden',
  },
  liveTabArea: {
    flexDirection: 'row',
  },
  liveTabItem: (isOn: boolean, type: string) => {
    return {
      backgroundColor: isOn ? type == 'RES' ? '#FE0456' : '#7986EE' : '#fff',
      borderWidth: 1,
      borderColor: type == 'RES' ? '#FE0456' : '#7986EE',
      borderRadius: 8,
      width: 65,
      height: 22,
      alignItems: `center`,
      justifyContent: `center`,
      marginRight: 4,
    }
  },
  liveTabText: (isOn: boolean, type: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 11,
      color: !isOn ? type == 'RES' ? '#FE0456' : '#7986EE' : '#fff',
    };
  },
  liveScoreArea: (type: string) => {
    return {
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `center`,
      borderWidth: 1,
      borderColor: type == 'LIVE_RES' ? '#FE0456' : '#7986EE',
      borderRadius: 5,
      paddingHorizontal: 5,
      height: 19,
      backgroundColor: type == 'LIVE_RES' ? '#FE0456' : '#7986EE',
      marginTop: 2,
      marginLeft: 3,
    };
  },
  liveScoreText: (type: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: 12,
      color: '#fff',
    };
  },
  newIcon: (itemColor: string) => {
    return {
      position: 'absolute',
      top: 3,
      right: 5,
      width: 8,
      height: 8,
      backgroundColor: itemColor,
      borderRadius: 30,
    };
  },
  checkArea: {
    flexDirection: 'row',
    backgroundColor: '#EFF3FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    overflow: 'hidden',
  },
  checkAreaText: (itemColor: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoM00',
      fontSize: 12,
      color: itemColor,
      marginLeft: 5,
    };
  },
  newDotted: (itemColor: string) => {
    return {
      width: 8,
      height: 8,
      backgroundColor: itemColor,
      borderRadius: 30,
      marginRight: 5,
    };
  },
  bannerArea: {
    height: 65,
    backgroundColor: '#1E67D4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 23,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerText01: {
    color: '#85FFEE',
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    marginTop: -4,
  },
  bannerText02: {
    color: '#ffffff',
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
  },
  refuseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  refuseAreaTextArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  refuseAreaText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 5,
  },
  openPopupMessageArea: {
    width: '100%',
    backgroundColor: '#F6F7FE',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  openPopupMessageTit: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    color: '#646464',
    marginBottom: 10,
  },
  openPopupMessageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#646464',
  },
  openPopupDescArea: {
    alignItems: 'center',
  },
  openPopupDescText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    color: '#646464',
  },
  openPopupDescIcon: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 16,
    color: '#697AE6',
    marginLeft: 3,
  },
  
});