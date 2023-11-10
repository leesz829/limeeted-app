import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { useDispatch, useSelector } from 'react-redux';
import { isEmptyData } from 'utils/functions';

export default function InterviewRender({ title, dataList }) {
  
  return (
    <>
      {isEmptyData(dataList) && dataList.length > 0 && (
        <SpaceView>
          <SpaceView mb={30}>
            <Text style={_styles.titleText}>인터뷰</Text>
          </SpaceView>

          <SpaceView mb={30}>
            <Text style={_styles.mstText}>"리미티드에 오신 것을 정말 정말 환영합니다. 데일리뷰 많이 참여해 주시고 라이브도 잊지 마시고 서로 평점 테러 좀 하지 마세요. 제발"</Text>
          </SpaceView>

          <SpaceView>
            {/* <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={_styles.interviewListWrap}>

              {dataList.map((e, index) => (
                <>
                  {e.answer != "" && e.answer != null && 
                    <SpaceView key={'interview_' + index} viewStyle={[_styles.contentItemContainer, index % 2 !== 0 && _styles.itemActive]}>
                      <View style={_styles.questionRow}>
                        <Text style={_styles.questionText}>Q.</Text>
                        <Text style={[_styles.questionBoldText]}> {e?.code_name}</Text>
                      </View>
                      <View style={_styles.answerRow}>
                        <Text style={_styles.answerText}>A.</Text>
                        <Text style={[_styles.answerNormalText, Platform.OS == 'ios' ? {marginTop: -5} : {marginTop: 0}]}>{e?.answer}</Text>
                      </View>
                    </SpaceView>
                  }
                </>
              ))}
            </ScrollView> */}
          </SpaceView>
        </SpaceView>
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

  titleText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 27,
    color: '#FFF8CC',
  },
  mstText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 17,
    color: '#344756',
    textAlign: 'center',
  },
  interviewListWrap: {

  },




  registerButton: {
    borderColor: '#7986ee',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 3,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
  },
  registerText: {
    color: Color.primary,
  },
  deleteButton: {
    backgroundColor: '#7986ee',
    paddingHorizontal: 20,
    paddingVertical: 3,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteText: {
    color: Color.white,
  },

  checkIconStyle: {
    width: 12,
    height: 8,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Color.grayDDDD,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 6,
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  contentItemContainer: {
    width: '100%',
    minHeight: 100,
    borderRadius: 10,
    backgroundColor: '#eff3fe',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f9f9f9',
    padding: 20,
    marginBottom: 10,
  },
  itemActive: {
    backgroundColor: '#fff',
    borderColor: '#F7F7F7',
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '90%',
  },
  questionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  questionBoldText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'left',
    color: '#272727',
    marginLeft: 10,
    marginTop: 3,
  },
  questionNormalText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#272727',
  },
  answerRow: {
    flexDirection: 'row',
    width: '80%',
    marginTop: 10,
    position: 'relative',
  },
  answerText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  answerNormalText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginLeft: 12,
    marginTop: -7,
    textAlignVertical: 'top',
  },
  penPosition: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
  penImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  selectedDelete: {
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: '#363636',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  selectedDeleteText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});
