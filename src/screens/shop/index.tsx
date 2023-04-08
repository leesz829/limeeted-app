import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  View,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { findSourcePath, ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';

import { ColorType, ScreenNavigationProp } from '@types';
import {
  initConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
} from 'react-native-iap';
import { get_banner_list, purchase_product } from 'api/models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import * as hooksMember from 'hooks/member';
import { Color } from 'assets/styles/Color';
import { Slider } from '@miblanchard/react-native-slider';
import RecommandProduct from './Component/RecommandProduct';
import CategoryShop from './Component/CategoryShop';
import { ROUTES, STACK } from 'constants/routes';
import BannerPannel from './Component/BannerPannel';



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
export const Shop = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const onPressInventory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
    //navigation.navigate(STACK.COMMON, { screen: ROUTES.Gifticon_Detail });
  };
  // const isFocusShop = useIsFocused();

  // const jwtToken = hooksMember.getJwtToken(); // 토큰
  // const memberSeq = hooksMember.getMemberSeq(); // 회원번호

  // const [products, setProducts] = useState<Products>([]); // 테스트 상품
  // const [productsPass, setProductsPass] = useState<Products>([]); // 패스 상품
  // const [productsRoyalPass, setProductsRoyalPass] = useState<Products>([]); // 로얄패스 상품

  // const [passAmt, setPassAmt] = useState<any>('');
  // const [royalPassAmt, setRoyalPassAmt] = useState<any>('');

  // const skus = Platform.select({
  //   ios: ['cash_100', 'cash_200'],
  //   android: ['cash_100', 'cash_200'],
  // });

  // const passSkus = Platform.select({
  //   ios: ['cash_100', 'cash_200'],
  //   android: [
  //     'pass_30',
  //     'pass_50_10',
  //     'pass_100_20',
  //     'pass_300_60',
  //     'pass_500_100',
  //     'pass_1000_200',
  //   ],
  // });

  // const royalPassSkus = Platform.select({
  //   ios: ['cash_100', 'cash_200'],
  //   android: [
  //     'royal_pass_10',
  //     'royal_pass_20_10',
  //     'royal_pass_50_20',
  //     'royal_pass_90_40',
  //     'royal_pass_150_60',
  //     'royal_pass_250_120',
  //   ],
  // });

  // const [errMsg, setErrMsg] = React.useState('');

  // // 최초 실행
  // useEffect(() => {
  //   //  init();
  //   getMemberHasPoint();
  // }, [isFocusShop]);

  // // ##### 초기 실행 함수
  // async function init() {
  //   const isConnected = await initConnection();
  //   if (isConnected) {
  //     const result = await getAvailablePurchases();

  //     // const _products = await getProducts({ skus:skus });
  //     // setProducts(_products);
  //     /* console.log(
  //           'getAvailablePurchases : ',
  //           JSON.stringify(result),
  //           'getProducts : ',
  //           JSON.stringify(_products),
  //        ); */

  //     await getProducts({ skus: passSkus });
  //     const _productsPass = [
  //       {
  //         description: '리미티드 기본 재화 30',
  //         name: '패스30',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩7,500',
  //           priceAmountMicros: '7500000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_30',
  //         productType: 'inapp',
  //         title: '패스30 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 기본 재화 50',
  //         name: '패스50',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩13,900',
  //           priceAmountMicros: '13900000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_50_10',
  //         productType: 'inapp',
  //         title: '패스50 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 기본 재화 100',
  //         name: '패스100',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩25,900',
  //           priceAmountMicros: '25900000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_100_20',
  //         productType: 'inapp',
  //         title: '패스100 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 기본 재화 300',
  //         name: '패스300',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩68,900',
  //           priceAmountMicros: '68900000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_300_60',
  //         productType: 'inapp',
  //         title: '패스300 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 기본 재화 500',
  //         name: '패스500',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩99,000',
  //           priceAmountMicros: '99000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_500_100',
  //         productType: 'inapp',
  //         title: '패스500 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 기본 재화 1000',
  //         name: '패스1000',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩179,000',
  //           priceAmountMicros: '179000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'pass_1000_200',
  //         productType: 'inapp',
  //         title: '패스1000 (LImeetED)',
  //       },
  //     ];
  //     setProductsPass(_productsPass);

  //     await getProducts({ skus: royalPassSkus });
  //     const _productsRoyalPass = [
  //       {
  //         description: '리미티드 고급 재화 10',
  //         name: '로얄패스10',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩10,000',
  //           priceAmountMicros: '10000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_10',
  //         productType: 'inapp',
  //         title: '로얄패스10 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 고급 재화 20',
  //         name: '로얄패스20',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩27,900',
  //           priceAmountMicros: '27900000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_20_10',
  //         productType: 'inapp',
  //         title: '로얄패스20 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 고급 재화 50',
  //         name: '로얄패스50',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩59,900',
  //           priceAmountMicros: '59900000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_50_20',
  //         productType: 'inapp',
  //         title: '로얄패스50 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 고급 재화 90',
  //         name: '로얄패스90',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩99,000',
  //           priceAmountMicros: '99000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_90_40',
  //         productType: 'inapp',
  //         title: '로얄패스90 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 고급 재화 150',
  //         name: '로얄패스150',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩139,000',
  //           priceAmountMicros: '139000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_150_60',
  //         productType: 'inapp',
  //         title: '로얄패스150 (LImeetED)',
  //       },
  //       {
  //         description: '리미티드 고급 재화 250',
  //         name: '로얄패스250',
  //         oneTimePurchaseOfferDetails: {
  //           formattedPrice: '₩219,000',
  //           priceAmountMicros: '219000000000',
  //           priceCurrencyCode: 'KRW',
  //         },
  //         productId: 'royal_pass_250_120',
  //         productType: 'inapp',
  //         title: '로얄패스250 (LImeetED)',
  //       },
  //     ];
  //     setProductsRoyalPass(_productsRoyalPass);
  //   }
  // }

  // // ##### 회원 보유 재화 조회
  // const getMemberHasPoint = async () => {
  //   const result = await axios
  //     .post(
  //       properties.api_domain + '/member/getMemberHasPoint',
  //       {
  //         'api-key': 'U0FNR09CX1RPS0VOXzAx',
  //         member_seq: memberSeq,
  //       },
  //       {
  //         headers: {
  //           'jwt-token': jwtToken,
  //         },
  //       }
  //     )
  //     .then(function (response) {
  //       console.log(
  //         'response.data.result_code :::::::: ',
  //         response.data.result_code
  //       );

  //       if (response.data.result_code != '0000') {
  //         console.log(response.data.result_msg);
  //         return false;
  //       } else {
  //         setPassAmt(response.data.passAmt);
  //         setRoyalPassAmt(response.data.royalPassAmt);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log('error ::: ', error);
  //     });
  // };

  // // ##### 구매처리
  // const onPressItem = async (id: string, name: string, price: string) => {
  //   try {
  //     const result = await requestPurchase({
  //       skus: [id],
  //       andDangerouslyFinishTransactionAutomaticallyIOS: false,
  //     });

  //     const { success, data } = await purchase_product(
  //       Platform.OS,
  //       price.replace('₩', '').replace(',', ''),
  //       name,
  //       id,
  //       result,
  //       '0000',
  //       result[0].transactionReceipt
  //     );
  //     if (success) {
  //       Alert.alert('구매완료', '상품이 성공적으로 구매되었습니다.', [
  //         {
  //           text: '확인',
  //           onPress: () => {
  //             navigation.navigate('Main', {
  //               screen: 'Roby',
  //             });
  //           },
  //         },
  //       ]);
  //     }
  //   } catch (err: any) {
  //     console.warn(err.code, err.message);
  //     setErrMsg(JSON.stringify(err));
  //   }
  // };

  // const RenderProduct = useCallback(
  //   ({ item }: { item: Product }) => (
  //     <TouchableOpacity
  //       style={styles.rowStyle}
  //       onPress={() =>
  //         onPressItem(
  //           item?.productId,
  //           item?.name,
  //           item?.oneTimePurchaseOfferDetails?.formattedPrice
  //         )
  //       }
  //     >
  //       <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
  //         <Image source={ICON.pass} style={styles.iconSize32} />
  //         <Text fontWeight={'500'}>{item?.name}</Text>
  //       </SpaceView>
  //       <View>
  //         <Text fontWeight={'700'}>
  //           {item?.oneTimePurchaseOfferDetails?.formattedPrice}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   ),
  //   [products]
  // );

  // const RenderPassProduct = useCallback(
  //   ({ item }: { item: Product }) => (
  //     <TouchableOpacity
  //       style={styles.rowStyle}
  //       onPress={() =>
  //         onPressItem(
  //           item?.productId,
  //           item?.name,
  //           item?.oneTimePurchaseOfferDetails?.formattedPrice
  //         )
  //       }
  //     >
  //       <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
  //         <Image source={ICON.pass} style={styles.iconSize32} />
  //         <Text fontWeight={'500'}>{item?.name}</Text>
  //       </SpaceView>
  //       <View>
  //         <Text fontWeight={'700'}>
  //           {item?.oneTimePurchaseOfferDetails?.formattedPrice}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   ),
  //   [productsPass]
  // );

  // const RenderRoyalPassProduct = useCallback(
  //   ({ item }: { item: Product }) => (
  //     <TouchableOpacity
  //       style={styles.rowStyle}
  //       onPress={() =>
  //         onPressItem(
  //           item?.productId,
  //           item?.name,
  //           item?.oneTimePurchaseOfferDetails?.formattedPrice
  //         )
  //       }
  //     >
  //       <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
  //         <Image source={ICON.royalpass} style={styles.iconSize32} />
  //         <Text fontWeight={'500'}>{item?.name}</Text>
  //       </SpaceView>
  //       <View>
  //         <Text fontWeight={'700'}>
  //           {item?.oneTimePurchaseOfferDetails?.formattedPrice}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   ),
  //   [productsRoyalPass]
  // );

  return (
    <>
      <TopNavigation currentPath={''} />
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />

      <TouchableOpacity
        onPress={onPressInventory}
        style={styles.floatingButtonWrapper}
      >
        <Image source={ICON.floatingButton} style={styles.floatingButton} />
      </TouchableOpacity>
    </>
  );
};

