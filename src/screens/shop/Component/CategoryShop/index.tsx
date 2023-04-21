import AsyncStorage from '@react-native-community/async-storage';
import { get_bm_product, purchase_product } from 'api/models';
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
  Platform,
} from 'react-native';
import ProductModal from '../ProductModal';
import { CommaFormat } from 'utils/functions';
import {
  initConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
} from 'react-native-iap';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';



interface Products {
  products: Product[];
}
interface Product {
  oneTimePurchaseOfferDetails: {
    priceAmountMicros: string;
    formattedPrice: string;
    priceCurrencyCode: string;
  };
  name: string;
  productType: string;
  description: string;
  title: string;
  productId: string;
}

export default function CategoryShop() {
  const navigation = useNavigation();
  const { show } = usePopup();  // 공통 팝업

  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [items, setItems] = useState([]);

  // ########################## 인앱 getProduct
   const passProduct = Platform.select({
    ios: [
      'prod_pass_a001'
      , 'prod_pack_a002'
      , 'prod_pass_a002'
      , 'prod_pack_a003'
      , 'prod_pass_a003'
      , 'prod_pack_a004'
      , 'prod_pass_a004'
      , 'prod_subs_b001'
      , 'prod_pack_a005'
      , 'prod_pass_a005'
      , 'prod_subs_b002'
      , 'prod_pass_a006'
      , 'prod_subs_b003'
      , 'prod_pass_b001'
      , 'prod_pass_b002'
      , 'prod_pass_b003'
      , 'prod_pack_a010'
      , 'prod_pass_b004'
      , 'prod_pack_a011'
      , 'prod_pass_b005'
      , 'prod_pack_a012'
      , 'prod_pass_b006'
      , 'prod_pack_a013'
      , 'prod_pass_b007'
      , 'prod_pack_a014'
      , 'prod_pass_b008'
      , 'prod_pass_b009'
      , 'prod_subs_e001'
      , 'prod_subs_e002'
      , 'prod_subs_e003'
    ],
    android: [
      'prod_pass_a001'
      , 'prod_pack_a002'
      , 'prod_pass_a002'
      , 'prod_pack_a003'
      , 'prod_pass_a003'
      , 'prod_pack_a004'
      , 'prod_pass_a004'
      , 'prod_subs_b001'
      , 'prod_pack_a005'
      , 'prod_pass_a005'
      , 'prod_subs_b002'
      , 'prod_pass_a006'
      , 'prod_subs_b003'
      , 'prod_pass_b001'
      , 'prod_pass_b002'
      , 'prod_pass_b003'
      , 'prod_pack_a010'
      , 'prod_pass_b004'
      , 'prod_pack_a011'
      , 'prod_pass_b005'
      , 'prod_pack_a012'
      , 'prod_pass_b006'
      , 'prod_pack_a013'
      , 'prod_pass_b007'
      , 'prod_pack_a014'
      , 'prod_pass_b008'
      , 'prod_pass_b009'
      , 'prod_subs_e001'
      , 'prod_subs_e002'
      , 'prod_subs_e003'
    ],
  });
  

  // 구독상품
  const subsProduct = Platform.select({
    ios: ['cash_100', 'cash_200'],
    android: ['cash_100', 'cash_200'],
  });

  const [productsPass, setProductsPass] = useState<Products>([]); // 패스 상품

  useEffect(() => {
    async function fetch() {
      const isConnected = await initConnection();
      if (isConnected) {
        await getProducts({ skus:passProduct });
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      const body = { item_type_code: selectedCategory.value };
      const { success, data } = await get_bm_product(body);
      if (success) {
        let _products = data?.item_list;
        /* data?.item_list.map((item: any) => {
          console.log('item ::::: ', item);

          let product = {};
          product.name = item.item_name;
          product.description = item.item_contents;
          //product.productId = item.item_code;
          product.productId = 'cash_100';
          product.productType = 'inapp';
          product.title = item.item_name;

          let details = {};
          details.formattedPrice = CommaFormat(item?.shop_buy_price);
          details.priceAmountMicros = item?.shop_buy_price || '00000';
          details.priceCurrencyCode = 'KRW';

          product.oneTimePurchaseOfferDetails = details;

          _products.push(product);
        });     */

        setProductsPass(_products);
        //console.log(JSON.stringify(data));
        //setItems(data?.item_list);
      }
    }
    fetch();
  }, [selectedCategory]);

  // ######################################################### 카테고리 선택 함수
  const onPressCategory = (value) => {
    setSelectedCategory(value);
  };

  // ######################################################### 상품상세 팝업 활성화 함수
  const openModal = (item) => {
    setTargetItem(item);
    setModalVisible(true);
  };

  // ######################################################### 상품상세 팝업 닫기 함수
  const closeModal = () => {
    setModalVisible(false);
  };

  // ######################################################### 인앱상품 구매하기 함수
  const productPurchase = async (item_code:string) => {
    //console.log('productId ::::::: ', targetItem.productId);

    try {
      const result = await requestPurchase({
        skus: [item_code],
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      const body = {
        device_gubun: Platform.OS,
        buy_price: targetItem?.shop_buy_price,
        item_name: targetItem?.item_name,
        item_code: targetItem?.item_code,
        result_msg: '성공',
        result_code: '0000',
        receiptData: result[0].transactionReceipt
      }

      const { success, data } = await purchase_product(body);
      console.log('data :::: ', data);
      if (success) {
        if(data.result_code == '0000') {
          show({
            content: '구매에 성공하였습니다.' ,
            confirmCallback: function() {
              closeModal(); 
              navigation.navigate(STACK.TAB, { screen: 'Shop' });
            }
          });
        } else {
          show({
            content: data.result_msg ,
            confirmCallback: function() { closeModal(); }
          });
        }
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() { closeModal(); }
        });
      }

    } catch (err: any) {
      console.warn(err.code, err.message);
      show({
        title: '알림',
        content: '구매에 실패하였습니다.' ,
        confirmCallback: function() { }
      });
    }
  }

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

      {productsPass?.map((item, index) => (
        <RenderItem
          key={`product-${item?.item_code}-${index}`}
          item={item}
          openModal={openModal}
        />
      ))}

      {/* ##################### 상품 상세 팝업 */}
      <ProductModal
        isVisible={modalVisible}
        type={'bm'}
        item={targetItem}
        closeModal={closeModal}
        productPurchase={productPurchase}
      />
    </ScrollView>
  );
}

