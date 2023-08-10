import { useNavigation, CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { useCallback } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { StackScreenProp } from '@types';
import { ICON, IMAGE } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { Wallet } from './TopNavigation';
import { commonStyle } from 'assets/styles/Styles';
import { usePopup } from 'Context';
import { isEmptyData } from 'utils/functions';


export type NavigationHeaderProps = {
  title?: string;
  right?: React.ReactNode;
  containerStyle?: any;
  backIcon?: any;
  walletTextStyle?: any;
  isLogoType?: any;
};

/**
 * 공통 헤더
 * @param {string} title 헤더 타이틀
 */
function CommonHeader({
  title,
  right,
  containerStyle,
  backIcon,
  walletTextStyle,
  isLogoType,
}: NavigationHeaderProps) {

  const navigation = useNavigation<StackScreenProp>();
  const { show } = usePopup();  // 공통 팝업

  const goHome = useCallback(() => {
    const screen = navigation.getState().routes[navigation.getState().routes.length-1].name;
    const params = navigation.getState().routes[navigation.getState().routes.length-1].params;

    if(screen == 'ItemMatching') {
      if(isEmptyData(params) && params.type == 'PROFILE_CARD_ITEM') {
        show({ 
          content: '선택을 안하시는 경우 아이템이 소멸됩니다.\n그래도 나가시겠습니까?',
          cancelCallback: function() {},
          confirmCallback: function() {
            goMove();
          }
        });
      } else {
        goMove();
      }
    } else {
      goMove();
    }

    //return;
  }, [navigation]);

  const goMove = async () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Login01' }],
          })
        );
  }

  

  return (
    <>
      {isLogoType ? (
        <>
          <View style={{ ...styles.headerLogoContainer}}>
            <Image source={IMAGE.logoBanner} resizeMode={'cover'} style={{width: '100%', height: 43}} />
          </View>
        </>
      ) : (
        <>
          <View style={{ ...styles.headerContainer, ...containerStyle, zIndex: 1 }}>
            <TouchableOpacity
              onPress={goHome}
              style={styles.backContainer}
              hitSlop={commonStyle.hipSlop10}
            >
              <Image source={backIcon || ICON.back} style={styles.backImg} />
            </TouchableOpacity>

            {title && (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={goHome}
                hitSlop={commonStyle.hipSlop10}
              >
                <Text style={styles.titleStyle}>{title}</Text>
              </TouchableOpacity>
            )}
            <View>{right || <Wallet textStyle={walletTextStyle} />}</View>
          </View>
        </>
      )}
    </>
  );
}

export default CommonHeader;

const styles = StyleSheet.create({
  backContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerContainer: {
    height: 56,
    paddingRight: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLogoContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImg: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  titleStyle: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    lineHeight: 32,
    color: Color.black2222,
  },
});