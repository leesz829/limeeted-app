import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { findSourcePath, IMAGE, GIF_IMG } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA } from 'constants/reusltcode';
import { useDispatch } from 'react-redux';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import { isEmptyData } from 'utils/functions';
import CommonHeader from 'component/CommonHeader';
import { STACK } from 'constants/routes';
import Image from 'react-native-fast-image';



/* ################################################################################################################
###### Story 등록 - 유형 선택
################################################################################################################ */

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StoryRegi'>;
  route: RouteProp<StackParamList, 'StoryRegi'>;
}

export default function StoryRegi(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const memberBase = useUserInfo(); // 회원 기본 데이터
  const { show } = usePopup(); // 공통 팝업
  const [isLoad, setIsLoad] = useState(false); // 로딩 상태 체크

  // 스토리 유형 선택
  const selectedStoryType = async (type:string) => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryEdit',
      params: {
        storyType : type,
      }
    });
  }


  /* ##################################################################################################################################
  ################## 초기 실행 함수
  ################################################################################################################################## */
  React.useEffect(() => {
    if(isFocus) {
      
    };
  }, [isFocus]);

  return (
    <>
      <CommonHeader title={'NEW STORY'} />

      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#fff'}}>
        <SpaceView mt={50} pl={20} pr={20}>

          <SpaceView mb={30} viewStyle={_styles.titleArea}>
            <Text style={_styles.titleText}>게시글 유형을 선택해 주세요.</Text>
          </SpaceView>

          <SpaceView viewStyle={_styles.contentArea}>
            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#E0E4FF',}]} onPress={() => { selectedStoryType('STORY'); }}>
              <Text style={_styles.contentTitle}>스토리</Text>
              <Text style={_styles.contentSubTitle}>소소한 일상부터 음식, 여행 등 주제에 관계없이 자유롭게 소통해 보세요.</Text>
              <Image source={ICON.megaphone} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>

            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#FEEFF2',}]} onPress={() => { selectedStoryType('VOTE'); }}>
              <Text style={_styles.contentTitle}>투표형</Text>
              <Text style={_styles.contentSubTitle}>왼 VS 오 어떤 것?{'\n'}밸런스 게임으로 사람들의 성향을 알아가요.</Text>
              <Image source={ICON.mail} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>

            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#FFFCEE',}]} onPress={() => { selectedStoryType('SECRET'); }}>
              <Text style={_styles.contentTitle}>비밀</Text>
              <Text style={_styles.contentSubTitle}>이야기 앞에 “비밀”이 붙으면 재미있어 지는 법이죠!</Text>
              <Image source={ICON.secret} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>
          </SpaceView>

        </SpaceView>
      </ScrollView>
    </>
  );

};





{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  titleArea: {

  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#000',
  },
  contentArea: {
    
  },
  contentItem: {
    backgroundColor: '#C5C5C5',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 160,
  },
  contentTitle: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 17,
    marginBottom: 10,
  },
  contentSubTitle: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
  },
  contentImg: {
    width: 30,
    height: 30,
    marginTop: 15,
    marginLeft: 'auto',
  },
});