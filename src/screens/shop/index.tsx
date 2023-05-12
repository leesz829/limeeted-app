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
import { CommonLoading } from 'component/CommonLoading';


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
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState([]);

  // 인벤토리 이동 함수
  const onPressInventory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
    //navigation.navigate(STACK.COMMON, { screen: ROUTES.Gifticon_Detail });
  };

  const loadingFunc = (isStatus: boolean) => {
    setIsLoading(isStatus);
  };

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
    <>
      <TopNavigation currentPath={''} />
      {/* <FlatList
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      /> */}

      {isLoading && <CommonLoading />}

      <ScrollView>
        <View>
          {/* ############################################### 상단 배너 */}
          <FlatList
            data={banner}
            horizontal
            style={_styles.bannerWrapper}
            pagingEnabled
            renderItem={({ item, index }) => {
              const urlPath =  findSourcePath(item?.s_file_path + item?.s_file_name);
              return <Image style={_styles.topBanner} source={urlPath} />;
            }}
          />

          <View style={{ height: 50, paddingHorizontal: 16 }}>
            <BannerPannel />
          </View>
        </View>

        {/* ############################################### 인벤토리 영역 */}
        <TouchableOpacity onPress={onPressInventory}>
          <View style={_styles.inventoryArea}>
            <View>
              <Image source={ICON.inventoryIcon} style={_styles.inventoryIcon} />
            </View>
            <View style={_styles.inventoryText}>
              <Text style={_styles.inventoryTextTit}>인벤토리</Text>
              <Text style={_styles.inventoryTextSubTit}>구매한 상품 또는 보상은 인벤토리에 저장되요.</Text>
            </View>
            <View>
              <Image source={ICON.arrow_right} style={_styles.arrowIcon} />
            </View>
          </View>
        </TouchableOpacity>

        {/* ############################################### 카테고리별 */}
        <CategoryShop loadingFunc={loadingFunc} />
      </ScrollView>

      {/* <TouchableOpacity
        onPress={onPressInventory}
        style={_styles.floatingButtonWrapper}>

        <Image source={ICON.floatingButton} style={_styles.floatingButton} />
      </TouchableOpacity> */}
    </>
  );
};




/* ###########################################################################################
##### Header Component
########################################################################################### */
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
        style={_styles.bannerWrapper}
        pagingEnabled
        renderItem={({ item, index }) => {
          const urlPath =  findSourcePath(item?.s_file_path + item?.s_file_name);
          return <Image style={_styles.topBanner} source={urlPath} />;
        }}
      />

      <View style={{ height: 50, paddingHorizontal: 16 }}>
        <BannerPannel />
      </View>
    </View>
  );
};

/* ###########################################################################################
##### Footer Component
########################################################################################### */
function ListFooterComponent() {
  return (
    <>
      {/* ############################################### 추천상품 */}
      {/* <RecommandProduct data={['', '', '', '']} /> */}
      {/* ############################################### 카테고리별 */}
      <CategoryShop />
    </>
  );
};


{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const _styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: Color.white,
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
  inventoryArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAD7DE',
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 30,
    paddingLeft: 2,
    paddingRight: 20,
  },
  inventoryIcon: {
    width: 65,
    height: 65,
    marginTop: 0,
  },
  arrowIcon: {
    width: 10,
    height: 19,
  },
  inventoryText : {
    marginRight: 30,
    justifyContent: 'center',
    marginTop: -5,
  },
  inventoryTextTit : {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    color: '#646467',
  },
  inventoryTextSubTit : {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#939393',
    letterSpacing: 0,
  },

});
