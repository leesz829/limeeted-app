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
import LinearGradient from 'react-native-linear-gradient';


export default function BannerPannel({ payInfo }) {
  const me = useUserInfo();

  if (!me) return null;
  return me?.gender !== 'M' ? <FemalePannel /> : <MalePannel payInfo={payInfo} />;
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          
          <View style={{ flexDirection: 'column'}}>
            <SpaceView mb={20} mt={route.name === ROUTES.Mileage_Shop ? 10 : 0}>
              <Text style={female.pointText}>
                {me?.nickname} <Text>✨</Text>
              </Text>
            </SpaceView>

            <View>
              {route.name !== ROUTES.Mileage_Shop && (
                <>
                  {/* <Text style={female.infoText}>{me?.nickname}님의 공주력</Text> */}
                  {/* <Text style={female.infoText}>리밋샵에 구경 오세요 :)</Text> */}
                  
                  <TouchableOpacity
                    style={female.lmtShopButton}
                    onPress={onPressLimitShop}
                    hitSlop={commonStyle.hipSlop20}>

                    <View style={_styles.iconArea}>
                      <Text style={_styles.newText}>NEW</Text>
                    </View>

                    <Text style={female.lmtButtonText2}>리밋샵 입장하기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'column', alignItems: 'flex-end'}}>

            {route.name === ROUTES.Mileage_Shop && (
              <View>
                <TouchableOpacity
                  style={female.lmtShopPayButton}
                  onPress={onPressMileageOrder}
                  hitSlop={commonStyle.hipSlop20}>

                  <Text style={female.lmtButtonText3}>구매내역</Text>
                </TouchableOpacity>
                
                {/*
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
                */}
              </View>
            )}
            
            <View style={{ flexDirection: 'column' }}>
              <SpaceView viewStyle={female.myBox}>
                <TouchableOpacity onPress={onPressLimitInfo}>
                  <View style={female.myBox}>
                    <Text style={female.infoText}>리밋 획득방법 안내</Text>
                    <Image source={ICON.currencyTooltip} style={{ width: 14, height: 12, bottom:3}} />
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

function MalePannel({ payInfo }) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();

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

  return (
    <View style={male.floatWrapper}>
      <View style={male.floatContainer}>
        <View>
          <TouchableOpacity onPress={onPressPointReward} hitSlop={commonStyle.hipSlop10}>
            <Text style={male.infoText}>즐거운 <Text style={male.cashbackText}>캐시백</Text> 생활</Text>
            <View style={male.pointIntroArea}>
              <Text style={male.pointText}>리미티드 포인트</Text>
              <View style={male.rewardBtn}><Text style={male.rewardAddText}>알아보기</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onPressPointReward} hitSlop={commonStyle.hipSlop10}>

          <LinearGradient
            colors={['#7986EE', '#8854D2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={_styles.gradient(payInfo?.price_persent)}>
          </LinearGradient>

          <Slider
            //value={payInfo?.price_persent}
            animateTransitions={true}
            renderThumbComponent={() => null}
            maximumTrackTintColor={'transparent'}
            minimumTrackTintColor={'transparent'}
            containerStyle={male.sliderContainer}
            trackStyle={male.sliderTrack}
            trackClickable={false}
            disabled
          />
          <View style={{position: 'absolute', bottom: -15, right: 0}}>
            <Text style={male.infoText02}>
              캐시백 보상까지 {CommaFormat(payInfo?.member_buy_price)} / {CommaFormat(payInfo?.target_buy_price)}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* <TouchableOpacity onPress={onPressPointReward} style={male.TooltipButton} hitSlop={commonStyle.hipSlop10}>
          <Image source={ICON.currencyTooltip} style={male.imageTooltip} />
        </TouchableOpacity> */}

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

const _styles = StyleSheet.create({
  iconArea: {
    position: 'absolute',
    top: -14,
    left: -14,
    zIndex: 1,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: ColorType.white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  gradient: (value:any) => {
    let percent = 0;

    if(value != null && typeof value != 'undefined') {
      percent = value * 100;
    };

    return {
      position: 'absolute',
      top: 6,
      width: percent + '%',
      height: 7,
      zIndex: 1,
      borderRadius: 20,
    };
  },
});

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
  pointIntroArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pointText: {
    fontSize: 19,
    fontFamily: 'AppleSDGothicNeoEB00',
    color:'#333333'
  },
  rewardBtn: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#7986EE',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  rewardAddText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#7986EE',
  },
  infoText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#B1B1B1',
  },
  infoText02: {
    fontSize: 10,
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#B1B1B1',
    textAlign: 'right',
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
    height: 4,
    borderRadius: 13,
    backgroundColor: '#E1E4FB',
  },
  sliderTrack: {
    height: 23,
    borderRadius: 13,
    backgroundColor: 'transparent',
    position: 'absolute',
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
    marginTop: -70,
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
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'right',
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
    width: 100,
  },
  lmtShopPayButton: {
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7986ee',
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 5,
    paddingVertical: 2,
    width: 70,
  },
  lmtButtonText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  lmtButtonText2: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  lmtButtonText3: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    letterSpacing: 0,
    color: '#7986ee',
    paddingHorizontal: 10,
    paddingVertical: 1
  },
  myBox: {
    flexDirection: `row`,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
