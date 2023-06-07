import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { Slider } from '@miblanchard/react-native-slider';


const { width, height } = Dimensions.get('window');

export default function ProfileActive({ memberData }) {

  return (
    <>
      <SpaceView>
        <Text style={_styles.title}>프로필 활동지수</Text>
        <View style={_styles.profileActivePannel}>
          <Text style={_styles.profileEverageText}>프로필 평점</Text>
          <Text style={_styles.profileActiveText1}>
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              {memberData.nickname}
            </Text>
            님의 리미티드 대표 인상
          </Text>
          <Text style={_styles.profileActiveText2}>{memberData.face_code_name}</Text>
          <View style={_styles.sliderContainer}>
            <Text style={_styles.sliderText}>프로필 평점 {memberData.profile_score}</Text>
            <Slider
              value={memberData.profile_score/10}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={ColorType.purple}
              minimumTrackTintColor={ColorType.purple}
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
            <Slider
              value={memberData?.social_grade/10}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={'#fe0456'}
              minimumTrackTintColor={'#ff9fbe'}
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    // lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 20,
  },
  profileActivePannel: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ebedfc',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  profileEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#697ae6',
  },
  profileActiveText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 4,
  },
  profileActiveText2: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#5d6ae2',
    marginTop: 10,
  },
  sliderContainer: {
    marginTop: 26,
    alignItems: 'flex-start',
  },
  sliderText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#b7b7b7',
  },
  sliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  gageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#d0d0d0',
  },
  socialContainer: {
    borderRadius: 20,
    backgroundColor: '#feeff2',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  socialEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#fe0456',
  },
  socialText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#1c1c1c',
  },
  socialSliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fe0456',
  },
  socialSliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },

});