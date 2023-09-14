import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import { Watermark } from 'component/Watermark';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring, withSequence, withDelay, Easing, withRepeat, interpolate, Extrapolate, cancelAnimation, stopClock } from 'react-native-reanimated';
import { styles } from 'assets/styles/Styles';
import { ROUTES, STACK } from 'constants/routes';


const { width, height } = Dimensions.get('window');

export default function InventoryButton({ newItemCnt }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  const isFocus = useIsFocused();

  // ############################################################################################################# 애니메이션 관련
  const giftOpacityValue = useSharedValue(0);
  const giftRotateValue = useSharedValue(0);

  const [isRotated, setIsRotated] = React.useState(false);

  const giftStyle = useAnimatedStyle(() => {
    const interpolatedRotation = interpolate(giftRotateValue.value, [0, 1], [0, -20], Extrapolate.CLAMP);

    return {
      opacity: giftOpacityValue.value,
      transform: [{ rotate: `${interpolatedRotation}deg` }],
    };
  });

  // 선물함 애니메이션 실행 함수
  const giftAnimate = async () => {
    giftAnimateCancel();

    giftOpacityValue.value = withSequence(
      withDelay(500, withTiming(1, { duration: 500 })),
      withDelay(9500, withTiming(0, { duration: 500 })),
    );

    giftRotateValue.value = withSequence(
      withDelay(1000, withTiming(1, { duration: 1000 })),
      withTiming(0, { duration: 1000 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 }),
      withDelay(1000, withTiming(1, { duration: 1000 })),
      withTiming(0, { duration: 1000 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 }),
    );
  };
  
  /* const animateSequence = async (animations:any) => {
    for (const animation of animations) {
      await animation();
    }
  }; */

  // 선물함 애니메이션 취소 및 초기화 함수
  const giftAnimateCancel = async () => {
    cancelAnimation(giftOpacityValue);
    cancelAnimation(giftRotateValue);

    giftOpacityValue.value = 0;
    giftRotateValue.value = 0;
  }

  // 인벤토리 이동 함수
  const onPressInventory = () => {
    navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
  };

  useFocusEffect(
    React.useCallback(() => {
      giftAnimate();

      return () => {
      };
    }, []),
  );

  return (
    <>
      <TouchableOpacity
        onPress={onPressInventory}
        style={_styles.floatingButtonWrapper}>

        <Animated.View style={[_styles.giftIconArea, giftStyle]}>
          <Image source={ICON.giftIcon} style={styles.iconSquareSize(85)} />
        </Animated.View>

        <Image source={ICON.inventoryIcon} style={_styles.floatingButton} />
        {newItemCnt > 0 &&
          <View style={_styles.iconArea}>
            <Text style={_styles.newText}>NEW</Text>
          </View>
        }
      </TouchableOpacity>
    </>
  );

}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  floatingButtonWrapper: {
    borderRadius: 25,
    position: 'absolute',
    bottom: 13,
    right: 15,
  },
  floatingButton: {
    width: 72,
    height: 72,
    borderRadius: 25,
  },
  giftIconArea: {
    position: 'absolute',
    top: -42,
    left: 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  iconArea: {
    position: 'absolute',
    top: 10,
    right: -8,
  },
  newText: {
    backgroundColor: '#FF7E8C',
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },

});