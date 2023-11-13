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


/* ################################################################################################################
###### LIVE
################################################################################################################ */

const { width, height } = Dimensions.get('window');

export const Live = () => {
  const isFocus = useIsFocused();

  // 본인 데이터
  const memberBase = useUserInfo();

  // 이미지 인덱스
  const [page, setPage] = useState(0);

  // Live 팝업 Modal
  const [liveModalVisible, setLiveModalVisible] = useState(false);

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // 라이브 관련 데이터
  const [data, setData] = useState<any>({
    live_member_info: LiveMemberInfo,
    live_profile_img: [LiveProfileImg],
    distance: '',
  });

  // ####################################################################################### 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width - 80));
    setPage(index);
  };

  // ####################################################################################### LIVE 평가 회원 조회
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

  useFocusEffect(
    React.useCallback(() => {
      getLiveMatchTrgt();

      return () => {
        setIsLoad(false);
        setIsEmpty(false);
      };
    }, []),
  );

  React.useEffect(() => {
    if(isFocus) {

    };
  }, [isFocus]);


  return (
    <>
      <TopNavigation currentPath={'LIVE'} />

        <SpaceView pb={50} viewStyle={{backgroundColor: '#3D4348'}}> 
        {isLoad ? (
          <SpaceView mb={40}>
            {/* 라이브 회원 이미지 */}
            <FlatList
              contentContainerStyle={{ overflow: 'visible', paddingHorizontal: 20 }} // overflow를 visible로 설정
              data={data?.live_profile_img}
              horizontal={true}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={width * 0.85 + 25}
              keyExtractor={(item, index) => index.toString()}
              renderItem={RenderItem}
              onScroll={handleScroll}
            />

            {/* 최하단 스킵, 인상 선택 버튼 */}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 18}}>
              <TouchableOpacity style={[_styles.bottomBtn,{width: width * 0.36, marginRight: 10}]}>
                <Text style={[_styles.bottomTxt, {color: '#656565'}]}>스킵</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[_styles.bottomBtn,{width: width * 0.47, backgroundColor: '#FCBB15'}]}
                onPress={() => { 
                  setLiveModalVisible(true);
                }}
                >
                <Text style={[_styles.bottomTxt, {color: '#FFF'}]}>인상 선택하기</Text>
              </TouchableOpacity>
            </View>

            {/* 인상 선택 모달 */}
            <Modal isVisible={liveModalVisible} style={{backgroundColor: 'rgba(9, 32, 50, 0.5)', margin: 0}}>
              <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 120}}>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#눈이 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <Text style={_styles.faceModalText}>#웃는게 이뻐요.</Text>
                <TouchableOpacity
                  style={{marginTop: 130}}
                  onPress={() => {
                    setLiveModalVisible(false);
                  }}
                >
                  <Image source={ICON.circleX} style={styles.iconSize40} />
                </TouchableOpacity>
              </View>
            </Modal>
          </SpaceView>
        ) : (
          <>
            <SpaceView viewStyle={{width: width, height: height}}>
              <View style={{height:height / 2, alignItems: 'center', justifyContent:'center', flexDirection: 'row'}}>
                <Text style={{fontSize: 25, fontFamily: 'Pretendard-Regular', color: '#646467'}}><Text style={{fontSize: 30, color: '#BAFAFC', fontFamily:'Pretendard-Bold'}}>{memberBase?.nickname}님</Text>을 위한{'\n'}새로운 이성을 찾는 중입니다.</Text>
                <Image source={ICON.digitalClock} style={[styles.iconSize40, {marginTop: 25, marginLeft: 5}]} />
              </View>
            </SpaceView>
          </>
        )}

        </SpaceView>
    </>
  );

  /* 이미지 렌더링 */
  function RenderItem({ item }) {

    return (
      <>
        <View style={_styles.imgItemWrap}>
          <View style={_styles.mmbrStatusView}>
            <Text style={{color: '#A29552', fontSize: 12, fontFamily: 'Pretendard-Bold'}}>NEW</Text>
          </View>
          <SpaceView viewStyle={{borderRadius: 20, overflow: 'hidden'}}>
            <Image
              source={{uri: item?.url?.uri}}
              style={{
                width: width * 0.85,
                height: height * 0.67, 
              }}
              resizeMode={'cover'}
            />
            
            <SpaceView viewStyle={_styles.infoArea}>
              <SpaceView viewStyle={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={_styles.distanceText}>12.9Km</Text>
                <View>
                  <View style={_styles.indocatorContainer}>
                    {data?.live_profile_img.map((e, index) => (
                      <View style={[ _styles.indicator, { backgroundColor: index === page ? '#A6ABEE' : '#34447A' }, ]} key={index} />
                    ))}
                  </View>
                </View>
                <Text style={_styles.nicknameText}>{data.live_member_info.nickname}, {data.live_member_info.age}</Text>
                <Text style={_styles.introText}>리미티드의 여신</Text>
              </SpaceView>
            </SpaceView>

            <LinearGradient
              colors={['transparent', '#000000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={_styles.thumnailDimArea} />
            <Watermark value={memberBase?.phone_number}/>
          </SpaceView>
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
  imgItemWrap: {
    marginHorizontal: 5,
  },
  infoArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 25,
  },
  distanceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#FFF',
    marginBottom: 5,
  },
  nicknameText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 25,
    color: '#FFF',
    marginBottom: 3,
  },
  introText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#FFF',
  },
  indocatorContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
  },
  indicator: {
    width: 22,
    height: 2,
  },
  thumnailDimArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    height: height * 0.24,
  },
  faceModalText: {
    color: '#FFF',
    marginBottom: 20,
    fontSize: 22,
    fontFamily: 'Pretendard-Bold',
  },
  mmbrStatusView: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical:3,
    borderRadius: 10,
  },
  bottomBtn: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  bottomTxt: {
    textAlign: 'center',
    fontFamily: 'pretendard-Bold',
  },
});
