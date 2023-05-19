import { View, Image, StyleSheet } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';

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
      if (isFocused) {
        return <Image style={_style.iconSize} source={ICON.mailboxOn} />;
      } else {
        return <Image style={_style.iconSize} source={ICON.mailbox} />;
      }
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
});
