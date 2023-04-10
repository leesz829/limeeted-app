import { useNavigation, CommonActions } from '@react-navigation/native';
import * as React from 'react';
import { useCallback } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { StackScreenProp } from '@types';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { Wallet } from './TopNavigation';

export type NavigationHeaderProps = {
  title?: string;
  right?: React.ReactNode;
  containerStyle?: any;
  backIcon?: any;
  walletTextStyle?: any;
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
}: NavigationHeaderProps) {
  const navigation = useNavigation<StackScreenProp>();
  const goHome = useCallback(() => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Login' }],
          })
        );
  }, [navigation]);

  return (
    <View style={{ ...styles.headerContainer, ...containerStyle }}>
      <TouchableOpacity onPress={goHome} style={styles.backContainer}>
        <Image source={backIcon || ICON.back} style={styles.backImg} />
      </TouchableOpacity>

      {title && (
        <TouchableOpacity style={{ flex: 1 }} onPress={goHome}>
          <Text style={styles.titleStyle}>{title}</Text>
        </TouchableOpacity>
      )}
      <View>{right || <Wallet textStyle={walletTextStyle} />}</View>
    </View>
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
