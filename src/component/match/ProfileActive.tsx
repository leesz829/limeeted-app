import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { Slider } from '@miblanchard/react-native-slider';
import LinearGradient from 'react-native-linear-gradient';
import { isEmptyData } from 'utils/functions';


const { width, height } = Dimensions.get('window');

export default function ProfileActive({ memberData }) {

  return (
    <>
      <SpaceView mt={30}>

        <SpaceView viewStyle={{flexDirection: 'row', alignItems: `center`, justifyContent: `flex-start`,}}>
          <Text style={_styles.title}>프로필 활동지수</Text>

          <View style={[_styles.levelBadge, {marginRight: 0, marginTop: 1}]}>

            {/* ####################################################################################################
              ##################################### 프로필 평점 노출 영역
              #################################################################################################### */}
              {memberData?.profile_score < 6.0 &&
                <LinearGradient colors={['#FF7EA6', '#FF7EA6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score5Icon} style={[{width: 12, height: 12}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 6.0 && memberData?.profile_score < 7.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score6Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 7.0 && memberData?.profile_score < 8.0 &&
                <LinearGradient colors={['#FF4381', '#FF4381']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score7Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 8.0 && memberData?.profile_score < 9.0 &&
                <LinearGradient colors={['#FE0456', '#FF82AB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreKingIcon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 9.0 && memberData?.profile_score < 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E6DF5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.scoreDiamondIcon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }

              {memberData?.profile_score >= 10.0 &&
                <LinearGradient colors={['#FE0456', '#9E41E5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={_styles.scoreBadge}>
                  <Image source={ICON.score10Icon} style={[{width: 16, height: 16}]} />
                  <Text style={_styles.yellowText}>{memberData?.profile_score}</Text>
                </LinearGradient>
              }
          </View>

        </SpaceView>

        {/* ##############################################################################################
        ############### 프로필 평점 영역
        ############################################################################################## */}
        <View style={_styles.profileActivePannel}>
          <View style={{zIndex: 1}}>
            <Text style={_styles.profileEverageText}>프로필 평점</Text>
            <Text style={_styles.profileActiveText1}>
              <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>{memberData.nickname}</Text>
              님의 리미티드 대표 인상
            </Text>
            <Text style={_styles.profileActiveText2}>{memberData.face_code_name}</Text>
            <View style={_styles.sliderContainer}>
              <Text style={_styles.sliderText}>프로필 평점 {memberData.profile_score}</Text>

              {isEmptyData(memberData?.profile_score) && memberData?.profile_score > 0 &&
                <View style={[_styles.scoreContainer, { left: memberData?.profile_score == 0 ? 0 : memberData?.profile_score * 10 - 5 + '%' }]}>
                  <Text style={_styles.scoreText}>{memberData?.profile_score}</Text>
                  <View style={_styles.triangle}></View>
                </View>
              }

              <SpaceView mt={5} viewStyle={{zIndex: 1}}>
                <LinearGradient
                  colors={['#7986EE', '#8854D2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={_styles.gradient(memberData?.profile_score/10)}>
                </LinearGradient>
              </SpaceView>

              <Slider
                animateTransitions={true}
                renderThumbComponent={() => null}
                containerStyle={_styles.sliderContainerStyle}
                trackStyle={_styles.sliderThumbStyle}
                trackClickable={false}
                disabled
              />

              <View style={_styles.gageContainer}>
                <Text style={_styles.gageText}>0</Text>
                <Text style={_styles.gageText}>5</Text>
                <Text style={_styles.gageText}>10</Text>
              </View>
            </View>
          </View>
          
          {/* {memberData?.profile_score >= 7.0 && memberData?.profile_score < 8.0 &&
            <View style={{position: 'absolute', top: -10, right: 10}}>
              <Image source={ICON.score7BigIcon} style={[{width: 180, height: 180, opacity: 0.6}]} />
            </View>
          }
          {memberData?.profile_score >= 8.0 && memberData?.profile_score < 9.0 &&
            <View style={{position: 'absolute', top: -5, right: 15}}>
              <Image source={ICON.scoreKingIcon} style={[{width: 180, height: 180, opacity: 0.6}]} />
            </View>
          }
          {memberData?.profile_score >= 9.0 && memberData?.profile_score < 10.0 &&
            <View style={{position: 'absolute', top: 15, right: 5}}>
              <Image source={ICON.scoreDiamondIcon} style={[{width: 180, height: 180, opacity: 0.6}]} />
            </View>
          }
          {memberData?.profile_score >= 10.0 &&
            <View style={{position: 'absolute', top: 0, right: 5}}>
              <Image source={ICON.score10Icon} style={[{width: 180, height: 180, opacity: 0.6}]} />
            </View>
          } */}
          
        </View>


        {/* ##############################################################################################
        ############### 소셜 평점 영역
        ############################################################################################## */}
        <View style={_styles.socialContainer}>
          <Text style={_styles.socialEverageText}>소셜 평점</Text>
          <Text style={[_styles.socialText1, { fontFamily: 'AppleSDGothicNeoEB00' }]}>
            {memberData?.social_grade > 9 && '천상계와 신계 그 어딘가의 존재'}
            {memberData?.social_grade > 8 && memberData?.social_grade <= 9 && '미세먼지없이 맑은 하늘 위에 숨쉬는 존재'}
            {memberData?.social_grade > 7 && memberData?.social_grade <= 8 && '쾌청한 하늘 아래 맑은 바닷물과 어울리는 분'}
            {memberData?.social_grade > 6 && memberData?.social_grade <= 7 && '따사로운 햇살이 비치는 꽃길을 걷는 분'}
            {memberData?.social_grade > 5 && memberData?.social_grade <= 6 && '어두운 골목과 화려한 조명의 조화 속에 숨은 사람'}
            {memberData?.social_grade > 4 && memberData?.social_grade <= 5 && '심해로 통하는 어두운 바다에 몸을 담근 자'}
            {memberData?.social_grade <= 4 && '깊은 심해를 탐험하는 자'}
          </Text>
          {/* <Text style={styles.socialText1}>매칭되면</Text>
          <Text style={styles.socialText1}>
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              후회하지 않을듯한
            </Text>{' '}
            느낌이 들어요
          </Text> */}
          <View style={_styles.sliderContainer}>
            <Text style={_styles.sliderText}>소셜 평점 {memberData?.social_grade.toFixed(1)}</Text>

            {isEmptyData(memberData?.social_grade) && memberData?.social_grade > 0 &&
              <View style={[_styles.scoreContainer, { left: memberData?.social_grade == 0 ? 0 : memberData?.social_grade * 10 - 5 + '%' }]}>
                <Text style={_styles.scoreText}>{memberData?.social_grade}</Text>
                <View style={_styles.triangle}></View>
              </View>
            }

            <SpaceView mt={5} viewStyle={{zIndex: 1}}>
              <LinearGradient
                colors={['#FF9FBE', '#FE0456']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={_styles.gradient(memberData?.social_grade/10)}>
              </LinearGradient>
            </SpaceView>

            <Slider
              //value={memberData?.social_grade/10}
              animateTransitions={true}
              renderThumbComponent={() => null}
              /* maximumTrackTintColor={'#fe0456'}
              minimumTrackTintColor={'#ff9fbe'} */
              containerStyle={_styles.socialSliderContainerStyle}
              trackStyle={_styles.socialSliderThumbStyle}
              trackClickable={false}
              disabled
            />
            <View style={_styles.gageContainer}>
              <Text style={_styles.gageText}>0</Text>
              <Text style={_styles.gageText}>5</Text>
              <Text style={_styles.gageText}>10</Text>
            </View>
          </View>
        </View>
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
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  profileActivePannel: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#D5DAFC',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  profileEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    lineHeight: 26,
    color: '#697AE6',
  },
  profileActiveText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
    color: '#333333',
    marginTop: 4,
  },
  profileActiveText2: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#5d6ae2',
    marginTop: 3,
  },
  sliderContainer: {
    marginTop: 26,
    alignItems: 'flex-start',
  },
  sliderText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 11,
    textAlign: 'center',
    color: '#8A8DA4',
  },
  sliderContainerStyle: {
    width: '100%',
    height: 11,
    borderRadius: 50,
    backgroundColor: ColorType.primary,
  },
  sliderThumbStyle: {
    height: 11,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  gageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  gageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    color: '#8A8DA4',
  },
  socialContainer: {
    borderRadius: 20,
    backgroundColor: '#FEEFF2',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  socialEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    lineHeight: 26,
    color: '#fe0456',
  },
  socialText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
    color: '#1c1c1c',
  },
  socialSliderContainerStyle: {
    width: '100%',
    height: 11,
    borderRadius: 50,
    backgroundColor: '#fe0456',
  },
  socialSliderThumbStyle: {
    height: 11,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  gradient: (value:any) => {
    let percent = 0;

    if(value != null && typeof value != 'undefined') {
      percent = value * 100;
    };

    return {
      position: 'absolute',
      width: percent + '%',
      height: 11,
      zIndex: 1,
      borderRadius: 13,
    };
  },
  scoreBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `space-between`,
    marginRight: 5,
    paddingHorizontal: 5,
  },
  yellowText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FDFFD8',
  },
  levelBadge: {
    width: 51,
    height: 21,
    borderRadius: 5,
    //backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginLeft: 8,
  },
  scoreContainer: {
    position: 'absolute',
    transform: [{ translateY: -6 }], // 수직 중앙 정렬을 위한 translateY
    alignItems: 'center',
  },
  scoreText: {
    backgroundColor: '#151515',
    color: ColorType.white,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderBottomColor: '#151515',
    overflow: 'hidden',
  },
  triangle: {
    marginTop: -1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151515',
    transform: [{ rotate: '180deg' }],
  },

});