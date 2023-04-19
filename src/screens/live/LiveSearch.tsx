import { useEffect, useRef, useState } from 'react';
import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, View } from 'react-native';
import { ICON, GIF_IMG, IMAGE } from 'utils/imageUtils';

export const LiveSearch = ( data ) => {
  const [isEmpty, setIsEmpty] = useState(data?.isEmpty);

  return (
    <>
      <TopNavigation currentPath={'LIVE'} />

      {isEmpty ? (
        <View
          style={[
            layoutStyle.alignCenter,
            layoutStyle.justifyCenter,
            layoutStyle.flex1,
            styles.whiteBack,
          ]}
        >
          <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
            <Image source={IMAGE.logoMark} style={styles.iconSize48} />
          </SpaceView>

          <View style={layoutStyle.alignCenter}>
            <CommonText type={'h4'} textStyle={[layoutStyle.textCenter, commonStyle.fontSize16, commonStyle.lineHeight23]}>
              프로필 평가에 참여해주셔서 감사합니다.{"\n"}
              오늘은 여기까지! 내일 다시 만나요!
            </CommonText>
          </View>
        </View>
      ) : (
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
      )}
    </>
  );
};
