import { View, Image, StyleSheet, Text, Platform } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommaFormat, isEmptyData } from 'utils/functions';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withDelay, Easing, withRepeat, withSequence } from 'react-native-reanimated';
import SpaceView from './SpaceView';


const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
  const memberBase = useUserInfo();

  const shopDescOpacity = useSharedValue(0);
  const storageDescOpacity = useSharedValue(0);

  const shopDescAnimate = () => {
    shopDescOpacity.value = withRepeat(
      withSequence(
        withDelay(2000, withTiming(1, { duration: 700 })),
        withDelay(2500, withTiming(0, { duration: 700 })),
      ),
      -1,
      true
    );
  };

  const storageDescAnimate = () => {
    storageDescOpacity.value = withSequence(
        withDelay(500, withTiming(1, { duration: 500 })),
        withDelay(1000, withTiming(0, { duration: 500 })),
        withDelay(500, withTiming(1, { duration: 500 })),
        withDelay(1000, withTiming(0, { duration: 500 })),
        withDelay(500, withTiming(1, { duration: 500 })),
        withDelay(1000, withTiming(0, { duration: 500 })),
    );
  };

  const shopDescStyle = useAnimatedStyle(() => {
    return {
      opacity: shopDescOpacity.value
    };
  });

  const storageDescStyle = useAnimatedStyle(() => {
    return {
      opacity: storageDescOpacity.value
    };
  });

  if(name == 'Cashshop') {
    shopDescAnimate();
  } else if(name == 'Storage') {
    storageDescAnimate();
  };

  switch (name) {
    case 'Roby': {
      const mbrProfileImgList = useProfileImg();
      const masterProfileImg = mbrProfileImgList.filter((e, i) => i == 0);

      if(masterProfileImg.length > 0) {
        return (
          <>
            <View>
              <Image style={_style.imgSize(isFocused)} source={findSourcePath(masterProfileImg[0].img_file_path)} />

              {isEmptyData(memberBase?.new_board_cnt) && memberBase?.new_board_cnt > 0 && (
                <View style={_style.newIcon} />
              )}
            </View>
          </>
        )
      } else {
        if (isFocused) {
          return <Image style={_style.iconSize} source={ICON.robyOn} />;
        } else {
          return <Image style={_style.iconSize} source={ICON.roby} />;
        }
      };
    }
    case 'Storage': {
      return (
        <>
          <View>
            <Image style={_style.iconSize} source={isFocused ? ICON.storageOn : ICON.storage} />

            {isEmptyData(memberBase?.new_match_cnt) && memberBase?.new_match_cnt > 0 && (
              <View style={_style.newIcon} />
            )}

            {isEmptyData(memberBase?.storageRecMsgCd) && (
              <Animated.View style={[_style.storageLimitArea, storageDescStyle]}>

                {memberBase?.storageRecMsgCd == 'STR_REC_01' && (  
                  <View style={_style.storageLimitTextArea(130)}><Text style={_style.storageText}>인증 레벨 30의 그 분이 등장 🤩</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_02' && (
                  <View style={_style.storageLimitTextArea(195)}><Text style={_style.storageText}>리미티드가 드리는 절대 추천! 꼭 확인해 보세요 😍</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_03' && (
                  <View style={_style.storageLimitTextArea(160)}><Text style={_style.storageText}>럭셔리차 소유자분이 관심을 보내셨어요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_04' && (
                  <View style={_style.storageLimitTextArea(160)}><Text style={_style.storageText}>인기 많은 SNS 셀럽이 관심을 보내셨어요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_05' && (
                  <View style={_style.storageLimitTextArea(170)}><Text style={_style.storageText}>억대 자산가님이 황금빛 관심을 보내셨어요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_06' && (
                  <View style={_style.storageLimitTextArea(160)}><Text style={_style.storageText}>억대연봉 능력자님이 관심을 보내셨어요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_07' && (
                  <View style={_style.storageLimitTextArea(160)}><Text style={_style.storageText}>뇌가 섹시한 분이 보낸 관심은 어떠세요?</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_08' && (
                  <View style={_style.storageLimitTextArea(190)}><Text style={_style.storageText}>전문성이 남다른 분에게 온 관심을 확인해 보세요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_09' && (
                  <View style={_style.storageLimitTextArea(175)}><Text style={_style.storageText}>훈내 가득한 찐심! 이 분은 꼭 보고 가세요 💕</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_10' && (
                  <View style={_style.storageLimitTextArea(155)}><Text style={_style.storageText}>지금 온 관심은 훈훈함이 가득하단 소식!</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_11' && (
                  <View style={_style.storageLimitTextArea(170)}><Text style={_style.storageText}>프로필에 고평점을 남기고 간 사람이 있어요.</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_12' && (
                  <View style={_style.storageLimitTextArea(130)}><Text style={_style.storageText}>새 찐심 도착! 과연 누구일까요?</Text></View>
                )}
                {memberBase?.storageRecMsgCd == 'STR_REC_13' && (
                  <View style={_style.storageLimitTextArea(140)}><Text style={_style.storageText}>누군가 내 프로필을 보고 있어요.</Text></View>
                )}

                {/* <View style={_style.storageLimitTextArea(205)}><Text style={_style.storageText}>아직 열어보지 못 한 관심 5 / 10 / 15 / 30개가 있어요.</Text></View> */}

                <View style={_style.storageTriangle}></View>
              </Animated.View>
            )}
          </View>
        </>
      );
    }
    case 'Message': {
      return (
        <>
          {isFocused ? <Image style={_style.iconSize} source={ICON.mailboxOn} /> : 
            <Image style={_style.iconSize} source={ICON.mailbox} />
          }

          {memberBase?.msg_cnt != null && typeof memberBase?.msg_cnt != 'undefined' && memberBase?.msg_cnt > 0 &&
            <View style={_style.iconArea}><Text style={_style.countText}>{memberBase?.msg_cnt}</Text></View>
          }
        </>
      );
    }
    case 'Cashshop': {
      return (
        <>
          <View style={{width:28}}>
            {isFocused ? <Image style={_style.iconSize} source={ICON.cashshopOn} /> :
              <Image style={_style.iconSize} source={ICON.cashshop} />
            }

            {(memberBase?.gender == 'M' && memberBase?.new_item_cnt != null && typeof memberBase?.new_item_cnt != 'undefined' && memberBase?.new_item_cnt > 0) &&
              <View style={_style.shopIconArea}><Text style={_style.newText}>NEW</Text></View>
            }
            {memberBase?.gender == 'W' && (
              <>
                <Animated.View style={[_style.shopLimitArea, shopDescStyle]}>
                  <View style={_style.shopLimitTextArea}>
                    <SpaceView><Text style={_style.limitText}><Image style={{width: 10, height: 7}} source={ICON.crown} /> {CommaFormat(memberBase?.mileage_point)}리밋 보유 중!</Text></SpaceView>
                    <SpaceView mb={1}><Text style={_style.limitText}>리밋샵 바로가기</Text></SpaceView>
                  </View>
                  <View style={_style.triangle}></View>
                </Animated.View>
              </>
            )}
          </View>
        </>
      )
    }
    default:
      return <Image style={_style.iconSize} source={ICON.roby} />;
  }
};

