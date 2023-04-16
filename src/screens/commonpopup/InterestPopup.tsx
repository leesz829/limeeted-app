import React, { useRef } from 'react';
import type { FC, useState, useEffect } from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import CommonHeader from 'component/CommonHeader';
import { commonStyle, layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { ColorType } from '@types';
import { usePopup } from 'Context';
import { useDispatch } from 'react-redux';
import { useSecondAth } from 'hooks/useSecondAth';


/* ################################################################################################################
###################################################################################################################
###### 관심사 팝업
###### 1. type
###### - JOB : 직업
###### - EDU : 학위
###### - INCOME : 소득
###### - ASSET : 자산
###### - SNS : SNS
###### - VEHICLE : 차량
###################################################################################################################
################################################################################################################ */

interface Props {
  type: string;
  onCloseFn: () => void;
  saveFn: (
      type: string,
      list: any
  ) => void;
  filePath01: string
  filePath02: string
  filePath03: string
}

export const InterestPopup = (props: Props) => {

  const dispatch = useDispatch();
  const { show } = usePopup();  // 공통 팝업
  const isFocus = useIsFocused();

  const mbrSecondAuthList = useSecondAth();  // 회원 2차 인증 정보
  
  const type = props.type;
  let title = '';
  let itemNm = '';
  let placeholderTxt = '';
  let etcTxt01 = '';
  let etcTxt02 = '';

  const fileInfo = { uri: '', fileName: '', fileSize: 0, type: '', base64: '' };
  const [fileDataList, setFileDataList] = React.useState([]);
  const [item, setItem] = React.useState(props.itemTxt);

  const [authFile_01, setAuthFile_01] = React.useState('');
  const [authFile_02, setAuthFile_02] = React.useState('');
  const [authFile_03, setAuthFile_03] = React.useState('');



  // ################################################################ 2차 인증 저장 함수


  // 첫 렌더링 때 fetchNews() 한 번 실행
  React.useEffect(() => {
    //getMemberSecondDetail();
  }, [isFocus]);


  return (

    <View style={modalStyle.modalBody}>      
      {intList.map((item, index) => (
        <SpaceView mb={24} key={item.group_code + '_' + index}>
          <SpaceView mb={16}>
            <CommonText fontWeight={'500'}>{item.group_code_name}</CommonText>
          </SpaceView>

          <View style={[_styles.rowStyle, layoutStyle.justifyBetween]}>
            {item.list.map((i, idx) => {
              let tmpCommonCode = '';
              let tmpCnt = 0;

              for (let j = 0; j < checkIntList.length; j++) {
                if(checkIntList[j].common_code == i.common_code){
                  tmpCommonCode = i.common_code
                  tmpCnt = j;
                  break;
                }
              }

              return (
                <SpaceView key={i.common_code}>
                  <TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
                            onPress={() => {
                              if(i.common_code === tmpCommonCode){
                                setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
                              } else {
                                setCheckIntList(intValue => [...intValue, i])
                              }
                            }}>
                    <CommonText
                      fontWeight={'500'}
                      color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
                      {i.code_name}
                    </CommonText>
                  </TouchableOpacity>
                </SpaceView>
              )
            })}	
          </View>
        </SpaceView>
      ))}

      <SpaceView mb={16}>
        <CommonBtn value={'저장'} 
              type={'primary'}
              onPress={int_confirm}/>
      </SpaceView>
    </View>
  );
};


const _styles = StyleSheet.create({
	rowStyle : {
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});