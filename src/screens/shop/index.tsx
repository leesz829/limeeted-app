import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, View, Platform, Alert, FlatList, TouchableOpacity } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType, ScreenNavigationProp } from '@types';
import {
   initConnection,
   getProducts,
   requestPurchase,
   getAvailablePurchases,
} from 'react-native-iap';
import { purchase_product } from 'api/models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import * as hooksMember from 'hooks/member';

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
   
   const isFocusShop = useIsFocused();

   const jwtToken = hooksMember.getJwtToken();      // 토큰
   const memberSeq = hooksMember.getMemberSeq();   // 회원번호

   const [products, setProducts] = useState<Products>([]);                  // 테스트 상품
   const [productsPass, setProductsPass] = useState<Products>([]);            // 패스 상품
   const [productsRoyalPass, setProductsRoyalPass] = useState<Products>([]);   // 로얄패스 상품

   const [passAmt, setPassAmt] = useState<any>('');
   const [royalPassAmt, setRoyalPassAmt] = useState<any>('');

   const skus = Platform.select({
      ios: ['cash_100', 'cash_200'],
      android: [
         'cash_100', 'cash_200'
      ],
   });

   const passSkus = Platform.select({
      ios: ['cash_100', 'cash_200'],
      android: ['pass_30', 'pass_50_10', 'pass_100_20', 'pass_300_60', 'pass_500_100', 'pass_1000_200'],
   });

   const royalPassSkus = Platform.select({
      ios: ['cash_100', 'cash_200'],
      android: ['royal_pass_10', 'royal_pass_20_10', 'royal_pass_50_20', 'royal_pass_90_40', 'royal_pass_150_60', 'royal_pass_250_120'],
   });



   const [errMsg, setErrMsg] = React.useState('');


   // 최초 실행
   useEffect(() => {
      init();
      getMemberHasPoint();
   }, [isFocusShop]);

   // ##### 초기 실행 함수
   async function init() {
      const isConnected = await initConnection();
      if (isConnected) {
         const result = await getAvailablePurchases();

         // const _products = await getProducts({ skus:skus });
         // setProducts(_products);
         /* console.log(
            'getAvailablePurchases : ',
            JSON.stringify(result),
            'getProducts : ',
            JSON.stringify(_products),
         ); */

         await getProducts({ skus:passSkus });
         const _productsPass = [
            {"description": "리미티드 기본 재화 30", "name": "패스30", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩7,500", "priceAmountMicros": "7500000000", "priceCurrencyCode": "KRW"}, "productId": "pass_30", "productType": "inapp", "title": "패스30 (LImeetED)"}
            , {"description": "리미티드 기본 재화 50", "name": "패스50", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩13,900", "priceAmountMicros": "13900000000", "priceCurrencyCode": "KRW"}, "productId": "pass_50_10", "productType": "inapp", "title": "패스50 (LImeetED)"}
            , {"description": "리미티드 기본 재화 100", "name": "패스100", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩25,900", "priceAmountMicros": "25900000000", "priceCurrencyCode": "KRW"}, "productId": "pass_100_20", "productType": "inapp", "title": "패스100 (LImeetED)"}
            , {"description": "리미티드 기본 재화 300", "name": "패스300", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩68,900", "priceAmountMicros": "68900000000", "priceCurrencyCode": "KRW"}, "productId": "pass_300_60", "productType": "inapp", "title": "패스300 (LImeetED)"}
            , {"description": "리미티드 기본 재화 500", "name": "패스500", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩99,000", "priceAmountMicros": "99000000000", "priceCurrencyCode": "KRW"}, "productId": "pass_500_100", "productType": "inapp", "title": "패스500 (LImeetED)"}
            , {"description": "리미티드 기본 재화 1000", "name": "패스1000", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩179,000", "priceAmountMicros": "179000000000", "priceCurrencyCode": "KRW"}, "productId": "pass_1000_200", "productType": "inapp", "title": "패스1000 (LImeetED)"}
               
         ];
         setProductsPass(_productsPass);

         await getProducts({ skus:royalPassSkus });
         const _productsRoyalPass = [
            {"description": "리미티드 고급 재화 10", "name": "로얄패스10", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩10,000", "priceAmountMicros": "10000000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_10", "productType": "inapp", "title": "로얄패스10 (LImeetED)"}
            , {"description": "리미티드 고급 재화 20", "name": "로얄패스20", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩27,900", "priceAmountMicros": "27900000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_20_10", "productType": "inapp", "title": "로얄패스20 (LImeetED)"}
            , {"description": "리미티드 고급 재화 50", "name": "로얄패스50", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩59,900", "priceAmountMicros": "59900000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_50_20", "productType": "inapp", "title": "로얄패스50 (LImeetED)"}
            , {"description": "리미티드 고급 재화 90", "name": "로얄패스90", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩99,000", "priceAmountMicros": "99000000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_90_40", "productType": "inapp", "title": "로얄패스90 (LImeetED)"}
            , {"description": "리미티드 고급 재화 150", "name": "로얄패스150", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩139,000", "priceAmountMicros": "139000000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_150_60", "productType": "inapp", "title": "로얄패스150 (LImeetED)"}
            , {"description": "리미티드 고급 재화 250", "name": "로얄패스250", "oneTimePurchaseOfferDetails": {"formattedPrice": "₩219,000", "priceAmountMicros": "219000000000", "priceCurrencyCode": "KRW"}, "productId": "royal_pass_250_120", "productType": "inapp", "title": "로얄패스250 (LImeetED)"}
         ];
         setProductsRoyalPass(_productsRoyalPass);
      }
   }

   // ##### 회원 보유 재화 조회
   const getMemberHasPoint = async () => {
      const result = await axios.post(properties.api_domain + '/member/getMemberHasPoint', {
         'api-key' : 'U0FNR09CX1RPS0VOXzAx'
      }
      , {
         headers: {
           'jwt-token' : jwtToken
         }
      })
      .then(function (response) {
         console.log('response.data.result_code :::::::: ', response.data.result_code);

         if(response.data.result_code != '0000'){
            console.log(response.data.result_msg);
            return false;
         } else {
            setPassAmt(response.data.pass_amt);
            setRoyalPassAmt(response.data.royal_pass_amt);
         }
      })
      .catch(function (error) {
         console.log('error ::: ' , error);
      });
   }

   // ##### 구매처리
   const onPressItem = async (id: string, name: string, price: string) => {
      try {
         const result = await requestPurchase({
            skus: [id],
            andDangerouslyFinishTransactionAutomaticallyIOS: false,
         });

         const { success, data } = await purchase_product(
            Platform.OS
            , price.replace('₩', '').replace(',', '')
            , name
            , id
            , result
            , '0000'
            , result[0].transactionReceipt
         );
         if (success) {
            Alert.alert('구매완료', '상품이 성공적으로 구매되었습니다.', [
               { 
                  text: '확인'
                  , onPress: () => { 
                     navigation.navigate('Main', {
                        screen: 'Roby',
                     });
                   }
               },
            ]);
         }
      } catch (err: any) {
         console.warn(err.code, err.message);
         setErrMsg(JSON.stringify(err));
      }
   };

   const RenderProduct = useCallback(
      ({ item }: { item: Product }) => (
         <TouchableOpacity style={styles.rowStyle} onPress={() => onPressItem(item?.productId, item?.name, item?.oneTimePurchaseOfferDetails?.formattedPrice)}>
            <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
               <Image source={ICON.pass} style={styles.iconSize32} />
               <CommonText fontWeight={'500'}>{item?.name}</CommonText>
            </SpaceView>
            <View>
               <CommonText fontWeight={'700'}>
                  {item?.oneTimePurchaseOfferDetails?.formattedPrice}
               </CommonText>
            </View>
         </TouchableOpacity>
      ),
      [products],
   );

   const RenderPassProduct = useCallback(
      ({ item }: { item: Product }) => (
         <TouchableOpacity style={styles.rowStyle} onPress={() => onPressItem(item?.productId, item?.name, item?.oneTimePurchaseOfferDetails?.formattedPrice)}>
            <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
               <Image source={ICON.pass} style={styles.iconSize32} />
               <CommonText fontWeight={'500'}>{item?.name}</CommonText>
            </SpaceView>
            <View>
               <CommonText fontWeight={'700'}>
                  {item?.oneTimePurchaseOfferDetails?.formattedPrice}
               </CommonText>
            </View>
         </TouchableOpacity>
      ),
      [productsPass],
   );

   const RenderRoyalPassProduct = useCallback(
      ({ item }: { item: Product }) => (
         <TouchableOpacity style={styles.rowStyle} onPress={() => onPressItem(item?.productId, item?.name, item?.oneTimePurchaseOfferDetails?.formattedPrice)}>
            <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
               <Image source={ICON.royalpass} style={styles.iconSize32} />
               <CommonText fontWeight={'500'}>{item?.name}</CommonText>
            </SpaceView>
            <View>
               <CommonText fontWeight={'700'}>
                  {item?.oneTimePurchaseOfferDetails?.formattedPrice}
               </CommonText>
            </View>
         </TouchableOpacity>
      ),
      [productsRoyalPass],
   );

   return (
      <>
         <TopNavigation currentPath={''} />
         <ScrollView style={styles.scrollContainer}>
            <SpaceView mb={16}>
               <CommonText fontWeight={'700'} type={'h3'}>
                  보유 재화
               </CommonText>
            </SpaceView>

            <SpaceView viewStyle={styles.halfContainer} mb={16}>
               <View style={styles.halfItemLeft}>
                  <View style={styles.textContainer}>
                     <SpaceView mb={8}>
                        <CommonText>보유 패스</CommonText>
                     </SpaceView>
                     <Image source={ICON.pass} style={styles.iconSize32} />
                     <CommonText fontWeight={'700'} type={'h2'}>
                        {passAmt}
                     </CommonText>
                  </View>
               </View>
               <View style={styles.halfItemRight}>
                  <View style={styles.textContainer}>
                     <SpaceView mb={8}>
                        <CommonText>보유 로얄패스</CommonText>
                     </SpaceView>
                     <Image source={ICON.royalpass} style={styles.iconSize32} />
                     <CommonText fontWeight={'700'} type={'h2'}>
                        {royalPassAmt}
                     </CommonText>
                  </View>
               </View>
            </SpaceView>

            {/* <SpaceView viewStyle={[styles.purpleContainer, layoutStyle.rowBetween]} mb={48}>
               <View>
                  <CommonText fontWeight={'700'} color={ColorType.white}>
                     추천 패키지
                  </CommonText>
                  <CommonText>300 패스 + 10 로얄패스</CommonText>
               </View>
               <View style={layoutStyle.rowCenter}>
                  <SpaceView viewStyle={styles.whiteCircleBox30} mr={8}>
                     <CommonText
                        fontWeight={'700'}
                        textStyle={styles.lineHeight16}
                        type={'h6'}
                        color={ColorType.white}
                     >
                        D.C {'\n'}30%
                     </CommonText>
                  </SpaceView>
                  <CommonText fontWeight={'700'} color={ColorType.white} type={'h4'}>
                     ₩9,900
                  </CommonText>
               </View>
            </SpaceView> */}

            
            {/*
            <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     테스트 상품
                  </CommonText>
               </SpaceView>
               <ScrollView>
                  {products.map((e, index) => {
                     return <RenderProduct item={e} key={'RednerProduct' + index} />;
                  })}
               </ScrollView>
            </SpaceView>
            */}

            <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     패스
                  </CommonText>
               </SpaceView>
               <ScrollView>
                  {productsPass.map((e, index) => {
                     return <RenderPassProduct item={e} key={'RednerProduct' + index} />;
                  })}
               </ScrollView>
            </SpaceView>

            <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     로얄패스
                  </CommonText>
               </SpaceView>
               <ScrollView>
                  {productsRoyalPass.map((e, index) => {
                     return <RenderRoyalPassProduct item={e} key={'RednerProduct' + index} />;
                  })}
               </ScrollView>
            </SpaceView>

            {/* <SpaceView mb={48}>
               <SpaceView mb={16}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                     로얄패스
                  </CommonText>
               </SpaceView>
               <View style={styles.rowStyle}>
                  <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
                     <Image source={ICON.royalpass} style={styles.iconSize32} />
                     <CommonText fontWeight={'500'}>5</CommonText>
                  </SpaceView>
                  <View>
                     <CommonText fontWeight={'700'}>₩9,900</CommonText>
                  </View>
               </View>
               <View style={styles.rowStyle}>
                  <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
                     <Image source={ICON.pass} style={styles.iconSize32} />
                     <CommonText fontWeight={'500'}>10</CommonText>
                  </SpaceView>
                  <View>
                     <CommonText fontWeight={'700'}>₩19,900</CommonText>
                  </View>
               </View>
               <View style={styles.rowStyle}>
                  <SpaceView mr={4} viewStyle={layoutStyle.rowCenter}>
                     <Image source={ICON.pass} style={styles.iconSize32} />
                     <CommonText fontWeight={'500'}>20</CommonText>
                  </SpaceView>
                  <View>
                     <CommonText fontWeight={'700'}>₩39,900</CommonText>
                  </View>
               </View>
            </SpaceView> */}

            <SpaceView mb={60}>
               <SpaceView viewStyle={styles.dotTextContainer} mb={16}>
                  <View style={styles.dot} />
                  <CommonText color={ColorType.gray6666}>모든 상품은 VAT 포함된 가격입니다.</CommonText>
               </SpaceView>

               <SpaceView viewStyle={styles.dotTextContainer} mb={16}>
                  <View style={styles.dot} />
                  <CommonText color={ColorType.gray6666}>
                     구매 완료 후 7일 이내에 청약철회가 가능합니다.
                  </CommonText>
               </SpaceView>

               <SpaceView viewStyle={styles.dotTextContainer}>
                  <View style={styles.dot} />
                  <CommonText color={ColorType.gray6666}>
                     청약철회 시 대상 상품의 수량이 보유 수량에서 차감됩니다.
                  </CommonText>
               </SpaceView>



               {/* <SpaceView viewStyle={styles.dotTextContainer}>
                  <View style={styles.dot} />
                  <CommonText color={ColorType.gray6666}>
                     에러 : {errMsg}
                  </CommonText>
               </SpaceView> */}


            </SpaceView>
         </ScrollView>
      </>
   );
};