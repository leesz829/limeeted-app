import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { SectionGrid } from 'react-native-super-grid';
import BannerPannel from '../Component/BannerPannel';
import ProductModal from '../Component/ProductModal';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, STACK } from 'constants/routes';
import { get_auct_product, get_product_list, order_goods } from 'api/models';
import { CommaFormat, getRemainTime } from 'utils/functions';
import { usePopup } from 'Context';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';


const DATA = [
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['PizzaPizza', 'BurgerBurger', 'RisottoRisotto'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: '01/08 ~ 01/15 (7일 후 열림)',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export default function MileageShop() {
  const [tab, setTab] = useState(categories[0]);
  const [data, setData] = useState(DATA);

  const dispatch = useDispatch();

  async function fetch() {
    if (tab.value === 'boutique') {

      // 경매 상품 목록 조회
      const { success: sa, data: ad } = await get_auct_product();
      if (sa) {
        setData(ad?.prod_list);
      }
    } else {

      // 재고 상품 목록 조회
      const { success: sp, data: pd } = await get_product_list();
      if (sp) {
        setData(pd?.prod_list);
      }
    }
  };

  async function purchaseCallFn() {
    dispatch(myProfile());
    fetch();
  };

  useEffect(() => { 
    fetch();
  }, [tab]);

  const onPressTab = (value) => {
    setTab(value);
  };

  return (
    <>
       <CommonHeader title="리밋샵" />

      <View style={styles.root}>
        <ListHeaderComponent onPressTab={onPressTab} tab={tab} />

        <SectionGrid
          itemDimension={(Dimensions.get('window').width -75) / 3}
          sections={data}
          fixed={true}
          /* ListHeaderComponent={
            
          } */
          stickySectionHeadersEnabled={false}
          // 상시판매 프로세스 적용으로 인해 삭제
          // renderSectionHeader={renderSectionHeader}
          renderItem={(props) => {
            //console.log('props : ', JSON.stringify(props));
            const { item, index, rowIndex } = props;
            return <RenderItem type={tab.value} item={item} callFn={purchaseCallFn} />;
          }}
        />
      </View>
    </>
  );
}

// ######################################################################### 카테고리 렌더링
const RenderCategory = ({ onPressTab, tab }) => {
  return categories?.map((item) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.categoryBorder(item.value === tab.value)}
      onPress={() => onPressTab(item)}
    >
      <Text style={styles.categoryText(item.value === tab.value)}>
        {item?.label}
      </Text>
    </TouchableOpacity>
  ));
};

// ######################################################################### List Header 렌더링
function ListHeaderComponent({ onPressTab, tab }) {
  return (
    <View>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
          <BannerPannel />
        </View>
      </View>
      <View style={styles.categoriesContainer}>
        <RenderCategory onPressTab={onPressTab} tab={tab} />
      </View>
    </View>
  );
}

