import * as React from 'react';
import { Image, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';

export const MatchSearch = () => {
  return (
    <>
      <TopNavigation currentPath={'LIMEETED'} />

      <View
        style={[
          layoutStyle.alignCenter,
          layoutStyle.justifyCenter,
          layoutStyle.flex1,
          styles.whiteBack,
        ]}
      >
        <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
          <Image source={ICON.search} style={styles.iconSize48} />
        </SpaceView>
        <View style={layoutStyle.alignCenter}>
          <CommonText type={'h4'}>다음 매칭 회원을 찾고 있어요.</CommonText>
        </View>
      </View>
    </>
  );
};
