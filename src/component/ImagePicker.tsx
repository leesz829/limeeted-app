import { styles } from 'assets/styles/Styles';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { ICON } from 'utils/imageUtils';
import type { FC, useState, useEffect } from 'react';

interface Action {
  title: string;
  type: 'library';
  options: ImageLibraryOptions;
}

interface Props {
  isBig: boolean;
  callbackFn: (
    uri: any,
    base64: string
  ) => void;
  uriParam?: string;
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
    <TouchableOpacity
      onPress={onButtonPress}
      style={props.isBig ? styles.tempBoxBig : styles.tempBoxSmall}
    >
      {response?.assets ? (
        response?.assets.map(({ uri }: { uri: any }) => (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={props.isBig ? styles.tempBoxBig : styles.tempBoxSmall}
            key={uri}
            source={{ uri }}
            
          />
        ))
      ) : props.uriParam != null && props.uriParam != '' ? (
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          style={props.isBig ? styles.tempBoxBig : styles.tempBoxSmall}
          key={props.uriParam}
          source={props.uriParam}
        />
      ) : (
        <Image source={ICON.purplePlus} style={styles.boxPlusIcon} />
      )}
    </TouchableOpacity>
  );
};
