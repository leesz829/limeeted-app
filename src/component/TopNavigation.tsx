import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ColorType, ScreenNavigationProp } from '@types';
import { Color } from 'assets/styles/Color';
import { ROUTES, STACK } from 'constants/routes';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import type { FC } from 'react';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BasePopup } from 'screens/commonpopup/BasePopup';
import { ICON, IMAGE } from 'utils/imageUtils';
import Image from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Tooltip from 'rn-tooltip';

interface Props {
  currentPath: string;
  theme?: string;
}
/**
 * 상단 네비게이션
 * @param {string} currentPath 현재 경로
 * @returns
 */
const TopNavigation: FC<Props> = (props) => {
  const [currentNavi, setCurrentNavi] = useState<string>(props.currentPath);

  const { show } = usePopup();

  // React.useEffect(() => {
  //   setCurrentNavi(props.currentPath);
  // }, [props]);

  function onPressStory() {
    show({ title: '스토리', content: '준비중입니다.' });
  }

  return props.theme ? (
    <LinearGradient
      colors={['#89b0fa', '#aaa1f7']}
      style={{
        width: '100%',
        zIndex: 1,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={_styles.tabContainer}>
        <NaviButtons navName={props.currentPath} theme={props.theme} />
        {/* ######################################################################
			  ##### 팝업 영역
			  ###################################################################### */}
        <Wallet theme={props.theme} />
      </View>
    </LinearGradient>
  ) : (
    <View style={[_styles.tabContainer, { backgroundColor: 'white', zIndex: 1 }]}>
      <NaviButtons navName={props.currentPath} theme={props.theme} />
      {/* ######################################################################
			##### 팝업 영역
			###################################################################### */}
      <Wallet theme={props.theme} />
    </View>
  );
};
function NaviButtons({ navName, theme }: { navName: string; theme?: string }) {
  function onPressLimeeted() {
    navigation.navigate(STACK.TAB, {
      screen: 'Matching',
    });
  }
  function onPressLive() {
    navigation.navigate('Live');
  }
  const navigation = useNavigation<ScreenNavigationProp>();

  const limitedIcon = React.useMemo(() => {
    return navName === 'LIMEETED'
      ? ICON.limited_on
      : theme != undefined
      ? ICON.limited_off_white
      : ICON.limited_off_gray;
  }, [navName, theme]);
  const liveIcon = React.useMemo(() => {
    return navName === 'LIVE'
      ? ICON.live_on
      : theme != undefined
      ? ICON.live_off_white
      : ICON.live_off_gray;
  }, [navName, theme]);

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={[_styles.tab]} onPress={onPressLimeeted} disabled={navName == 'LIMEETED' ? true : false}>
        <Image style={_styles.limitedIcon} source={limitedIcon} resizeMode="contain" />
      </TouchableOpacity>
      
      <TouchableOpacity style={[_styles.tab]} onPress={onPressLive} disabled={navName == 'LIVE' ? true : false}>
        <Image style={_styles.liveIcon} source={liveIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
export function Wallet({ theme }) {
  const isFocus = useIsFocused();
  const memberBase = useUserInfo(); // 회원 기본정보

  return (
    <>
      {typeof memberBase != 'undefined' && (
        <View
          style={{
            flexDirection: 'row',
          }} >

          <View style={[_styles.itemContainer, { marginRight: 10 }]}>
            <Tooltip
              actionType='press'
              withPointer={false}
              backgroundColor=""
              containerStyle={[_styles.tooltipDescContainer]}
              popover={
                <View style={[_styles.tooltipArea('pass'), ]}>
                  <Text style={_styles.tooltipAreaText}>범용적으로 사용되는 기본 재화.{'\n'}관심을 보내거나 확인하는데 사용돼요.</Text>
                </View>
              }>

                <View style={_styles.itemContainer}>
                  <Image style={_styles.itemStyle} source={ICON.passCircle} resizeMode={'contain'} />
                  <Text
                    style={[
                      _styles.statusText,
                      { color: theme ? '#625AD1' : '#625AD1', lineHeight: 13 },
                    ]}>

                    {memberBase?.pass_has_amt}
                  </Text>
                </View>
            </Tooltip>
          </View>

          <View style={_styles.itemContainer}>
            <Tooltip
                actionType='press'
                withPointer={false}
                backgroundColor=""
                containerStyle={[_styles.tooltipDescContainer]}
                popover={
                  <View style={[_styles.tooltipArea('royal'), ]}>
                    <Text style={_styles.tooltipAreaText}>리미티드의 특수 재화.{'\n'}찐심을 보내는데 사용돼요.</Text>
                  </View>
                }>

                <View style={_styles.itemContainer}>
                  <Image style={_styles.itemStyle} source={ICON.royalPassCircle} resizeMode={'contain'}  />
                  <Text
                    style={[
                      _styles.statusText,
                      { color: theme ? '#625AD1' : '#625AD1', lineHeight: 13 },
                    ]}>

                    {memberBase?.royal_pass_has_amt}
                  </Text>
                </View>
            </Tooltip>
          </View>
        </View>
      )}
    </>
  );
}
export default TopNavigation;

const _styles = StyleSheet.create({
  logo1: { width: 105, height: 29 },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 16,
    // backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    paddingRight: 16,
  },
  tabText: {
    fontSize: 18,
    lineHeight: 32,
    color: Color.grayAAAA,
    fontFamily: 'AppleSDGothicNeoB00',
  },
  tabTextActive: {
    color: Color.primary,
  },
  activeDot: {
    right: 18,
    top: 4,
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 20,
    backgroundColor: Color.black2222,
  },
  itemStyle: {
    width: 25,
    height: 25,
    marginRight: 2,
  },
  itemStyle2: {
    width: 25,
    height: 25,
    marginRight: 1,
  },
  itemContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  statusText: {
    fontSize: 12,
    color: 'rgb(84, 84 , 86)',
    fontWeight: 'bold',
    fontFamily: 'AppleSDGothicNeoEB00',
  },
  limitedIcon: {
    width: 100,
    height: 29,
    resizeMode: 'contain',
  },
  liveIcon: {
    width: 39,
    height: 29,
    resizeMode: 'contain',
  },
  tooltipArea: (type) => {
    return {
      width: type == 'pass' ? 170 : 125,
      position: 'absolute',
      bottom: 0,
      left: type == 'pass' ? 20 : 50,
      zIndex: 9998,
      backgroundColor: '#151515',
      borderRadius: 7,
    };
  },
  tooltipAreaText: {
    fontSize: 10,
    fontFamily: 'AppleSDGothicNeoM00',
    color: ColorType.white,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  tooltipDescContainer: {
    
  },
});
