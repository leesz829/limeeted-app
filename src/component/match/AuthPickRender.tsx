import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList, Platform } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat, interpolate, Extrapolate, cancelAnimation, stopClock, Value, timing } from 'react-native-reanimated';
import { styles } from 'assets/styles/Styles';
import { ROUTES, STACK } from 'constants/routes';
import AuthLevel from 'component/common/AuthLevel';
import { isEmptyData } from 'utils/functions';


const { width, height } = Dimensions.get('window');

export default function AuthPickRender({ _authLevel, _authList }) {
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
  const wrapTopValue = useSharedValue(-200);
  const wrapOpacityValue = useSharedValue(0);

  const [authCount, setAuthCount] = React.useState(1);

  const topBaseOpacityValue = useSharedValue(1);
  const topMainOpacityValue = useSharedValue(0);

  const bottomMainOpacityValue = useSharedValue(0);
  const bottomAuthOpacityValue = useSharedValue(0.5);
  const bottomAuthOpacityValue01 = useSharedValue(0.5);
  const bottomAuthOpacityValue02 = useSharedValue(0.5);
  const bottomAuthOpacityValue03 = useSharedValue(0.5);
  const bottomAuthOpacityValue04 = useSharedValue(0.5);
  const bottomAuthOpacityValue05 = useSharedValue(0.5);
  const bottomAuthOpacityValue06 = useSharedValue(0.5);

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
    return { opacity: topBaseOpacityValue.value }
  });

  const topMainStyle = useAnimatedStyle(() => {
    return { opacity: topMainOpacityValue.value }
  });

  const bottomMainStyle = useAnimatedStyle(() => {
    return { opacity: bottomMainOpacityValue.value }
  });

  const bottomAuthStyle = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue.value }
  });

  const bottomAuthStyle01 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue01.value }
  });

  const bottomAuthStyle02 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue02.value }
  });

  const bottomAuthStyle03 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue03.value }
  });

  const bottomAuthStyle04 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue04.value }
  });

  const bottomAuthStyle05 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue05.value }
  });

  const bottomAuthStyle06 = useAnimatedStyle(() => {
    return { opacity: bottomAuthOpacityValue06.value }
  });


  // 애니메이션 실행 함수 적용
  const bottomAuthStyleConverter = async (index:number) => {
    if(index == 0) {
      return bottomAuthStyle01;
    } else if(index == 1) {
      return bottomAuthStyle02;
    } else if(index == 2) {
      return bottomAuthStyle03;
    } else if(index == 3) {
      return bottomAuthStyle04;
    } else if(index == 4) {
      return bottomAuthStyle05;
    } else if(index == 5) {
      return bottomAuthStyle06;
    }    
  };

  // 애니메이션 실행 함수 적용
  const authPickAnimate = async () => {
    authPickAnimateCancel();

    wrapTopValue.value = withSequence(
      withDelay(500, withSpring(100, { damping: 15, stiffness: 180 })),
      withDelay(5300, withTiming(-200, { duration: 300 })),
    );

    wrapOpacityValue.value = withSequence(
      withDelay(500, withTiming(1, { duration: 300 })),
      withDelay(5300, withTiming(1, { duration: 800 })),
    );

    setTimeout(() => {
      // 딜레이 후에 카운팅 애니메이션 시작
      for (let i = 1; i <= _authLevel; i++) {
        setTimeout(() => {
          setAuthCount(i);

          if(i == _authLevel) {
            bottomAuthAnimate();
          }
        }, i * 50); // 10밀리초마다 업데이트하여 애니메이션 효과 생성
      }
    }, 1300);

    topBaseOpacityValue.value = withDelay(800, withTiming(0, { duration: 300 }));
    topMainOpacityValue.value = withDelay(800, withTiming(1, { duration: 300 }));

    //bottomAuthOpacityValue.value = withDelay(2000, withTiming(1, { duration: 800 }));
  };

  // 하단 애니메이션 실행
  const bottomAuthAnimate = async () => {
    let _delayCount = 0;

    bottomMainOpacityValue.value = withDelay(100, withTiming(1, { duration: 300 }));

    setTimeout(() => {
      authList.map((item, index) => {
        if(item.level > 0) {
          _delayCount = _delayCount+400;
          if(index == 0) {
            bottomAuthOpacityValue01.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          } else if(index == 1) {
            bottomAuthOpacityValue02.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          } else if(index == 2) {
            bottomAuthOpacityValue03.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          } else if(index == 3) {
            bottomAuthOpacityValue04.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          } else if(index == 4) {
            bottomAuthOpacityValue05.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          } else if(index == 5) {
            bottomAuthOpacityValue06.value = withDelay(_delayCount, withTiming(1, { duration: 300 }));
          }
        };
      });
    }, 1000);

    //bottomAuthOpacityValue.value = withDelay(2000, withTiming(1, { duration: 800 }));
  };

  // 애니메이션 취소 및 초기화 함수
  const authPickAnimateCancel = async () => {
    cancelAnimation(wrapTopValue);
    cancelAnimation(wrapOpacityValue);
    cancelAnimation(topBaseOpacityValue);
    cancelAnimation(topMainOpacityValue);
    cancelAnimation(bottomMainOpacityValue);
    cancelAnimation(bottomAuthOpacityValue);
    cancelAnimation(bottomAuthOpacityValue01);
    cancelAnimation(bottomAuthOpacityValue02);
    cancelAnimation(bottomAuthOpacityValue03);
    cancelAnimation(bottomAuthOpacityValue04);
    cancelAnimation(bottomAuthOpacityValue05);
    cancelAnimation(bottomAuthOpacityValue06);

    wrapTopValue.value = -200;
    wrapOpacityValue.value = 0;
    topBaseOpacityValue.value = 1;
    topMainOpacityValue.value = 0;
    bottomMainOpacityValue.value = 0;
    bottomAuthOpacityValue.value = 0.5;
    bottomAuthOpacityValue01.value = 0.5;
    bottomAuthOpacityValue02.value = 0.5;
    bottomAuthOpacityValue03.value = 0.5;
    bottomAuthOpacityValue04.value = 0.5;
    bottomAuthOpacityValue05.value = 0.5;
    bottomAuthOpacityValue06.value = 0.5;

    setAuthCount(1);
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

            <Animated.View style={[_styles.topAnimation(1)]}>
              <SpaceView viewStyle={_styles.topContent}>
                <SpaceView viewStyle={_styles.topTitleArea}>
                  <Image source={ICON.celebrityIcon01} style={styles.iconSquareSize(30)} />

                  <Animated.View style={[topBaseStyle]}>
                    <Text style={_styles.topTitleText}>리미티드 추천 회원</Text>
                  </Animated.View>
                </SpaceView>
                <SpaceView>
                  {/* <AuthLevel authAcctCnt={5} type={'BASE'} /> */}
                  <View style={{width: 48, height: 21, borderRadius: 5, backgroundColor: '#7986EE', marginRight: 5,}} />
                </SpaceView>
              </SpaceView>
              <View style={_styles.topAuthLine} />
            </Animated.View>

            <Animated.View style={[_styles.topAnimation(2), topMainStyle]}>
              <SpaceView viewStyle={_styles.topContent}>
                <SpaceView viewStyle={_styles.topTitleArea}>
                  {authCount < 10 ? (
                    <>
                      <Image source={ICON.celebrityIcon01} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>리미티드 추천 회원</Text>
                    </>
                  ) : authCount >= 10 && authCount < 15 ? (
                    <>
                      <Image source={ICON.celebrityIcon02} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>프로필 인증 상위 회원</Text>
                    </>
                  ) : authCount >= 15 && authCount < 20 ? (
                    <>
                      <Image source={ICON.celebrityIcon03} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>프로필 인증 최상위 회원</Text>
                    </>
                  ) : authCount >= 20 && authCount < 25 ? (
                    <>
                      <Image source={ICON.celebrityIcon04} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                    </>
                  ) : authCount >= 25 && authCount < 30 ? (
                    <>
                      <Image source={ICON.celebrityIcon05} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                    </>
                  ) : authCount >= 30 && (
                    <>
                      <Image source={ICON.celebrityIcon06} style={styles.iconSquareSize(30)} />
                      <Text style={_styles.topTitleText}>TOP CLASS 회원</Text>
                    </>
                  )}
                </SpaceView>
                <SpaceView>
                  {/* <AuthLevel authAcctCnt={_authLevel} type={'BASE'} /> */}
                  <AuthLevel authAcctCnt={authCount} type={'BASE'} />
                  {/* <Animated.Text style={{ fontSize: 48 }}>
                    {authCount}
                  </Animated.Text> */}
                </SpaceView>
              </SpaceView>

              {authCount < 10 ? (
                <View style={_styles.topAuthLine} />
              ) : authCount >= 10 && authCount < 15 ? (
                <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
              ) : authCount >= 15 && authCount < 20 ? (
                <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
              ) : authCount >= 20 && authCount < 25 ? (
                <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
              ) : authCount >= 25 && authCount < 30 ? (
                <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
              ) : authCount >= 30 && (
                <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.topAuthLine} />
              )}
            </Animated.View>

          </SpaceView>

          <SpaceView viewStyle={_styles.bottomBox}>
            <Animated.View style={[_styles.bottomAnimation(1)]}>
              {authList.map((item, index) => {
                  return (
                    <>
                      <Animated.View style={[_styles.bottomAuthItem()]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(0)}>{item.name}</Text>
                      </Animated.View>
                    </>
                  )
                })}
            </Animated.View>

            <Animated.View style={[_styles.bottomAnimation(2), bottomMainStyle]}>
              {authList.map((item, index) => {
                return (
                  <>
                    {index == 0 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle01)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : index == 1 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle02)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : index == 2 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle03)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : index == 3 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle04)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : index == 4 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle05)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : index == 5 ? (
                      <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyle06)]}>
                        <Image source={item.img} style={{width: 40, height: 30}} />
                        <Text style={_styles.bottomAuthText(item.level > 0)}>{item.level > 0 ? 'Lv.' + item.level : item.name}</Text>
                      </Animated.View>
                    ) : null}

                    {/* <Animated.View style={[_styles.bottomAuthItem(), (item.level > 0 && bottomAuthStyleConverter(index))]}>
                      <Image source={item.img} style={{width: 40, height: 30}} />
                      <Text style={_styles.bottomAuthText(item.level > 0)}>{item.name} {item.level > 0 && 'Lv.' + item.level}</Text>
                    </Animated.View> */}
                  </>                
                )
              })}
            </Animated.View>
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
        /* borderWidth: 1,
        borderColor: '#707070', */
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.23,
        shadowRadius: 5.0,
        elevation: 8,
        overflow: 'visible',
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
  topAnimation: (_zIndex: number) => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: _zIndex,
    };
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
    marginBottom: 5,
    height: 53,
  },
  bottomAnimation: (_zIndex: number) => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: _zIndex,
    };
  },

  bottomAuthItem: (isOpacity: boolean) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      opacity: 0.5,
    };
  },
  bottomAuthText: (isOn: boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: 10,
      color: '#fff',
      backgroundColor: isOn ? '#7986EE' : '#B1B3C7',
      //backgroundColor: '#B1B3C7',
      width: 48,
      textAlign: 'center',
      borderRadius: 8,
      overflow: 'hidden',
      marginTop: 5,
    };
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