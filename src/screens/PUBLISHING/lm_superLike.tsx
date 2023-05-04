import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';
import Carousel from 'react-native-snap-carousel';
const { width } = Dimensions.get('window');
export const lm_superLike = () => {
  const ref = useRef(null);

  const onPressPrev = () => {
    ref?.current?.snapToPrev();
  };
  const onPressNext = () => {
    ref?.current?.snapToNext();
  };
  return (
    <Modal isVisible>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>레벨 선택</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.infoText}>
              찐심을 보내는데 사용할 로얄패스를 선택해주세요
            </Text>

            <View
              style={{
                width: '95%',
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={onPressPrev}>
                <Image source={ICON.back} style={styles.arrowIcon} />
              </TouchableOpacity>
              <View style={styles.swiperWrapper}>
                <Carousel
                  ref={ref}
                  data={['pass', 'pass']}
                  renderItem={() => (
                    <View style={styles.passStyle}>
                      <Image
                        source={ICON.passIconNew}
                        style={styles.passIcon}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  sliderWidth={width * 0.6}
                  itemWidth={width * 0.6}
                />
              </View>
              <TouchableOpacity onPress={onPressNext}>
                <Image source={ICON.arrow_right} style={styles.arrowIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBox}>
              <TouchableOpacity style={styles.leftButton}>
                <Text style={styles.leftButtonText}>취소 할래요!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rightButton}>
                <Text style={styles.rightButtonText}>찐심 보내기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 248,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    // borderStyle: 'solid',
    // borderWidth: 1,
    borderColor: '#ededed',
  },
  titleBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    height: 35,
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#676767',
  },
  body: {
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: 'space-between',
    height: 213,
  },
  infoText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646464',
    marginTop: 25,
  },
  bottomBox: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  leftButton: {
    width: '50%',
    height: 49,
    borderBottomLeftRadius: 5,
    backgroundColor: '#d6d3d3',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  leftButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  rightButton: {
    width: '50%',
    height: 49,
    borderBottomEndRadius: 5,
    backgroundColor: '#697ae6',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  rightButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  swiperWrapper: {
    height: 100,
    width: '60%',
    alignItems: `center`,
    justifyContent: `center`,
  },
  passStyle: {
    flex: 1,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  passIcon: {
    width: 90,
    height: 50,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
