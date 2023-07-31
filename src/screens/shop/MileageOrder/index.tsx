import { Color } from 'assets/styles/Color';
import CommonHeader from 'component/CommonHeader';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { get_order_list } from 'api/models';
import { SectionGrid } from 'react-native-super-grid';
import { useUserInfo } from 'hooks/useUserInfo';
import { TextInput } from 'react-native-gesture-handler';
import { CommaFormat } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import SpaceView from 'component/SpaceView';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import { ROUTES, STACK } from 'constants/routes';

const DATA = [
  {
    title: '23/03/01',
    data: ['PizzaPizza', 'BurgerBurger', 'RisottoRisotto'],
  },
];

export default function MileageOrder() {
  const me = useUserInfo();
  
  const [memberAddr, setMemberAddr] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [orderStatus, setOrderStatus] = useState({
    order_complet: 0,
    bid_fail: 0,
    bid_success: 0,
    dlvr: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    
    async function fetch() {
      setIsLoading(true);

      try {
        // 주문 목록 조회
        const body = {};
        const { success: sp, data: pd } = await get_order_list(body);
        if (sp) {
          setOrderList(pd?.order_list);
          setOrderStatus(pd?.order_status_count);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }

    }
    fetch();
  }, []);

  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / 300);
    setCurrentIndex(index);
  };

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader
        title={'주문 내역'}
        backIcon={ICON.back}
        walletTextStyle={{ color: 'white' }} />

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <LinearGradient
          colors={['#895dfa', '#6b6dfa']}
          style={{ width: '100%', height: Dimensions.get('window').width * 0.55, justifyContent: 'center' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.paddingBox}>
            <Text style={styles.nameText}>{me?.nickname}</Text>
            <View style={styles.addressBox}>
              {/*
                <TextInput
                  defaultValue={'교환한 기프티콘은 KT 비즈콘으로 문자 발송됩니다 :)'}
                  onChangeText={(text) => setMemberAddr(text) }
                  style={[style ㅕㅜㅛs.addressText]}
                  multiline={false}
                  placeholder={'!'}
                  placeholderTextColor={'#c6ccd3'}
                  numberOfLines={1}
                  maxLength={100}
                /> 
              */}
              
              <Text style={styles.addressText} numberOfLines={1}>
                교환한 기프티콘은 KT 비즈콘으로 문자 발송됩니다 :)
              </Text>
              {/* <Image style={styles.pencil} source={ICON.pencil} /> */}
            </View>
            <View style={styles.limitBox}>
              <View style={styles.leftBox}>
                <Image source={ICON.roundCrown} style={styles.roundCrown} />
                <Text style={styles.limitText}>리밋</Text>
              </View>
              <Text style={styles.amountText}>{CommaFormat(me?.mileage_point)}</Text>
            </View>
          </View>
          <View style={styles.line} />
        </LinearGradient>
        { /* 주문내역 상태창 노출 */ }
        <View style={styles.backMargin}>
          <TouchableOpacity activeOpacity={1} style={styles.purpleBg}>
            <Text style={styles.textLeft}>입찰완료</Text>
            <Text style={styles.textRight}>{orderStatus.bid_success}건</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.whiteBg}>
            <Text style={[styles.textLeft, { color: '#9d9d9d' }]}>입찰실패</Text>
            <Text style={[styles.textRight, { color: '#9d9d9d' }]}>{orderStatus.bid_fail}건</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.whiteBg}>
            <Text style={[styles.textLeft, { color: '#706afa' }]}>배송준비</Text>
            <Text style={[styles.textRight, { color: '#706afa' }]}>{orderStatus.dlvr}건</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.whiteBg}>
            <Text style={[styles.textLeft, { color: '#742dfa' }]}>주문완료</Text>
            <Text style={[styles.textRight, { color: '#742dfa' }]}>{orderStatus.order_complet}건</Text>
          </TouchableOpacity>
        </View>
        
        

        <View style={styles.orderHistory}>
          <View style={styles.rowBetween}>
            <Text style={styles.historyText}>
              주문내역
              <Text style={styles.historySubText}>(최근 3개월 내역)</Text>
            </Text>
            {/* <Text style={styles.dateText}>23/01/04</Text> */}
          </View>
        </View>

        {orderList.length > 0 ? (
          <FlatList
            /* onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            horizontal={false} */
            data={orderList}
            renderItem={(data) => <RenderItem data={data} />}
          />
        ) : (
          <SpaceView viewStyle={{justifyContent: 'center', alignItems: 'center', height: 150}}>
            <Text style={{fontFamily: 'AppleSDGothicNeoB00'}}>주문 내역이 없습니다.</Text>
          </SpaceView>
        )}

      </View>
    </>
  );
}

