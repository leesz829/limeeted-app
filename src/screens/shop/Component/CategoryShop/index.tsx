import AsyncStorage from '@react-native-community/async-storage';
import { get_bm_product } from 'api/models';
import { STORAGE } from 'api/route';
import { Color } from 'assets/styles/Color';
import storeKey from 'constants/storeKey';
import { useUserInfo } from 'hooks/useUserInfo';
import React, { memo, useEffect, useState } from 'react';
import * as hooksMember from 'hooks/member';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api_domain } from 'utils/properties';
import ProductModal from '../ProductModal';
import { CommaFormat } from 'utils/functions';

export default function CategoryShop() {
  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetch() {
      const body = { item_type_code: selectedCategory.value };
      const { success, data } = await get_bm_product(body);
      if (success) {
        console.log(JSON.stringify(data));
        setItems(data?.item_list);
      }
    }
    fetch();
  }, [selectedCategory]);

  const onPressCategory = (value) => {
    setSelectedCategory(value);
  };
  const openModal = (item) => {
    setTargetItem(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.categoriesContainer}>
        {categories?.map((item, index) => (
          <TouchableOpacity
            key={`category-${item.value}-${index}`}
            activeOpacity={0.8}
            style={styles.categoryBorder(item.value === selectedCategory.value)}
            onPress={() => onPressCategory(item)}
          >
            <Text
              style={styles.categoryText(item.value === selectedCategory.value)}
            >
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {items?.map((item, index) => (
        <RednerItem
          key={`product-${item?.item_code}-${index}`}
          item={item}
          openModal={openModal}
        />
      ))}
      <ProductModal
        isVisible={modalVisible}
        item={targetItem}
        closeModal={closeModal}
      />
    </ScrollView>
  );
}
function RednerItem({ item, openModal }) {
  const onPressItem = () => openModal(item);

  const imagePath = api_domain + item?.file_path + item?.file_name;

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPressItem}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{
            uri: imagePath,
          }}
          style={styles.tumbs}
        />
        <View style={styles.textContainer}>
          <Text style={styles.BESTText}>BEST</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            {item?.item_name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.discountRate}>
              {(item?.shop_buy_price / item?.shop_buy_price) * 100}%
            </Text>
            <Text style={styles.price}>
              {CommaFormat(item?.shop_buy_price)}
            </Text>
            <Text style={styles.originPrice}>
              {CommaFormat(item?.shop_buy_price)}
            </Text>
          </View>
          <View style={styles.boxWrapper}>
            <View style={styles.box}>
              <Text style={styles.boxText}>특가할인</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    marginTop: 30,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : Color.grayAAAA,
      borderRadius: 9,
      marginLeft: 4,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      color: isSelected ? Color.primary : Color.grayAAAA,
    };
  },
  itemContainer: {
    width: '100%',
    borderBottomColor: Color.grayDDDD,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  tumbs: {
    width: 110,
    height: 80,
    backgroundColor: Color.gray6666,
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  BESTText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primary,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  originPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textDecorationLine: 'line-through',
  },
  boxWrapper: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `flex-start`,
    marginTop: 4,
  },
  box: {
    padding: 4,
    backgroundColor: Color.grayDDDD,
    borderRadius: 5,
  },
  boxText: {
    fontSize: 10,
    color: Color.purple,
  },
});

const categories = [
  {
    label: '패스상품',
    value: 'PASS',
  },
  {
    label: '구독상품',
    value: 'SUBSCRIPTION',
  },
  {
    label: '패키지',
    value: 'PACKAGE',
  },
];
