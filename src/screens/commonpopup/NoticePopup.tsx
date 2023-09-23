import { ColorType } from '@types';
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
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat, interpolate, Extrapolate, stopClock } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';



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
  const ref = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const noticeRef = React.useRef();

  const memberBase = useUserInfo();

  const [noticeList, setNoticeList] = React.useState([]);


  // 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor((contentOffset.x / (width-180)) / 3);
    setCurrentIndex(index);
  };

  const onPressConfirm = async (isNextChk) => {
    if(isNextChk) {
      let nowDt = formatNowDate().substring(0, 8);
      await AsyncStorage.setItem('POPUP_ENDDT_' + 'NOTICE', nowDt);
    } else {
      props.setPopupVIsible(false);
    };

    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {

    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc(isNextChk);
      
    };
  };

  const onPressEtc = (item:any) => {
    props.etcCallbackFunc(item);
    props.setPopupVIsible(false);
  };

  const onPressItem = async (index:number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    setNoticeList(props.noticeList);
  }, [props]);


  const noticeMoveValue = useSharedValue(20);

  const noticeStyle = useAnimatedStyle(() => {
    const interpolatedMove = interpolate(noticeMoveValue.value, [0, 100], [10, -500], Extrapolate.CLAMP);

    return {
      left: `${interpolatedMove}%`,
    };
  });

  const noticeAnimate = async () => {
    noticeAnimateCancel();

    noticeMoveValue.value = withSequence(
      withDelay(500, withTiming(1, { duration: 500 })),
    );
  };

  // 공지 팝업 초기화 함수
  const noticeAnimateCancel = async () => {
    noticeMoveValue.value = 20;
  };

  useFocusEffect(
    React.useCallback(() => {
      noticeAnimate();

      return () => {
      };
    }, []),
  );

  // ################################################################ 초기 실행 함수

  return (
    <>
      {props.popupVisible &&
      <Animated.View style={[_styles.test, noticeStyle]}>
				<LinearGradient
          colors={['#8800FF', '#0F68B7']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={_styles.popupContainer}>

          <SpaceView>
            <SpaceView mt={3} viewStyle={_styles.topArea}>
              <Image source={ICON.bellIcon} style={styles.iconSquareSize(15)} />
              <Text style={_styles.noticeText}>공지</Text>
            </SpaceView>

            <SpaceView mt={6} viewStyle={_styles.noticeContent}>

              {/* 인디케이터 영역 */}
              <SpaceView viewStyle={_styles.indecatorArea}>
                <Text style={_styles.indecatorText}>{currentIndex}/{noticeList.length}</Text>
              </SpaceView>

              {/* 상세보기 영역 */}
              <TouchableOpacity style={_styles.detailBtnArea} hitSlop={commonStyle.hipSlop15}>
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
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                sliderWidth={Math.round(width)} 
                itemWidth={Math.round(width)}
                horizontal={true}
                inactiveSlideScale={1}
                loop={true}
                pagingEnabled
                autoplay={true}
                autoplayDelay={2000}
                renderItem={({ item, index }) => {
                  return (
                    <SpaceView key={index} viewStyle={_styles.noticeItem}>
                      <Text style={_styles.noticeTit} numberOfLines={1}>{item.title}</Text>
                      <Text style={_styles.noticeDesc} numberOfLines={1}>{item.content}</Text>
                    </SpaceView>
                  )
                }}
              />
            </SpaceView>

            <SpaceView viewStyle={_styles.btnArea}>
              <TouchableOpacity onPress={() => onPressConfirm(true)}>
                <Text style={_styles.closeBtnText}>오늘은 그만보기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPressConfirm(false)}>
                <Text style={_styles.closeBtnText}>닫기 X</Text>
              </TouchableOpacity>
            </SpaceView>
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
  test: {
    position: 'absolute',
    bottom: 30,
  },
});