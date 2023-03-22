import { Color } from 'assets/styles/Color';
import React, { memo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductModal from '../ProductModal';

export default function CategoryShop({ data }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

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
            key={`category-${index}`}
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

      {data?.map((item) => (
        <RednerItem item={item} openModal={openModal} />
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
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPressItem}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.tumbs} />
        <View style={styles.textContainer}>
          <Text style={styles.BESTText}>BEST</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            테스트 상품 리미티드 기획상품
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.discountRate}>50%</Text>
            <Text style={styles.price}>7,500 </Text>
            <Text style={styles.originPrice}>15,000 </Text>
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
  //   {
  //     label: '전체',
  //     value: 'all',
  //   },
  //   {
  //     label: '기획상품',
  //     value: 'plan',
  //   },
  {
    label: '패스상품',
    value: 'pass',
  },
  {
    label: '구독상품',
    value: 'subscription',
  },
  {
    label: '패키지',
    value: 'package',
  },
];
