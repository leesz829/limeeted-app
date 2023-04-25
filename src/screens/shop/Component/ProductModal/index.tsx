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
} from 'react-native';
import Modal from 'react-native-modal';
import { findSourcePath, ICON } from 'utils/imageUtils';
import ViewPager from '../ViewPager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api_domain } from 'utils/properties';
import { CommaFormat } from 'utils/functions';
import {
  initConnection,
  getProducts,
  requestPurchase,
  getAvailablePurchases,
} from 'react-native-iap';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { usePopup } from 'Context';


interface Props {
  isVisible: boolean;
  type: string; /* bm: bm상품, gifticon: 재고상품, boutique: 경매상품 */
  closeModal: () => void;
  item: any;
  productPurchase: (item_code: string) => void;
}

export default function ProductModal({ isVisible, type, closeModal, item, productPurchase }: Props) {
  const { show } = usePopup(); // 공통 팝업

  const { bottom } = useSafeAreaInsets();

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



  const purchaseBtn = async () => {

    /* show({
      title: '상품 구매',
      content: '상품을 구매하시겠습니까?' ,
      canncelCallback: function() {

      },
      confirmCallback: function() {
        productPurchase(item_code && item_code);
      }
    }); */

    setComfirmModalVisible(true);
  }
  

  return (
    <Modal isVisible={isVisible} 
            style={modalStyleProduct.modal}
            onRequestClose={() => {
              closeModal();
              console.log("modal appearance")
            }}>

      <View style={modalStyleProduct.root}>
        <View style={modalStyleProduct.closeContainer}>
          <TouchableOpacity onPress={closeModal} hitSlop={commonStyle.hipSlop20}>
            <Image source={ICON.closeBlack} style={modalStyleProduct.close} />
          </TouchableOpacity>
        </View>

        <ViewPager
          data={images}
          style={modalStyleProduct.pagerView}
          renderItem={(data) => <Image source={data} style={modalStyleProduct.itemImages} />}
        />

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
                {CommaFormat(item?.shop_buy_price != null ? item?.shop_buy_price : item?.buy_price) + (item?.money_type_code == 'PASS' ? '패스' : '원')}
              </Text>
              {/*<Image source={ICON.crown} style={modalStyleProduct.crown} />*/}
            </View>  
          </View>
          <View style={modalStyleProduct.infoContents}>
              <Text style={modalStyleProduct.brandContentText}>{prod_content}</Text>
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
              <TouchableOpacity style={modalStyleProduct.puchageButton} onPress={() => purchaseBtn()}>
                <Text style={modalStyleProduct.puchageText}>구매하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>

      {/* ###################### 구매하기 Confirm 팝업 */}
      <Modal isVisible={comfirmModalVisible} transparent={true} style={modalStyleProduct.modal}>
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
									onPress={() => productPurchase(item_code && item_code)}>
									<CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
										확인하기
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

    </Modal>
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
    marginTop: 30,
    paddingHorizontal: 7,
  },
  close: {
    width: 19.5,
    height: 19.5,
  },
  pagerView: {
    // flex: 1,
    width: Dimensions.get('window').width - 60,
    height: 229,
    marginTop: 28,
  },
  itemImages: {
    width: Dimensions.get('window').width - 60,
    height: 229,
    borderRadius: 10,
    backgroundColor: '#727272',
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
