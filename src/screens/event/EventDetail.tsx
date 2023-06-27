import { RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ColorType, ScreenNavigationProp } from '@types';
import { get_item_matched_info } from 'api/models';
import { ROUTES, STACK } from 'constants/routes';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { IMAGE, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';


const { width, height } = Dimensions.get('window');

export default function EventDetail(element) {
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = useState(false);

  const [subImgPath, setSubImgPath] = useState(element.route.params.sub_img_path);

  useEffect(() => {

  }, []);

  return (
    <>
      <CommonHeader title="이벤트 상세" />

      <View>
        <Image source={findSourcePath(subImgPath)} style={{width: width, height: height-80}} resizeMode={'cover'} />
      </View>
    </>
  );
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
 
});
