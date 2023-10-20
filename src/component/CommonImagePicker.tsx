import { styles } from 'assets/styles/Styles';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, TouchableOpacity, StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import type { FC, useState, useEffect } from 'react';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import { usePopup } from 'Context';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import { isEmptyData } from 'utils/functions';



interface Action {
  title: string;
  type: 'library';
  options: ImageLibraryOptions;
}

interface Props {
  type?: string;
  isAuth?: boolean;
  callbackFn: (
    uri: any,
    base64: string
  ) => void;
  uriParam?: string;
  plusBtnType?: string;
  auth_status?: string;
  imgWidth?: number;
  imgHeight?: number;
  borderRadius?: number;
  iconSize?: number;
}

const includeExtra = true;
const options: Action = {
  title: '이미지를 선택해 주세요.',
  type: 'library',
  options: {
    //maxHeight: 200,
    //maxWidth: 200,
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: true,
    includeExtra,
  },
};

const { width, height } = Dimensions.get('window');

export const CommonImagePicker: FC<Props> = (props) => {
  const { show } = usePopup();  // 공통 팝업

  const [response, setResponse] = React.useState<any>(null);
  const onButtonPress = React.useCallback(() => {
    imagePickerProc();
  }, []);

  const [imgPath, setImgPath] = React.useState('');

  // 이미지 편집
  const imagePickerProc = async () => {
    ImagePicker.openPicker({
      width: 800,
      height: 1000,
      cropping: true,
      //cropperActiveWidgetColor: '#8E9AEB',  // widget 색상
      cropperToolbarTitle: '사진 편집',
      showCropGuidelines: false,
      hideBottomControls: true,
      includeBase64: true,
      mediaType: "photo",
      //smartAlbums: 'UserLibrary',
    }).then(image => {
      //console.log('image ::::::: ' , image.path);
      setImgPath(image.path);

      props.callbackFn(
        image.path,
        image.data
      );

    }).catch(
      console.log
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setImgPath('');
      };
    }, []),
  ); 

  return (
    <>
      {(isEmptyData(props.type) && props.type == 'STORY') ? (

        <TouchableOpacity onPress={onButtonPress} style={_styles.imgBoxBase(props.imgWidth, props.imgHeight, props.borderRadius)}>
          {imgPath != '' ? (
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={_styles.imgBoxBase(props.imgWidth, props.imgHeight, props.borderRadius)}
              source={isEmptyData(props.uriParam) ? props.uriParam : {uri : imgPath}}
            />
          ) : (
            <>
              {isEmptyData(props.uriParam) ? (
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imgBoxBase(props.imgWidth, props.imgHeight, props.borderRadius)}
                  key={props.uriParam}
                  source={props.uriParam}
                />
              ) : (
                <Image 
                  source={props.plusBtnType == '02' ? ICON.plus2 : ICON.plus_primary} 
                  style={styles.iconSquareSize(isEmptyData(props.iconSize) ? props.iconSize : (width - 100) / 13)} />
              )}
            </>
          )}
        </TouchableOpacity>

      ) : (

        <TouchableOpacity onPress={onButtonPress} style={props.isAuth ? _styles.tempBoxAuth : _styles.tempBoxBase} >

          {imgPath != '' ? (
            <>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={_styles.tempBoxBase}
                source={{uri : imgPath}}
              />

              <View style={_styles.imgDisabled}>
                <Text style={[_styles.profileImageDimText('PROGRESS')]}>심사중</Text>
              </View>
            </>
          ) : isEmptyData(props.uriParam) ? (
            <>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={_styles.tempBoxBase}
                key={props.uriParam}
                source={props.uriParam}
              />

              {props.isAuth && 
                <View style={_styles.imgDisabled}>
                  <Text style={[_styles.profileImageDimText(props.auth_status)]}>{props.auth_status == 'PROGRESS' ? '심사중' : '반려'}</Text>
                </View>
              }
            </>
          ) : (
            <Image source={props.plusBtnType == '02' ? ICON.plus2 : ICON.plus_primary} style={styles.boxPlusIcon} />
          )}

        </TouchableOpacity>
      )}
    </>
  );
};



const _styles = StyleSheet.create({
  imgBoxBase: (imgWidth: number, imgHeight: number, borderRadius: number) => {
    return {
      width: isEmptyData(imgWidth) ? imgWidth : (width - 160) / 2,
      height: isEmptyData(imgHeight) ? imgHeight : (width - 160) / 2,
      borderRadius: isEmptyData(borderRadius) ? borderRadius : 20,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };
  },
  profileImageDimText: (status: string) => {
    return {
      width: '100%',
      backgroundColor: '#000',
      textAlign: 'center',
      paddingVertical: 3,
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 12,
      color: status == 'REFUSE' ? ColorType.redF20456 : '#fff',
    };
  },
  tempBoxAuth: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    //borderWidth: 1,
    borderRadius: 20,
    borderColor: '#C7C7C7',
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tempBoxBase: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgDisabled: {
    position: 'absolute',
    top: 0,    
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
})