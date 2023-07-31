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
import { CommonLoading } from 'component/CommonLoading';
import SpaceView from 'component/SpaceView';


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

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  
  let timer:any;
  
  let tmpLeftSecondsArr: { left_seconds: number; prod_seq: number }[] = [];

  const [leftSecondsArr, setLeftSecondsArr] = useState<any>({
    left_seconds: 0
    , prod_seq: 0
  });
  
  const fnAuctTimeCount = async () => {
    tmpLeftSecondsArr.filter((e, i) => {
      e.left_seconds = e.left_seconds - 1;
    })
    
    
    setLeftSecondsArr(tmpLeftSecondsArr);

    /*
    

    console.log('leftSecondsArr ::: ' , leftSecondsArr);
    */
    /*
    data.filter((e, i) => {
      e.data.filter((o, j) => {
        o.left_seconds = o.left_seconds - 1;
      })
    })
    */
    
    // console.log('data :::: ', data[1].data[0].left_seconds);

    // setDeleteList((prev) => prev.filter((i) => i !== item));
    /*
    setData((prev) => 
      prev.filter((e, i) => {
        e.data.filter((o, j) => {
          console.log('o :::::::: ' , o)
          o.left_seconds = o.left_seconds - countSecond++;
        })
      })
    );
    */
    
    // console.log('fnAuctTimeCount data ::: ' , data.data);

    // console.log(countSecond++, data);
/*
    setData((prev) => data.filter((e, i) => {
      console.log('e :::::::: ' , e)
        
    }));
*/


  }
  

  async function fetch() {
    setIsLoading(true);

    try {
      if(tab.value === 'boutique') {

        // 경매 상품 목록 조회
        const { success: sa, data: ad } = await get_auct_product();
        if (sa) {
          if(ad?.prod_list.length > 0) {
            setData(ad?.prod_list);

            ad?.prod_list.forEach(e => {
              tmpLeftSecondsArr.push({'left_seconds': e.data[0].left_seconds, 'prod_seq':e.data[0].prod_seq });
            });
          };
        };
  
      } else {
  
        // 재고 상품 목록 조회
        const { success: sp, data: pd } = await get_product_list();
        if (sp) {
          setData(pd?.prod_list);
        };
      };

    } catch {
    
    } finally {
      setIsLoading(false);
    };
  };

  async function purchaseCallFn() {
    dispatch(myProfile());
    fetch();
  };

  useEffect(() => { 
    fetch();

    // timer = setInterval(fnAuctTimeCount, 1000);
    // return () => clearInterval(timer);
  }, [tab]);

  const onPressTab = (value) => {
    setIsLoading(true);
    setTab(value);
  };

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title="리밋샵" />

      <View style={_styles.root}>
        <ListHeaderComponent onPressTab={onPressTab} tab={tab} />

        <SectionGrid
          itemDimension={tab.value == 'gifticon' ? (Dimensions.get('window').width -75) / 3 : Dimensions.get('window').width - 37}
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
            return (
              <>
                {!isLoading ? (
                  <RenderItem type={tab.value} item={item} callFn={purchaseCallFn} />
                ) : (
                  <View></View>
                )}
              </>
            )
          }}
        />
      </View>
    </>
  );
}

