import { styles } from 'assets/styles/Styles';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { ICON } from 'utils/imageUtils';
import type { FC, useState, useEffect } from 'react';
import { CommonText } from 'component/CommonText';
import { ColorType } from '@types';
import { usePopup } from 'Context';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';



interface Action {
  title: string;
  type: 'library';
  options: ImageLibraryOptions;
}

interface Props {
  isAuth?: boolean;
  callbackFn: (
    uri: any,
    base64: string
  ) => void;
  uriParam?: string;
  plusBtnType?: string;
  auth_status?: string;
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
      //console.log('image ::::::: ' , image);
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
      <TouchableOpacity
        onPress={onButtonPress}
        style={props.isAuth ? styles.tempBoxAuth : styles.tempBoxBase} >

        {imgPath != '' ? (
          <>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={styles.tempBoxBase}
              source={{ imgPath }}
            />

            <View style={styles.disabled}>
              <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
            </View>
          </>
        ) : props.uriParam != null && props.uriParam != '' ? (
          <>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={styles.tempBoxBase}
              key={props.uriParam}
              source={props.uriParam}
            />

            {props.isAuth && 
              <View style={styles.disabled}>
                {props.auth_status == 'PROGRESS' ? (
                  <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                ) : props.auth_status == 'REFUSE' && (
                  <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                )}
              </View>
            }
          </>
        ) : (
          <Image source={props.plusBtnType == '02' ? ICON.plus2 : ICON.plus_primary} style={styles.boxPlusIcon} />
        )}

      </TouchableOpacity>
    </>
  );
};



const _styles = StyleSheet.create({

})