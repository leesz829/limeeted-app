import { get_bm_product, purchase_product } from 'api/models';
import { Color } from 'assets/styles/Color';
import React, { memo, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ProductModal from '../ProductModal';
import { CommaFormat, formatNowDate } from 'utils/functions';
import {
  initConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  validateReceiptIos,
  clearProductsIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import AsyncStorage from '@react-native-community/async-storage';
import { ColorType } from '@types';


interface Props {
  loadingFunc: (isStatus: boolean) => void;
  itemUpdateFunc: (isStatus: boolean) => void;
}

/* interface Products {
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
} */

export default function CategoryShop({ loadingFunc, itemUpdateFunc }) {
  const navigation = useNavigation();
  const { show } = usePopup();  // 공통 팝업

  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [items, setItems] = useState([]);

  const [isPayLoading, setIsPayLoading] = useState(false);

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
      , 'prod_subs_b003'
      , 'prod_subs_b004'
      , 'prod_subs_b005'
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
      , 'prod_subs_b003'
      , 'prod_subs_b004'
      , 'prod_subs_b005'
    ],
  });
  

  // 구독상품
  const subsProduct = Platform.select({
    ios: ['cash_100', 'cash_200'],
    android: ['cash_100', 'cash_200'],
  });

  /* const purchaseUpdateSubscription = purchaseUpdatedListener((purchase: Purchase) => {
    console.log('purchase ::::::: ', purchase);

    if (purchase) {
      validateReceiptIos({
        receiptBody: {
          'receipt-data': purchase.transactionReceipt,
          'password': '91cb6ffa05d741628d64316192f2cd5e',
        },
        isTest: true,
      }).then(res => {
        console.log('receipt result ::::::::: ', res);
      });
    }

  });

  const purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
    console.log('error ::::::: ', error);
  }); */


  const [productsPass, setProductsPass] = useState<Products>([]); // 패스 상품

  useEffect(() => {
    // 스토어 커넥션
    async function fetch() {  
      const isConnected = await initConnection();
      if (isConnected) {
        await getProducts({ skus:passProduct });
      }
    };
    fetch();
  }, []);

  // ########################################################### 카테고리 상품 페이지 로드 실행 함수
  useFocusEffect(
    React.useCallback(() => {
      async function fetch() {
        onPressCategory(categories[0]);
        await AsyncStorage.setItem('SHOP_CONNECT_DT', formatNowDate());
      };
      fetch();
      return async() => {
      };
    }, []),
  );

  // ######################################################### 카테고리 선택 함수
  const onPressCategory = async(category:any) => {
    setSelectedCategory(category);
    loadingFunc(true);

    const body = { item_type_code: category.value };
    const { success, data } = await get_bm_product(body);
    if (success) {
      let _products = data?.item_list;

      const connectDate = await AsyncStorage.getItem('SHOP_CONNECT_DT');

      _products.map((item: any) => {
        item.connect_date = connectDate;
      });

      setProductsPass(_products);

      loadingFunc(false);
    } else {
      loadingFunc(false);
    }
  };

  // ######################################################### 상품상세 팝업 활성화 함수
  const openModal = (item) => {
    setTargetItem(item);
    setModalVisible(true);
  };

  // ######################################################### 상품상세 팝업 닫기 함수
  const closeModal = (isPayConfirm: boolean) => {
    setModalVisible(false);

    if(isPayConfirm && typeof itemUpdateFunc != 'undefined') {
      itemUpdateFunc(isPayConfirm);
    }
  };

  return (
    <>
      <ScrollView style={_styles.container}>
        <View style={_styles.categoriesContainer}>
          {categories?.map((item, index) => (
            <TouchableOpacity
              key={`category-${item.value}-${index}`}
              activeOpacity={0.8}
              style={_styles.categoryBorder(item.value === selectedCategory.value)}
              onPress={() => onPressCategory(item)}>

              <Text
                style={_styles.categoryText(item.value === selectedCategory.value)}>
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
        />
      </ScrollView>
    </>
  );
}

// ######################################################### 상품 RenderItem
function RenderItem({ item, openModal }) {
  const isNew = (item.connect_date == null || item.connect_date < item.reg_dt) ? true : false;

  const onPressItem = () => openModal(item);
  const imagePath = findSourcePath(item?.file_path + item?.file_name);

  return (
    <TouchableOpacity style={_styles.itemContainer} onPress={onPressItem}>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Image
            source={ imagePath }
            style={_styles.tumbs}
          />
          {isNew &&
            <View style={_styles.iconArea}>
              <Text style={_styles.newText}>NEW</Text>
            </View>
          }
        </View>
        <View style={_styles.textContainer}>
          <Text style={_styles.BESTText}>BEST</Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color:'#363636' }}>
            {item?.item_name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={_styles.discountRate}>
              {item?.discount_rate && item.discount_rate != 0 ? item.discount_rate + '%':''}
            </Text>
            <Text style={_styles.price}>
              {CommaFormat(item?.shop_buy_price) + (item.money_type_code == 'PASS' ? '패스' : '원')}
            </Text>
            <Text style={_styles.originPrice}>
              {item?.discount_rate && item.discount_rate != 0 ? CommaFormat(item?.original_price) + (item.money_type_code == 'PASS' ? '패스' : '원') : ''}
            </Text>
          </View>
          <View style={_styles.boxWrapper}>
            {
              (item?.discount_rate && item.discount_rate != 0 ? true : false) && <View style={_styles.box}>
                <Text style={_styles.boxText}>특가할인</Text>
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

const _styles = StyleSheet.create({
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
    color:'#363636',
  },
  originPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    textDecorationLine: 'line-through',
    color:'#363636',
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
  iconArea: {
    position: 'absolute',
    top: 4,
    left: 5,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: ColorType.white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  }
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
    label: '패키지상품',
    value: 'PACKAGE',
  },
];
