import { useRoute, useNavigation } from '@react-navigation/native';
import { get_auct_detail } from 'api/models';
import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import { useUserInfo } from 'hooks/useUserInfo';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommaFormat, getRemainTime } from 'utils/functions';
import { ICON, findSourcePath } from 'utils/imageUtils';
import ViewPager from '../Component/ViewPager';
import dayjs from 'dayjs';
import { api_domain } from 'utils/properties';
import { order_auct } from 'api/models';
import { usePopup } from 'Context';
import { ROUTES, STACK } from 'constants/routes';



function indextToText(index) {
  switch (index) {
    case 0:
      return '현재 입찰가';

    case 1:
      return '희망 입찰가';

    default:
      return '';
  }
}
export default function AuctionDetail() {
  const navigation = useNavigation();
  const { show } = usePopup();  // 공통 팝업

  const { prod_seq, modify_seq } = useRoute().params;

  const [data, setData] = useState(null);
  const me = useUserInfo();

  const images = data?.images?.filter((e) => e.represent_yn == 'Y')?.map((img) => {
    const imagePath =  findSourcePath(img?.file_path + img?.file_name);
    return imagePath;
  });

  useEffect(() => {
    async function fetch() {
      const body = { prod_seq, modify_seq };
      const { success, data } = await get_auct_detail(body);
      if (success) {
        setData({
          images: data?.prod_img_list,
          ...data?.prod_detail,
          auct_list: data?.auct_list,
        });
      }
    }
    fetch();
  }, []);


  // ######################################## 경매상품 구매하기 함수
  const productPurchase = async (nowBuyYn:string) => {

    let modalTitle = nowBuyYn == 'Y' ? '즉시 구매하기' : '입찰하기';
    let modalContent = nowBuyYn == 'Y' ? '표기 된 리밋 수량을 소모하고\n 즉시구매 하시겠습니까?' : '표기 된 호가로 입찰 신청하시겠습니까?';

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
            req_bid_price: data?.now_buy_price,
            now_buy_yn: nowBuyYn,
            mobile_os: Platform.OS,
          }
          const { success, data } = await order_auct(body);
          console.log('data :::: ', data);
          if (success) {
            if(data.result_code == '0000') {
              show({
                content: '구매에 성공하였습니다.' ,
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
    <View style={styles.root}>
      <CommonHeader title="경매" />

      <FlatList
        data={data?.auct_list}
        style={{ flexGrow: 1 }}
        ListFooterComponent={<View style={{ height: 50 }} />}
        ListHeaderComponent={
          <>
            {images != null ? (
              <ViewPager
                data={images}
                style={styles.pagerView}
                renderItem={() => <Image style={styles.itemImages} />}
              />
            ) : null}
            
            <View style={styles.infoContainer}>
              <Text style={styles.brandText}>{data?.brand_name}</Text>
              <Text style={styles.giftName}>{data?.prod_name}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.inventory}></Text>
                <View style={styles.rowCenter}>
                  <Text style={styles.price}>{data?.asking_price}</Text>
                  <Image source={ICON.crown} style={styles.crown} />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.currency}>
                <View>
                  <Text style={styles.currencyText}>현재 나의 보유 리밋</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={styles.roundCrown} source={ICON.roundCrown} />
                  <Text style={styles.currenyAmount}>
                    {CommaFormat(me?.mileage_point)}
                  </Text>
                </View>
              </View>
              <Text style={styles.duration}>
                경매기간 : {dayjs(data?.buy_start_dt).format('MM/DD')} ~{' '}
                {dayjs(data?.buy_end_dt).format('MM/DD')}
                <Text style={styles.durationSub}>
                  {getRemainTime(data?.buy_end_dt, true)}
                </Text>
              </Text>
              <View style={styles.dashline} />
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>현재 입찰 상황</Text>
              </View>

              <View style={styles.rowStyle}>
                <Text style={styles.rowTextLeft}>상황</Text>
                <Text style={styles.rowTextCenter}>입찰가</Text>
                <Text style={styles.rowTextRight}>상태</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.itemStyle}>
            <Text
              style={
                index === 0
                  ? styles.ItemRowTextLeftPurple
                  : styles.ItemRowTextLeft
              }
            >
              {indextToText(index)}
            </Text>
            <Text style={styles.ItemRowTextCenter}>
              {CommaFormat(item?.bid_price)}원
            </Text>
            <Text style={styles.ItemRowTextRight}>
              {index === 0 && '20분 후 낙찰'}
            </Text>
          </View>
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
        <View style={styles.rowAround}>
          <TouchableOpacity style={styles.puchageButton} onPress={() => productPurchase('Y')}>
            <Text style={styles.puchageText}>구매</Text>
            <Seperator />
            <View>
              <Text style={styles.priceText}>
                {CommaFormat(data?.now_buy_price)}
              </Text>
              <Text style={styles.additionalText}>즉시구매가</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bidButton} onPress={() => productPurchase('N')}>
            <Text style={styles.puchageText}>입찰</Text>
            <Seperator />
            <View>
              <Text style={styles.priceText}>
                {CommaFormat(data?.asking_price)}
              </Text>
              <Text style={styles.additionalText}>입찰대기10분</Text>
            </View>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
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
  crown: {
    width: 17.67,
    height: 11.73,
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
    marginTop: 18.5,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7b7b7b',
    marginLeft: 5,
  },
  durationSub: {
    color: '#d3d3d3',
  },
  dashline: {
    height: 2,
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
    width: '33%',
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
    width: '33%',
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
    width: '33%',
  },
  ItemRowTextCenter: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#7b7b7b',
    width: '33%',
  },
  ItemRowTextRight: {
    opacity: 0.37,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: 0,
    textAlign: 'right',
    color: '#7b7b7b',
    width: '33%',
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

  puchageButton: {
    width: (Dimensions.get('window').width - 16) * 0.5,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#262626',
    borderColor: '#262626',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'center',
    paddingHorizontal: 10,
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
  priceText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
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
});