function ListHeaderComponent() {
  const [banner, setBanner] = useState([]);
  useEffect(() => {
    const getBanner = async () => {
      const { success, data } = await get_banner_list({ banner_type: 'PROD' });
      if (success) {
        setBanner(data?.banner_list);
      }
    };
    getBanner();
  }, []);
  return (
    <View>
      {/* ############################################### 상단 배너 */}
      <FlatList
        data={banner}
        horizontal
        style={styles.bannerWrapper}
        pagingEnabled
        renderItem={({ item, index }) => {
          const urlPath =  findSourcePath(item?.s_file_path + item?.s_file_name);
          return <Image style={styles.topBanner} source={urlPath} />;
        }}
      />

      <View style={{ height: 50, paddingHorizontal: 16 }}>
        <BannerPannel />
      </View>
    </View>
  );
}
function ListFooterComponent() {
  return (
    <>
      {/* ############################################### 추천상품 */}
      <RecommandProduct data={['', '', '', '']} />
      {/* ############################################### 카테고리별 */}
      <CategoryShop />
    </>
  );
}




{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: Color.primary,
    width: `100%`,
    height: 250,
  },
  topBanner: {
    backgroundColor: Color.primary,
    width: Dimensions.get('window').width,
    height: 250,
    justifyContent: 'flex-end',
  },
  floatWrapper: {
    width: `100%`,
    position: 'absolute',
    bottom: -50,
  },
  floatContainer: {
    padding: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 40,
    height: 100,
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
    justifyContent: 'space-around',
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
  },
  infoText: {
    marginTop: 8,
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
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.grayDDDD,
  },
  TooltipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageTooltip: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  floatingButtonWrapper: {
    backgroundColor: Color.purple,
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  floatingButton: {
    backgroundColor: Color.purple,
    width: 50,
    height: 50,
    borderRadius: 25,
    // position: 'absolute',
    // bottom: 10,
    // right: 10,
  },
});