// ######################################################################### 카테고리 렌더링
const RenderCategory = ({ onPressTab, tab }) => {
  return categories?.map((item, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      style={_styles.categoryBorder(item.value === tab.value)}
      onPress={() => onPressTab(item)}>

      <Text style={_styles.categoryText(item.value === tab.value)}>
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
      <View style={_styles.categoriesContainer}>
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
        params: {
          prod_seq: item?.prod_seq, 
          modify_seq: item?.modify_seq 
        },
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
          closeModal(false);
        },
        confirmCallback: async function() {
          const body = {
            prod_seq: item.prod_seq,
            modify_seq: item.modify_seq,
            buy_price: item.buy_price,
            mobile_os: Platform.OS,
          }
          const { success, data } = await order_goods(body);
          
          closeModal(false);

          if (success) {
            if(data.result_code == '0000') {
              show({
                content: '구매에 성공하였습니다.' ,
                confirmCallback: function() {
                  closeModal(false);
                  navigation.navigate(STACK.TAB, { screen: 'Shop' });
                }
              });
            } else {
              show({
                content: data.result_msg ,
                confirmCallback: function() { closeModal(false); }
              });
            }
          } else {
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() { closeModal(false); }
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
      {/* boutique : 경매 상품 목록,  gifticon : 기프티콘 재고 상품 목록 */}
      {type == 'boutique' ? (
        <View style={_styles.renderItem02}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => 
                                                                console.log('item ::: ' , item)
                                                               // onPressItem(item)
                                                              }>
            <View style={{ flexDirection: 'row' }}>
              
              <SpaceView viewStyle={_styles.thumbArea}>
                <Image style={_styles.thumb02} source={imagePath} resizeMode={'cover'} />
              </SpaceView>

              <SpaceView viewStyle={_styles.textArea}>
                <SpaceView mt={17}>
                  <Text style={_styles.boutiqueStatus('')}>낙찰</Text>
                  
                  <Text style={_styles.brandName}>{item?.brand_name}</Text>
                  <Text style={_styles.productName(type)}>{item?.prod_name}</Text>
                </SpaceView>

                <SpaceView mb={10}>
                  <View style={[_styles.textContainer]}>
                    <View>
                      <Text style={_styles.hintText}>즉시구매가</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={_styles.priceText(13)}>{CommaFormat(item?.now_buy_price)}</Text>
                      <Image source={ICON.crown} style={_styles.crown} />
                    </View>
                  </View>
                  
                  <View style={_styles.textContainer}>
                    <View>
                      <Text style={_styles.bidText('#8855D3')}>입찰가<Text style={_styles.bidSubText('#8855D3')}>(입찰중)</Text></Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={_styles.priceText(13)}>{CommaFormat(item?.now_bid_price)}</Text>
                      <Image source={ICON.crown} style={_styles.crown} />
                    </View>
                  </View>
                </SpaceView>
              </SpaceView>

              <Text style={_styles.remainText}>{remainTime}</Text>
            </View>        
          </TouchableOpacity>
        </View>

      ) : (

        <TouchableOpacity activeOpacity={0.8} style={_styles.renderItem} onPress={() => onPressItem(item)}>
          <View style={{ flexDirection: 'column' }}>

            <SpaceView viewStyle={_styles.thumbArea}>
              <Image style={_styles.thumb} source={imagePath} resizeMode={'cover'} />
            </SpaceView>

            <View style={{ paddingHorizontal: 3 }}>
              <Text style={_styles.brandName}>{item?.brand_name}</Text>
              <Text style={_styles.productName(type)}>{item?.prod_name}</Text>

              <SpaceView mt={5}>
                <View style={[_styles.textContainer]}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={_styles.priceText(12)}>{type === 'gifticon' ? CommaFormat(item?.buy_price) : CommaFormat(item?.now_buy_price)}</Text>
                    <Image source={ICON.crown} style={_styles.crown} />
                  </View>
                </View>
                <View style={_styles.textContainer}>
                    {
                      item.prod_cnt > 0 ?
                        <Text style={_styles.hintText}>{item.prod_cnt}개 남음 ({item.buy_cnt}/{item.base_buy_sanction_cnt}구매)</Text> :
                        <Text style={_styles.soldOutText}>품절</Text>
                    }
                    
                    {/* <Text style={styles.hintText}>6/2 열림</Text> */}
                    <Text style={_styles.priceText(12)}></Text>
                  </View>
              </SpaceView>
            </View>

            <Text style={_styles.remainText}>{remainTime}</Text>
          </View>        
        </TouchableOpacity>
      )}

      {/* ####################### 상품 팝업 */}
      <ProductModal
        isVisible={modalVisible}
        type={type}
        item={targetItem}
        closeModal={closeModal}
        // productPurchase={productPurchase}
      />
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



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: 'white', 
    paddingHorizontal: 0,
  },
  categoriesContainer: {
    marginTop: 160,
    marginBottom: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'flex-start',
    paddingHorizontal: 20
  },
  categoryBorder: (isSelected: boolean) => {
    return {
      width: 80,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: isSelected ? Color.primary : '#ECECEC',
      borderRadius: 9,
      marginRight: 8,
    };
  },
  categoryText: (isSelected: boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoM00',
      fontSize: 14,
      color: isSelected ? Color.primary : '#A5A5A5',
      textAlign: 'center',
    };
  },
  renderItem: {
    width: (Dimensions.get('window').width - 75) / 3,
    marginTop: 10,
    flex: 1,
  },
  renderItem02: {
    position: 'relative',
    //flexWrap: 'wrap',
    //padding: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 37,
    height: (Dimensions.get('window').width) / 2.6,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15
  },
  thumbArea: {
    
  },
  textArea: {
    width: (Dimensions.get('window').width) / 2.5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  thumb: {
    width: (Dimensions.get('window').width - 75) / 3,
    height: (Dimensions.get('window').width - 75) / 3,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  thumb02: {
    width: (Dimensions.get('window').width) / 2,
    height: (Dimensions.get('window').width) / 2.6,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  brandName: {
    fontSize: 10,
    fontFamily: 'AppleSDGothicNeoM00',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 5,
  },
  productName: (type: string) => {
    return {
      fontSize: type == 'boutique' ? 14 : 13,
      fontFamily: 'AppleSDGothicNeoM00',
      letterSpacing: 0,
      textAlign: 'left',
      color: '#363636',
      marginTop: 2,
    };
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  priceText: (fontSize:number) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: fontSize,
      fontWeight: 'bold',
      letterSpacing: 0,
      textAlign: 'left',
      color: '#363636',
    };
  },
  hintText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    //color: '#d3d3d3',
    color: '#C1C1C1',
  },
  soldOutText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
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
    marginLeft: 4,
  },
  boutiqueStatus: (type:string) => {
    /*
      낙찰 : SOLD
      , 60분 후 낙찰 (일, 시간) : MIN
      , 60초후낙찰 : SCND
    */
   let backgroundColor = (type=='SOLD'?'#69C9E6':'#000000');
   let fontColor = (type=='SCND'?'#FFC100':'#fff');
   
   return {
     fontFamily: 'AppleSDGothicNeoM00',
     fontSize: 10,
     color: fontColor,
     backgroundColor: backgroundColor,
     borderRadius: 7,
     width: 45,
     textAlign: 'center',
     paddingVertical: 1,
   };
  },
  bidText: (color:string) => {
    return {
      fontFamily: 'AppleSDGothicNeoM00',
      fontSize: 10,
      color: color,
    };
  },
  bidSubText: (color:string) => {
    return {
      fontFamily: 'AppleSDGothicNeoM00',
      fontSize: 8,
      color: color,
    };
  },  

});

const categories = [
  {
    label: '기프티콘',
    value: 'gifticon',
  },
  {
    label: '부티크',
    value: 'boutique',
  },
];
