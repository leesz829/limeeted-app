import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { useDispatch, useSelector } from 'react-redux';
import { isEmptyData } from 'utils/functions';
import { ICON } from 'utils/imageUtils';

export default function InterviewRender({ title, dataList, type }) {

  return (
    <>
      {isEmptyData(dataList) && dataList.length > 0 && (
        <SpaceView>
          <SpaceView mb={25} viewStyle={{alignItems: 'center'}}>
            <SpaceView viewStyle={{flexDirection: 'row'}}>
              <View style={{zIndex:1}}>
                <Text style={_styles.titText}>{title}</Text>
              </View>
              <View style={_styles.titUnderline} />
            </SpaceView>
          </SpaceView>

          <SpaceView viewStyle={{alignItems:'flex-start', justifyContent: 'flex-start'}}>
            {dataList.map((e, index) => (
              <>
                {e.answer != "" && e.answer != null && 
                  <>
                    <SpaceView key={'interview_' + index} viewStyle={_styles.contentItemContainer}>
                      <SpaceView mb={10} viewStyle={_styles.questionRow}>
                        <Text style={_styles.questionText}>Q. {e?.code_name}</Text>
                      </SpaceView>
                      <SpaceView viewStyle={_styles.answerRow}>
                        <Text style={_styles.answerText}>"{e?.answer}"</Text>
                      </SpaceView>
                    </SpaceView>
                    {type == 'profile' &&
                      <TouchableOpacity style={_styles.modBtn}>
                        <Image source={ICON.squarePen} style={styles.iconSize16} />
                        <Text style={_styles.modBtnText}>수정</Text>
                      </TouchableOpacity>
                    }
                  </>
                }
              </>
            ))}
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
  titText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: '#FE8C12',
  },
  contentItemContainer: {
    //width: '100%',
    //justifyContent: 'flex-start',
    //minHeight: 60,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemActive: {
    backgroundColor: '#fff',
    borderColor: '#F7F7F7',
  },
  questionRow: {
    
  },
  questionText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#F1B10E',
  },
  answerRow: {
    /* flexDirection: 'row',
    width: '80%',
    marginTop: 10,
    position: 'relative', */
  },
  answerText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
    color: '#F3DEA6',
  },
  modBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
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
