import { styles } from 'assets/styles/Styles';
import React from 'react';
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




export const ImagePicker: FC<Props> = (props) => {
  const { show } = usePopup();  // 공통 팝업

  const [response, setResponse] = React.useState<any>(null);
  const onButtonPress = React.useCallback(() => {
    //launchImageLibrary(options, setResponse);
    launchImageLibrary(options.options, setResponse);
  }, []);

  React.useEffect(() => {
    if (null != response && !response.didCancel) {
      if(response?.errorCode == "permission") {
        show({
          content: '프로필 사진 및 인증 자료 업로드를 위해\n사진첩에 접근 허용이 필요합니다.\n업로드 된 사진은 외부에 유출되지 않습니다.' ,
          confirmCallback: function() {}
        });
      } else {

        if(props.isAuth){
          props.callbackFn(
            response?.assets[0].uri,
            response?.assets[0].base64
          );
          return;
        }

        ImageResizer.createResizedImage(
          response?.assets[0].uri,
          800,
          1200,
          'PNG',
          100,
          undefined,
          undefined,
        )
        .then(res => {
          RNFS.readFile( res.uri, 'base64')
          .then(base64res => {
            props.callbackFn(
              res.uri,
              base64res
            );
          });
        })
        .catch(err => {
          props.callbackFn(
            response?.assets[0].uri,
            response?.assets[0].base64
          );
        });
      }
    }
  }, [response]);

  return (
    <>
      <TouchableOpacity
        onPress={onButtonPress}
        style={props.isAuth ? styles.tempBoxAuth : styles.tempBoxBase} >

        {response?.assets ? (
          <>
            {response?.assets.map(({ uri }: { uri: any }) => (
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.tempBoxBase}
                key={uri}
                source={{ uri }}
              />
            ))}

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
                <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
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