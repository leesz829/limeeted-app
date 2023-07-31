import { useIsFocused, useNavigation, useFocusEffect  } from '@react-navigation/native';
import {
  CommonCode,
  FileInfo,
  LabelObj,
  ProfileImg,
  LiveMemberInfo,
  LiveProfileImg,
  ScreenNavigationProp,
} from '@types';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonText } from 'component/CommonText';
import { RadioCheckBox } from 'component/RadioCheckBox';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { LivePopup } from 'screens/commonpopup/LivePopup';
import { LiveSearch } from 'screens/live/LiveSearch';
import { get_live_members, regist_profile_evaluation, get_common_code, update_additional } from 'api/models';
import { useMemberseq } from 'hooks/useMemberseq';
import { findSourcePath, IMAGE, GIF_IMG } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA } from 'constants/reusltcode';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import { useUserInfo } from 'hooks/useUserInfo';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
//import { Easing } from 'react-native-reanimated';
import RatingStar from 'component/RatingStar';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { ColorType } from '@types';
import { isEmptyData } from 'utils/functions';
import { BannerAd, BannerAdSize, useInterstitialAd, TestIds, RewardedAd } from '@react-native-admob/admob';


/* ################################################################################################################
###### LIVE
################################################################################################################ */

const { width, height } = Dimensions.get('window');

