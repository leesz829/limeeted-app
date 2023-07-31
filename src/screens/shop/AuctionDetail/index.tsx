import { useRoute, useNavigation } from '@react-navigation/native';
import { get_auct_detail } from 'api/models';
import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import { useUserInfo } from 'hooks/useUserInfo';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommaFormat, getRemainTime } from 'utils/functions';
import { ICON, findSourcePath } from 'utils/imageUtils';
import ViewPager from '../Component/ViewPager';
import dayjs from 'dayjs';
import { api_domain } from 'utils/properties';
import { order_auct } from 'api/models';
import { usePopup } from 'Context';
import { ROUTES, STACK } from 'constants/routes';
import SpaceView from 'component/SpaceView';



export default function AuctionDetail() {
  const navigation = useNavigation();
  const { show } = usePopup();  // 공통 팝업
  const [auctIndex, setAuctIndex] = useState(1);

  const { prod_seq, modify_seq } = useRoute().params;

  const [data, setData] = useState(null);
  const [nowBidPrice, setNowBidPrice] = useState(0);
  const [hasMileage, setHasMileage] = useState(0);
  const [biddingBtnFlag, setBiddingBtnFlag] = useState(true);
  const [auctTimeText, setAuctTimeText] = useState('');
  const [auctTimeType, setAuctTimeType] = useState('');
  let buyEndDt = '';
  let countSecond = 0;
  
  const me = useUserInfo();
  let timer:any;

  const images = data?.images?.map((img) => {
    const imagePath =  findSourcePath(img?.file_path + img?.file_name);
    return imagePath;
  });


  const fnAuctTimeCount = async () => {
    console.log('buyEndDt ::: ' , buyEndDt);

    // 2023-07-31 18:00:00
    let date = new Date(buyEndDt);
    let now = new Date();
    date.setSeconds(date.getSeconds() - countSecond++);
    
    let diff = (date.getTime() - now.getTime()) / (1000*60*60*24);
    let timeTypeName = '일';
    let auctTimeTypeCode = 'D';

    if(diff < 1){
      auctTimeTypeCode = 'H'
      diff = diff * 24;
      timeTypeName = '시';
      if(diff < 1){
        auctTimeTypeCode = 'M'
        diff = diff * 60;
        timeTypeName = '분';
        if(diff < 1){
          auctTimeTypeCode = 'S'
          diff = diff * 60;
          timeTypeName = '초';
        }
      }
    }

    if(Math.floor(diff) < 0){
      clearInterval(timer);

      show({
        title: '상품 낙찰',
        content: '아쉽게도 보고 계신 상품이 지금 낙찰되었습니다.\n부티크 상점으로 이동합니다.',
        confirmCallback: function () {
          navigation.navigate(STACK.COMMON, 
            { screen: ROUTES.Mileage_Shop }
          );
        },
      });

      return false;
    }
    setAuctTimeType(auctTimeTypeCode);
    setAuctTimeText(auctTimeText => Math.round(diff) + timeTypeName)
  }

  
  const fetch = async () => {
    const body = { prod_seq, modify_seq };
    const { success, data } = await get_auct_detail(body);

    buyEndDt = data.prod_detail.buy_end_dt;

    // setNowBidPrice
    if (success) {
      setData({
        images: data?.prod_img_list,
        ...data?.prod_detail,
        auct_list: data?.auct_list,
      });
    }

    // 현재 입찰 가능 금액
    setNowBidPrice(data.prod_detail.now_bid_price);
    setHasMileage(data.has_mileage);
  }

  useEffect(() => {
    fetch();

    timer = setInterval(fnAuctTimeCount, 1000);
    return () => clearInterval(timer);
  }, []);


  const setBidding = (item:any, index:number) =>{
    setAuctIndex(index);
    setNowBidPrice(item?.bid_price);

    setBiddingBtnFlag(item.bid_price > hasMileage?false:true);
  }
  
  // ######################################## 경매상품 구매하기 함수
  const productPurchase = async (nowBuyYn:string) => {

    let modalTitle = nowBuyYn == 'Y' ? '즉시 구매하기' : '입찰하기';
    let modalContent = nowBuyYn == 'Y' ? '표기 된 리밋 수량을 소모하고\n 즉시구매 하시겠습니까?' : '표기 된 호가로 입찰 신청하시겠습니까?';
    let req_bid_price = nowBuyYn == 'Y' ? data?.now_buy_price : nowBidPrice;

    try {
      show({
        title: modalTitle,
        content: modalContent,
        cancelCallback: function() {
          
        },
        confirmCallback: async function() {
          
          const body = {
            prod_seq: prod_seq,
            modify_seq: modify_seq,
            req_bid_price: req_bid_price,
            now_buy_yn: nowBuyYn,
            mobile_os: Platform.OS,
          }
          const { success, data } = await order_auct(body);
          
          if (success) {
            if(data.result_code == '0000') {
              show({
                content: nowBuyYn == 'Y'?'구매에 성공하였습니다.':'입찰되었습니다.' ,
                confirmCallback: function() { 
                  navigation.navigate(STACK.TAB, { screen: 'Shop' });
                }
              });
            } else {
              show({
                content: data.result_msg ,
                confirmCallback: function() { }
              });
            }
          } else {
            show({
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() { }
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
    <View style={_styles.root}>
      <CommonHeader title="입찰하기" />

      <FlatList
        data={data?.auct_list}
        style={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListHeaderComponent={
          <>
            {images != null ? (
              <ViewPager
                data={images}
                style={_styles.pagerView}
                renderItem={(data) => <Image source={data} style={_styles.itemImages} />}
              />
            ) : null}
            
            <View style={_styles.infoContainer}>
              <Text style={_styles.brandText}>{data?.brand_name}</Text>
              <Text style={_styles.giftName}>{data?.prod_name}</Text>
              <View style={_styles.rowBetween}>
                <Text style={_styles.inventory}>{data?.prod_content}</Text>                
              </View>
              <View style={_styles.spacer} />
              <View style={_styles.currency}>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={_styles.roundCrown} source={ICON.roundCrown} />
                  <Text style={_styles.currencyText}>보유 리밋</Text>
                </View>
                <View>
                  <Text style={_styles.currenyAmount}>
                    {CommaFormat(me?.mileage_point)}
                  </Text>
                </View>
              </View>

              <View style={_styles.dashline} />

              <View style={_styles.tableHeader}>
                <Text style={_styles.tableHeaderText}>현재 입찰 상황</Text>
              </View>

              <View style={_styles.rowStyle}>
                <Text style={_styles.rowTextLeft}>상황</Text>
                <Text style={_styles.rowTextCenter}>입찰가</Text>
                <Text style={_styles.rowTextRight}>상태</Text>
              </View>

            </View>
          </>
        }

        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => index != 0 && setBidding(item, index) }>
            <View style={_styles.itemStyle}>
              <Text style={index === 0?_styles.ItemRowTextLeft:_styles.ItemRowTextLeftPurple}>
                {index === 0 && '현재 입찰가'}
                {(index != 0 && index === auctIndex) && '희망 입찰가'}
              </Text>
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={ item.bid_price > hasMileage?_styles.ItemRowTextCenterRed:
                              index != auctIndex?_styles.ItemRowTextCenter:_styles.ItemRowTextCenterPurple}>
                  {CommaFormat(item?.bid_price)}
                </Text>
                <Image style={_styles.smallCrown} source={ICON.crown} />
              </View>
              
              {index === 0 ?
                    <View style={{width: '30%'}}>
                      <Text>
                        
                        <Text style={auctTimeType == 'D'?null:auctTimeType == 'H' || auctTimeType == 'M' ? {color: '#8657D4'} : {color: '#FFC100'} }>
                          {auctTimeText}
                        </Text>
                          {'후 낙찰'}
                      </Text>
                        
                    </View>:
                    <Text style={ item.bid_price > hasMileage?_styles.ItemRowTextRightRed:_styles.ItemRowTextRightPurple}>
                      {(index != 0 && index === auctIndex && item.bid_price < hasMileage) && '입찰가능'}
                      {(index != 0 && item.bid_price > hasMileage ) && '보유리밋 부족'}
                    </Text>
              }

            </View>
          </TouchableOpacity>
        )}
      />
      <View
        style={[
          {
            marginBottom: 10,
            backgroundColor: 'transparent',
          },
        ]}
      >
        <View style={_styles.rowAround}>
          <TouchableOpacity style={_styles.puchageButton} onPress={() => productPurchase('N')}>
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={_styles.puchageText}>즉시구매</Text>
            </View>
            <Seperator />
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text style={_styles.priceText}>
                {CommaFormat(data?.now_buy_price)}
              </Text>
              <Image style={_styles.topCrown} source={ICON.crown} />
            </View>
          </TouchableOpacity>
          
        {biddingBtnFlag?
          <TouchableOpacity style={_styles.bidButton} onPress={() => productPurchase('N')}>
          <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <Text style={_styles.puchageText}>입찰</Text>
          </View>
          <Seperator />
          <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <Text style={_styles.priceText}>
              {CommaFormat(nowBidPrice)}
            </Text>
            <Image style={_styles.topCrown} source={ICON.crown} />
          </View>
        </TouchableOpacity>
        :<TouchableOpacity style={_styles.bidNoButton}>
          <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <Text style={_styles.puchageText}>입찰</Text>
          </View>
          <Seperator />
          <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <Text style={_styles.priceRedText}>
              {CommaFormat(nowBidPrice)}
            </Text>
            <Text style={_styles.priceRedNoText}>
              {'보유리밋 부족'}
            </Text>
            <Image style={_styles.topCrown} source={ICON.crown} />
          </View>
        </TouchableOpacity>
        }
          
        
        {/*
          <TouchableOpacity style={_styles.bidNoButton} onPress={() => productPurchase('N')}>
            <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={_styles.puchageText}>입찰</Text>
            </View>
            <Seperator />
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text style={_styles.priceRedText}>
                {CommaFormat(nowBidPrice)}
              </Text>
              <Text style={_styles.priceRedNoText}>
                {'보유리밋 부족'}
              </Text>
              <Image style={_styles.topCrown} source={ICON.crown} />
            </View>
          </TouchableOpacity>
      */}
        </View>
      </View>
    </View>
  );
}

const Seperator = () => (
  <View
    style={{
      width: 1,
      height: 22,
      opacity: 0.1,
      backgroundColor: '#ffffff',
      marginHorizontal: 10,
    }}
  />
);



{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const _styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  pagerView: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.65,
  },
  itemImages: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.65,

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
    paddingHorizontal: 16,
  },
  brandText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 12,
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
  rowAround: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
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
  smallCrown: {
    width: 15,
    height: 10,
  },
  crown: {
    width: 17.67,
    height: 11.73,
    marginLeft: 5,
  },
  spacer: {
    width: '100%',
    height: 1,
    backgroundColor: '#e3e3e3',
    marginTop: 10,
  },
  currency: {
    width: '100%',
    borderRadius: 15.5,
    backgroundColor: '#8657d4',
    marginTop: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`,
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  currencyText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  roundCrown: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  currenyAmount: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  duration: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    textAlign: 'left',
    color: '#7b7b7b',
    marginLeft: 5,
  },
  durationSub: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#d3d3d3',
    marginLeft: 3,
  },
  dashline: {
    height: 1,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderStyle: 'dashed',
    marginTop: 12.5,
  },
  tableHeader: {
    width: '100%',
    backgroundColor: '#ededed',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ececec',
    marginTop: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  tableHeaderText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7b7b7b',
  },
  rowStyle: {
    width: '100%',
    borderStyle: 'solid',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#e3e3e3',
    padding: 4,
  },
  rowTextLeft: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7b7b7b',
    width: '33%',
  },
  rowTextCenter: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#7b7b7b',
    width: '30%',
  },
  rowTextRight: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'right',
    color: '#7b7b7b',
    width: '33%',
  },
  ItemRowTextLeft: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7b7b7b',
    width: '30%',
  },
  ItemRowTextLeftPurple: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#8657d4',
    width: '30%',
  },
  ItemRowTextCenterPurple: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#8657d4',
    width: '40%',
  },
  ItemRowTextRightPurple: {
    opacity: 0.8,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'right',
    color: '#8657d4',
    width: '30%',
  },

  ItemRowTextCenterRed: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FF5858',
    width: '40%',
  },
  ItemRowTextRightRed: {
    opacity: 0.8,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'right',
    color: '#FF5858',
    width: '30%',
  },

  ItemRowTextCenter: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#7b7b7b',
    width: '40%',
  },
  itemStyle: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    padding: 4,
    paddingHorizontal: 20,
  },
  itemText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7b7b7b',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 30,
  },
  bidButton: {
    width: (Dimensions.get('window').width - 16) * 0.5,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#8657d4',
    borderStyle: 'solid',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },

  bidNoButton: {
    width: (Dimensions.get('window').width - 16) * 0.5,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#D1D1D1',
    borderStyle: 'solid',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },

  puchageButton: {
    width: (Dimensions.get('window').width - 16) * 0.5,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#262626',
    borderStyle: 'solid',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  puchageText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#ffffff',
    marginLeft: 15,
    textAlign: 'left',
  },
  priceText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#ffffff',
    marginRight: 20
  },
  priceRedText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#FF5858',
    marginRight: 20
  },
  priceRedNoText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#FF5858',
    marginRight: 20
  },
  /*
  priceText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  */
  additionalText: {
    opacity: 0.23,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  topCrown: {
    width: 12.7,
    height: 8.43,
    position: 'absolute',
    right: 18,
    top: -6,
  },
});
