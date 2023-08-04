import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { useDispatch, useSelector } from 'react-redux';

const indexToKr = [
  '첫',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
  '열',
  '열한',
  '열두',
  '열세',
  '열네',
];
export default function InterviewRender({ title, dataList }) {
  
  return (
    <>
      {dataList != null && typeof dataList != 'undefined' && dataList.length > 0 &&
        <SpaceView>
          <SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
            <View>
              <CommonText fontWeight={'700'} type={'h3'}>
                {title || '인터뷰'}
              </CommonText>
            </View>
          </SpaceView>

          {dataList.map((e, index) => (
            <>
              {e.answer != "" && e.answer != null && 
                <View key={'interview_' + index} style={[style.contentItemContainer, index % 2 !== 0 && style.itemActive]}>
                  <View style={style.questionRow}>
                    <Text style={style.questionText}>Q.</Text>
                    <Text style={[style.questionBoldText]}> {e?.code_name}</Text>
                  </View>
                  <View style={style.answerRow}>
                    <Text style={style.answerText}>A.</Text>
                    {/* <Text style={[style.questionBoldText, {marginLeft: 11, color: '#7986EE'}]}> {e?.answer}</Text> */}
                    <Text style={[style.answerNormalText, Platform.OS == 'ios' ? {marginTop: -5} : {marginTop: 0}]}>{e?.answer}</Text>
                  </View>
                </View>
              }
            </>
          ))}
        </SpaceView>
      }
    </>
  );
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const style = StyleSheet.create({
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    fontWeight: 'normal',
    fontStyle: 'normal',
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  answerNormalText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginLeft: 12,
    marginTop: -7,
    
    /* position: 'absolute',
    top: 1, */
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});
