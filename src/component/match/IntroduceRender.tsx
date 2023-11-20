import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { STACK, ROUTES } from 'constants/routes';
import { modalStyle, layoutStyle, commonStyle, styles } from 'assets/styles/Styles';
import { isEmptyData } from 'utils/functions';


const { width, height } = Dimensions.get('window');

export default function IntroduceRender({ memberData, isEditBtn, comment }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  return (
    <>
      <SpaceView mb={15} viewStyle={{flexDirection: 'row'}}>
        <View style={{zIndex:1}}>
          <Text style={_styles.commentTitText}>{memberData?.nickname}님 소개</Text>
        </View>
        <View style={_styles.commentUnderline} />
      </SpaceView>

      {(isEmptyData(isEditBtn) && isEditBtn) && (
        <SpaceView viewStyle={{width: '100%', alignItems: 'flex-end'}}>
          <TouchableOpacity 
            onPress={() => { navigation.navigate(STACK.COMMON, { screen: ROUTES.PROFILE_INTRODUCE }); }} 
            style={_styles.modBtn}>
            <Image source={ICON.squarePen} style={styles.iconSize16} />
            <Text style={_styles.modBtnText}>수정</Text>
          </TouchableOpacity>
        </SpaceView>
      )}

      <SpaceView>
        <Text style={_styles.commentText}>{comment}</Text>
      </SpaceView>
    </>
  );
}


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  commentTitText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  commentText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: '#F3DEA6',
    textAlign: 'center',
  },
  commentUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: '#FE8C12',
  },
  modBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  modBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D5CD9E',
    marginLeft: 3,
  },

});