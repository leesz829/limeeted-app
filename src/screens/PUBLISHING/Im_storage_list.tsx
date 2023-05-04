import CommonHeader from 'component/CommonHeader';
import { Wallet } from 'component/TopNavigation';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';

import { Color } from 'assets/styles/Color';
import { StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import ToggleSwitch from 'toggle-switch-react-native';
const { width } = Dimensions.get('window');
interface Props {
  navigation: any;
  route: any;
}

const tabs = [
  {
    title: '찜 목록',
  },
  {
    title: '내가 받은 관심',
  },
  {
    title: '내가 보낸 관심',
  },
  {
    title: '성공 매칭',
  },
];
export const Im_storage_list = (props: Props) => {
  const { route } = props;

  const params = route.params;
  const pageIndex = params?.pageIndex || 0;
  const ref = useRef();
  const [currentIndex, setCurrentIndex] = useState(pageIndex);

  return (
    <View style={styles.root}>
      <CommonHeader title={tabs[currentIndex].title} right={<Wallet theme />} />
      <View style={styles.topContainer}>
        <View style={styles.dotContainer}>
          {tabs.map((_, index) => (
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? '#697ae6' : '#e2e2e2',
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.row}>
          <Text style={styles.showText}>찐심만 보기</Text>
          <ToggleSwitch
            isOn={true}
            onColor={Color.primary}
            offColor={Color.grayDDDD}
            size="small"
            onToggle={(isOn) => console.log(isOn)}
            trackOffStyle={{ width: 45, height: 25 }}
          />
        </View>
      </View>
      <Carousel
        ref={ref}
        data={tabs}
        firstItem={pageIndex}
        onSnapToItem={setCurrentIndex}
        renderItem={() => (
          <ScrollView>
            <View style={styles.imageWarpper}>
              {['', '', '', '', ''].map((item, index) => (
                <RenderItem item={item} index={index} />
              ))}
            </View>

            <View style={{ height: 50 }} />
          </ScrollView>
        )}
        sliderWidth={width}
        itemWidth={width}
      />
    </View>
  );
};

function RenderItem({ item, index }) {
  return (
    <ImageBackground source={''} style={styles.renderItemContainer}>
      <View style={styles.renderItemTopContainer}>
        <Image
          style={styles.renderItemTopIcon}
          source={true ? ICON.passIconNew : ICON.royalPassIconNew}
          resizeMode={'contain'}
        />

        <Text style={styles.renderItemTopText}>7일 남음</Text>
      </View>
      <View style={styles.renderItemBottomContainer}>
        <Text style={styles.renderItemBottomTextName}>재훈, 35</Text>
        <Text style={styles.renderItemBottomTextSpec}>엔지니어 180cm</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    width: `100%`,
    height: 50,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  dotContainer: {
    width: 60,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  dot: {
    width: 9,
    height: 9,
    backgroundColor: '#e2e2e2',
    borderRadius: 5,
  },
  row: { flexDirection: `row`, alignItems: `center`, justifyContent: `center` },
  showText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginRight: 8,
  },
  imageWarpper: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 21,
  },

  renderItemContainer: {
    width: (width - 54) / 2,
    height: (width - 54) / 2,
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebe9ef',
  },
  renderItemTopContainer: {
    position: 'absolute',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    left: 10,
    top: 10,
  },
  renderItemTopIcon: {
    width: 20,
    height: 20,
    marginRight: 1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  renderItemTopText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 3,
  },
  renderItemBottomContainer: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: `center`,
    left: 10,
    bottom: 10,
  },
  renderItemBottomTextName: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginTop: 2,
  },
  renderItemBottomTextSpec: {
    opacity: 0.86,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});