import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON } from 'utils/imageUtils';

import { Slider } from '@miblanchard/react-native-slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { ROUTES, STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';

export default function BannerPannel() {
  const me = useUserInfo();

  if (!me) return null;
  return me?.gender !== 'M' ? <MalePannel /> : <FemalePannel />;
}

function FemalePannel() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute();

  const onPressLimitShop = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_Shop });
  };
  const onPressMilerageHistory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.Mileage_History });
  };
  return (
    <View style={female.floatWrapper}>
      <View style={female.floatContainer}>
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={female.pointText}>
              방배동 아이유 <Text>✨</Text>
            </Text>
            {route.name === ROUTES.Mileage_Shop && (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={onPressMilerageHistory}
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 13,
                    backgroundColor: Color.primary,
                    marginRight: 8,
                  }}
                ></TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 13,
                    backgroundColor: Color.primary,
                  }}
                ></TouchableOpacity>
              </View>
            )}
          </View>
          <View style={female.row}>
            {route.name !== ROUTES.Mileage_Shop && (
              <View>
                <Text style={female.infoText}>방배동 아이유님의 공주력</Text>
                <TouchableOpacity
                  style={female.lmtShopButton}
                  onPress={onPressLimitShop}
                >
                  <Text style={female.lmtButtonText}>LIMIT shop +</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ flexDirection: 'column' }}>
              <Text style={female.infoText}>나의 공주력</Text>
              <Text style={female.rate}>999,999</Text>
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
    marginTop: -50,
  },
  floatContainer: {
    padding: 25,
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 40,
    height: 100,
    marginHorizontal: 20,
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
    marginTop: -50,
  },
  floatContainer: {
    position: 'relative',
    padding: 25,
    backgroundColor: 'white',
    width: '100%',
    height: 100,
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
    color: '#000',
  },
  infoText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoM00',
    color: Color.grayAAAA,
  },
  row: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  lmtShopButton: {
    borderRadius: 10,
    borderColor: Color.primary,
    borderWidth: 1,
    paddingHorizontal: 1,
    paddingVertical: 5,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 10,
    zIndex: 10,
  },
  lmtButtonText: {
    color: Color.primary,
    fontSize: 10,
  },
  rate: {
    fontSize: 19,
    color: Color.purple,
    fontWeight: 'bold',
  },
});
