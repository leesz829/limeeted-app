import * as React from 'react';
import { Image, View } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON, GIF_IMG, IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { useNavigation, useRoute } from '@react-navigation/native';

export const MatchSearch = ( data ) => {
  const route = useRoute();

  return (
    <>
      <TopNavigation currentPath={'LIMEETED'} />

      {data.isEmpty ? (
        <View
          style={[
            layoutStyle.alignCenter,
            layoutStyle.justifyCenter,
            layoutStyle.flex1,
            styles.whiteBack,
          ]}>
          <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
            <Image source={IMAGE.logoMark} style={styles.iconSize48} />
          </SpaceView>
          <View style={[layoutStyle.alignCenter]}>
            <CommonText type={'h4'} textStyle={[layoutStyle.textCenter, commonStyle.fontSize16, commonStyle.lineHeight23]}>
              오늘 소개해드릴 데일리뷰가 마감되었어요.{"\n"}
              데일리뷰에서 제공해드릴 프로필 카드는 {"\n"}운영 정책에 따라 늘려 나갈 예정이니 기대해주세요.
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
          ]}>
          <SpaceView mb={20} viewStyle={layoutStyle.alignCenter}>
            {/* <Image source={GIF_IMG.faceScan} style={styles.iconSize48} /> */}
            <Image source={IMAGE.logoMark} style={styles.iconSize48} />
          </SpaceView>
          <View style={layoutStyle.alignCenter}>
            <CommonText type={'h4'}>다음 매칭 회원을 찾고 있어요.</CommonText>
          </View>
        </View>
      )}

      
    </>
  );
};