// ######################################################### 상품 RenderItem
function RenderItem({ item, openModal }) {
  const onPressItem = () => openModal(item);

  const imagePath = findSourcePath(item?.file_path + item?.file_name);
  //const imagePath = findSourcePath(item?.full_file_url);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPressItem}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={ imagePath }
          style={styles.tumbs}
        />
        <View style={styles.textContainer}>
          <Text style={styles.BESTText}>BEST</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color:'#363636', fontFamily: 'AppleSDGothicNeoM00-Regular' }}>
            {item?.item_name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.discountRate}>
              {item?.discount_rate && item.discount_rate != 0 ? item.discount_rate + '%':''}
            </Text>
            <Text style={styles.price}>
              {CommaFormat(item?.shop_buy_price) + (item.money_type_code == 'PASS' ? '패스' : '원')}
            </Text>
            <Text style={styles.originPrice}>
              {item?.discount_rate && item.discount_rate != 0 ? CommaFormat(item?.original_price) + (item.money_type_code == 'PASS' ? '패스' : '원') : ''}
            </Text>
          </View>
          <View style={styles.boxWrapper}>
            {
              (item?.discount_rate && item.discount_rate != 0 ? true : false) && <View style={styles.box}>
                <Text style={styles.boxText}>특가할인</Text>
              </View>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}


{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

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
    color: '#363636',
    fontFamily: 'AppleSDGothicNeoEB00-Regular'
  },
  discountRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primary,
    fontFamily: 'AppleSDGothicNeoEB00-Regular'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
    color:'#363636',
    fontFamily: 'AppleSDGothicNeoEB00-Regular'
  },
  originPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textDecorationLine: 'line-through',
    color:'#363636',
    fontFamily: 'AppleSDGothicNeoM00-Regular'
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
    fontFamily: 'AppleSDGothicNeoM00-Regular'
  },
});

const categories = [
  {
    label: '패스상품',
    value: 'PASS',
  },
  {
    label: '부스팅상품',
    value: 'SUBSCRIPTION',
  },
  {
    label: '패키지',
    value: 'PACKAGE',
  },
];