const RenderItem = ({ data }) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const dateStr = data.item.title;
  const prodList = data.item.data;

  const onPressMileageOrder = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_History });
  };

  return (
    <>
      <View style={styles.dateTitle}>
        <Text style={[styles.dateText]}>{dateStr}</Text>
      </View>

      {prodList.map((item, idx) => (
        <TouchableOpacity
          onPress={() => {
            if(item.order_type == 'AUCT'){
              onPressMileageOrder();
            }
          }}
        >
          <View style={styles.itemBox} key={'order_item_' + idx}>
            <ImageBackground source={findSourcePath(item?.file_path + item?.file_name)} style={styles.thumb}>
              {/* 분기 */}

              {item.status_code == 'COMPLET' ? (
                <View style={styles.completeMark}>
                  <Text style={styles.completeText}>판매완료</Text>
                </View>
              ) : null}

              {/* 주문목록 상태 노출 */}
              {/* <View style={styles.bidCompleteMark}>
                <Text style={styles.bidCompleteText}>입찰완료</Text>
              </View>
              <View style={styles.readyMark}>
                <Text style={styles.readyText}>발송준비</Text>
              </View>
              <View style={styles.completeMark}>
                <Text style={styles.completeText}>배송완료</Text>
              </View> */}
              
            </ImageBackground>

            <View style={styles.itemInfoBox}>
              <Text style={styles.brandName}>{item.brand_name}</Text>
              <Text style={styles.title}>{item.prod_name}</Text>
              <View style={styles.rowBetween2}>
                <View style={styles.row}>
                  <Text style={styles.price}>{CommaFormat(item?.buy_price)}</Text>
                  <Image source={ICON.crown} style={styles.crown} />
                </View>

                {/* 조건부 */}
                {item.invc_num != null ? (
                  <View style={styles.copyCode}>
                    <Text style={styles.copyText}>송장번호 복사</Text>
                  </View>
                ) : null}
                {/* 조건부 */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};







{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const styles = StyleSheet.create({
  paddingBox: {
    paddingHorizontal: 32,
    //marginTop: 20,
  },
  nameText: {
    //marginTop: 25,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 24,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  addressBox: {
    marginTop: 10,
    minWidth: Dimensions.get('window').width * 0.84,
    borderRadius: 15.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    paddingHorizontal: 20,
    paddingVertical: 1,
    height: 30
  },
  addressText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    overflow: 'hidden',
  },
  pencil: {
    width: 24,
    height: 24,
  },
  limitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundCrown: {
    width: 20,
    height: 20,
  },
  limitText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 6,
  },
  amountText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  line: {
    height: 1,
    opacity: 0.09,
    backgroundColor: '#ffffff',
    marginTop: 10,
    marginHorizontal: 30,
  },
  backMargin: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-around',
    paddingHorizontal: '3%',
    marginTop: -Dimensions.get('window').width * 0.1,
  },
  purpleBg: {
    width: Dimensions.get('window').width * 0.218,
    height: Dimensions.get('window').width * 0.2,
    borderRadius: 10,
    backgroundColor: '#742dfa',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whiteBg: {
    width: Dimensions.get('window').width * 0.218,
    height: Dimensions.get('window').width * 0.2,

    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textLeft: {
    width: '100%',
    opacity: 0.76,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  textRight: {
    width: '100%',
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#ffffff',
  },
  orderHistory: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  rowBetween: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  historyText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  historySubText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#a3a3a3',
  },
  dateText: {
    opacity: 0.64,
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Color.grayDDDD,
  },
  thumb: {
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').width * 0.2,
    borderRadius: 5,
    backgroundColor: '#d1d1d1',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 7,
  },
  bidCompleteMark: {
    width: '50%',
    borderRadius: 6.5,
    backgroundColor: '#742dfa',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: 2,
  },
  bidCompleteText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 9,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  readyMark: {
    width: '50%',
    borderRadius: 6.5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ada9fc',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: 2,
  },
  readyText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 7,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ada9fc',
  },
  completeMark: {
    width: '50%',
    borderRadius: 6.5,
    backgroundColor: '#f2f2f2',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: 2,
  },
  completeText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 7,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#888888',
  },
  itemInfoBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width * 0.75 - 48,
    marginLeft: 10,
  },
  brandName: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#939393',
  },
  title: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#363636',
  },
  rowBetween2: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
  },
  price: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#212121',
  },
  crown: {
    width: 12.7,
    height: 8.43,
    marginLeft: 6,
  },
  copyCode: {
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#742dfa',
    padding: 4,
  },
  copyText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 9,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#742cf9',
  },
  dateTitle: {
    alignItems: 'flex-end',
    marginTop: 25,
    marginRight: 20,
    marginBottom: 10
  },
  addressTxt: {

  }

});