export default TabIcon;

const _style = StyleSheet.create({
  iconSize: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  imgSize: (isOn: boolean) => {
    return {
      width: 28,
      height: 28,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: isOn ? '#7C79E7' : '#707070',
      overflow: 'hidden',
    };
  },
  iconArea: {
    position: 'absolute',
    top: -3,
    right: 25,
  },
  countText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#fff',
    borderRadius: 9,
    width: 28,
    textAlign: 'center',
    paddingVertical: 1,
    overflow: 'hidden',
  },
  shopIconArea: {
    position: 'absolute',
    top: -2,
    right: -21,
  },
  shopLimitArea: {
    position: 'absolute',
    top: -39,
    right: -32,
    alignItems: 'flex-end',
    opacity: 0,
    flex: 1,
  },
  shopLimitTextArea: {
    backgroundColor: '#7F67FF',
    borderRadius: 3,
    //overflow: 'hidden',
    minWidth: 99,
    paddingVertical: 3,
    paddingLeft: Platform.OS == 'android' ?  0 : 5,
    
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#fff',
    borderRadius: 9,
    //paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
    width: 34,
    textAlign: 'center',
  },
  limitText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 9,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  triangle: {
    marginTop: -1,
    marginRight: 40,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#7F67FF',
    transform: [{ rotate: '180deg' }],
  },
  newIcon: {
		position: 'absolute',
		top: -3,
		right: -5,
		width: 8,
		height: 8,
		backgroundColor: '#FF7E8C',
		borderRadius: 30,
	},
  storageLimitArea: {
    position: 'absolute',
    top: -38,
    left: -50,
    alignItems: 'flex-start',
    opacity: 0,
  },
  storageLimitTextArea: (width: number) => {
    return {
      backgroundColor: '#7F67FF',
      borderRadius: 3,
      overflow: 'hidden',
      width: width,
      paddingVertical: 8,
    };
  },
  storageTriangle: {
    marginTop: -1,
    marginLeft: 58,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#7F67FF',
    transform: [{ rotate: '180deg' }],
  },
  storageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 9,
    color: '#FFF',
    textAlign: 'center',
  },


});