import { View, Image, StyleSheet, Text, Platform } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommaFormat, isEmptyData } from 'utils/functions';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withDelay, Easing, withRepeat, withSequence } from 'react-native-reanimated';


const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
  const memberBase = useUserInfo();

  //const fadeAnim = new Animated.Value(1);

  //const [isAnimating, setIsAnimating] = React.useState(false);

  /* const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700, // 깜빡임이 서서히 사라지는 데 걸리는 시간 (1초)
        delay: 2500,
        //easing: '',

        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700, // 깜빡임이 서서히 나타나는 데 걸리는 시간 (1초)
        delay: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => fadeInOut());
  }; */

  const shopDescOpacity = useSharedValue(0);
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

  const shopDescStyle = useAnimatedStyle(() => {
    return {
      opacity: shopDescOpacity.value
    };
  });

  if(name == 'Cashshop') {
    //fadeInOut();
    shopDescAnimate();
  }

  switch (name) {
    case 'Roby': {
      const mbrProfileImgList = useProfileImg();
      const masterProfileImg = mbrProfileImgList.filter((e, i) => i == 0);

      if(masterProfileImg.length > 0) {
        return (
          <>
            <View>
              <Image style={_style.imgSize(isFocused)} source={findSourcePath(masterProfileImg[0].img_file_path)} />

              {isEmptyData(memberBase.new_board_cnt) && memberBase.new_board_cnt > 0 && (
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

            {isEmptyData(memberBase.new_match_cnt) && memberBase.new_match_cnt > 0 && (
              <View style={_style.newIcon} />
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

            {(memberBase.gender == 'M' && memberBase?.new_item_cnt != null && typeof memberBase?.new_item_cnt != 'undefined' && memberBase?.new_item_cnt > 0) &&
              <View style={_style.shopIconArea}><Text style={_style.newText}>NEW</Text></View>
            }
            {memberBase.gender == 'W' && (
              <>
                {/* <Animated.View style={[_style.shopLimitArea, { opacity: fadeAnim }]}>
                  <Text style={_style.limitText}><Image style={{width: 10, height: 7, position: 'absolute', top: 5, left: 7, zIndex: 1}} source={ICON.crown} /> {CommaFormat(memberBase.mileage_point)}리밋 보유 중!{'\n'}리밋샵 바로가기</Text>
                  <View style={_style.triangle}></View>
                </Animated.View> */}

                <Animated.View style={[_style.shopLimitArea, shopDescStyle]}>
                  <View style={_style.shopLimitTextArea}>
                    <Text style={_style.limitText}><Image style={{width: 10, height: 7}} source={ICON.crown} /> {CommaFormat(memberBase.mileage_point)}리밋 보유 중!{'\n'}리밋샵 바로가기</Text>
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
  },
  shopLimitTextArea: {
    backgroundColor: '#7F67FF',
    borderRadius: 3,
    overflow: 'hidden',
    width: 103,
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
    fontSize: 10,
    color: '#FFF',
    textAlign: 'center',
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
});
