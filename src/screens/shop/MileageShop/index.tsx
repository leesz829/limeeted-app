import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SectionGrid } from 'react-native-super-grid';
import BannerPannel from '../Component/BannerPannel';
import Modal from 'react-native-modal';
import { ICON } from 'utils/imageUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewPager from '../Component/ViewPager';

const DATA = [
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['PizzaPizza', 'BurgerBurger', 'RisottoRisotto'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];
export default function MileageShop() {
  const [tab, setTab] = useState(categories[0]);
  const [data, setData] = useState(DATA);
  const onPressTab = (value) => {
    setTab(value);
  };

  return (
    <>
      <CommonHeader title="마일리지샵" />
      <View style={styles.root}>
        <SectionGrid
          itemDimension={(Dimensions.get('window').width - 72) / 3}
          sections={data}
          fixed={true}
          ListHeaderComponent={
            <ListHeaderComponent onPressTab={onPressTab} tab={tab} />
          }
          stickySectionHeadersEnabled={false}
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item, index, rowIndex }) => (
            <RenderItem type={tab.value} item={item} />
          )}
        />
      </View>
    </>
  );
}

const RenderCategory = ({ onPressTab, tab }) => {
  return categories?.map((item) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.categoryBorder(item.value === tab.value)}
      onPress={() => onPressTab(item)}
    >
      <Text style={styles.categoryText(item.value === tab.value)}>
        {item?.label}
      </Text>
    </TouchableOpacity>
  ));
};
function ListHeaderComponent({ onPressTab, tab }) {
  return (
    <View>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 70, paddingHorizontal: 1 }}>
          <BannerPannel />
        </View>
      </View>
      <View style={styles.categoriesContainer}>
        <RenderCategory onPressTab={onPressTab} tab={tab} />
      </View>
    </View>
  );
}
const RenderItem = ({ item, type }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const images = item?.images || ['', '', '', ''];
  const onPressItem = () => {
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const { bottom } = useSafeAreaInsets();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.renderItem}
      onPress={onPressItem}
    >
      <View style={{ flexDirection: 'column' }}>
        <Image style={styles.thumb} />

        <View style={{ paddingHorizontal: 3 }}>
          <Text style={styles.brandName}>브랜드명</Text>
          <Text style={styles.productName}>제품 모델명</Text>
          <View style={[styles.textContainer, { marginTop: 5 }]}>
            <Text style={styles.price}>50,000</Text>
            {type !== 'gifticon' && (
              <Text style={styles.hintText}>즉시 구매가</Text>
            )}
          </View>
          {type === 'gifticon' ? (
            <View style={styles.textContainer}>
              <Text style={styles.hintText}>100개 남음</Text>
              <Text style={styles.price}></Text>
            </View>
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.price}>50,000</Text>
              <Text style={styles.hintText}>입찰가</Text>
            </View>
          )}
        </View>
        <Text style={styles.remainText}>60분 남음</Text>
      </View>
      <Modal isVisible={modalOpen} style={modalStyle.modal}>
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
                  <Image source={ICON.like} style={modalStyle.likeImage} />
                </TouchableOpacity>
                <TouchableOpacity style={modalStyle.puchageButton}>
                  <Text style={modalStyle.puchageText}>구매하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};
const renderSectionHeader = ({ section }) => (
  <View style={{ marginTop: 15 }}>
    <Text>{section.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16 },
  categoriesContainer: {
    marginTop: 27,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      paddingVertical: 9,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : Color.grayAAAA,
      borderRadius: 9,
      marginLeft: 8,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      color: isSelected ? Color.primary : Color.grayAAAA,
    };
  },
  renderItem: {
    width: (Dimensions.get('window').width - 72) / 3,
    marginTop: 10,
  },
  thumb: {
    width: (Dimensions.get('window').width - 72) / 3,
    height: (Dimensions.get('window').width - 72) / 3,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  brandName: {
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
    marginTop: 2,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    // fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  hintText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#d3d3d3',
  },
  remainText: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: Color.gray8888,
    fontSize: 9,
  },
});

const categories = [
  {
    label: '기프티콘',
    value: 'gifticon',
  },
  {
    label: '부띠끄',
    value: 'boutique',
  },
];

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
    width: 40,
    height: 40,
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
