import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, View } from 'react-native';
import { ICON, GIF_IMG } from 'utils/imageUtils';

export const LiveSearch = () => {
  return (
    <>
      <TopNavigation currentPath={'LIVE'} />

      <View
        style={[
          layoutStyle.alignCenter,
          layoutStyle.justifyCenter,
          layoutStyle.flex1,
          styles.whiteBack,
        ]}
      >
        <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
          <Image source={GIF_IMG.faceScan} style={styles.iconSize48} />
        </SpaceView>

        <View style={layoutStyle.alignCenter}>
          <CommonText type={'h4'}>다음 회원을 찾고 있어요.</CommonText>
        </View>
      </View>
    </>
  );
};
