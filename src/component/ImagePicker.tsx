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
  const [response, setResponse] = React.useState<any>(null);
  const onButtonPress = React.useCallback(() => {
    //launchImageLibrary(options, setResponse);
    launchImageLibrary(options.options, setResponse);
  }, []);

  React.useEffect(() => {
    if (null != response && !response.didCancel) {
      props.callbackFn(
        response?.assets[0].uri,
        response?.assets[0].base64
      );
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
              {/* <CommonText fontWeight={'700'} type={'h5'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mt10, commonStyle.mr10]}>심사중</CommonText> */}
              <CommonText fontWeight={'700'} type={'h5'} color={ColorType.gray8888} textStyle={{textAlign: 'right', marginTop: 10, marginRight: 10}}>심사중</CommonText>
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
                <CommonText fontWeight={'700'} type={'h5'} color={ColorType.gray8888} textStyle={{textAlign: 'right', marginTop: 10, marginRight: 10}}>심사중</CommonText>
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