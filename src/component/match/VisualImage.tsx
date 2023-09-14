import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat } from 'react-native-reanimated';
import { styles } from 'assets/styles/Styles';
import AuthLevel from 'component/common/AuthLevel';
import ProfileGrade from 'component/common/ProfileGrade';


const { width, height } = Dimensions.get('window');

export default function VisualImage({ imgList, memberData, isButton, isAnimation }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  const memberBase = useUserInfo(); //hooksMember.getBase();

  const imgRef = React.useRef();

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
  };

  // ############################################################################################################# 애니메이션 관련
  const [isExpanded, setIsExpanded] = React.useState(false);
  const boxOpacity = useSharedValue(0);
  const boxWidth = useSharedValue(45);
  const textOpacity = useSharedValue(0);

  const resIntroAnimate = async () => {
    /* animateWith.value = withSpring(isExpanded ? 100 : 200, {
      duration: 3551,
      damping: 0.5,
      stiffness: 14,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    }); */

    boxOpacity.value = withDelay(500, withTiming(1, { duration: 300 }, () => {
      boxWidth.value = withTiming(315, { duration: 1000, easing: Easing.inOut(Easing.exp) }, () => {
        textOpacity.value = withTiming(1, { duration: 500 }, () => {
          textOpacity.value = withDelay(1500, withTiming(0, { duration: 400 }, () => {
            boxWidth.value = withTiming(45, { duration: 500 }, () => {
              boxOpacity.value = withDelay(500, withTiming(0, { duration: 300 }, () => {

              }));
            });
          }));
        });
      });
    }));

    setIsExpanded(!isExpanded);
  };

  const boxStyle = useAnimatedStyle(() => {
    return {
      opacity: boxOpacity.value,
      width: boxWidth.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  useFocusEffect(
    React.useCallback(() => {
      if(isAnimation) {
        resIntroAnimate();
      };

      return () => {
        imgRef?.current?.scrollToIndex({ index: 0, animated: false });
      };
    }, []),
  );

  return (
    <>
      <View style={{overflow: 'hidden', borderRadius: 20}}>

        {/* ####################################################################################################
        ##################################### 이미지 Indicator
        #################################################################################################### */}
        <View style={_styles.pagingContainer}>
          {imgList?.map((item, index) => {
            return item.status == 'ACCEPT' && (
              <View style={_styles.dotContainerStyle} key={'dot' + index}>
                <View style={[_styles.pagingDotStyle, index == currentIndex && _styles.activeDot]} />
              </View>
            )
          })}
        </View>

        {/* ####################################################################################################
        ##################################### 이미지 렌더링
        #################################################################################################### */}
        <FlatList
          ref={imgRef}
          data={imgList}
          renderItem={RenderItem}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
        />

        <View style={_styles.absoluteView(isButton)}>

          <SpaceView ml={25} mr={25} mb={20}>
            <Animated.View
              style={[_styles.checkDocAnimateArea, boxStyle]}>

              <Image source={ICON.boxTipsIcon} style={styles.iconSquareSize(30)} />

              <Animated.View style={[textStyle]}>
                <Text style={[_styles.checkDocAnimateText]}>관심을 수락하면 서로의 연락처를 열람할 수 있어요.</Text>
              </Animated.View>
            </Animated.View>
          </SpaceView>
          
          <LinearGradient
            colors={['transparent', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={_styles.thumnailArea} />

          <View style={{paddingHorizontal: 27}}>
            <View style={_styles.badgeContainer}>

              {/* ####################################################################################################
              ##################################### 인증 레벨 노출 영역
              #################################################################################################### */}
              <AuthLevel authAcctCnt={memberData?.auth_acct_cnt} type={'BASE'} />

              {/* ####################################################################################################
              ##################################### 프로필 평점 노출 영역
              #################################################################################################### */}
              <ProfileGrade profileScore={memberData?.profile_score} type={'BASE'} />

              {/* 고평점 이성 소개받기 구독 아이템 표시 */}
              {/* <View style={styles.redBadge}>
                <Image source={ICON.whiteCrown} style={styles.crownIcon} />
                <Text style={styles.whiteText}>{data.match_member_info?.profile_score}</Text>
              </View> */}
            </View>

            {/* {data.distance_val != null &&
            <View style={styles.distanceContainer}>
              <Image source={ICON.marker} style={styles.markerIcon} />
              <Text style={styles.regionText}>12.9Km</Text>
            </View>
            } */}

            <View style={_styles.nameContainer}>
              <Text style={_styles.nameText}>{memberData?.nickname}, {memberData?.age}</Text>
              <Image source={ICON.checkICon} style={_styles.checkIcon} />
            </View>

            <View style={_styles.distanceContainer}>
              <Text style={_styles.regionText}>{memberData?.comment}</Text>
            </View>

          </View>
        </View> 
      </View>
    </>
  );

  function RenderItem({ item }) {
    const url = findSourcePath(item?.img_file_path);

    return (
      <>
        {item.status == 'ACCEPT' &&
          <View>
            <Image
              source={url}
              style={{
                flex: 1,
                width: width,
                height: height * 0.7,
                borderRadius: 20,
              }}
              resizeMode={'cover'}
            />
            <Watermark value={memberBase?.phone_number}/>
          </View>
        }
      </>
    );
  }

}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
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
  dotContainerStyle: {
    marginRight: 2,
    marginLeft: 2,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  absoluteView: (isButton: boolean) => {
    let isOn = true;
    if(typeof isButton == 'undefined' || isButton) {
      isOn = true;
    } else {
      isOn = false;
    }

    return {
      position: 'absolute',
      left: 0,
      //bottom: !isOn ? -width * -0.08 : -width * -0.16,
      bottom: 0,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      zIndex: 1,
      width: '100%',
      paddingBottom: isOn ? 63 : 25,
    };
  },
  thumnailArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    height: height * 0.24,
  },
  badgeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  yellowText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FDFFD8',
  },
  authBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginRight: 5,
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
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  regionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },








  checkDocAnimateArea: {
    height: 45,
    overflow: 'hidden',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 7,
  },
  checkDocAnimateText: {
    color: '#686868',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    marginLeft: 5,
  },

});