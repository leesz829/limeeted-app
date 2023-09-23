import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat, interpolate, Extrapolate, cancelAnimation, stopClock } from 'react-native-reanimated';
import { styles } from 'assets/styles/Styles';
import { ROUTES, STACK } from 'constants/routes';
import AuthLevel from 'component/common/AuthLevel';
import { isEmptyData } from 'utils/functions';


const { width, height } = Dimensions.get('window');

export default function AuthPick({ _authLevel, _authList }) {
  const isFocus = useIsFocused();

  // 인증 목록 데이터
  const [authList, setAuthList] = React.useState(function() {
    let data = [
      {type: 'JOB', name: '직업', level: 0, img: ICON.jobNew},
      {type: 'EDU', name: '학력', level: 0, img: ICON.degreeNew},
      {type: 'INCOME', name: '소득', level: 0, img: ICON.incomeNew},
      {type: 'ASSET', name: '자산', level: 0, img: ICON.assetNew},
      {type: 'SNS', name: 'SNS', level: 0, img: ICON.snsNew},
      {type: 'VEHICLE', name: '차량', level: 0, img: ICON.vehicleNew},
    ];

    if(isEmptyData(_authList) && _authList.length > 0) {
      _authList.map((item: any, index) => {
        const type = item.common_code;
        const level = item.auth_level;

        data.map((_item: any, _index) => {
          if(type == _item.type) {
            _item.level = level;
          }
        });
      });
    }

    return data;
  });

  // ############################################################################################################# 애니메이션 관련
  const wrapTopValue = useSharedValue(-100);
  const wrapOpacityValue = useSharedValue(0);

  const topBaseOpacityValue = useSharedValue(1);
  const topMainOpacityValue = useSharedValue(0);

  const bottomAuthOpacityValue = useSharedValue(0.5);

  const [isRotated, setIsRotated] = React.useState(false);

  /* const giftStyle = useAnimatedStyle(() => {
    const interpolatedRotation = interpolate(giftRotateValue.value, [0, 1], [0, -20], Extrapolate.CLAMP);

    return {
      opacity: giftOpacityValue.value,
      transform: [{ rotate: `${interpolatedRotation}deg` }],
    };
  }); */

  const wrapStyle = useAnimatedStyle(() => {
    return {
      top: wrapTopValue.value,
      opacity: wrapOpacityValue.value,
    }
  });

  const topBaseStyle = useAnimatedStyle(() => {
    return {
      opacity: topBaseOpacityValue.value,
    }
  });

  const topMainStyle = useAnimatedStyle(() => {
    return {
      opacity: topMainOpacityValue.value,
    }
  });

  const bottomAuthStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomAuthOpacityValue.value,
    }
  });


  // 애니메이션 실행 함수 적용
  const authPickAnimate = async () => {
    authPickAnimateCancel();

    //wrapTopValue.value = withDelay(500, withTiming(100, { duration: 800 }));
    //wrapTopValue.value = withDelay(500, withSpring(100, { damping: 15, stiffness: 180 }));
    //wrapOpacityValue.value = withDelay(500, withTiming(1, { duration: 300 }));  

    wrapTopValue.value = withSequence(
      withDelay(500, withSpring(100, { damping: 15, stiffness: 180 })),
      withDelay(4500, withTiming(-100, { duration: 300 })),
    );

    wrapOpacityValue.value = withSequence(
      withDelay(500, withTiming(1, { duration: 300 })),
      withDelay(4500, withTiming(1, { duration: 800 })),
    );

    topBaseOpacityValue.value = withDelay(1300, withTiming(0, { duration: 300 }));
    topMainOpacityValue.value = withDelay(1300, withTiming(1, { duration: 300 }));

    bottomAuthOpacityValue.value = withDelay(1800, withTiming(1, { duration: 800 }));

    //wrapOpacityValue.value = withDelay(4500, withTiming(0, { duration: 800 }));
    //wrapTopValue.value = withDelay(4500, withTiming(-100, { duration: 300 }));

    /* wrapTopValue.value = withSequence(
      withDelay(1000, withTiming(100, { duration: 500 })),
      //withDelay(200, withTiming(70, { duration: 500 })),
      //withDelay(500, withTiming(-300, { duration: 500 })),
    ); */
  };

  // 애니메이션 취소 및 초기화 함수
  const authPickAnimateCancel = async () => {
    cancelAnimation(wrapTopValue);
    cancelAnimation(wrapOpacityValue);
    cancelAnimation(topBaseOpacityValue);
    cancelAnimation(topMainOpacityValue);
    cancelAnimation(bottomAuthOpacityValue);

    wrapTopValue.value = -100;
    wrapOpacityValue.value = 0;
    topBaseOpacityValue.value = 1;
    topMainOpacityValue.value = 0;
    bottomAuthOpacityValue.value = 0.5;
  }

  useFocusEffect(
    React.useCallback(() => {
      authPickAnimate();

      return () => {
        authPickAnimateCancel();
      };
    }, []),
  );

  return (
    <>
      <Animated.View style={[_styles.wrap, wrapStyle]}>
        <SpaceView viewStyle={_styles.area(Platform.OS)}>
          <SpaceView mb={5} viewStyle={_styles.topBox}>

            <Animated.View style={[_styles.topAnimation, topBaseStyle]}>
              <SpaceView viewStyle={_styles.topContent}>
                <SpaceView viewStyle={_styles.topTitleArea}>
                  <Image source={ICON.celebrityIcon01} style={styles.iconSquareSize(30)} />
                  <Text style={_styles.topTitleText}>리미티드 추천 회원</Text>
                </SpaceView>
                <SpaceView>
                  <AuthLevel authAcctCnt={0} type={'BASE'} />
                </SpaceView>
              </SpaceView>
              <View style={_styles.topAuthLine} />
            </Animated.View>

            {_authLevel >= 5 && (
              <Animated.View style={[_styles.topAnimation, topMainStyle]}>
                <SpaceView viewStyle={_styles.topContent}>
                  <SpaceView viewStyle={_styles.topTitleArea}>
                    {_authLevel >= 5 && _authLevel < 10 ? (
                      <>
                        <Image source={ICON.celebrityIcon01} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>리미티드 추천 회원</Text>
                      </>
                    ) : _authLevel >= 10 && _authLevel < 15 ? (
                      <>
                        <Image source={ICON.celebrityIcon02} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>프로필 인증 상위 회원</Text>
                      </>
                    ) : _authLevel >= 15 && _authLevel < 20 ? (
                      <>
                        <Image source={ICON.celebrityIcon03} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>프로필 인증 최상위 회원</Text>
                      </>
                    ) : _authLevel >= 20 && _authLevel < 25 ? (
                      <>
                        <Image source={ICON.celebrityIcon04} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                      </>
                    ) : _authLevel >= 25 && _authLevel < 30 ? (
                      <>
                        <Image source={ICON.celebrityIcon05} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                      </>
                    ) : _authLevel >= 30 && (
                      <>
                        <Image source={ICON.celebrityIcon06} style={styles.iconSquareSize(30)} />
                        <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                      </>
                    )}
                  </SpaceView>
                  <SpaceView>
                    <AuthLevel authAcctCnt={_authLevel} type={'BASE'} />
                  </SpaceView>
                </SpaceView>

                {_authLevel >= 5 && _authLevel < 10 ? (
                  <View style={_styles.topAuthLine} />
                ) : _authLevel >= 10 && _authLevel < 15 ? (
                  <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
                ) : _authLevel >= 15 && _authLevel < 20 ? (
                  <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
                ) : _authLevel >= 20 && _authLevel < 25 ? (
                  <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
                ) : _authLevel >= 25 && _authLevel < 30 ? (
                  <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
                ) : _authLevel >= 30 && (
                  <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
                )}
              </Animated.View>
            )}

          </SpaceView>
          <SpaceView viewStyle={_styles.bottomBox}>

            {authList.map((item, index) => {
              return (
                <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle)]}>
                  <Image source={item.img} style={{width: 40, height: 30}} />
                  <Text style={_styles.bottomAuthText}>{item.name} {item.level > 0 && 'Lv.' + item.level}</Text>
                </Animated.View>
              )
            })}
          </SpaceView>

          <View style={_styles.bgBox} />
        </SpaceView>
      </Animated.View>
    </>
  );

}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  area: (device:any) => {
    if(device == 'ios') {
      return {
        //backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#707070',
      };
    } else {
      return {
        //backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 5,
        /* borderWidth: 1,
        borderColor: '#707070', */
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.23,
        shadowRadius: 5.0,
        elevation: 8,
        overflow: 'visible',
      };
    }    
  },
  topBox: {
    height: 37,
    zIndex: 1,
  },
  topAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topContent: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  topTitleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topTitleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#7B7B7B',
    marginLeft: 5,
  },
  topAuthLine: {
    backgroundColor: '#7986EE',
    width: '100%',
    height: 4,
    marginBottom: 5,
  },
  bottomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    zIndex: 1,
  },
  bottomAuthItem: (isOpacity: boolean) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      opacity: 0.5,
    };
  },
  bottomAuthText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#7986EE',
    width: 48,
    textAlign: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5,
  },
  bgBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    overflow: 'hidden',
  },

});