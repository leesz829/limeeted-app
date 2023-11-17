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
#### 라이브 평점 노출 Component
#########################################################################
###################################################################### */
export default function ProfileGrade({ profileScore, type }) {
  
  return (
    <>
      {isEmptyData(profileScore) && (
        <>
          {/* {profileScore < 6.0 &&
            <LinearGradient colors={['#FF7EA6', '#FF7EA6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.score5Icon} style={styles.iconSquareSize(type == 'SMALL' ? 8 : 12)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          }

          {profileScore >= 6.0 && profileScore < 7.0 &&
            <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.score6Icon} style={styles.iconSquareSize(type == 'SMALL' ? 10 : 16)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          }

          {profileScore >= 7.0 && profileScore < 8.0 &&
            <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.score7Icon} style={styles.iconSquareSize(type == 'SMALL' ? 10 : 16)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          }

          {profileScore >= 8.0 && profileScore < 9.0 &&
            <LinearGradient colors={['#FE0456', '#FF82AB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.scoreKingIcon} style={styles.iconSquareSize(type == 'SMALL' ? 10 : 16)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          }

          {profileScore >= 9.0 && profileScore < 10.0 &&
            <LinearGradient colors={['#FE0456', '#9E6DF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.scoreDiamondIcon} style={styles.iconSquareSize(type == 'SMALL' ? 10 : 16)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          }

          {profileScore >= 10.0 &&
            <LinearGradient colors={['#FE0456', '#9E41E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Image source={ICON.score10Icon} style={styles.iconSquareSize(type == 'SMALL' ? 10 : 16)} />
              <Text style={_styles.scoreText(type)}>{profileScore}</Text>
            </LinearGradient>
          } */}

          {profileScore < 6.0 &&
            <LinearGradient colors={['#C5C5C5', '#B4CACC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Text style={_styles.scoreText(type)}>SILVER</Text>
            </LinearGradient>
          }

          {profileScore >= 6.0 && profileScore < 8.0 &&
            <LinearGradient colors={['#FFF711', '#FFCC00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Text style={_styles.scoreText(type)}>GOLD</Text>
            </LinearGradient>
          }

          {profileScore >= 8.0 && profileScore < 10.0 &&
            <LinearGradient colors={['#70FFC1', '#B2FC00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Text style={_styles.scoreText(type)}>VIP</Text>
            </LinearGradient>
          }

          {profileScore >= 10.0 &&
            <LinearGradient colors={['#009DCE', '#9F42BB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge(type)}>
              <Text style={_styles.scoreText(type)}>VVIP</Text>
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
  scoreBadge: (type:string) => {
    return {
      //width: type == 'SMALL' ? 36 : 48,
      //height: type == 'SMALL' ? 14 : 21,
      width: type == 'SMALL' ? 36 : 85,
      height: type == 'SMALL' ? 14 : 30,
      marginRight: type == 'SMALL' ? 0 : 5,
      paddingHorizontal: type  == 'SMALL' ? 3 : 5,
      //borderRadius: 5,
      borderRadius: 15,
      flexDirection: `row`,
      alignItems: `center`,
      //justifyContent: `space-between`,
      justifyContent: 'center',
    };
  },
  scoreText: (type:string) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      // fontSize: type == 'SMALL' ? 8 : 11,
      fontSize: type == 'SMALL' ? 8 : 18,
      letterSpacing: 0,
      textAlign: 'left',
      // color: '#FDFFD8',
      color: '#D5CD9E',
    };
  },

});