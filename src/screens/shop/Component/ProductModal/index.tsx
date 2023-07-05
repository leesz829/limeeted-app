import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { Color } from 'assets/styles/Color';
import { ColorType } from '@types';
import React, { memo, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  PanResponder,
} from 'react-native';
import Modal from 'react-native-modal';
import { findSourcePath, ICON } from 'utils/imageUtils';
import ViewPager from '../ViewPager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommaFormat } from 'utils/functions';
import {
  initConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
  validateReceiptIos,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  endConnection,
  clearProductsIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { useNavigation } from '@react-navigation/native';
import { usePopup } from 'Context';
import { CommonLoading } from 'component/CommonLoading';
import { purchase_product, order_goods } from 'api/models';
import { ROUTES, STACK } from 'constants/routes';
import { ScrollView } from 'react-native-gesture-handler';


interface Props {
  isVisible: boolean;
  type: string; /* bm: bm상품, gifticon: 재고상품, boutique: 경매상품 */
  closeModal: (isPayConfirm:boolean) => void;
  item: any;
}

export default function ProductModal({ isVisible, type, closeModal, item }: Props) {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();
  const { show } = usePopup(); // 공통 팝업
  const { bottom } = useSafeAreaInsets();
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [comfirmModalVisible, setComfirmModalVisible] = useState(false);

  //추후 데이터 배열로 변환시 변경필요
  const images = [findSourcePath(item?.file_path + item?.file_name)];

  // 브랜드명
  const brand_name = item?.brand_name != null ? item?.brand_name : '리미티드';

  // 상품명
  const prod_name = type == 'bm' ? item?.item_name : item?.prod_name;

  // 판매금액
  const buy_price = type == 'bm' ? item?.shop_buy_price : item?.buy_price;

  // 상품상세
  const prod_content = type == 'bm' ? item?.item_contents : item?.prod_content;

  // 아이템 코드(BM상품)
  const item_code = item?.item_code;

  // 상품번호(재고상품)
  const prod_seq = item?.prod_seq;

  // 재화 구분 코드
  const money_type_code = item?.money_type_code;

  // ######################################################### 상품 구매하기 함수
  const purchaseBtn = async () => {
    if(!isPayLoading) {
      setIsPayLoading(true);
      
      try {
        if(type == 'bm'){

          // 재화 유형 구분 : 인앱상품
          if(money_type_code == 'INAPP') {
            if(Platform.OS == 'android') {
              purchaseAosProc();
            } else if(Platform.OS == 'ios') {
              purchaseIosProc();
            }
          
          // 재화 유형 구분 : 패스상품(임시처리::추후수정)
          } else if(money_type_code == 'PASS') {
            closeModal(false);
            setIsPayLoading(false);
            setComfirmModalVisible(false);
          }
        } else {
          buyProdsProc();
        }
      } catch (err: any) {
        console.warn(err.code, err.message);
      }
    }
  };

  // ######################################################### 재고 상품 구매하기 함수
  const buyProdsProc = async () => {
    try {
      const { success, data } = await order_goods({
        prod_seq : item.prod_seq
        , modify_seq : item.modify_seq
        , buy_price : item.buy_price
        , mobile_os : Platform.OS
      });
      
      if (success) {
        if(data.result_code != '0000') {
          show({
            content: data.result_msg
            , confirmCallback: function () {
              closeModal(true)
              setComfirmModalVisible(false);
            },
          });
          return false;
        }else{
          if(Platform.OS == 'android') {
            show({
              title: '알림',
              content: '구매에 성공하였습니다.',
              confirmCallback: function () {
                setComfirmModalVisible(false);
                closeModal(true);
              },
            });
          } else {
            Alert.alert('알림', '구매에 성공하였습니다.',
            [{ 
              text: '확인',
              onPress: () => {
                setComfirmModalVisible(false);
                closeModal(true);
              }
            }]);
          }
        }
      }else{
        if(Platform.OS == 'android') {
          show({
            title: '알림',
            content: '기프티콘 발급 통신 오류입니다. 잠시 후 다시 시도해주세요.',
            confirmCallback: function () {
              setComfirmModalVisible(false);
              closeModal(true);
            },
          });
        } else {
          Alert.alert('알림', '기프티콘 발급 통신 오류입니다. 잠시 후 다시 시도해주세요.',
          [{ 
            text: '확인',
            onPress: () => {
              setComfirmModalVisible(false);
              closeModal(true);
            }
          }]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsPayLoading(false);
    }
  }

  // ######################################################### AOS 결제 처리
  const purchaseAosProc = async () => {

    try {
      const result = await requestPurchase({
        skus: [item_code]
      });

      const receiptDataJson = JSON.parse(result[0].transactionReceipt);

      const dataParam = {
        device_gubun: Platform.OS,
        buy_price: buy_price,
        item_name: prod_name,
        item_code: item_code,
        result_msg: '성공',
        result_code: '0000',
        acknowledged: receiptDataJson.acknowledged,
        package_name: receiptDataJson.packageName,
        product_id: receiptDataJson.productId,
        purchase_state: receiptDataJson.purchaseState,
        purchase_time: receiptDataJson.purchaseTime,
        purchase_token: receiptDataJson.purchaseToken,
        quantity: receiptDataJson.quantity,
        transaction_id: '',
      };

      purchaseResultSend(dataParam);

      await finishTransaction({
        purchase: result[0]
        , isConsumable: true
        , developerPayloadAndroid: undefined
      });

    } catch (err: any) {
      setIsPayLoading(false);
      console.warn(err.code, err.message);
    } finally {
      console.log('finally!!!!!');
    }
  };

  // ######################################################### IOS 결제 처리
  const purchaseIosProc = async () => {
    try {
      const result = await requestPurchase({
        sku: item_code,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
  
      let purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase: Purchase) => {
        try {
    
          if (purchase) {
            validateReceiptIos({
              receiptBody: {
                'receipt-data': purchase.transactionReceipt,
                'password': '91cb6ffa05d741628d64316192f2cd5e',
              },
              isTest: false,
            }).then(res => {
              purchaseUpdateSubscription.remove();
    
              const dataParam = {
                device_gubun: Platform.OS,
                buy_price: buy_price,
                item_name: prod_name,
                item_code: item_code,
                result_msg: '성공',
                result_code: '0000',
                acknowledged: 0,
                package_name: res?.receipt?.bundle_id,
                product_id: res?.receipt?.in_app[0].product_id,
                purchase_state: 0,
                purchase_time: '20230429000000',
                purchase_token: '',
                quantity: res?.receipt?.in_app[0].quantity,
                transaction_id: res?.receipt?.in_app[0].transaction_id,
              };
    
              purchaseResultSend(dataParam);
            });
          };
          
        } catch (error) {
          purchaseUpdateSubscription.remove();
          Alert.alert('알림', '구매에 실패하였습니다.');
          setIsPayLoading(false);
          setComfirmModalVisible(false);
          closeModal(false);
        } finally {
          await finishTransaction({
            purchase: purchase,
            isConsumable: true,
          }).then();
        }
      });
      
    } catch (error) {
      setIsPayLoading(false);
    }
  
    let purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      purchaseErrorSubscription.remove();
      Alert.alert('알림', '구매에 실패하였습니다.');
      setIsPayLoading(false);
      setComfirmModalVisible(false);
      closeModal(false);
    });

  };

  // ######################################################### 인앱상품 구매 결과 API 전송
  const purchaseResultSend = async (dataParam:any) => {
    const body = dataParam;

    const { success, data } = await purchase_product(body);
    console.log('data :::: ', data);
    if (success) {
      if(data?.result_code == '0000') {
        setIsPayLoading(false);
        setComfirmModalVisible(false);
        closeModal(true);
        //navigation.navigate(STACK.TAB, { screen: 'Shop' });

        if(Platform.OS == 'android') {
          show({
            content: '구매에 성공하였습니다.' ,
            confirmCallback: function() { }
          });
        } else {
          Alert.alert('알림', '구매에 성공하였습니다.', [{ text: '확인' }]);
        }
      } else {
        closeModal(false);
        setIsPayLoading(false);
        setComfirmModalVisible(false);

        if(Platform.OS == 'android') {
          show({
            title: '알림',
            content: '구매에 실패하였습니다.',
            confirmCallback: function() { }
          });
        } else {
          Alert.alert('알림', '구매에 실패하였습니다.', [{ text: '확인' }]);
        }
      }
    } else {
      closeModal(false);
      setIsPayLoading(false);
      setComfirmModalVisible(false);

      if(Platform.OS == 'android') {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() { }
        });
      } else {
        Alert.alert('알림', '오류입니다. 관리자에게 문의해주세요.', [{ text: '확인' }]);
      }

    }
  };

  const toggleModal = async () => {
    closeModal(false);
  };

  // 터치 컨트롤 함수
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 50 && gestureState.dy > gestureState.dx) {
          toggleModal();
          // 아래로 스와이프 동작이면 스크롤을 막음
          //scrollViewRef.current.setNativeProps({ scrollEnabled: false });
        } else {
          // 위로 스와이프 동작이면 스크롤을 허용
          //scrollViewRef.current.setNativeProps({ scrollEnabled: true });
        }
      },
      onPanResponderRelease: () => {
        //scrollViewRef.current.setNativeProps({ scrollEnabled: true });
      },
    })
  ).current;

  return (
    <>
      <Modal 
        isVisible={isVisible} 
        style={modalStyleProduct.modal}
        //onSwipeComplete={toggleModal}
        //onBackdropPress={toggleModal} // 모달 외부 터치 시 모달 닫기
        //swipeDirection="down" // 아래 방향으로 스와이프
        //propagateSwipe={true}
        onRequestClose={() => { closeModal(false); }}>

        <View style={modalStyleProduct.root}>
          <View {...panResponder.panHandlers}>
            <View style={modalStyleProduct.closeContainer}>
              <TouchableOpacity onPress={toggleModal} hitSlop={commonStyle.hipSlop20}>
                <Image source={ICON.closeBlack} style={modalStyleProduct.close} />
              </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <ViewPager
                data={images}
                style={modalStyleProduct.pagerView}
                renderItem={(data) => <Image key={data.index} source={data} style={modalStyleProduct.itemImages} resizeMode={'contain'} />} 
              />
            </View>
          </View>

          <View style={modalStyleProduct.infoContainer}>
            {brand_name != '' && brand_name != null ? (
              <Text style={modalStyleProduct.brandText}>{brand_name}</Text>
            ) : null}

            <Text style={modalStyleProduct.giftName}>{prod_name}</Text>
            <View style={modalStyleProduct.rowBetween}>
              <Text style={modalStyleProduct.inventory}>
                {type == 'gifticon' ? CommaFormat(item?.prod_cnt) + '개 남음' : null}

                {/* {CommaFormat(item?.buy_count_max)}개 남음 */}
              </Text>
              <View style={modalStyleProduct.rowCenter}>
               <Text style={modalStyleProduct.price}>
                  {
                    CommaFormat(item?.shop_buy_price != null ? item?.shop_buy_price : item?.buy_price)
                  }

                  { 
                    type != 'bm'? <Image source={ICON.crown} style={modalStyleProduct.crown} /> : item?.money_type_code == 'PASS' ? '패스' : '원' 
                  }
                </Text>
                {/*<Image source={ICON.crown} style={modalStyleProduct.crown} />*/}
              </View>  
            </View>

            <View style={modalStyleProduct.infoContents}>
              <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }} style={{maxHeight: height - 625}}>
                <View>
                  <Text style={modalStyleProduct.brandContentText}>{prod_content}</Text>
                </View>
              </ScrollView>
            </View>
            
            <View
              style={[
                modalStyleProduct.bottomContainer,
                {
                  marginBottom: bottom + 10,
                },
              ]}
            >
              <View style={modalStyleProduct.rowBetween}>
                {/* <TouchableOpacity style={modalStyle.likeButton}>
                  <Image source={ICON.storage} style={modalStyle.likeImage} />
                </TouchableOpacity> */}
                <TouchableOpacity 
                  style={modalStyleProduct.puchageButton} 
                  onPress={() => {
                    setComfirmModalVisible(true);
                  }}>
                  <Text style={modalStyleProduct.puchageText}>구매하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

        {/* ###################### 구매하기 Confirm 팝업 */}
        <Modal isVisible={comfirmModalVisible} transparent={true} style={modalStyleProduct.modal}>
            {isPayLoading && <CommonLoading />}
            <View style={modalStyle.modalBackground}>
            <View style={modalStyle.modalStyle1}>

              <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalHeader]}>
                <CommonText fontWeight={'700'} type={'h5'} color={'#676767'}>
                  상품 구매
                </CommonText>
              </SpaceView>

              <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalBody]}>
                <CommonText type={'h5'} textStyle={layoutStyle.textCenter} color={'#646464'}>
                  상품을 구매하시겠습니까?
                </CommonText>
              </SpaceView>

              <View style={modalStyle.modalBtnContainer}>
                <TouchableOpacity
                  style={[modalStyle.modalBtn, {backgroundColor: Color.grayD6D3D3, borderBottomLeftRadius: 5}]}
                  onPress={() => setComfirmModalVisible(false)}>
                  <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>취소할래요!</CommonText>
                </TouchableOpacity>

                <View style={modalStyle.modalBtnline} />

                  <TouchableOpacity 
                    style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomRightRadius: 5}]}
                    onPress={() => purchaseBtn()}>
                    <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
                      구매하기
                    </CommonText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

      </Modal>
    </>
  );
}



{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const modalStyleProduct = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  root: {
    // flex: 1,
    width: '100%',
    minHeight: '80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 27,
  },
  closeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 7,
  },
  close: {
    width: 19.5,
    height: 19.5,
  },
  pagerView: {
    // flex: 1,
    width: Dimensions.get('window').width - 150,
    height: 169,
    marginTop: 28,
  },
  itemImages: {
    width: Dimensions.get('window').width - 150,
    height: 169,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  dot: {
    width: 9,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#eeeeee',
  },
  dotActive: {
    width: 9,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Color.primary,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 13
  },
  brandText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  brandContentText: {
    color: '#363636',
  },
  giftName: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
    marginTop: 5,
  },
  rowBetween: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  inventory: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#d3d3d3',
  },
  price: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 25,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#212121',
  },
  crown: {
    width: 17.67,
    height: 11.73,
    marginLeft: 5
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  likeButton: {
    width: (Dimensions.get('window').width - 60) * 0.2,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ebebeb',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  likeImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  puchageButton: {
    //width: (Dimensions.get('window').width - 60) * 0.8,
    width: (Dimensions.get('window').width) * 0.87,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#262626',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#262626',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  puchageText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  infoContents: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#e3e3e3',
    borderTopWidth: 1,
  }

});

