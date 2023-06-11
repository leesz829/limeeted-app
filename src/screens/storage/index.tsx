import { ColorType, BottomParamList, ScreenNavigationProp } from '@types';
import { commonStyle, styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { Wallet } from 'component/TopNavigation';
import * as React from 'react';
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground,
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
} from '@react-navigation/native';
import * as dataUtils from 'utils/data';
import { useDispatch } from 'react-redux';
import { get_member_storage, update_match } from 'api/models';
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

  const { show } = usePopup();  // 공통 팝업

  const memberSeq = useMemberseq(); // 회원번호

  const [btnStatus, setBtnStatus] = useState(true);
  const [btnStatus1, setBtnStatus1] = useState(true);
  const [btnStatus2, setBtnStatus2] = useState(true);

  const [isSpecialVisible, setIsSpecialVisible] = React.useState(false);

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
    resSpecialCnt: 0,
    reqSpecialCnt: 0,
    matchSpecialCnt: 0,
  });

  // ################################################################################# 보관함 정보 조회
  const getStorageData = async () => {
    setIsLoading(true);

    try {
      const { success, data } = await get_member_storage();
      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        } else {
          let resLikeListData: any = dataUtils.getStorageListData(
            data.res_like_list
          );
          let reqLikeListData: any = dataUtils.getStorageListData(
            data.req_like_list
          );
          let matchTrgtListData: any = dataUtils.getStorageListData(
            data.match_trgt_list
          );
          let zzimTrgtListData: any = dataUtils.getStorageListData(
            data.zzim_trgt_list
          );

          let tmpResSpecialCnt = 0;
          let tmpReqSpecialCnt = 0;
          let tmpMatchSpecialCnt = 0;

          if (data.res_like_list.length > 0) {
            [
              data.res_like_list.map(
                ({ special_interest_yn }: { special_interest_yn: any }) => {
                  if (special_interest_yn == 'Y') {
                    tmpResSpecialCnt++;
                  }
                }
              ),
            ]
          };            

          if (data.req_like_list.length > 0) {
            [
              data.req_like_list.map(
                ({ special_interest_yn }: { special_interest_yn: any }) => {
                  if (special_interest_yn == 'Y') {
                    tmpReqSpecialCnt++;
                  }
                }
              ),
            ]
          };

          if (data.match_trgt_list.length > 0) {
            [
              data.match_trgt_list.map(
                ({ special_interest_yn }: { special_interest_yn: any }) => {
                  if (special_interest_yn == 'Y') {
                    tmpMatchSpecialCnt++;
                  }
                }
              ),
            ]
          };
            

          setDataStorage({
            ...dataStorage,
            resLikeList: resLikeListData,
            reqLikeList: reqLikeListData,
            matchTrgtList: matchTrgtListData,
            zzimTrgtList: zzimTrgtListData,
            resSpecialCnt: tmpResSpecialCnt,
            reqSpecialCnt: tmpReqSpecialCnt,
            matchSpecialCnt: tmpMatchSpecialCnt,
          });
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
  ) => {
    
    if(member_status != 'ACTIVE') {
      show({
        title: '프로필 열람 실패',
        content: '최근에 휴면 또는 탈퇴를 하신 회원입니다.',
      });

      return;
    }
    
    if (profile_open_yn == 'N') {

      show({
        title: '프로필 열람',
        content: '패스를 소모하여 프로필을 열람하시겠습니까?\n패스 x15',
        cancelCallback: function() {

        },
        confirmCallback: function() {
          goProfileOpen(match_seq, tgt_member_seq, type);
        },
      });

    } else {
      navigation.navigate(STACK.COMMON, { screen: 'StorageProfile', params: {
        matchSeq: match_seq,
        tgtMemberSeq: tgt_member_seq,
        type: type,
      } });
    }
  };

  // ################################################################################# 프로필 열람 이동
  const goProfileOpen = async (match_seq:any, tgt_member_seq:any, type:any) => {
    let req_profile_open_yn = '';
    let res_profile_open_yn = '';

    if (type == 'REQ') {
      req_profile_open_yn = 'Y';
    } else if (type == 'RES') {
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
          navigation.navigate(STACK.COMMON, { screen: 'StorageProfile', params: {
            matchSeq: match_seq,
            tgtMemberSeq: tgt_member_seq,
            type: type,
          } });

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

    }
  };

  // ######################################################################################## 초기 실행 함수
  React.useEffect(() => {
    if(isFocusStorage) {
      getStorageData();
    }
  }, [isFocusStorage]);


  // #######################################################################################################
  const { route } = props;
  const params = route.params;
  const pageIndex = params?.pageIndex || 0;
  const ref = useRef();
  const [currentIndex, setCurrentIndex] = useState(pageIndex);

  const tabs = [
    {
      type: 'REQ',
      title: '받은 관심',
      color: '#FF7E8C',
      data: dataStorage.resLikeList
    },
    {
      type: 'RES',
      title: '보낸 관심',
      color: '#697AE6',
      data: dataStorage.reqLikeList
    },
    {
      type: 'MATCH',
      title: '성공 매칭',
      color: '#8669E6',
      data: dataStorage.matchTrgtList
    },
    {
      type: 'ZZIM',
      title: '찜 목록',
      color: '#69C9E6',
      data: dataStorage.zzimTrgtList
    },
  ];

  const onPressDot = (index) => {
    ref?.current?.snapToItem(index);
  };


  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={_styles.topContainer}>
          <View style={_styles.dotContainer}>
            {tabs.map((item, index) => (
              <TouchableOpacity 
                onPress={() => {
                  onPressDot(index);
                }}>

                <View
                  style={[
                    //_styles.dot,
                    _styles.tabItem,
                    {
                      backgroundColor: index === currentIndex ? item.color : '#ececec',
                    },
                  ]}>
                  <Text style={_styles.tabItemText}>{item.title} | {item.data.length}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <SpaceView mt={7} viewStyle={commonStyle.paddingHorizontal25}>
          <View style={[_styles.row, {minHeight: 30}]}>
            {currentIndex < 3 &&
              <>
                <Text style={_styles.showText}>찐심만 보기</Text>
                <ToggleSwitch
                  isOn={isSpecialVisible}
                  onColor={Color.primary}
                  offColor={Color.grayDDDD}
                  size="small"
                  onToggle={(isOn) => setIsSpecialVisible(isOn) }
                />
              </>
            }
          </View>
        </SpaceView>

        <Carousel
          ref={ref}
          data={tabs}
          firstItem={pageIndex}
          onSnapToItem={setCurrentIndex}
          sliderWidth={width}
          itemWidth={width}
          pagingEnabled
          renderItem={({item, index}) => {
            return (
              <>
                {item.data.length == 0 ? (
                  <SpaceView viewStyle={_styles.noData}>
                    <Text style={_styles.noDataText}>{item.title}이 없습니다.</Text>
                  </SpaceView>
                ) : (
                  <ScrollView>
                    <View style={_styles.imageWarpper}>
                      {item.data.map((i, n) => (
                        <RenderItem item={i} index={n} type={item.type} />
                      ))}
                    </View>

                    <View style={{ height: 50 }} />
                  </ScrollView>
                )}
              </>
            )
          }}          
        />
      </View>
    </>
  );

  function RenderItem({ item, index, type }) {
    let tgt_member_seq = '';
    let profile_open_yn = 'N';

    if(type == 'REQ') {
      tgt_member_seq = item.req_member_seq;
      profile_open_yn = item.req_profile_open_yn;
    } else if(type == 'RES') {
      tgt_member_seq = item.res_member_seq;
      profile_open_yn = 'Y';
    } else if(type == 'MATCH' || type == 'ZZIM') {
      if (item.req_member_seq != memberSeq) {
        tgt_member_seq = item.req_member_seq;
      } else {
        tgt_member_seq = item.res_member_seq;
      }
      profile_open_yn = 'Y';
    };

    return (
      <>
        {((isSpecialVisible && item.special_interest_yn == 'Y') || (!isSpecialVisible)) && 

          <TouchableOpacity
            onPress={() => {
              popupProfileOpen(
                item.match_seq,
                tgt_member_seq,
                type,
                profile_open_yn,
                item.member_status
              );
            }}>

            <ImageBackground source={item.img_path} style={_styles.renderItemContainer}>
              <View style={_styles.renderItemTopContainer}>

                {type == 'ZZIM' ? (
                  <>
                    <Image style={_styles.renderItemTopZzimIcon} source={ICON.zzimCircle} />
                    <Text style={[_styles.renderItemTopText, {marginTop: 5}]}>
                      {item.dday > 0 ? item.dday + '일 남음' : '오늘까지'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Image style={_styles.renderItemTopIcon} source={item.special_interest_yn == 'N' ? ICON.passCircle : ICON.royalPassCircle} />
                    <Text style={[_styles.renderItemTopText, (type == 'REQ' && profile_open_yn == 'N' && {color: '#787878'})]}>
                      {item.dday > 0 ? item.dday + '일 남음' : '오늘까지'}
                    </Text>
                  </>
                )}
              </View>

              <View style={[_styles.renderItemBottomContainer]}>
                <View style={{flexDirection: 'row', marginBottom: -2, justifyContent: 'space-between'}}>
                  {/* ############# 인증 레벨 노출 */}

                  {item.auth_acct_cnt > 0 && item.auth_acct_cnt < 10 &&
                    <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {item.auth_acct_cnt >= 10 && item.auth_acct_cnt < 15 &&
                    <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level10Icon} style={[_styles.authBadgeImg, {width: 18, height: 18}]} />
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {item.auth_acct_cnt >= 15 && item.auth_acct_cnt < 20 &&
                    <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level15Icon} style={[_styles.authBadgeImg, {width: 18, height: 18}]} />
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {item.auth_acct_cnt >= 20 && item.auth_acct_cnt < 25 &&
                    <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level20Icon} style={[_styles.authBadgeImg02, {width: 18, height: 18}]} />
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {item.auth_acct_cnt >= 25 && item.auth_acct_cnt < 30 &&
                    <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level25Icon} style={[_styles.authBadgeImg02, {width: 20, height: 20}]} />
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {item.auth_acct_cnt >= 30 &&
                    <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                      <Image source={ICON.level30Icon} style={[_styles.authBadgeImg02, {width: 20, height: 20}]} />
                      <Text style={_styles.whiteText}>LV.{item.auth_acct_cnt}</Text>
                    </LinearGradient>
                  }

                  {/* ############# 프로필 평점 노출 */}
                  {item.profile_score < 6.0 &&
                    <LinearGradient colors={['#FF7EA6', '#FF7EA6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.score5Icon} style={[{width: 8, height: 8}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                  {item.profile_score >= 6.0 && item.profile_score < 7.0 &&
                    <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.score6Icon} style={[{width: 10, height: 10}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                  {item.profile_score >= 7.0 && item.profile_score < 8.0 &&
                    <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.score7Icon} style={[{width: 10, height: 10}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                  {item.profile_score >= 8.0 && item.profile_score < 9.0 &&
                    <LinearGradient colors={['#FE0456', '#FF82AB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.scoreKingIcon} style={[{width: 10, height: 10}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                  {item.profile_score >= 9.0 && item.profile_score < 10.0 &&
                    <LinearGradient colors={['#FE0456', '#9E6DF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.scoreDiamondIcon} style={[{width: 10, height: 10}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                  {item.profile_score >= 10.0 &&
                    <LinearGradient colors={['#FE0456', '#9E41E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                      <Image source={ICON.score10Icon} style={[{width: 10, height: 10}]} />
                      <Text style={_styles.yellowText}>{item.profile_score}</Text>
                    </LinearGradient>
                  }

                </View>

                <Text style={_styles.renderItemBottomTextName}>{item.nickname}, {item.age}</Text>

                {/* {isEmptyData(item.job_name) && isEmptyData(item.height) && 
                  <Text style={_styles.renderItemBottomTextSpec}>
                    {item.job_name} {isEmptyData(item.height) && item.height + 'cm'}
                  </Text>
                } */}
              </View>

              {type == 'REQ' && profile_open_yn == 'N' && (
                <>
                  <View style={_styles.reqRenderThumb}></View>
                  <View style={_styles.reqRenderItem}>
                    <Image source={IMAGE.logoMark} style={{width: 70, height: 70, marginTop: 20, opacity: 0.6}} resizeMode="contain" />
                    <Text style={_styles.reqRenderItemText}>터치하고 열어보기</Text>
                  </View>
                </>
              )}
            </ImageBackground>

          </TouchableOpacity>
        }
      </>
    );
  }
};



{/* ######################################################################################################
################################################ Style 영역 ##############################################
###################################################################################################### */}

const _styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    width: `100%`,
    //height: 50,
    //flexDirection: `row`,
    //alignItems: `center`,
    //justifyContent: 'space-between',
    //paddingHorizontal: 24,
  },
  dotContainer: {
    //width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
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
    justifyContent: 'flex-end'
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
    paddingHorizontal: 21,
  },

  renderItemContainer: {
    width: (width - 54) / 2,
    height: (width - 54) / 2,
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    overflow: 'hidden',
  },
  renderItemTopContainer: {
    position: 'absolute',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    left: 5,
    top: 3,
    zIndex: 1,
  },
  renderItemTopIcon: {
    width: 25,
    height: 25,
    marginRight: 1,
    marginTop: 5,
    borderRadius: 10,
  },
  renderItemTopZzimIcon: {
    width: 20,
    height: 20,
    marginRight: 3,
    marginTop: 5,
  },
  renderItemTopText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 0,
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginTop: 2,
  },
  renderItemBottomTextSpec: {
    opacity: 0.86,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  tabItem: {
    flexDirection: `row`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: '#ECECEC',
  },
  tabItemText: {
    flexDirection: `row`,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'AppleSDGothicNeoEB00',
    color: ColorType.white,
    letterSpacing: 0,
    textAlign: 'left',
  },
  noData: {
    paddingHorizontal: 20,
    height: height - 300,
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
    color: '#787878',
    fontSize: 14,
    fontFamily: 'AppleSDGothicNeoB00',
    marginTop: 10,
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 8,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  yellowText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 8,
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
    marginRight: 0,
    marginTop: -3
  },
  scoreBadge: {
    width: 36,
    height: 14,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`,
    paddingHorizontal: 3,
  },
  authBadge: {
    width: 40,
    height: 14,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginRight: 5,
  },
});