import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import {
  View,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import Image from 'react-native-fast-image';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';

const { width } = Dimensions.get('window');
export const Im_live = () => {
  const [page, setPage] = useState(0);
  const data = ['', '', '', ''];

  const onChangePage = (e) => {
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setPage(pageNum);
  };

  return (
    <View style={styles.root}>
      <TopNavigation />
      <ScrollView style={styles.root}>
        <View style={styles.indocatorContainer}>
          {data.map((e, index) => (
            <View
              style={[
                styles.indicator,
                { backgroundColor: index === page ? 'white' : '#000000' },
              ]}
            />
          ))}
          <Image style={styles.badgeIcon} />
        </View>

        <FlatList
          data={data}
          horizontal={true}
          alwaysBounceVertical={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onScroll={onChangePage}
          renderItem={({ item, index }) => (
            <Image style={styles.image}>
              <View style={styles.imageBottonContainer}>
                <View style={styles.authContainer}>
                  <Text style={styles.authText}>인증완료</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.nickname}>방배동 아이유, 29</Text>
                  {/* <Image source={ICON.checkICon} style={styles.authIcon} /> */}
                </View>
                <View style={styles.locationContainer}>
                  <Image source={ICON.marker} style={styles.markerIcon} />
                  <Text style={styles.locationText}>경기도 수원시 12.9Km</Text>
                </View>
              </View>
            </Image>
          )}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>인상을 선택해주세요.</Text>
          <View style={styles.tagContainer}>
            {[
              dummy.map((e) => (
                <View style={styles.tagBox}>
                  <Text style={styles.tagText}>{e}</Text>
                </View>
              )),
            ]}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  indocatorContainer: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    position: 'absolute',
    zIndex: 10,
    top: 20,
  },
  indicator: {
    width: 18,
    height: 2,
    marginHorizontal: 2,
  },
  badgeIcon: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    position: 'absolute',
    top: -6,
    right: 8,
    borderRadius: 19,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageBottonContainer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
  authContainer: {
    width: 48,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    paddingVertical: 3,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  authText: {
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  nickname: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#ffffff',
  },
  authIcon: {
    width: 15,
    height: 15,
    marginLeft: 3,
  },
  locationContainer: {
    marginTop: 7,
    flexDirection: `row`,
    alignItems: `center`,
  },
  markerIcon: {
    width: 13,
    height: 17.3,
  },
  locationText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 6,
  },
  infoContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  infoTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginLeft: 7,
  },
  tagContainer: {
    flexWrap: 'wrap',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  tagBox: {
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#b7b7b9',
    marginLeft: 7,
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b1b1b1',
  },
});

const dummy = [
  '웃는게 이뻐요',
  '눈이 이뻐요',
  '보조개가 있어요',
  '청순미',
  '몸매가 좋아요',
  '몸매가 좋아요',
  '분위기가 좋아요',
  '귀여워요',
  '섹시한',
  '코가 높아요',
  '웃는게 이뻐요',
  '눈이 이뻐요',
];
