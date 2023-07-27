import { View, Image, StyleSheet, Text, Animated } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommaFormat } from 'utils/functions';


const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
  const memberBase = useUserInfo();

  const fadeAnim = new Animated.Value(1);

  const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // 깜빡임이 서서히 사라지는 데 걸리는 시간 (1초)
        delay: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // 깜빡임이 서서히 나타나는 데 걸리는 시간 (1초)
        delay: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => fadeInOut());
  };

  /* React.useEffect(() => {
    fadeInOut();
  }, []); */

  fadeInOut();

  switch (name) {
    case 'Roby': {
      const mbrProfileImgList = useProfileImg();
      const masterProfileImg = mbrProfileImgList.filter((e, i) => i == 0);

      if(masterProfileImg.length > 0) {
        if (isFocused) {
          return <Image style={_style.imgSize(true)} source={findSourcePath(masterProfileImg[0].img_file_path)} />;
        } else {
          return <Image style={_style.imgSize(false)} source={findSourcePath(masterProfileImg[0].img_file_path)} />;
        }
      } else {
        if (isFocused) {
          return <Image style={style.iconSize} source={ICON.robyOn} />;
        } else {
          return <Image style={style.iconSize} source={ICON.roby} />;
        }
      }
    }
    case 'Storage': {
      if (isFocused) {
        return <Image style={_style.iconSize} source={ICON.storageOn} />;
      } else {
        return <Image style={_style.iconSize} source={ICON.storage} />;
      }
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
          {isFocused ? <Image style={_style.iconSize} source={ICON.cashshopOn} /> :
            <Image style={_style.iconSize} source={ICON.cashshop} />
          }
          {(memberBase.gender == 'M' && memberBase?.new_item_cnt != null && typeof memberBase?.new_item_cnt != 'undefined' && memberBase?.new_item_cnt > 0) &&
            <View style={_style.shopIconArea}><Text style={_style.newText}>NEW</Text></View>
          }
          {memberBase.gender == 'W' && (
            <>
              <Animated.View style={[_style.shopLimitArea, { opacity: fadeAnim }]}>
                <Text style={_style.limitText}>{CommaFormat(memberBase.mileage_point)}리밋 보유 중!{'\n'}리밋샵에 획득 가능한 상품이 있어요</Text>
                <View style={_style.triangle}></View>
              </Animated.View>
            </>
          )}
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
    top: -3,
    right: 16,
  },
  shopLimitArea: {
    position: 'absolute',
    top: -33,
    right: 7,
    alignItems: 'flex-end',
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#fff',
    borderRadius: 9,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  limitText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 8,
    color: '#FFF',
    backgroundColor: '#7F67FF',
    borderRadius: 3,
    textAlign: 'center',
    width: 120,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  triangle: {
    marginTop: -1,
    marginRight: 36,
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
});
