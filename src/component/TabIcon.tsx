import { View, Image, StyleSheet, Text } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';
import { useUserInfo } from 'hooks/useUserInfo';

const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
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
    case 'Cashshop': {
      if (isFocused) {
        return <Image style={_style.iconSize} source={ICON.cashshopOn} />;
      } else {
        return <Image style={_style.iconSize} source={ICON.cashshop} />;
      }
    }
    case 'Message': {
      const memberBase = useUserInfo();

      return (
        <>
          {
            isFocused ? <Image style={_style.iconSize} source={ICON.mailboxOn} /> : 
            <Image style={_style.iconSize} source={ICON.mailbox} />
          }
          {memberBase?.msg_cnt != null && typeof memberBase?.msg_cnt != 'undefined' && memberBase?.msg_cnt > 0 &&
            <View style={_style.iconArea}><Text style={_style.newText}>{memberBase?.msg_cnt}</Text></View>
          }
        </>
      );
    }
    case 'Storage': {
      if (isFocused) {
        return <Image style={_style.iconSize} source={ICON.storageOn} />;
      } else {
        return <Image style={_style.iconSize} source={ICON.storage} />;
      }
    }
    default:
      return <Image style={_style.iconSize} source={ICON.roby} />;
  }
};

export default TabIcon;

const _style = StyleSheet.create({
  iconSize: {
    width: 24,
    height: 24,
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
    top: -7,
    right: 23,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 1,
  }
});
