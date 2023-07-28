import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';


const { width, height } = Dimensions.get('window');

export default function VisualImage({ imgList, memberData, isButton }) {
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

  useFocusEffect(
    React.useCallback(() => {
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
              {memberData?.auth_acct_cnt > 0 && memberData?.auth_acct_cnt < 10 &&
                <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Text style={_styles.whiteText}>LV.{memberData.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {memberData?.auth_acct_cnt >= 10 && memberData?.auth_acct_cnt < 15 &&
                <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level10Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                  <Text style={_styles.whiteText}>LV.{memberData?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {memberData?.auth_acct_cnt >= 15 && memberData?.auth_acct_cnt < 20 &&
                <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level15Icon} style={[_styles.authBadgeImg, {width: 23, height: 23}]} />
                  <Text style={_styles.whiteText}>LV.{memberData?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {memberData?.auth_acct_cnt >= 20 && memberData?.auth_acct_cnt < 25 &&
                <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level20Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{memberData?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {memberData?.auth_acct_cnt >= 25 && memberData?.auth_acct_cnt < 30 &&
                <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level25Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{memberData?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {memberData?.auth_acct_cnt >= 30 &&
                <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge}>
                  <Image source={ICON.level30Icon} style={[_styles.authBadgeImg02, {width: 30, height: 30}]} />
                  <Text style={_styles.whiteText}>LV.{memberData?.auth_acct_cnt}</Text>
                </LinearGradient>
              }

              {/* ####################################################################################################
              ##################################### 프로필 평점 노출 영역
              #################################################################################################### */}
              {memberData?.profile_score < 6.0 &&
                <LinearGradient colors={['#FF7EA6', '#FF7EA6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score5Icon} style={[{width: 12, height: 12}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 6.0 && memberData?.profile_score < 7.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score6Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 7.0 && memberData?.profile_score < 8.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score7Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 8.0 && memberData?.profile_score < 9.0 &&
                <LinearGradient colors={['#FE0456', '#FF82AB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreKingIcon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 9.0 && memberData?.profile_score < 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E6DF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreDiamondIcon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E41E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score10Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

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
      paddingBottom: isOn ? 75 : 35,
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

});