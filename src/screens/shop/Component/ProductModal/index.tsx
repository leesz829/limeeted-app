import { Color } from 'assets/styles/Color';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { ICON } from 'utils/imageUtils';
import ViewPager from '../ViewPager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  item: any;
}

export default function ProductModal({ isVisible, closeModal, item }: Props) {
  const { bottom } = useSafeAreaInsets();

  const images = item?.images || ['', '', ''];
  return (
    <Modal isVisible={isVisible} style={modalStyle.modal}>
      <View style={modalStyle.root}>
        <View style={modalStyle.closeContainer}>
          <TouchableOpacity onPress={closeModal}>
            <Image source={ICON.closeBlack} style={modalStyle.close} />
          </TouchableOpacity>
        </View>
        <ViewPager
          data={images}
          style={modalStyle.pagerView}
          renderItem={() => <Image style={modalStyle.itemImages} />}
        />
        <View style={modalStyle.infoContainer}>
          <Text style={modalStyle.brandText}>스타벅스</Text>
          <Text style={modalStyle.giftName}>스타벅스 1만원권</Text>
          <View style={modalStyle.rowBetween}>
            <Text style={modalStyle.inventory}>100개남음</Text>
            <View style={modalStyle.rowCenter}>
              <Text style={modalStyle.price}>10,000</Text>
              <Image source={ICON.crown} style={modalStyle.crown} />
            </View>
          </View>
          <View
            style={[
              modalStyle.bottomContainer,
              {
                marginBottom: bottom + 10,
              },
            ]}
          >
            <View style={modalStyle.rowBetween}>
              <TouchableOpacity style={modalStyle.likeButton}>
                <Image source={ICON.storage} style={modalStyle.likeImage} />
              </TouchableOpacity>
              <TouchableOpacity style={modalStyle.puchageButton}>
                <Text style={modalStyle.puchageText}>구매하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyle = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  root: {
    // flex: 1,
    width: '100%',
    minHeight: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 27,
  },
  closeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 7,
  },
  close: {
    width: 19.5,
    height: 19.5,
  },
  pagerView: {
    // flex: 1,
    width: Dimensions.get('window').width - 60,
    height: 229,
    marginTop: 28,
  },
  itemImages: {
    width: Dimensions.get('window').width - 60,
    height: 229,
    borderRadius: 10,
    backgroundColor: '#727272',
  },
  dot: {
    width: 9,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#eeeeee',
  },
  dotActive: {
    width: 9,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Color.primary,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  brandText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 12,
  },
  giftName: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
    marginTop: 5,
  },
  rowBetween: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  inventory: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#d3d3d3',
  },
  price: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 25,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#212121',
  },
  crown: {
    width: 17.67,
    height: 11.73,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  likeButton: {
    width: (Dimensions.get('window').width - 60) * 0.2,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebebeb',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  likeImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  puchageButton: {
    width: (Dimensions.get('window').width - 60) * 0.8,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#262626',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#262626',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  puchageText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});
