import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
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
import { get_banner_list, purchase_product, update_additional } from 'api/models';
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { Slider } from '@miblanchard/react-native-slider';
import RecommandProduct from './Component/RecommandProduct';
import CategoryShop from './Component/CategoryShop';
import { ROUTES, STACK } from 'constants/routes';
import BannerPannel from './Component/BannerPannel';
import { CommonLoading } from 'component/CommonLoading';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import Carousel from 'react-native-snap-carousel';
import useInterval from 'utils/useInterval';
import { isEmptyData, formatNowDate } from 'utils/functions';




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
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const { show } = usePopup(); // 공통 팝업

  const { width, height } = Dimensions.get('window');

  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState([]);
  const [payInfo, setPayInfo] = useState({});

  const [newItemCnt, setNewItemCnt] = useState(0);

  // 회원 기본 데이터
  const memberBase = useUserInfo();

  // 인벤토리 이동 함수
  const onPressInventory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
    //navigation.navigate(STACK.COMMON, { screen: ROUTES.Gifticon_Detail });
  };

  const loadingFunc = (isStatus: boolean) => {
    setIsLoading(isStatus);
  };

  // 팝업 목록
  let popupList = [];
  let isPopup = true;

  /* const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const snapToOffsets = useMemo(() => Array.from(Array(banner.length)).map((_, index) => index * width),
  [banner],
  );

  useEffect(() => {
    console.log('currentIndex ::::::::: ', currentIndex);
    if (currentIndex !== snapToOffsets.length) {
      flatListRef.current?.scrollToOffset({
        animated: true,
        offset: snapToOffsets[currentIndex],
      });
    }
  }, [currentIndex, snapToOffsets]);

  useInterval(() => {
    setCurrentIndex(prev => (prev === snapToOffsets.length - 1 ? 0 : prev + 1));
  }, isFocus ? 5000 : null); */

  // ############################################################################# 배너 목록 조회
  const getBanner = async (isPopupShow:boolean) => {
    //const invenConnectDate = await AsyncStorage.getItem('INVENTORY_CONNECT_DT') || '20230524000000';
    const { success, data } = await get_banner_list({ banner_type: 'PROD' });

    if (success) {

      // 이벤트 팝업 노출
      if(data.popup_list?.length > 0) {
        popupList = data.popup_list;

        // 튜토리얼 팝업 닫혀있는 경우 호출
        if(isPopupShow) {
          popupShow();
        }
      };

      setBanner(data?.banner_list);
      setNewItemCnt(data?.mbr_base?.new_item_cnt);

      if(typeof data?.pay_info != 'undefined') {
        let payInfoData = data?.pay_info?.result;
        let lettmpltName = payInfoData?.tmplt_name;
        let mbrPrice = payInfoData?.member_buy_price;
        let trgtPrice = payInfoData?.target_buy_price;
        let level = payInfoData?.tmplt_level;

        let percent = (mbrPrice*100) / trgtPrice;
        if(percent > 0) {
          percent = percent / 100;
        }

        setPayInfo({
          member_buy_price: mbrPrice
          , target_buy_price: trgtPrice
          , price_persent: percent
          , tmplt_name: lettmpltName.replace(/(\s*)/g, "")
          , tmplt_level: level
        });
      }

      // 회원 기본 데이터 저장
      dispatch(setPartialPrincipal({
        mbr_base : data?.mbr_base
      }));
    }
  };

  // ############################################################################# 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_shop_yn: 'N'
    };
    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      }
    }
  };

  // ############################################################ 팝업 활성화
  const popupShow = async () => {
    if(popupList.length > 0 && isPopup) {
      let type = popupList[0].type;  // 팝업 유형
      let nowDt = formatNowDate().substring(0, 8);
      let endDt = await AsyncStorage.getItem('POPUP_ENDDT_' + type);

      if(null == endDt || endDt < nowDt) {
        show({
          type: 'EVENT',
          eventType: 'EVENT',
          eventPopupList: popupList,
          confirmCallback: async function(isNextChk) {
            if(isNextChk) {
              // 팝업 종료 일시 Storage 저장
              await AsyncStorage.setItem('POPUP_ENDDT_' + type, nowDt);
              isPopup = false;
            }
          },
          etcCallback: async function(pop_bas_seq, sub_img_path, index) {
            navigation.navigate(STACK.COMMON, { 
              screen: 'EventDetail',
              params: {
                pop_bas_seq: pop_bas_seq,
                sub_img_path: sub_img_path,
                index: index
              }
            });
          },
        });
      }
    }
  };

  // ############################################################################# 초기 실행 실행
  /* useFocusEffect(
    React.useCallback(() => {
      getBanner();
      
      return async() => {
        
      };
    }, []),
  ); */

  useEffect(() => {
    if(isFocus) {
      let isPopupShow = true;

      // 튜토리얼 팝업 노출
      if(!isEmptyData(memberBase?.tutorial_shop_yn) || memberBase?.tutorial_shop_yn == 'Y') {
        isPopupShow = false;

        show({
          type: 'GUIDE',
          guideType: 'SHOP_BASIC',
          guideSlideYn: 'Y',
          guideNexBtnExpoYn: 'Y',
          confirmCallback: function(isNextChk) {
            if(isNextChk) {
              saveMemberTutorialInfo();
            }
            popupShow();
          }
        });
      };

      getBanner(isPopupShow);
    }
  }, [isFocus]);


  return (
    <>
      <TopNavigation currentPath={''} />
      {/* <FlatList
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      /> */}

      {isLoading && <CommonLoading />}

      <ScrollView>
        <View style={{minHeight: 300, zIndex: 1, backgroundColor: '#ffffff'}}>

          {/* ############################################### 상단 배너 */}
          <Carousel
            data={banner}
            //layout={'default'}
            sliderWidth={Math.round(width)} 
            itemWidth={Math.round(width)}
            horizontal={true}
            useScrollView={true}
            inactiveSlideScale={1}
            inactiveSlideOpacity={0.5}
            inactiveSlideShift={15}
            firstItem={banner.length}
            loop={true}
            loopClonesPerSide={banner.length}
            autoplay={true}
            autoplayDelay={2000}
            autoplayInterval={5000}
            pagingEnabled
            renderItem={({ item, index }) => {
              const urlPath =  findSourcePath(item?.s_file_path + item?.s_file_name);
              //return  <Image style={_styles.topBanner} source={urlPath} />;
              return (
                <View style={{width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={_styles.topBanner} source={urlPath} />
                </View>
              )
            }}
          />

          {/* <FlatList
            ref={flatListRef}
            data={banner}
            horizontal
            style={_styles.bannerWrapper}
            pagingEnabled
            snapToOffsets={snapToOffsets}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item, index }) => {
              const urlPath =  findSourcePath(item?.s_file_path + item?.s_file_name);
              return <Image style={_styles.topBanner} source={urlPath} />;
            }}
          /> */}

          <View style={{ height: 55, paddingHorizontal: 16 }}>
            <BannerPannel payInfo={payInfo} />
          </View>
        </View>

        {/* ############################################### 인벤토리 영역 */}
        {/* <TouchableOpacity onPress={onPressInventory}>
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
        </TouchableOpacity> */}

        {/* ############################################### 카테고리별 */}
        <CategoryShop loadingFunc={loadingFunc} itemUpdateFunc={getBanner} />
      </ScrollView>

      <TouchableOpacity
        onPress={onPressInventory}
        style={_styles.floatingButtonWrapper}>

        <Image source={ICON.inventoryIcon} style={_styles.floatingButton} />
        {newItemCnt > 0 &&
          <View style={_styles.iconArea}>
            <Text style={_styles.newText}>NEW</Text>
          </View>
        }
      </TouchableOpacity>
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
    borderRadius: 25,
    position: 'absolute',
    bottom: 13,
    right: 15,
  },
  floatingButton: {
    width: 72,
    height: 72,
    borderRadius: 25,
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
  iconArea: {
    position: 'absolute',
    top: 4,
    right: -5,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: ColorType.white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  }

});
