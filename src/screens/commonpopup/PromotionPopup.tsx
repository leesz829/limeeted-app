import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, ScrollView, Dimensions, Animated, StyleSheet } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { IMAGE, PROFILE_IMAGE, findSourcePath, ICON } from 'utils/imageUtils';
import { CommaFormat, isEmptyData } from 'utils/functions';



/* ################################################################################################################
###################################################################################################################
###### 프로모션 팝업 Component
###################################################################################################################
################################################################################################################ */

interface Props {
  popupVisible?: boolean; // popup state
  setPopupVIsible?: any; // popup setState
  isConfirm?: boolean; // confirm 여부
  title?: string; // 팝업 제목
  text?: string; // 팝업 문구
  subText?: string;
  confirmCallbackFunc?: Function | undefined; // 확인 Callback 함수
  prodList?: any;
  etcCallbackFunc?: Function | undefined;
}

const { width, height } = Dimensions.get('window');

export const PromotionPopup = (props: Props) => {
  const ref = React.useRef();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const memberBase = useUserInfo();

  const [prodList, setProdList] = React.useState([]);

  const onPressConfirm = (isNextChk) => {
    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {

    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc(isNextChk);
      props.setPopupVIsible(false);
    };
  };

  const onPressEtc = (item:any) => {
    props.etcCallbackFunc(item);
    props.setPopupVIsible(false);
  };

  const onPressItem = async (index:number) => {
    setCurrentIndex(index);
  };

  React.useEffect(() => {
    setProdList(props.prodList);
  }, [props]);

  // ################################################################ 초기 실행 함수

  return (
    <>
      <Modal visible={props.popupVisible} transparent={true}>
        <View style={modalStyle.modalBackground}>
        <LinearGradient
            colors={['#1A1E1C', '#333B41']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }} 
            style={_styles.popupContainer}>
            {/* <SpaceView viewStyle={_styles.speakerIconArea}>
              <Image source={ICON.speakerIcon} style={styles.iconSquareSize(65)} />
            </SpaceView> */}
            <SpaceView viewStyle={_styles.discountBox}>
              <Text style={_styles.discountText}>할인중</Text>
            </SpaceView>
            <Text style={_styles.recTitText}>{prodList?.length}개의 추천 상품</Text>

            <SpaceView>
              <SpaceView mb={10} viewStyle={_styles.popupContent}>
                <SpaceView>
                  {/* <SpaceView mb={10} viewStyle={{borderRadius: 10, overflow: 'hidden'}}>
                    <Image source={findSourcePath(prodList[currentIndex]?.img_path)} style={{width: width - 190, height: 150}} resizeMode={'cover'} />
                  </SpaceView>*/}
                  <SpaceView mt={20}>
                    <Text style={_styles.titleText}>{prodList[currentIndex]?.item_name}</Text>
                    <Text style={_styles.subTitleText}>{prodList[currentIndex]?.item_contents}</Text>
                  </SpaceView>
                </SpaceView>

                {(isEmptyData(prodList[currentIndex]?.discount_rate) && prodList[currentIndex]?.discount_rate != 0) && (
                  <View>
                    {/* <Image source={ICON.saleIcon} style={styles.iconSquareSize(65)} /> */}
                    <Image source={ICON.polygonGreen} style={styles.iconSquareSize(110)} />
                  </View>
                )}
              </SpaceView>


              <SpaceView mb={20} viewStyle={_styles.recItemArea}>
                
                <SpaceView mt={8} mr={30} viewStyle={{height: 50}}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={_styles.recList}>

                    {props.prodList?.map((item, index) => {
                      return (
                        <>
                          <TouchableOpacity key={index} style={_styles.prodItem(currentIndex == index)} onPress={() => { onPressItem(index); }}>
                            {/* <Image source={findSourcePath(item.img_path)} style={{width: 60, height: 45}} resizeMode={'cover'} /> */}
                            <Image source={ICON.polygonGreen} style={styles.iconSquareSize(40)} />
                            <SpaceView viewStyle={_styles.recListBox}>
                              <SpaceView mr={5} viewStyle={_styles.recDiscountBox}>
                                <Text style={_styles.recDiscountText}>{item?.discount_rate}%</Text>
                              </SpaceView>
                              <Text style={_styles.recItemName}>{item?.item_name}</Text>
                            </SpaceView>
                          </TouchableOpacity>
                        </>
                      )
                    })}
                  </ScrollView>
                </SpaceView>
              </SpaceView>

              <TouchableOpacity 
                disabled={prodList[currentIndex]?.buy_count_max < 999999 && prodList[currentIndex]?.buy_count >= prodList[currentIndex]?.buy_count_max}
                style={_styles.masterPriceArea(isEmptyData(prodList[currentIndex]?.discount_rate) && prodList[currentIndex]?.discount_rate != 0)} 
                onPress={() => { onPressEtc(prodList[currentIndex]) }}>

                <Text style={_styles.masterPercent}>
                  {(isEmptyData(prodList[currentIndex]?.discount_rate) && prodList[currentIndex]?.discount_rate != 0) && (
                    <>
                      {prodList[currentIndex]?.discount_rate}%
                    </>
                  )}
                </Text>

                <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                  <Text style={_styles.price}>{CommaFormat(prodList[currentIndex]?.shop_buy_price)}<Text style={_styles.priceUnit}>원</Text></Text>

                  {(isEmptyData(prodList[currentIndex]?.discount_rate) && prodList[currentIndex]?.discount_rate != 0) && (
                    <Text style={_styles.orgPrice}>{CommaFormat(prodList[currentIndex]?.original_price)}<Text style={_styles.orgPriceUnit}>원</Text></Text>
                  )}
                </View>
              </TouchableOpacity>
            </SpaceView>
          </LinearGradient>

          <SpaceView viewStyle={_styles.btnArea}>
            <TouchableOpacity onPress={() => onPressConfirm(true)}>
              <Text style={_styles.closeBtnText}>오늘은 그만보기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressConfirm(false)}>
              <Text style={_styles.closeBtnText}>닫기 X</Text>
            </TouchableOpacity>
          </SpaceView>
        </View>
      </Modal>
    </>
  );
};




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  popupContainer: {
      width: width - 100,
      //width: 250,
      backgroundColor: 'white',
      borderRadius: 20,
      marginTop: -40,
      padding: 15,
      //overflow: 'hidden',
  },
  popupContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountBox: {
    backgroundColor: '#FFF',
    paddingVertical: 5,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  discountText: {
    fontFamily: 'Pretendard-Medium',
    color: '#FF4D29',
    fontSize: 10,
  },
  speakerIconArea: {
    position: 'absolute',
    top: -33,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    color: '#D5CD9E',
    marginBottom: 8,
  },
  subTitleText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 12,
    color: '#D5CD9E',
  },
  // masterItemArea: {
  //   alignItems: 'center',
  // },
  recListBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  recDiscountBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  recDiscountText: {
    color: '#FF4D29', 
    fontFamily: 'Pretendard-Medium',
    fontSize: 10,
  },
  recItemName: {
    width: 60,
    fontFamily: 'Pretendard-Regular',
    color: '#D5CD9E',
    marginTop: 10,
  },
  recItemArea: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  recTitText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 10,
    color: '#D5CD9E',
    marginTop: 5,
  },
  recList: {
    width: width - 120,
    overflow: 'hidden',
    marginRight: 15,
  },
  masterPriceArea: (isDiscount:boolean) => {
    return {
      flexDirection: 'row',
      justifyContent: isDiscount ? 'space-between' : 'center',
      alignItems: 'center',
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#FFDD00',
      borderRadius: 10,
      overflow: 'hidden',
    };
  },

  masterPercent: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    color: '#FF4D29',
    marginLeft: 5,
  },
  price: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: '#3D4348',
  },
  priceUnit: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    color: '#3D4348',
  },
  orgPrice: {
    fontFamily: 'Pretendard-Light',
    fontSize: 10,
    color: '#FF4D29',
    textDecorationLine: 'line-through',
    marginRight: 3,
    marginBottom: 2,
    marginTop: -2,
  },
  orgPriceUnit: {
    fontFamily: 'Pretendard-Light',
    fontSize: 10,
    color: '#FF4D29',
  },
  btnArea: {
    width: width - 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  closeBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#D5CD9E',
  },
  prodItem: (isOn:boolean) => {
    return {
      borderRadius: 3,
      borderWidth: isOn ? 1 : 0,
      borderColor: '#FFDD00',
      overflow: 'hidden',
      marginRight: 10,
      backgroundColor: '#6A6A6A',
      width: width - 290,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    };
  },

});