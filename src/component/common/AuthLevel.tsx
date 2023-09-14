import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import { styles } from 'assets/styles/Styles';
import { isEmptyData } from 'utils/functions';

/* ######################################################################
#########################################################################
#### 인증레벨 노출 Component
#########################################################################
###################################################################### */
export default function AuthLevel({ authAcctCnt, type }) {
  
  return (
    <>
      {isEmptyData(authAcctCnt) && (
        <>
          {authAcctCnt > 0 && authAcctCnt < 10 &&
            <LinearGradient colors={['#7986EE', '#7986EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }

          {authAcctCnt >= 10 && authAcctCnt < 15 &&
            <LinearGradient colors={['#E0A9A9', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Image source={ICON.level10Icon} style={[_styles.authBadgeImg, styles.iconSquareSize(type == 'SMALL' ? 18 : 23)]} />
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }

          {authAcctCnt >= 15 && authAcctCnt < 20 &&
            <LinearGradient colors={['#A9BBE0', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Image source={ICON.level15Icon} style={[_styles.authBadgeImg, styles.iconSquareSize(type == 'SMALL' ? 18 : 23)]} />
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }

          {authAcctCnt >= 20 && authAcctCnt < 25 &&
            <LinearGradient colors={['#FEB961', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Image source={ICON.level20Icon} style={[_styles.authBadgeImg02(type), styles.iconSquareSize(type == 'SMALL' ? 18 : 30)]} />
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }

          {authAcctCnt >= 25 && authAcctCnt < 30 &&
            <LinearGradient colors={['#9BFFB5', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Image source={ICON.level25Icon} style={[_styles.authBadgeImg02(type), styles.iconSquareSize(type == 'SMALL' ? 18 : 30)]} />
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }

          {authAcctCnt >= 30 &&
            <LinearGradient colors={['#E84CEE', '#79DEEE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.authBadge(type)}>
              <Image source={ICON.level30Icon} style={[_styles.authBadgeImg02(type), styles.iconSquareSize(type == 'SMALL' ? 18 : 30)]} />
              <Text style={_styles.authText(type)}>LV.{authAcctCnt}</Text>
            </LinearGradient>
          }
        </>
      )}
    </>
  );

}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  authText: (type:string) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: type == 'SMALL' ? 8 : 10,
      letterSpacing: 0,
      textAlign: 'left',
      color: '#ffffff',
    };
  },
  authBadge: (type:string) => {
    return {
      width: type == 'SMALL' ? 40 : 48,
      height: type == 'SMALL' ? 14 : 21,
      borderRadius: 5,
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `center`,
      marginRight: 5,
    };
  },
  authBadgeImg: {
    marginLeft: -5,
    marginRight: -2,
    marginTop: -2
  },
  authBadgeImg02: (type:string) => {
    return {
      marginLeft: -9,
      marginRight: type == 'SMALL' ? 0 : -4,
      marginTop: -3
    };
  },

});