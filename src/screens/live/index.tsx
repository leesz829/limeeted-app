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
import { styles, layoutStyle, commonStyle } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonText } from 'component/CommonText';
import { RadioCheckBox } from 'component/RadioCheckBox';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { LivePopup } from 'screens/commonpopup/LivePopup';
import { LiveSearch } from 'screens/live/LiveSearch';
import * as hooksMember from 'hooks/member';
import { get_live_members, regist_profile_evaluation, get_common_code } from 'api/models';
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

  const jwtToken = hooksMember.getJwtToken(); // 토큰
  const { show } = usePopup();  // 공통 팝업

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

  // 팝업 이벤트 제어 변수
  const [clickEventFlag, setClickEventFlag] = useState(false);

  // 이상형 타입 코드
  const [clickFaceTypeCode, setClickFaceTypeCode] = useState('');

  // 이상형 타입
  const [clickFaceType, setClickFaceType] = useState('');

  // 선택한 인상 점수
  let clickFaceScore = '';

  // 팝업 화면 콜백 함수
  const callBackFunction = (flag: boolean, faceType: string, score: string) => {
    setClickEventFlag(flag);

    let tmpClickFaceType = faceType ? faceType : clickFaceType;
    setClickFaceTypeCode(tmpClickFaceType);

    for (let idx in faceTypeList) {
      if (faceTypeList[idx].value == tmpClickFaceType) {
        setClickFaceType(faceTypeList[idx].label);
        break;
      }
    }

    if (score) {
      clickFaceScore = score;
      setFaceTypeList([LabelObj]);
      insertProfileAssessment();
    }
  };

  // ######################################################### 프로필 평가 등록
  const insertProfileAssessment = async () => {
    const body = {
      profile_score: clickFaceScore,
      face_code: clickFaceTypeCode,
      member_seq: data.live_member_info.member_seq,
      approval_profile_seq : data.live_member_info.approval_profile_seq
    };
    try {
      const { success, data } = await regist_profile_evaluation(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            dispatch(myProfile());
            setIsLoad(false);
            getLiveMatchTrgt();
            break;
          default:
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() {}
            });
            break;
        }
       
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }

  };

  // ######################################################### LIVE 평가 회원 조회
  const getLiveMatchTrgt = async () => {
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

              console.log('data.distance_val ::::: ' , data.distance_val);
              setIsLoad(true);
            };

            break;
          case NODATA:
            setIsLoad(false);
            setIsEmpty(true);
            break;
          default:
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() {
                
              }
            });
            break;
        }
       
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {
            
          }
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPage(0);
    }

  };

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setPage(index);
  };

  useFocusEffect(
    React.useCallback(() => {
      getLiveMatchTrgt();

      return () => {
        setIsLoad(false);
        setIsEmpty(false);
      };
    }, []),
  )

  return isLoad ? (
    <>
      <TopNavigation currentPath={'LIVE'} />

      <View style={_styles.root}>
        <ScrollView style={_styles.root}>

          <View>
            <View style={_styles.indocatorContainer}>
              {data?.live_profile_img.map((e, index) => (
                <View
                  style={[
                    _styles.indicator,
                    { backgroundColor: index === page ? 'white' : 'rgba(255,255,255,0.3)' },
                  ]}
                />
              ))}

              <View style={_styles.badgeIcon}>
                <Text style={_styles.authBadgeText}>심사중</Text>
              </View>
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

            <View style={_styles.absoluteView}>
              <View style={_styles.badgeContainer}>
                {/* {data.second_auth_list.length > 0 && 
                  <View style={styles.authBadge}>
                    <Text style={styles.whiteText}>인증 완료</Text>
                  </View>
                } */}
              </View>

              <View style={_styles.nameContainer}>
                <Text style={_styles.nameText}>{data.live_member_info.nickname}, {data.live_member_info.age}</Text>
              </View>

              <View style={_styles.distanceContainer}>
                {data.distance != null && data.distance != '' && data.distance != '0.0' &&
                  <View style={_styles.distanceContainer}>
                    <Image source={ICON.marker} style={_styles.markerIcon} />
                    <Text style={_styles.regionText}>{data.distance}Km</Text>
                  </View>
                }
              </View>
            </View>
          </View>

          <View style={_styles.infoContainer}>
            <Text style={_styles.infoTitle}>인상을 선택해주세요.</Text>
            <View style={_styles.tagContainer}>
              {[
                faceTypeList.map((e) => {
                  if(e.value != '') {
                    return (
                      <TouchableOpacity onPress={() => { callBackFunction(true, e.value, ''); }}>
                        <View style={_styles.tagBox}>
                          <Text style={_styles.tagText}>{e.label}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }
                }),
              ]}
            </View>
          </View>
        </ScrollView>
      </View>

      {clickEventFlag && (
        <LivePopup
          callBackFunction={callBackFunction}
          faceType={clickFaceType}
        />
      )}
    </>
  ) : (
    <>
      <TopNavigation currentPath={'LIVE'} />
      {isEmpty ? (
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
            <Image source={IMAGE.logoMark} style={styles.iconSize48} />
          </SpaceView>

          <View style={layoutStyle.alignCenter}>
            <CommonText type={'h4'} textStyle={[layoutStyle.textCenter, commonStyle.fontSize16, commonStyle.lineHeight23]}>
              오늘 소개해드릴 LIVE가 마감되었어요.
            </CommonText>
          </View>
        </View>
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
            <Image source={GIF_IMG.faceScan} style={styles.iconSize48} />
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
    return (
      <>
        <View>
            <Image
              source={{uri: url}}
              style={{
                width: width,
                height: height * 0.7,
              }}
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#b7b7b9',
    marginLeft: 7,
    marginTop: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  tagText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b1b1b1',
  },
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
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986EE',
  },

});