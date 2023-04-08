import { Color } from 'assets/styles/Color';
import React from 'react';
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


interface Props {
  isVisible: boolean;
  type: string; /* bm: bm상품, gifticon: 재고상품, boutique: 경매상품 */
  closeModal: () => void;
  item: any;
  productPurchase: () => void;
}

export default function ProductModal({ isVisible, type, closeModal, item, productPurchase }: Props) {
  console.log('item :::::: ', item);

  const { bottom } = useSafeAreaInsets();

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

  return (
    <Modal isVisible={isVisible} style={modalStyle.modal}>
      <View style={modalStyle.root}>
        <View style={modalStyle.closeContainer}>
          <TouchableOpacity onPress={closeModal}>
            <Image source={ICON.closeBlack} style={modalStyle.close} />
          </TouchableOpacity>
        </View>
        <ViewPager
          data={images}
          style={modalStyle.pagerView}
          renderItem={(data) => <Image source={data} style={modalStyle.itemImages} />}
        />
        <View style={modalStyle.infoContainer}>
          {brand_name != '' && brand_name != null ? (
            <Text style={modalStyle.brandText}>{brand_name}</Text>
          ) : null}

          <Text style={modalStyle.giftName}>{prod_name}</Text>
          <View style={modalStyle.rowBetween}>
            <Text style={modalStyle.inventory}>
              {type == 'gifticon' ? CommaFormat(item?.prod_cnt) + '개 남음' : null}

              {/* {CommaFormat(item?.buy_count_max)}개 남음 */}
            </Text>
            <View style={modalStyle.rowCenter}>
              <Text style={modalStyle.price}>
                {CommaFormat(item?.shop_buy_price != null ? item?.shop_buy_price : item?.buy_price)}
              </Text>
              <Image source={ICON.crown} style={modalStyle.crown} />
            </View>  
          </View>
          <View style={modalStyle.infoContents}>
              <Text>{prod_content}</Text>
          </View>
          <View
            style={[
              modalStyle.bottomContainer,
              {
                marginBottom: bottom + 10,
              },
            ]}
          >
            <View style={modalStyle.rowBetween}>
              {/* <TouchableOpacity style={modalStyle.likeButton}>
                <Image source={ICON.storage} style={modalStyle.likeImage} />
              </TouchableOpacity> */}
              <TouchableOpacity style={modalStyle.puchageButton} onPress={() => productPurchase(item)}>
                <Text style={modalStyle.puchageText}>구매하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}



{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const modalStyle = StyleSheet.create({
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
