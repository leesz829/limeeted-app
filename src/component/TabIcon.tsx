import { View, Image, StyleSheet, Text } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as React from 'react';
import { useProfileImg } from 'hooks/useProfileImg';
import { useUserInfo } from 'hooks/useUserInfo';

const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
  const memberBase = useUserInfo();

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
          {memberBase?.new_item_cnt != null && typeof memberBase?.new_item_cnt != 'undefined' && memberBase?.new_item_cnt > 0 &&
            <View style={_style.shopIconArea}><Text style={_style.newText}>NEW</Text></View>
          } 
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
    top: -7,
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
    top: -7,
    right: 16,
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
  }
});
