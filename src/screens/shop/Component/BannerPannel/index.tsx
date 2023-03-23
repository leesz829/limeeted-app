import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICON } from 'utils/imageUtils';

import { Slider } from '@miblanchard/react-native-slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { ROUTES, STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommaFormat } from 'utils/functions';

export default function BannerPannel() {
  const me = useUserInfo();

  if (!me) return null;
  return me?.gender !== 'M' ? <MalePannel /> : <FemalePannel />;
}

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
              {me?.name} <Text>✨</Text>
            </Text>
            {route.name === ROUTES.Mileage_Shop && (
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
            )}
          </View>
          <View style={female.row}>
            {route.name !== ROUTES.Mileage_Shop && (
              <View>
                <Text style={female.infoText}>{me?.name}님의 공주력</Text>
                <TouchableOpacity
                  style={female.lmtShopButton}
                  onPress={onPressLimitShop}
                >
                  <Text style={female.lmtButtonText}>LIMIT shop +</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity style={female.myBox} onPress={onPressLimitInfo}>
                <Text style={female.infoText}>나의 공주력</Text>
                <Image
                  style={{ width: 14, height: 14 }}
                  source={ICON.currencyTooltip}
                />
              </TouchableOpacity>

              <View>
                <Text style={female.rate}>
                  {CommaFormat(me?.mbr_mileage_point)}
                </Text>
                <Image style={female.crown} source={ICON.crown} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function MalePannel() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const onPressPointReward = () => {
    navigation.navigate(STACK.COMMON, { screen: 'PointReward' });
  };
  return (
    <View style={male.floatWrapper}>
      <View style={male.floatContainer}>
        <View>
          <Text style={male.pointText}>
            리미티드 포인트 <Text>✌️</Text>
          </Text>
          <Text style={male.infoText}>
            즐거운 <Text style={male.cashbackText}>캐시백</Text> 생활 9,000 /
            10,000
          </Text>
        </View>
        <Slider
          value={0.7}
          animateTransitions={true}
          renderThumbComponent={() => null}
          maximumTrackTintColor={ColorType.purple}
          minimumTrackTintColor={ColorType.purple}
          containerStyle={male.sliderContainer}
          trackStyle={male.sliderTrack}
        />
        <TouchableOpacity
          onPress={onPressPointReward}
          style={male.TooltipButton}
        >
          <Image source={ICON.currencyTooltip} style={male.imageTooltip} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    fontFamily: 'AppleSDGothicNeoM00',
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
    marginTop: 10,
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
    textAlign: 'left',
    color: '#8657d4',
  },
  crown: {
    width: 12.7,
    height: 8.43,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
