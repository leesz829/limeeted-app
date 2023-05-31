import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICON } from 'utils/imageUtils';

import { Slider } from '@miblanchard/react-native-slider';
import { useNavigation, useRoute, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { ROUTES, STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommaFormat } from 'utils/functions';
import { get_cashback_pay_info } from 'api/models';
import SpaceView from 'component/SpaceView';
import { commonStyle } from 'assets/styles/Styles';

export default function BannerPannel() {
  const me = useUserInfo();

  if (!me) return null;
  return me?.gender !== 'M' ? <FemalePannel /> : <MalePannel />;
}

// ############################################################################################### 여성회원 Pannel
function FemalePannel() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute();
  const me = useUserInfo();

  const onPressLimitShop = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_Shop });
  };
  const onPressMileageHistory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_History });
  };
  const onPressLimitInfo = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Limit_Info });
  };
  const onPressMileageOrder = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_Order });
  };

  return (
    <View style={female.floatWrapper}>
      <View style={female.floatContainer}>
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={female.pointText}>
              {me?.nickname} <Text>✨</Text>
            </Text>
            {/* {route.name === ROUTES.Mileage_Shop && (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={onPressMileageHistory}>
                  <Image
                    style={female.mileageHistoryButton}
                    source={ICON.mileageHistory}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressMileageOrder}>
                  <Image
                    style={female.mileageOrderButton}
                    source={ICON.mileageOrder}
                  />
                </TouchableOpacity>
              </View>
            )} */}
          </View>
          <View style={female.row}>
            
            <View>
              {route.name !== ROUTES.Mileage_Shop && (
                <>
                  {/* <Text style={female.infoText}>{me?.nickname}님의 공주력</Text> */}
                  <Text style={female.infoText}>리밋샵에 구경 오세요 :)</Text>
                  <TouchableOpacity
                    style={female.lmtShopButton}
                    onPress={onPressLimitShop}>

                    <Text style={female.lmtButtonText2}>리밋샵 미리보기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            <View style={{ flexDirection: 'column' }}>
              <SpaceView viewStyle={female.myBox}>
                <TouchableOpacity onPress={onPressLimitInfo}>
                  <View style={female.myBox}>
                    <Text style={female.infoText}>리밋 획득방법 안내</Text>
                    <Image
                      style={{ width: 14, height: 12, bottom:3}}
                      source={ICON.currencyTooltip}
                    />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={female.rate}>
                      {CommaFormat(me?.mileage_point)}
                    </Text>
                    <Image style={female.crown} source={ICON.crown} />
                  </View>
                </TouchableOpacity>
              </SpaceView>

            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ############################################################################################### 남성회원 Pannel
const PAY_INFO = {
  member_buy_price: 0
  , target_buy_price: 10
  , price_persent: 0
  , tmplt_name: ''
  , tmplt_level: 1
};

function MalePannel() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const [payInfo, setPayInfo] = useState(PAY_INFO);
  const onPressPointReward = () => {
    navigation.navigate(STACK.COMMON, { 
      screen: 'PointReward'
      , params: { 
          member_buy_price: payInfo.member_buy_price 
          , target_buy_price: payInfo.target_buy_price 
          , price_persent: payInfo.price_persent 
          , tmplt_name: payInfo.tmplt_name
          , tmplt_level: payInfo.tmplt_level
      }
    });
  };

  useEffect(() => {
    const getCashBackPayInfo = async () => {
      const { success, data } = await get_cashback_pay_info();
      if (success) {

        let lettmpltName = data?.result.tmplt_name;
        let mbrPrice = data?.result.member_buy_price;
        let trgtPrice = data?.result.target_buy_price;
        let level = data?.result.tmplt_level;

        let percent = (mbrPrice*100) / trgtPrice;
        if(percent > 0) {
         percent = percent / 100; 
        }

        setPayInfo({
          member_buy_price: mbrPrice
          , target_buy_price: trgtPrice
          , price_persent: percent
          , tmplt_name: lettmpltName.replace(/(\s*)/g, "")
          , tmplt_level: level
        });
      }
    };
    getCashBackPayInfo();
  }, [isFocus]);

  return (
    <View style={male.floatWrapper}>
      <View style={male.floatContainer}>
        <View>
          <Text style={male.pointText}>
            리미티드 포인트 <Text>✌️</Text>
          </Text>

          <TouchableOpacity onPress={onPressPointReward}>
            <Text style={male.infoText}>
              즐거운 <Text style={male.cashbackText}>캐시백</Text> 생활 {CommaFormat(payInfo?.member_buy_price)} /
              {CommaFormat(payInfo?.target_buy_price)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onPressPointReward} hitSlop={commonStyle.hipSlop10}>
          <Slider
            value={payInfo?.price_persent}
            animateTransitions={true}
            renderThumbComponent={() => null}
            maximumTrackTintColor={ColorType.purple}
            minimumTrackTintColor={ColorType.purple}
            containerStyle={male.sliderContainer}
            trackStyle={male.sliderTrack}
            trackClickable={false}
            disabled
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onPressPointReward} style={male.TooltipButton} hitSlop={commonStyle.hipSlop10}>
          <Image source={ICON.currencyTooltip} style={male.imageTooltip} />
        </TouchableOpacity>

        <View style={male.gradeArea}>
          <Text style={male.gradeText}><Text style={male.gradeEtc}>RANK</Text>{payInfo?.tmplt_name}</Text>
        </View>

      </View>
    </View>
  );
}





{/* ################################################################################################################
############### Style 영역
################################################################################################################ */}

const male = StyleSheet.create({
  floatWrapper: {
    width: `100%`,
    marginTop: -60,
  },
  floatContainer: {
    position: 'relative',
    padding: 25,
    backgroundColor: 'white',
    width: '100%',
    height: 120,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    justifyContent: 'space-around',
  },
  pointText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color:'#333333'
  },
  infoText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.grayAAAA,
  },
  cashbackText: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.primary,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.grayDDDD,
  },
  TooltipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  imageTooltip: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  gradeArea: {
    position: 'absolute',
    bottom: 18,
    right: 25,
  },
  gradeEtc: {
    fontSize: 9,
    fontFamily: 'AppleSDGothicNeoB00',
    opacity: 0.13,
    color: '#000',
  },
  gradeText: {
    fontSize: 72,
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#8657D4',
    fontWeight: 'bold',
    opacity: 0.13,
    textAlign: 'right',
    letterSpacing: 0,
  },
});

const female = StyleSheet.create({
  floatWrapper: {
    width: `100%`,
    marginTop: -60,
  },
  floatContainer: {
    position: 'relative',
    padding: 25,
    backgroundColor: 'white',
    width: '100%',
    height: 120,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    justifyContent: 'space-around',
  },
  pointText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  mileageHistoryButton: {
    width: 25,
    height: 25,
    borderRadius: 13,
    marginRight: 8,
  },
  mileageOrderButton: {
    width: 25,
    height: 25,
    borderRadius: 13,
  },
  infoText: {
    // marginTop: 8,
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b1b1b1',
    textAlignVertical: 'bottom',
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  lmtShopButton: {
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7986ee',
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 5,
    paddingVertical: 3,
  },
  lmtButtonText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  lmtButtonText2: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  myBox: {
    flexDirection: `row`,
    alignItems: 'flex-end',
    marginTop: 8,
  },
  rate: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 29,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#8657d4',
  },
  crown: {
    width: 12.7,
    height: 8.43,
    position: 'absolute',
    right: 3,
    top: 0,
  },
});