export const Live = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const member_seq = useMemberseq();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  // 본인 데이터
  const memberBase = useUserInfo();

  // 이미지 인덱스
  const [page, setPage] = useState(0);

  // 공통 팝업
  const { show } = usePopup();

  // Live 팝업 Modal
  const [liveModalVisible, setLiveModalVisible] = useState(false);

  const [isBlackBg, setIsBlackBg] = useState(false);

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // 라이브 관련 데이터
  const [data, setData] = useState<any>({
    live_member_info: LiveMemberInfo,
    live_profile_img: [LiveProfileImg],
    distance: '',
  });

  // 회원 인상 정보
  const [faceTypeList, setFaceTypeList] = useState([LabelObj]);

  // 이상형 타입 코드
  const [clickFaceTypeCode, setClickFaceTypeCode] = useState('');

  // 이상형 타입
  const [clickFaceType, setClickFaceType] = useState('');

  // 선택한 인상 점수
  const [selectedScore, setSelectedScore] = useState(0);

  // 임시 함수
  const callBackFunctionTemp = (score: number) => {

  };

  // 평가 확인 클릭 여부 함수
  const [isClickable, setIsClickable] = useState(true);


  // ####################################################################################### 평점 선택 콜백 함수
  const scoreSelectedCallBackFunc = async (score: number) => {
    // 2.5 보다 아래 체크
    if(score == 0) {
      show({ content: '프로필 평점을 다시 선택해 주세요!' , });
    } else if(score < 3.0) {
      insertProfileAssessment(score);
    } else {
      setSelectedScore(score);
      setPageIndex(2);
    }
  };

  // ####################################################################################### 인상 선택 함수
  const selectedFaceType = (code:string) => {
    let tmpClickFaceType = code ? code : clickFaceType;
    setClickFaceTypeCode(tmpClickFaceType);

    for (let idx in faceTypeList) {
      if (faceTypeList[idx].value == tmpClickFaceType) {
        setClickFaceType(faceTypeList[idx].label);
        break;
      }
    }

    setLiveModalVisible(true);
  };

  // ####################################################################################### 프로필 평가 등록
  const insertProfileAssessment = async (score:number) => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);

      const body = {
        profile_score: score,
        face_code: clickFaceTypeCode,
        member_seq: data.live_member_info?.member_seq,
        approval_profile_seq : data.live_member_info?.approval_profile_seq
      };

      try {
        const { success, data } = await regist_profile_evaluation(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              dispatch(myProfile());
              setIsLoad(false);
              setLiveModalVisible(false);
              getLiveMatchTrgt();

              break;
            default:
              show({ content: '오류입니다. 관리자에게 문의해주세요.' , });
              setIsClickable(true);
              break;
          }
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          setIsClickable(true);
        }
      } catch (error) {
        console.log(error);
        setIsClickable(true);
      } finally {
        
      }

    };
  };

  // ####################################################################################### LIVE 평가 회원 조회
  const getLiveMatchTrgt = async () => {
    setIsClickable(true);
    setPageIndex(1);
    setClickFaceTypeCode('');
    setSelectedScore(0);
    setIsBlackBg(false);

    try {
      const { success, data } = await get_live_members();
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            let tmpMemberInfo = LiveMemberInfo;
            let tmpProfileImgList = [LiveProfileImg];
            let tmpFaceTypeList = [LabelObj];
            let commonCodeList = [CommonCode];
    
            tmpMemberInfo = data.live_member_info;
            
            if(tmpMemberInfo != null && tmpMemberInfo.member_seq != null) {
              
              // LIVE 회원 프로필 사진
              data.live_profile_img_list.map((item) => {
                tmpProfileImgList.push({
                  url: findSourcePath(item.img_file_path)
                  , member_img_seq: item.member_img_seq
                  , order_seq: item.order_seq
                });
              });
    
              // 인상 유형 목록
              commonCodeList = data.face_type_list;
    
              // CommonCode
              commonCodeList.map((commonCode) => {
                tmpFaceTypeList.push({
                  label: commonCode.code_name,
                  value: commonCode.common_code,
                });
              });

              tmpProfileImgList = tmpProfileImgList.filter((x) => x.url);

              setFaceTypeList(tmpFaceTypeList);
              setData({
                live_member_info: tmpMemberInfo,
                live_profile_img: tmpProfileImgList,
                distance: data?.distance_val,
              });

              setIsLoad(true);              
            };

            break;
          case NODATA:
            setIsLoad(false);
            setIsEmpty(true);
            break;
          default:
            show({ content: '오류입니다. 관리자에게 문의해주세요.' , });
            break;
        }
       
      } else {
        show({ content: '오류입니다. 관리자에게 문의해주세요.' , });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPage(0);
    }

  };

  // ####################################################################################### 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setPage(index);
  };

  // ####################################################################################### 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_live_yn: 'N'
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












  /* ###################################################################################################################################
  ######################################################################################################################################
  ######### UI 변경 및 애니메이션 관련
  ######################################################################################################################################
  ################################################################################################################################### */

  // 페이지 변수
  const [pageIndex, setPageIndex] = useState(1);

  // 애니메이션 변수
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const transYAnimation = useRef(new Animated.Value(-50)).current;
  const transXAnimation = useRef(new Animated.Value(-50)).current;
  const rotateAnimation = useRef(new Animated.Value(360)).current;
  const scaleAnimation = useRef(new Animated.Value(1.5)).current;

  let animateStyle = {
    opacity: fadeAnimation,
    transform: [{translateY: transYAnimation,  translateX: transXAnimation}],
  };

  // ######################### 액션0
  const action00 = (isActive:boolean) => {
    if(isActive) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(transXAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(transYAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
      transXAnimation.setValue(-50);
      transYAnimation.setValue(-50);
    }
  };

  // ######################### 액션1
  const action01 = (isActive:boolean) => {
    if(isActive) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(transXAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
      transXAnimation.setValue(-50);
    }
  };

  // ######################### 액션2
  const action02 = (isActive:boolean) => {
    if(isActive) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(transYAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
      transYAnimation.setValue(-50);
    }
  }

  // ######################### 액션3
  const action03 = (isActive:boolean) => {
    if(isActive) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(transYAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
      transYAnimation.setValue(-50);
      rotateAnimation.setValue(360);
    }
  }

  // ######################### 액션4
  const action04 = (isActive:boolean) => {
    if(isActive) {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnimation.setValue(0);
      scaleAnimation.setValue(1.5);
    }
  }



  const prevBtn = async () => {
    setPageIndex(pageIndex-1);
  }

  const nextBtn = async () => {
    setPageIndex(pageIndex+1);
  }




  // ##################################################################################################################################

  // ######################################################################################## 초기 실행 함수
  useFocusEffect(
    React.useCallback(() => {
      getLiveMatchTrgt();

      return () => {
        setIsLoad(false);
        setIsEmpty(false);
      };
    }, []),
  );

  useEffect(() => {
    if(pageIndex != 2) {
      //action00(false);
      //action01(false);
      //action02(false);
      //action03(false);
      action04(false);
    } else {
      //action00(true);
      //action01(true);
      //action02(true);
      //action03(true);
      
      setIsBlackBg(true);
      setTimeout(() => {
        action04(true);
      }, 100);
    }

  }, [pageIndex]);

  React.useEffect(() => {
    if(isFocus) {
      //traslateXActiveReset();

      // 튜토리얼 팝업 노출
      if(!isEmptyData(memberBase?.tutorial_live_yn) || memberBase?.tutorial_live_yn == 'Y') {
        show({
          type: 'GUIDE',
          guideType: 'LIVE',
          guideSlideYn: 'Y',
          guideNexBtnExpoYn: 'Y',
          confirmCallback: function(isNextChk) {
            if(isNextChk) {
              saveMemberTutorialInfo();
            }
          }
        });
      };
    };
  }, [isFocus]);

  return isLoad ? (
    <>
      <TopNavigation currentPath={'LIVE'} />

      <View style={_styles.root}>
        <View style={_styles.titArea}>
          {pageIndex == 1 && <Text style={_styles.titText}><Text style={{color: '#97A1EF'}}>{data.live_member_info.nickname}</Text>님의{'\n'}프로필 평점을 선택해 주세요.</Text>}
          {pageIndex == 2 && <Text style={_styles.titText}><Text style={{color: '#97A1EF'}}>{data.live_member_info.nickname}</Text>님의{'\n'}인상을 선택해 주세요.</Text>}
        </View>

        <View style={{borderRadius: 31, overflow: 'hidden', position: 'absolute', bottom: 0}}>
          <View style={_styles.indocatorContainer}>
            {data?.live_profile_img.map((e, index) => (
              <View style={[ _styles.indicator, { backgroundColor: index === page ? 'white' : 'rgba(255,255,255,0.3)' }, ]} key={index} />
            ))}

            {data.live_member_info.member_status == 'APPROVAL' &&
              <View style={_styles.badgeIcon}>
                <Text style={_styles.authBadgeText}>심사중</Text>
              </View>
            }
          </View>

          <FlatList
            data={data?.live_profile_img}
            renderItem={RenderItem}
            horizontal={true}
            alwaysBounceVertical={false}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
          />

          {/* ############################################################# 페이지 1 */}
          {pageIndex == 1 &&
            <>
              <View style={_styles.absoluteView()}>
                <View style={_styles.nameContainer}>
                  <Text style={_styles.nameText}>{data.live_member_info.nickname}, {data.live_member_info.age}</Text>
                </View>

                <SpaceView>
                  <LinearGradient
                    colors={['rgba(199,123,222,0.5)', 'rgba(255,245,253,0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 2 }}
                    style={_styles.ratingArea}>

                    <RatingStar callBackFunction={scoreSelectedCallBackFunc} isFixed={false} score={0} />
                  </LinearGradient>

                  {!isClickable && (
                    <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1}} />
                  )}

                  {/* <View style={_styles.ratingArea}>
                    <RatingStar callBackFunction={callBackFunctionNew} />
                    <View style={{backgroundColor: '#D3A7FF', opacity: 0.4, width: '100%', height: 100, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
                  </View> */}

                </SpaceView>
              </View>
            </>
          }

          {/* ############################################################# 페이지 2 */}

          {pageIndex == 2 &&
            <>
              {isBlackBg &&
                <LinearGradient
                  colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={_styles.blackBg} />
              }

              <View style={_styles.absoluteView()}>
                <Animated.View style={{
                  opacity: fadeAnimation,
                  /* transform: [{translateY: transYAnimation, translateX: transXAnimation, rotate: rotateAnimation}] */
                  /* transform: [{translateY: transYAnimation, rotate: rotateAnimation}] */
                  transform: [{scale: scaleAnimation}]
                }}>
                {/* <Animated.View style={animateStyle}> */}

                  <View style={_styles.tagContainer}>
                    {[
                      faceTypeList.map((e, index) => {
                        if(e.value != '') {
                          return (
                            <TouchableOpacity key={index} onPress={() => { selectedFaceType(e.value); /* callBackFunction(true, e.value, ''); */ }}>
                              <View style={_styles.tagBox}>
                                <Text style={_styles.tagText}>{e.label}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      }),
                    ]}
                  </View>

                  {/* 뒤로가기 */}
                  <SpaceView mt={15} viewStyle={{width: '100%', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => { prevBtn(); }} style={{width: '100%'}}>
                      <Text style={_styles.backBtnText}>뒤로가기</Text>
                    </TouchableOpacity>
                  </SpaceView>
                </Animated.View>

              </View>
            </>
          }

        </View>
      </View>

      {/* ################################################################################# LIVE 팝업 */}
      <Modal isVisible={liveModalVisible} animationOut={'slideOutDown'} animationOutTiming={500}>
        <View style={{backgroundColor: '#fff', borderRadius: 20,}}>
          <SpaceView viewStyle={[modalStyle.modalBody]}>
            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
              <Text style={_styles.liveModalTitle}>인상 투표</Text>
            </SpaceView>

            <SpaceView mt={15} viewStyle={{alignItems: 'center', justifyContent: 'center'}}>
              <SpaceView>
                <Image source={{uri: data?.live_profile_img[0].url.uri}} style={{ width: 82, height: 82, borderRadius: 80 }} resizeMode={'cover'} />
              </SpaceView>

              <SpaceView mt={10}>
                <Text style={_styles.liveModalFaceText}>#{clickFaceType}</Text>
              </SpaceView>

              <SpaceView mt={10} viewStyle={_styles.liveModalRatingArea}>
                <RatingStar callBackFunction={callBackFunctionTemp} isFixed={true} score={selectedScore} starSize={30} />
              </SpaceView>
            </SpaceView>
          </SpaceView>

          <View style={{width: width - 39, flexDirection: 'row', justifyContent: 'space-between',}}>
            <SpaceView viewStyle={{flexDirection: 'row', width: '100%', paddingHorizontal: 10, paddingBottom: 8}}>
              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: '#D6D3D3', borderBottomLeftRadius: 15, borderTopLeftRadius: 15}]}
                onPress={() => { 
                  setLiveModalVisible(false); 
                  setPageIndex(1);
                  setSelectedScore(0);
                  setClickFaceTypeCode('');

                  setTimeout(() => {
                    setIsBlackBg(false);
                  }, 350);
                }}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>취소하기</CommonText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: '#697AE6', borderBottomRightRadius: 15, borderTopRightRadius: 15}]}
                onPress={() => { insertProfileAssessment(selectedScore); }}
                disabled={!isClickable}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>확인하기</CommonText>
              </TouchableOpacity>
            </SpaceView>
          </View>
        </View>
      </Modal>

    </>
  ) : (
    <>
      <TopNavigation currentPath={'LIVE'} />
      {isEmpty ? (
        <>
          <View
            style={[
              layoutStyle.alignCenter,
              layoutStyle.justifyCenter,
              layoutStyle.flex1,
              styles.whiteBack,
              {paddingBottom : 70}
            ]}
          >
            {/* <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
              <Image source={IMAGE.logoIcon} style={styles.iconSize48} />
            </SpaceView> */}

            <View style={layoutStyle.alignCenter}>
              <CommonText type={'h4'} textStyle={[layoutStyle.textCenter, commonStyle.fontSize16, commonStyle.lineHeight23]}>
                오늘 소개해드린 <Text style={{color: '#7986EE'}}>LIVE</Text>가 마감 되었어요.{'\n'}
                새로운 <Text style={{color: '#7986EE'}}>LIVE</Text> 소개는 매일 자정에 공개 됩니다.
              </CommonText>

              <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={IMAGE.logoIcon03} style={{width: 230, height: 230}} />
              </View>

              <View style={{position: 'absolute', top: -50, left: 30}}><Image source={IMAGE.heartImg01} style={{width: 40, height: 40}} /></View>
              {/* <View style={{position: 'absolute', top: 80, left: -15}}><Image source={IMAGE.heartImg02} style={{width: 60, height: 60}} /></View>
              <View style={{position: 'absolute', top: -100, right: -15}}><Image source={IMAGE.heartImg02} style={{width: 60, height: 60}} /></View> */}
              <View style={{position: 'absolute', top: 55, right: 30}}><Image source={IMAGE.heartImg01} style={{width: 40, height: 40}} /></View>

            </View>
          </View>

          {Platform.OS == 'android' &&
            <SpaceView viewStyle={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', alignItems:'center', justifyContent:'center'}}>
              <SpaceView viewStyle={{alignItems:'center', justifyContent:'center'}}>
                <BannerAd size={BannerAdSize.BANNER} unitId={'ca-app-pub-7259908680706846~5492241778'} />
              </SpaceView>
            </SpaceView>
          }

        </>
      ) : (
        <View
          style={[
            layoutStyle.alignCenter,
            layoutStyle.justifyCenter,
            layoutStyle.flex1,
            styles.whiteBack,
            {paddingBottom : 90}
          ]}
        >
          <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
            {/* <Image source={GIF_IMG.faceScan} style={styles.iconSize48} /> */}
            <Image source={GIF_IMG.loadingNewIcon} style={styles.iconSquareSize(48)} />
          </SpaceView>

          <View style={layoutStyle.alignCenter}>
            <CommonText type={'h4'}>다음 회원을 찾고 있어요.</CommonText>
          </View>
        </View>
      )}
    </>
  );

  
  /**
     * 이미지 렌더링
     */
  function RenderItem({ item }) {
    const url = item?.url?.uri;
    let imgHeight = height / 1.5;

    if(height > 700 && height < 800) {
      //imgHeight = height / 1.35;
      imgHeight = height / 1.4;
    };

    return (
      <>
        <View>
          <LinearGradient
            colors={['transparent', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={_styles.thumnailArea} />

          <Image
            source={{uri: url}}
            style={{
              width: width,
              height: imgHeight,
              //height: width * 1.44,
              //height: '100%',
              /* alignSelf:'center',
              alignItems: 'center', */
            }}
            resizeMode={'cover'}
          />

          <Watermark value={memberBase?.phone_number}/>
        </View>
      </>
    );
  }
};





{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    width: width,
    height: height,
  },
  indocatorContainer: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    position: 'absolute',
    zIndex: 10,
    top: 20,
  },
  indicator: {
    width: 18,
    height: 2,
    marginHorizontal: 2,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    position: 'absolute',
    top: -6,
    right: 8,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#7986EE',
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  image: {
    width: width,
    height: width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageBottonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
  authContainer: {
    width: 48,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    paddingVertical: 3,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  authText: {
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  nickname: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
    color: '#ffffff',
  },
  authIcon: {
    width: 15,
    height: 15,
    marginLeft: 3,
  },
  locationContainer: {
    marginTop: 7,
    flexDirection: `row`,
    alignItems: `center`,
  },
  markerIcon: {
    width: 13,
    height: 17.3,
  },
  locationText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 6,
  },
  infoContainer: {
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  infoTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 7,
  },
  tagContainer: {
    flexWrap: 'wrap',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  tagBox: {
    borderRadius: 5,
    backgroundColor: 'rgba(211, 167, 255, 0.75)',
    marginLeft: 7,
    marginTop: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    overflow: 'hidden',
  },
  tagText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    textAlign: 'left',
    color: '#ffffff',
  },
  absoluteView: () => {
    let bottomNumber = height * 0.05;

    if(height > 800) {
      bottomNumber = height * 0.07;
    } else if(height <= 800 && height > 700) {
      bottomNumber = height * 0.05;
    } else if(height <= 700) {
      bottomNumber = height * 0.05;
    }

    return {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: height * 0.03,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingHorizontal: '6%',
      zIndex: 1,
    };
  },
  badgeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  regionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
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
  authBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  authBadgeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986EE',
  },
  ratingArea: {
    marginTop: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    overflow: 'hidden',
  },
  blackBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  titArea: {
    //paddingVertical: 10,
    paddingHorizontal: 15,
    //height: width * 0.20,
    height: 80,
    justifyContent: 'center',
  },
  titText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#646467',
  },
  liveModalTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#333333',
  },
  liveModalFaceText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#697AE6',
  },
  liveModalRatingArea: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#707070',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 1.84,
    elevation: 4,
    overflow: 'visible',
  },
  thumnailArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    height: height * 0.24,
    zIndex: 1,
  },
  backBtnText: {
    backgroundColor: 'rgba(150, 146, 161, 0.65)',
    borderRadius: Platform.OS == 'android' ? 20 : 13,
    paddingVertical: 3,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'AppleSDGothicNeoR00',
    overflow: 'hidden',
  },
  
});