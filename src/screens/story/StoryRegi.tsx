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
import LinearGradient from 'react-native-linear-gradient';



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
        <SpaceView mt={20} pl={20} pr={20}>

          <SpaceView mb={30} viewStyle={_styles.titleArea}>
            <Text style={_styles.titleText}>{memberBase?.nickname}님의{'\n'}이야기로 리미티드에 일상을{'\n'}공유하고 소통해보세요.</Text>
            <View style={_styles.titleUnderline} />
          </SpaceView>

          <SpaceView viewStyle={_styles.contentArea}>
            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#E0E4FF',}]} onPress={() => { selectedStoryType('STORY'); }}>
              <Text style={[_styles.contentTitle, {color: '#6C76BE'}]}>스토리</Text>
              <Text style={_styles.contentSubTitle}>소소한 일상부터 음식, 여행 등 주제에 관계없이 자유롭게 소통해 보세요.</Text>
              <Image source={ICON.megaphone} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>

            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#B5FBFD',}]} onPress={() => { selectedStoryType('VOTE'); }}>
              <Text style={[_styles.contentTitle, {color: '#48B2B5'}]}>투표형</Text>
              <Text style={_styles.contentSubTitle}>왼 VS 오 어떤 것?{'\n'}밸런스 게임으로 사람들의 성향을 알아가요.</Text>
              <Image source={ICON.mail} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>

            <TouchableOpacity style={[_styles.contentItem, {backgroundColor: '#FEEFF2',}]} onPress={() => { selectedStoryType('SECRET'); }}>
              <Text style={[_styles.contentTitle, {color: '#D3697E'}]}>시크릿</Text>
              <Text style={_styles.contentSubTitle}>이야기 앞에 “비밀”이 붙으면 재미있어 지는 법이죠!</Text>
              <Image source={ICON.secret} style={_styles.contentImg} resizeMode={'cover'} />
            </TouchableOpacity>
          </SpaceView>

        </SpaceView>
      </ScrollView>

      {/* 디자인 리뉴얼 
      <CommonHeader title={'NEW STORY'} />

      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#fff'}}>
        <SpaceView mt={20} pl={20} pr={20}>

          <SpaceView mb={30} viewStyle={_styles.titleArea}>
            <Text style={_styles.titleText}><Text style={{color: '#7B81EC', fontSize: 20}}>{memberBase?.nickname}님</Text>의 이야기로{'\n'}리미티드에 일상을공유하고 소통해보세요.</Text>
          </SpaceView>

          <SpaceView viewStyle={_styles.contentArea}>
            <TouchableOpacity style={_styles.contentItemContents} onPress={() => { selectedStoryType('STORY'); }}>
              <LinearGradient colors={['#FFD76B', '#FFB801']} style={_styles.contentItem}>
                <View style={_styles.contentImgArea}>
                  <Image source={ICON.talkBalloonIcon} style={_styles.contentImg} resizeMode={'cover'} />
                </View>
                <Text style={_styles.contentTitle}>스토리</Text>
                <Text style={_styles.contentSubTitle}>소소한 일상부터 음식, 여행 등 주제에 관계없이 자유롭게 소통해 보세요.</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={[_styles.contentItemContents, {marginLeft: 7,}]} onPress={() => { selectedStoryType('VOTE'); }}>
              <LinearGradient colors={['#A9DBFF', '#7B81EC']} style={_styles.contentItem}>
                <View style={_styles.contentImgArea}>
                  <Image source={ICON.voteIcon} style={_styles.contentImg} resizeMode={'cover'} />
                </View>
                <Text style={_styles.contentTitle}>투표형</Text>
                <Text style={_styles.contentSubTitle}>왼 VS 오 어떤 것?{'\n'}밸런스 게임으로 사람들의 성향을 알아가요.</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={_styles.contentItemContents} onPress={() => { selectedStoryType('SECRET'); }}>
              <LinearGradient colors={['#8E1DFF', '#000000']} style={_styles.contentItem}>
                <View style={_styles.contentImgArea}>
                  <Image source={ICON.talkQuestionIcon} style={{width: 70, height: 70,}} resizeMode={'cover'} />
                </View>
                <Text style={_styles.contentTitle}>시크릿</Text>
                <Text style={_styles.contentSubTitle}>이야기 앞에 “비밀”이 붙으면 재미있어 지는 법이죠!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </SpaceView>

        </SpaceView>
      </ScrollView> */}
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
    color: '#333',
  },
  titleUnderline: {
    position: 'absolute',
    top: 72,
    left: -1,
    width: width-205,
    height: 8,
    backgroundColor: '#7986EE',
    zIndex:-1,
  },
  contentArea: {
    
  },
  contentItem: {
    position:'relative',
    backgroundColor: '#C5C5C5',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'visible',
  },
  contentTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 17,
    color: '#333333',
    marginBottom: 15,
  },
  contentSubTitle: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 15,
    color: '#333333',
  },
  contentImg: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 35,
    height: 35,
  },

  // 디자인 리뉴얼
  // titleText: {
  //   fontFamily: 'AppleSDGothicNeoEB00',
  //   fontSize: 16,
  //   color: '#333',
  // },
  // contentArea: {
  //    flex: 1,
  //    flexDirection: 'row',
  //    flexWrap: 'wrap',
  // },
  // contentItemContents: {
  //   flexDirection: 'column',
  //   backgroundColor: '#C5C5C5',
  //   borderRadius: 10,
  //   marginBottom: 7,
  //   width: '49%',
  // },
  // contentItem: {
  //   paddingVertical: 20,
  //   paddingHorizontal: 20,
  //   borderRadius: 10,
  //   height: 266,
  // },
  // contentTitle: {
  //   fontFamily: 'AppleSDGothicNeoEB00',
  //   fontSize: 17,
  //   color: '#FFF',
  //   marginBottom: 15,
  //   marginTop: 30,
  // },
  // contentSubTitle: {
  //   fontFamily: 'AppleSDGothicNeoR00',
  //   fontSize: 15,
  //   color: '#FFF',
  // },
  // contentImgArea: {
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  // contentImg: {
  //   width: 55,
  //   height: 55,
  // },
});