// ######################################################################### 상품 아이템 렌더링
const RenderItem = ({ item, type, callFn }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const { show } = usePopup();  // 공통 팝업

  // 상품 이미지 경로
  const imagePath = findSourcePath(item?.file_path + item?.file_name);

  const onPressItem = (item) => {
    // ==================== 재고상품 주문 팝업
    if (type === 'gifticon') {
      if(item.prod_cnt < 1){
        return false;
      }
      setTargetItem(item);
      setModalVisible(true);
    } else {
      navigation.navigate(STACK.COMMON, {
        screen: ROUTES.Auction_Detail,
        params: { prod_seq: item?.prod_seq, modify_seq: item?.modify_seq },
      });
    }
  };
  // const closeModal = () => setModalVisible(false);
  const closeModal = (isPayConfirm: boolean) => {
    setModalVisible(false);

    if(isPayConfirm) {
      callFn();
    }
  };

  const remainTime = getRemainTime(
    item?.sell_yn === 'Y' ? item?.buy_end_dt : item?.buy_start_dt,
    item?.sell_yn === 'Y'
  );

  // ######################################## 재고상품 구매하기 함수
  const productPurchase = async (item:any) => {
    try {
      show({
        title: '상품 구매',
        content: '상품을 구매하시겠습니까?' ,
        cancelCallback: function() {
          closeModal();
        },
        confirmCallback: async function() {
          const body = {
            prod_seq: item.prod_seq,
            modify_seq: item.modify_seq,
            buy_price: item.buy_price,
            mobile_os: Platform.OS,
          }
          const { success, data } = await order_goods(body);
          console.log('data :::: ', data);
          if (success) {
            if(data.result_code == '0000') {
              show({
                content: '구매에 성공하였습니다.' ,
                confirmCallback: function() { 
                  closeModal(); 
                  navigation.navigate(STACK.TAB, { screen: 'Shop' });
                }
              });
            } else {
              show({
                content: data.result_msg ,
                confirmCallback: function() { closeModal(); }
              });
            }
          } else {
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() { closeModal(); }
            });
          }
        }
      });
    } catch (err: any) {
      console.warn(err.code, err.message);
      //setErrMsg(JSON.stringify(err));
    }
  }


  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.renderItem}
        onPress={() => onPressItem(item)}>

        <View style={{ flexDirection: 'column' }}>
          <Image style={styles.thumb} source={imagePath} />

          <View style={{ paddingHorizontal: 3 }}>
            <Text style={styles.brandName}>{item?.brand_name}</Text>
            <Text style={styles.productName}>{item?.prod_name}</Text>
            <View style={[styles.textContainer, { marginTop: 5, justifyContent: 'flex-start' }]}>
              <Text style={styles.price}>{CommaFormat(item?.buy_price)}</Text>
              <Image source={ICON.crown} style={styles.crown} />
              {type !== 'gifticon' && (
                <Text style={styles.hintText}>즉시 구매가</Text>
              )}
            </View>
            {type === 'gifticon' ? (
              <View style={styles.textContainer}>
                {
                  item.prod_cnt > 0 ?
                    <Text style={styles.hintText}>{item.prod_cnt} 개 남음</Text> :
                    <Text style={styles.soldOutText}>품절</Text>
                }
                
                {/* <Text style={styles.hintText}>6/2 열림</Text> */}
                <Text style={styles.price}></Text>
              </View>
            ) : (
              <View style={styles.textContainer}>
                <Text style={styles.price}>50,000</Text>
                <Text style={styles.hintText}>입찰가</Text>
              </View>
            )}
          </View>
          <Text style={styles.remainText}>{remainTime}</Text>
        </View>

        {/* ####################### 상품 팝업 */}
        <ProductModal
          isVisible={modalVisible}
          type={type}
          item={targetItem}
          closeModal={closeModal}
          // productPurchase={productPurchase}
        />
      </TouchableOpacity>
    </>
  );
};

const renderSectionHeader = (props) => {
  const { section } = props;
  const sample = section.data[0];

  if (!Array.isArray(sample) ||
      sample.length === 0) {
    return null;
  } else {
    return (
      <View style={{ marginTop: 30, paddingHorizontal: 16 }}>
        <Text>{section.title}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white', paddingHorizontal: 0 },
  categoriesContainer: {
    marginTop: 160,
    marginBottom: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
    paddingHorizontal: 10
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      paddingVertical: 9,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : Color.grayAAAA,
      borderRadius: 9,
      marginLeft: 8,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontSize: 14,
      color: isSelected ? Color.primary : Color.grayAAAA,
    };
  },
  renderItem: {
    width: (Dimensions.get('window').width - 75) / 3,
    marginTop: 10,
    flex: 1,
  },
  thumb: {
    width: (Dimensions.get('window').width - 72) / 3,
    height: (Dimensions.get('window').width - 72) / 3,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  brandName: {
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'AppleSDGothicNeoM00',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 5,
  },
  productName: {
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'AppleSDGothicNeoM00',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
    marginTop: 2,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    // fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  hintText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#d3d3d3',
  },
  soldOutText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FE0456',
  },
  remainText: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: Color.gray8888,
    fontSize: 9,
  },
  crown: {
    width: 12.7,
    height: 8.43,
    marginTop: 5,
    marginLeft: 2,
  },
});

const categories = [
  {
    label: '기프티콘',
    value: 'gifticon',
  },
  /* {
    label: '부띠끄',
    value: 'boutique',
  }, */
];
