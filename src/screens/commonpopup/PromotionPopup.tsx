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
          <SpaceView viewStyle={_styles.popupContainer}>
            <SpaceView viewStyle={_styles.speakerIconArea}>
              <Image source={ICON.speakerIcon} style={styles.iconSquareSize(65)} />
            </SpaceView>

            <SpaceView viewStyle={_styles.popupContent}>
              {(isEmptyData(prodList[currentIndex]?.discount_rate) && prodList[currentIndex]?.discount_rate != 0) && (
                <View style={_styles.saleIconArea}>
                  <Image source={ICON.saleIcon} style={styles.iconSquareSize(65)} />
                </View>
              )}

              <SpaceView mb={30} viewStyle={_styles.masterItemArea}>
                <SpaceView mb={10} viewStyle={{borderRadius: 10, overflow: 'hidden'}}>
                  <Image source={findSourcePath(prodList[currentIndex]?.img_path)} style={{width: width - 190, height: 150}} resizeMode={'cover'} />
                </SpaceView>
                <SpaceView>
                  <Text style={_styles.titleText}>{prodList[currentIndex]?.item_name}</Text>
                  <Text style={_styles.subTitleText}>{prodList[currentIndex]?.item_contents}</Text>
                </SpaceView>
              </SpaceView>

              <SpaceView ml={15} mb={20} viewStyle={_styles.recItemArea}>
                <Text style={_styles.recTitText}>{prodList?.length}개의 추천 상품</Text>
                <SpaceView mt={8} ml={8} mr={30} viewStyle={{height: 40}}>
                  <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={_styles.recList}>

                    {props.prodList?.map((item, index) => {
                      return (
                        <>
                          <TouchableOpacity key={index} style={_styles.prodItem(currentIndex == index)} onPress={() => { onPressItem(index); }}>
                            <Image source={findSourcePath(item.img_path)} style={{width: 60, height: 45}} resizeMode={'cover'} />
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

            <SpaceView viewStyle={_styles.btnArea}>
              <TouchableOpacity onPress={() => onPressConfirm(true)}>
                <Text style={_styles.closeBtnText}>오늘은 그만보기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPressConfirm(false)}>
                <Text style={_styles.closeBtnText}>닫기 X</Text>
              </TouchableOpacity>
            </SpaceView>
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
      paddingHorizontal: 0,
      paddingTop: 60,
      //overflow: 'hidden',
  },
  popupContent: {
    
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
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#363636',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitleText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    color: '#767997',
    textAlign: 'center',
    marginHorizontal: 45,
    minHeight: 55,
  },
  masterItemArea: {
    alignItems: 'center',
  },
  recItemArea: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  recTitText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#767997',
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
      marginHorizontal: 18,
      marginBottom: 10,
      paddingHorizontal: 10,
      backgroundColor: '#FE0456',
      borderRadius: 10,
      overflow: 'hidden',
      height: 60,
    };
  },

  masterPercent: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 30,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  price: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
    color: '#FFFFFF',
  },
  priceUnit: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 18,
    color: '#fff',
  },
  orgPrice: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 20,
    color: '#FFBED3',
    textDecorationLine: 'line-through',
    marginTop: -7,
    marginRight: 3,
    marginBottom: 2,
  },
  orgPriceUnit: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    color: '#FFBED3',
  },
  btnArea: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  closeBtnText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    color: '#FFFFFF',
  },
  prodItem: (isOn:boolean) => {
    return {
      borderRadius: 3,
      borderWidth: isOn ? 1 : 0,
      borderColor: '#FE0456',
      overflow: 'hidden',
      marginRight: 10,
    };
  },
  saleIconArea: {
    position: 'absolute',
    top: 5,
    left: 8,
    zIndex: 1,
  },

});