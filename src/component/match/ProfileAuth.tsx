import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { SimpleGrid } from 'react-native-super-grid';
import { ICON } from 'utils/imageUtils';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { STACK } from 'constants/routes';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { isEmptyData } from 'utils/functions';
import AuthLevel from 'component/common/AuthLevel';
import { Slider } from '@miblanchard/react-native-slider';
import { useUserInfo } from 'hooks/useUserInfo';


const { width } = Dimensions.get('window');

export default function ProfileAuth({ data, isButton, callbackAuthCommentFn, memberData }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  const memberBase = useUserInfo();

  const authRef = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 프로필 인증 변경 버튼 클릭 함수
  const onPressSecondAuth = async () => {
    navigation.navigate(STACK.COMMON, { screen: 'SecondAuth', });
  };

  const onPressAuthDot = (index) => {
    authRef?.current?.snapToItem(index);
  };

  return (
    <>
      {data.length > 0 && (
        <SpaceView>

          {/* ########################################################################################### 타이틀 */}
          <SpaceView mb={15} viewStyle={{flexDirection: 'row'}}>
            <Text style={_styles.textStyle(20, '#EEEAEB', 'B')}>{memberData.nickname}님의 인증 정보🤩</Text>
          </SpaceView>

          {/* ########################################################################################### 인증 목록(세로) */}
          {/* <SpaceView>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={_styles.authList}>

              {data?.map((item, index) => {
                const authCode = item.common_code;
                let authIcon = ICON.authJob;

                if(authCode == 'EDU') {
                  authIcon = ICON.authEdu;
                } else if(authCode == 'INCOME') {
                  authIcon = ICON.authAsset;
                } else if(authCode == 'ASSET') {
                  authIcon = ICON.authAsset;
                } else if(authCode == 'SNS') {
                  authIcon = ICON.authAsset;
                } else if(authCode == 'VEHICLE') {
                  authIcon = ICON.authAsset;
                }

                return (
                  <>
                    <LinearGradient
                      colors={['#092032', '#344756']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={_styles.authItem}>

                      <SpaceView>
                        <SpaceView mb={20} viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image source={authIcon} style={styles.iconSquareSize(16)} />
                          <SpaceView ml={5}><Text style={_styles.textStyle(18, '#FEE05C', 'SB')}>{item.code_name}</Text></SpaceView>
                        </SpaceView>

                        <SpaceView>
                          <Text style={_styles.textStyle(11, '#EEEAEB')} numberOfLines={8}>
                            {isEmptyData(item?.auth_comment) ? (
                              <>"{item?.auth_comment}"</>
                            ) : (
                              <>"작성한 인증 코멘트가 없습니다."</>
                            )}
                          </Text>
                        </SpaceView>
                      </SpaceView>

                      <SpaceView viewStyle={{justifyContent: 'center'}}>
                        <Text style={_styles.textStyle(14, '#FEE05C', 'SB')}>{item?.slogan_name}중견기업 대표</Text>
                      </SpaceView>

                    </LinearGradient>
                  </>
                )
              })}

            </ScrollView>
          </SpaceView> */}

          {/* ########################################################################################### 인증 목록(가로) */}
          <SpaceView>
            {data?.map((item, index) => {
              const authCode = item.common_code;
              let authIcon = ICON.authJob;

              if(authCode == 'EDU') {
                authIcon = ICON.authEdu;
              } else if(authCode == 'INCOME') {
                authIcon = ICON.authAsset;
              } else if(authCode == 'ASSET') {
                authIcon = ICON.authAsset;
              } else if(authCode == 'SNS') {
                authIcon = ICON.authAsset;
              } else if(authCode == 'VEHICLE') {
                authIcon = ICON.authAsset;
              }

              return (
                <>
                  <LinearGradient
                    colors={['#F1B10E', '#EEC80C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={_styles.authItemWrap}>

                    <SpaceView viewStyle={_styles.itemSubBg} />

                    <SpaceView ml={20} mr={8} mt={8} mb={8} viewStyle={{flexDirection: 'column', justifyContent: 'space-between'}}>
                      <SpaceView mb={15} viewStyle={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <SpaceView>
                          <Image source={authIcon} style={styles.iconSquareSize(20)} />
                        </SpaceView>

                        <SpaceView pt={3} viewStyle={{justifyContent: 'center'}}>
                          <Text style={_styles.sloganText}>중견기업 대표</Text>
                        </SpaceView>
                      </SpaceView>

                      <SpaceView>
                        <Text style={_styles.textStyle(12, '#4A4846', 'L')}>
                          {isEmptyData(item?.auth_comment) ? (
                            <>"{item?.auth_comment}"</>
                          ) : (
                            <>"작성한 인증 코멘트가 없습니다."</>
                          )}
                        </Text>
                      </SpaceView>
                    </SpaceView>

                  </LinearGradient>
                </>
              )
            })}
          </SpaceView>

        </SpaceView>
      )}
    </>
  );
}


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}
const _styles = StyleSheet.create({
  textStyle: (_fSize:number, _fColor:string, _fType:string) => {
    let _fontFmaily = 'Pretendard-Regular';
    if(_fType == 'SB') {
      _fontFmaily = 'Pretendard-SemiBold';
    } else if(_fType == 'EB') {
      _fontFmaily = 'Pretendard-ExtraBold';
    } else if(_fType == 'B') {
      _fontFmaily = 'Pretendard-Bold';
    } else if(_fType == 'L') {
      _fontFmaily = 'Pretendard-Light';
    }

    return {
      fontFamily: _fontFmaily,
      fontSize: _fSize,
      color: isEmptyData(_fColor) ? _fColor : '#fff',
    };
  },
  authList: {
    width: width,
    overflow: 'hidden',
    marginRight: 15,
  },
  authItem: {
    width: 130,
    height: 220,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },





  authItemWrap: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    minHeight: 90,
  },
  itemSubBg: {
    backgroundColor: '#0EE9F1',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 12,
  },
  sloganText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: '#0EE9F1',
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },



});