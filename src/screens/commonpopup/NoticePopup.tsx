import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, ScrollView, Dimensions, StyleSheet, FlatList } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { IMAGE, PROFILE_IMAGE, findSourcePath, ICON } from 'utils/imageUtils';
import { CommaFormat, isEmptyData, formatNowDate } from 'utils/functions';
import AsyncStorage from '@react-native-community/async-storage';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat, interpolate, Extrapolate, stopClock, cancelAnimation } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { STACK } from 'constants/routes';



/* ################################################################################################################
###################################################################################################################
###### 공지 팝업 Component
###################################################################################################################
################################################################################################################ */

interface Props {
  popupVisible?: boolean; // popup state
  setPopupVIsible?: any; // popup setState
  isConfirm?: boolean; // confirm 여부
  confirmCallbackFunc?: Function | undefined; // 확인 Callback 함수
  noticeList?: any;
  etcCallbackFunc?: Function | undefined;
}

const { width, height } = Dimensions.get('window');

export const NoticePopup = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const ref = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(1);
  const noticeRef = React.useRef();

  const memberBase = useUserInfo();

  const [noticeList, setNoticeList] = React.useState([]);

  const onPressConfirm = async (isNextChk) => {
    if(isNextChk) {
      let nowDt = formatNowDate().substring(0, 8);
      await AsyncStorage.setItem('POPUP_ENDDT_NOTICE', nowDt);
      props.setPopupVIsible(false);
    } else {
      props.setPopupVIsible(false);
    };

    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {

    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc(isNextChk);
      
    };

    stopAutoPlay();
  };

  React.useEffect(() => {
    setNoticeList(props.noticeList);
  }, [props]);


  // 공지사항 이동 값
  const noticeMoveValue = useSharedValue(-500);

  const noticeStyle = useAnimatedStyle(() => {
    /* const interpolatedMove = interpolate(noticeMoveValue.value, [0, 100], [10, -500], Extrapolate.CLAMP);

    return {
      left: `${interpolatedMove}%`,
    }; */

    return {
      left: noticeMoveValue.value,
    }
  });

  const noticeAnimate = async () => {
    if (noticeRef.current) {
      noticeRef.current.startAutoplay();
    }

    noticeAnimateInit();

    noticeMoveValue.value = withDelay(500, withTiming(20, { duration: 500 }));
  };

  // 상세 이동
  const goDetail = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'Board0',
    });
  };

  // 공지 팝업 초기화 함수
  const noticeAnimateInit = async () => {
    cancelAnimation(noticeMoveValue);

    noticeMoveValue.value = -500;
  };

  // 자동 스크롤 중지 함수
  const stopAutoPlay = () => {
    if (noticeRef.current) {
      noticeRef.current.stopAutoplay();
      noticeRef.current.snapToItem(0);
      setCurrentIndex(1);
    }
  };

  // 현재 스냅된 아이템의 인덱스를 저장하는 이벤트 핸들러
  const handleSnapToItem = (index) => {
    setCurrentIndex(index+1);
  };

  useFocusEffect(
    React.useCallback(() => {
      noticeAnimate();

      return () => {
        noticeAnimateInit();
        stopAutoPlay();
      };
    }, []),
  );

  // ################################################################ 초기 실행 함수

  return (
    <>
      {props.popupVisible &&
      <Animated.View style={[_styles.popupWrap, noticeStyle]}>

        {/* 닫기 버튼 영역 */}
        <TouchableOpacity 
          onPress={() => onPressConfirm(true)}
          style={_styles.xButtonArea}
          hitSlop={commonStyle.hipSlop20}>
          <Image source={ICON.xBtn3} style={styles.iconSquareSize(23)} />
        </TouchableOpacity>

        <LinearGradient
          colors={['#8800FF', '#0F68B7']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={_styles.popupContainer}>

          <SpaceView>
            <SpaceView mt={3} viewStyle={_styles.topArea}>
              <Image source={ICON.bellIcon} style={styles.iconSquareSize(15)} />
              <Text style={_styles.noticeText}>최근 소식</Text>
            </SpaceView>

            <SpaceView mt={6} viewStyle={_styles.noticeContent}>

              {/* 인디케이터 영역 */}
              <SpaceView viewStyle={_styles.indecatorArea}>
                <Text style={_styles.indecatorText}>{currentIndex}/{noticeList.length}</Text>
              </SpaceView>

              {/* 상세보기 영역 */}
              <TouchableOpacity 
                onPress={() => goDetail()}
                style={_styles.detailBtnArea} 
                hitSlop={commonStyle.hipSlop15}>
                <Image source={ICON.nextArrowIcon} style={styles.iconSquareSize(12)} />
              </TouchableOpacity>

              {/* 공지사항 노출 영역 */}
              {/* <FlatList
                ref={noticeRef}
                data={noticeList}
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                renderItem={({ item, index }) => {
                  return (
                    <SpaceView key={index} viewStyle={_styles.noticeItem}>
                      <Text style={_styles.noticeTit} numberOfLines={1}>{item.title}</Text>
                      <Text style={_styles.noticeDesc} numberOfLines={1}>{item.content}</Text>
                    </SpaceView>
                  )
                }}
              /> */}

              <Carousel
                data={noticeList}
                ref={noticeRef}
                //onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                sliderWidth={Math.round(width-180)} 
                itemWidth={Math.round(width-180)}
                horizontal={true}
                inactiveSlideScale={1}
                loop={true}
                pagingEnabled
                autoplay={true}
                autoplayDelay={5000}
                onSnapToItem={handleSnapToItem} // 스냅 이벤트 핸들러 추가
                firstItem={noticeList.length}
                useScrollView={true}
                renderItem={({ item, index }) => {
                  return (
                    <SpaceView key={index} viewStyle={_styles.noticeItem}>
                      <TouchableOpacity onPress={() => goDetail()}>
                        <Text style={_styles.noticeTit} numberOfLines={1}>{item.title}</Text>
                        <Text style={_styles.noticeDesc} numberOfLines={1}>{item.content}</Text>
                      </TouchableOpacity>
                    </SpaceView>
                  )
                }}
              />
            </SpaceView>

            {/* <SpaceView viewStyle={_styles.btnArea}>
              <TouchableOpacity onPress={() => onPressConfirm(true)}>
                <Text style={_styles.closeBtnText}>오늘은 그만보기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPressConfirm(false)}>
                <Text style={_styles.closeBtnText}>닫기 X</Text>
              </TouchableOpacity>
            </SpaceView> */}
          </SpaceView>
        </LinearGradient>
        </Animated.View>
      }
    </>
  );
};




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  popupWrap: {
    position: 'absolute',
    bottom: 20,
  },
  popupContainer: {
      width: width - 150,
      borderRadius: 8,
      paddingHorizontal: 5,
      paddingVertical: 5,
      //overflow: 'hidden',
  },
  topArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  noticeText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  noticeContent: {
    backgroundColor: '#7980E9',
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  noticeItem: {
    width: width - 180,
  },
  noticeTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 3,
    //width: 150
    marginRight: 40,
  },
  noticeDesc: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    color: '#FFFFFF',
    minHeight: 30,
    marginRight: 20,
  },
  indecatorArea: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 33,
    backgroundColor: '#1FDBE2',
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 2,
    zIndex: 1,
  },
  indecatorText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  detailBtnArea: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    zIndex: 1,
  },
  btnArea: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  closeBtnText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#707070',
  },
  xButtonArea: {
    position: 'absolute',
    top: -10,
    right: -8,
    zIndex: 1,
  },
});
