import { useIsFocused, useNavigation, useFocusEffect  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, ScreenNavigationProp } from '@types';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { get_live_members, regist_profile_evaluation, get_common_code, update_additional } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA } from 'constants/reusltcode';
import { useDispatch } from 'react-redux';
import Image from 'react-native-fast-image';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import { ColorType } from '@types';
import { isEmptyData } from 'utils/functions';
import { STACK } from 'constants/routes';


/* ################################################################################################################
###### Story
################################################################################################################ */

const { width, height } = Dimensions.get('window');

export const Story = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
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


  const [itemList, setItemList] = useState([
    {
      idx: 1,
      type: 'ONLY_LARGE',
      lDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.manTmp3,
      }],
      mDataList: [],
      sDataList: [],
    },
    {
      idx: 2,
      type: 'COMPLEX_MEDIUM',
      lDataList: [],
      mDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.manTmp2,
      }],
      sDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.manTmp1,
      },
      {
        dummyYn: 'Y',
        imgUrl: PROFILE_IMAGE.manTmp2,
      }],
    },
    {
      idx: 3,
      type: 'ONLY_SMALL',
      lDataList: [],
      mDataList: [],
      sDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.womanTmp2,
      },
      {
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.womanTmp3,
      },
      {
        dummyYn: 'Y',
        imgUrl: PROFILE_IMAGE.manTmp2,
      }],
    },
    {
      idx: 2,
      type: 'COMPLEX_SMALL',
      lDataList: [],
      mDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.womanTmp1,
      }],
      sDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.manTmp5,
      },
      {
        dummyYn: 'Y',
        imgUrl: PROFILE_IMAGE.manTmp2,
      }],
    },
    {
      idx: 4,
      type: 'ONLY_LARGE',
      lDataList: [{
        dummyYn: 'N',
        imgUrl: PROFILE_IMAGE.womanTmp5,
      }],
      mDataList: [],
      sDataList: [],
    },
  ]);





  // 스토리 등록 이동
  const goStoryRegister = async () => {
    navigation.navigate(STACK.COMMON, { screen: 'StoryRegi', });
  };

  // 스토리 알림 이동
  const goStoryActive = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryActive',
    });
  };

  // 스토리 상세 이동
  const goStoryDetail = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryDetail',
      params: {
        storyBoardSeq: 7,
      }
    });
  };





  /* ##################################################################################################################################
  ################## 아이템 렌더링 관련 함수
  ################################################################################################################################## */

  // 대 렌더링
  const LargeRenderItem = React.memo(({ item }) => {
    const imgUrl = item?.imgUrl;

    return (
      <>
        <SpaceView viewStyle={_styles.itemArea}>
          <Image source={imgUrl} style={{width: width - 40, height: width - 40}} resizeMode={'cover'} />
        </SpaceView>
      </>
    );
  });

  // 중 렌더링
  const MediumRenderItem = React.memo(({ item }) => {
    const imgUrl = item?.imgUrl;

    return (
      <>
        <SpaceView viewStyle={_styles.itemArea}>
          <Image source={imgUrl} style={{width: (width - 43) / 1.5, height: (width - 43) / 1.5}} resizeMode={'cover'} />
        </SpaceView>
      </>
    );
  });

  // 소 렌더링
  const SmallRenderItem = React.memo(({ item }) => {
    const imgUrl = item?.imgUrl;
    const dummyYn = item?.dummyYn;

    return (
      <>
        {dummyYn == 'Y' ? (
          <SpaceView viewStyle={_styles.dummyArea}>
            <Text style={_styles.dummyText}>배너</Text>
          </SpaceView>
        ) : (
          <SpaceView viewStyle={_styles.itemArea}>
            <Image source={imgUrl} style={{width: (width - 55) / 3, height: (width - 55) / 3}} resizeMode={'cover'} />
          </SpaceView>
        )}
      </>
    );
  });

  /* ##################################################################################################################################
  ################## 초기 실행 함수
  ################################################################################################################################## */
  React.useEffect(() => {
    if(isFocus) {
      
    };
  }, [isFocus]);

  return (
    <>
      <TopNavigation currentPath={'Story'} />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#fff'}}>

          <FlatList
            contentContainerStyle={{marginBottom: 50, paddingHorizontal: 20}}
            //ref={noticeRef}
            data={itemList}
            renderItem={({ item:innerItem, index:innerIndex }) => {
              //console.log('innerItem :::: ' , innerItem.dataList.length);

              return (
                <>
                  <TouchableOpacity onPress={() => { goStoryDetail(); }}>
                    <SpaceView key={innerIndex} viewStyle={{flexDirection: 'column'}} mb={10}>

                      {innerItem.type == 'ONLY_LARGE' ? (
                        <>
                          {innerItem.lDataList.map((item, index) => {
                            return (
                              <LargeRenderItem item={item} />
                            )
                          })}
                        </>
                      ) : innerItem.type == 'ONLY_SMALL' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {innerItem.sDataList.map((item, index) => {
                              return (
                                <SmallRenderItem item={item} />
                              )
                            })}
                          </SpaceView>
                        </>
                      ) : innerItem.type == 'COMPLEX_MEDIUM' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {innerItem.mDataList.map((item, index) => {
                              return (
                                <MediumRenderItem item={item} />
                              )
                            })}
                            <SpaceView viewStyle={{flexDirection: 'column'}}>
                              {innerItem.sDataList.map((item, index) => {
                                return (
                                  <SpaceView mb={index == 0 ? 8 : 0}>
                                    <SmallRenderItem item={item} />
                                  </SpaceView>
                                )
                              })}
                            </SpaceView>
                          </SpaceView>
                        </>
                      ) : innerItem.type == 'COMPLEX_SMALL' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <SpaceView viewStyle={{flexDirection: 'column'}}>
                              {innerItem.sDataList.map((item, index) => {
                                return (
                                  <SpaceView mb={index == 0 ? 8 : 0}>
                                    <SmallRenderItem item={item} />
                                  </SpaceView>
                                )
                              })}
                            </SpaceView>
                            {innerItem.mDataList.map((item, index) => {
                              return (
                                <MediumRenderItem item={item} />
                              )
                            })}
                          </SpaceView>
                        </>
                      ) : (
                        <>
                          
                        </>
                      )}

                    </SpaceView>
                  </TouchableOpacity>
                </>
              )
            }}
          />

        </ScrollView>

        <SpaceView viewStyle={_styles.btnArea}>
          <SpaceView viewStyle={_styles.btnTextArea}>
            <TouchableOpacity onPress={() => { goStoryActive(); }}>
              <Text style={_styles.btnText}>활동</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { goStoryRegister(); }}>
              <Text style={_styles.btnText}>등록</Text>
            </TouchableOpacity>
          </SpaceView>
        </SpaceView>
    </>
  );

};





{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  
  wrap: {
    backgroundColor: '#fff',
  },
  itemArea: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  dummyArea: {
    width: (width - 55) / 3,
    height: (width - 55) / 3,
    backgroundColor: '#FE0456',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dummyText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
  },
  btnArea: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  btnTextArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    width: 150,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  btnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
  },
  
});