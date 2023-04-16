import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';

import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductModal from '../ProductModal';

export default function RecommandProduct({ data }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const openModal = (item) => {
    setTargetItem(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.recommandContainer}>
      <Text style={styles.recommandText}>오늘은{'\n'}이상품 어때요?</Text>

      <ScrollView horizontal style={styles.recommanListdWrapper}>
        {data?.map((item, index) => (
          <RednerRecommend
            key={`RednerRecommend-${index}`}
            item={item}
            openModal={openModal}
          />
        ))}
      </ScrollView>
      <ProductModal
        isVisible={modalVisible}
        item={targetItem}
        closeModal={closeModal}
      />
    </View>
  );
}

function RednerRecommend({ item, openModal }) {
  const onPressItem = () => openModal(item);
  return (
    <TouchableOpacity style={styles.recommandItem} onPress={onPressItem}>
      <View style={styles.thumbImage} />
      <Text style={styles.recommandTitle}>리미티드 기획상품</Text>
      <View style={styles.textContainer}>
        <Text style={styles.originPrice}>15,000</Text>
        <Text style={styles.salePrice}>7,500</Text>
        <Text style={styles.salePercent}>50%</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topBanner: {
    backgroundColor: Color.primary,
    width: `100%`,
    height: 255,
  },
  floatWrapper: {
    width: `100%`,
    position: 'absolute',
    bottom: -60,
  },
  floatContainer: {
    padding: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 40,
    height: 120,
    marginHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
  },
  infoText: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.grayAAAA,
  },
  cashbackText: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.primary,
  },
  sliderContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.grayDDDD,
  },
  imageTooltip: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  recommandContainer: {
    paddingHorizontal: 16,
    marginTop: 30,
  },
  recommandText: {
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
  },
  recommanListdWrapper: {
    width: '100%',
    marginTop: 13,
  },
  recommandItem: {
    paddingRight: 15,
  },
  thumbImage: {
    backgroundColor: Color.grayAAAA,
    width: 137,
    height: 91,
    borderRadius: 5,
  },
  recommandTitle: {
    fontSize: 14,
    margin: 4,
  },
  textContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-end',
  },
  originPrice: {
    textDecorationLine: 'line-through',
    color: Color.grayAAAA,
    fontSize: 10,
    marginRight: 3,
  },
  salePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 3,
  },
  salePercent: {
    fontSize: 10,
    color: Color.primary,
  },

  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 30,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  categoryBorder: {
    padding: 10,
    borderWidth: 1,
    borderColor: Color.primary,
    borderRadius: 9,
  },
  categoryText: {
    fontSize: 14,
  },
});

const categories = [
  {
    label: '전체',
    value: 'all',
  },
  {
    label: '기획상품',
    value: 'plan',
  },
  {
    label: '패스상품',
    value: 'pass',
  },
  {
    label: '부스팅',
    value: 'subscription',
  },
  {
    label: '패키지',
    value: 'package',
  },
];
