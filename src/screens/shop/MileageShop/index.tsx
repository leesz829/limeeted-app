import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SectionGrid } from 'react-native-super-grid';
import BannerPannel from '../Component/BannerPannel';
import ProductModal from '../Component/ProductModal';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';
import { get_auct_product } from 'api/models';

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

  useEffect(() => {
    async function fetch() {
      const { success, data } = await get_auct_product();
      if (success) {
        // setData(data)
      }
    }
  }, []);

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
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const onPressItem = (item) => {
    if (type === 'gifticon') {
      setTargetItem(item);
      setModalVisible(true);
    } else
      navigation.navigate(STACK.COMMON, {
        screen: ROUTES.Auction_Detail,
        params: item?.id,
      });
  };
  const closeModal = () => setModalVisible(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.renderItem}
      onPress={() => onPressItem(item)}
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
      <ProductModal
        isVisible={modalVisible}
        item={targetItem}
        closeModal={closeModal}
      />
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
