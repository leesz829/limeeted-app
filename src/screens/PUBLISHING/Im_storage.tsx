import CommonHeader from 'component/CommonHeader';
import { Wallet } from 'component/TopNavigation';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';

import { StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export const Im_storage = () => {
  return (
    <View style={styles.root}>
      <CommonHeader title="보관함" right={<Wallet theme />} />
      <ScrollView>
        <View style={{ padding: 24 }}>
          <Text style={styles.title}>방배동 아이유님의 찜 목록</Text>
        </View>
        <View style={styles.imageWarpper}>
          {['', '', '', '', ''].map((item, index) => (
            <RenderItem item={item} index={index} />
          ))}
        </View>

        <TouchableOpacity style={styles.moreContainer}>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
        <View style={{ paddingHorizontal: 21 }}>
          <MenuButton
            title={'나에게 관심있는 이성'}
            onPress={() => {}}
            badgeColor={'#ff7e8c'}
            count={36}
          />
          <MenuButton
            title={'찐심만 보기'}
            onPress={() => {}}
            badgeColor={'#697ae6'}
            count={36}
          />
          <MenuButton
            title={'내가 보낸 관심'}
            onPress={() => {}}
            badgeColor={'#8669e6'}
            count={36}
          />
          <MenuButton
            title={'매칭 성공한 이성'}
            onPress={() => {}}
            badgeColor={'#69c9e6'}
            count={36}
          />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

function RenderItem({ item, index }) {
  if (index > 3) return null;
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
        <Text style={styles.RenderItemBottomTextSpec}>엔지니어 180cm</Text>
      </View>
    </ImageBackground>
  );
}

function MenuButton({ title, count, onPress, badgeColor }) {
  return (
    <TouchableOpacity style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{title}</Text>
      <View style={styles.row}>
        <View
          style={[
            styles.badgeStyles,
            { backgroundColor: badgeColor || '#ff7e8c' },
          ]}
        >
          <Text style={styles.badgeText}>{count}</Text>
        </View>
        <Image source={ICON.arrow_right} style={styles.iconSize} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  imageWarpper: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 21,
  },
  moreContainer: {
    width: `100%`,
    height: 50,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  moreText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#a8a8a8',
    textDecorationLine: 'underline',
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
  RenderItemBottomTextSpec: {
    opacity: 0.86,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  buttonContainer: {
    height: 62,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebe9ef',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 11,
  },
  buttonText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646467',
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  badgeStyles: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
    textAlign: 'center',
  },
  badgeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  iconSize: {
    width: 8.4,
    height: 15.3,
    resizeMode: 'contain',
  },
});
