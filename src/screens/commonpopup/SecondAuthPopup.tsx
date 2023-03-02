import React, { useRef } from 'react';
import type { FC, useState, useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
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
import { ImagePicker } from 'component/ImagePicker';
import { save_profile_auth, get_member_second_detail } from 'api/models';
import { usePopup } from 'Context';
import { useDispatch } from 'react-redux';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { useSecondAth } from 'hooks/useSecondAth';


/* ################################################################################################################
###################################################################################################################
###### 2차 인증 팝업
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

export const SecondAuthPopup = (props: Props) => {

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


  if (type == 'JOB') {
    title = '직업';
    itemNm = '직업';
    placeholderTxt = '직업을 입력해주세요. (예 : 삼성전자 마케팅)';
    etcTxt01 = '자신의 커리어를 증명할 수 있는 명함 또는 증명서를 올려주세요.';
    etcTxt02 = '허용 증명서 : 재직 증명서, 건강보헝 자격 득실 증명서, 직업 라이선스';
  } else if (type == 'EDU') {
    title = '학업';
    itemNm = '교육기관';
    placeholderTxt = '출신 교육기관을 입력해주세요. (예 : 서울대 컴퓨터 공학과)';
    etcTxt01 = '자신의 출식 대학교 또는 대학원 등의 재학증명서 또는 졸업 증명서 등을 올려주세요.';
    etcTxt02 = '그외의 고등 교육기관의 경우는 관리자의 주관적 판단에 의해 결정될 수 있으니 참고바랍니다.';
  } else if (type == 'INCOME') {
    title = '소득';
    etcTxt01 = '가장 최근의 급여 명세서를 올려주세요.';
    etcTxt02 = '직업 인증과 이름이 다를 경우 관리자의 판단에 따라 반려될 수 있으니 참고해주세요.';
  } else if (type == 'ASSET') {
    title = '자산';
    etcTxt01 = '은행에서 발급 받을 수 있는 잔고 증명서를 올려주세요. 잔고가 5억 이상인 경우 프로필 2차 인증을 승인 받을 수 있습니다.';
  } else if (type == 'SNS') {
    title = 'SNS';
    itemNm = '인스타ID';
    placeholderTxt = '인스타그램 ID를 입력해주세요.';
    etcTxt01 = '자신의 인스타 계정을 연동시켜주세요.\n팔로워 수 10000명 이상이 되면 프로필 2차 인증이 승인됩니다.';
    etcTxt02 = 'ID를 정확히 입력해주셔야 인증 승인이 가능합니다.';
  } else if (type == 'VEHICLE') {
    title = '차량';
    itemNm = '모델명';
    placeholderTxt = '소유중인 차량 모델을 입력해주세요. (예 : 제네시스 G80)';
    etcTxt01 = '소유차량을 증명할 수 있는 차량 등록등 또는 자동차 보험 가입 현황을 올려주세요.';
  }

  // ################################################################ 인증 파일 콜백 함수
  const fileCallBackFn01 = (
    uri: any,
    base64: string
  ) => {
    let dupChk = false;
    let data = {file_uri: uri, file_base64: base64, order_seq: 1, auth_code: type};
    fileDataList.map(({order_seq} : {order_seq: any;}) => {
      if(order_seq == 1) { dupChk = true };
    })
    if(!dupChk) {
      setFileDataList([...fileDataList, data]);
    } else {
      setFileDataList((prev) =>
        prev.map((item: any) =>
          item.order_seq === 1 ? { ...item, uri: data.file_uri, file_base64: data.file_base64 } : item
        )
      );
    }
  };

  const fileCallBackFn02 = (
    uri: any,
    base64: string
  ) => {
    let dupChk = false;
    let data = {file_uri: uri, file_base64: base64, order_seq: 2, auth_code: type};
    fileDataList.map(({order_seq} : {order_seq: any;}) => {
      if(order_seq == 2) { dupChk = true };
    })
    if(!dupChk) {
      setFileDataList([...fileDataList, data]);
    } else {
      setFileDataList((prev) =>
        prev.map((item: any) =>
          item.order_seq === 2 ? { ...item, file_uri: data.file_uri, file_base64: data.file_base64 } : item
        )
      );
    }
  };

  const fileCallBackFn03 = (
    uri: any,
    base64: string
  ) => {
    let dupChk = false;
    let data = {file_uri: uri, file_base64: base64, order_seq: 3, auth_code: type};
    fileDataList.map(({order_seq} : {order_seq: any;}) => {
      if(order_seq == 3) { dupChk = true };
    })
    if(!dupChk) {
      setFileDataList([...fileDataList, data]);
    } else {
      setFileDataList((prev) =>
        prev.map((item: any) =>
          item.order_seq === 3 ? { ...item, file_uri: data.file_uri, file_base64: data.file_base64 } : item
        )
      );
    }
  };

  // ################################################################ 2차 인증 저장 함수
  const saveSecondAuth = async () => {
    props.saveFn(props.type, fileDataList);

    /* const body = {
      file_list: fileDataList
    };
    try {
      const { success, data } = await save_profile_auth(body);

      if (success) {
        if (data.result_code == '0000') {
          //dispatch(setPartialPrincipal({mbr_ideal_type : data.mbr_second_auth_list}));
          show({
            content: '심사 요청 되었습니다.' ,
            confirmCallback: function() {
              props.onCloseFn();
            }
          });          
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    } */
  };

  // ################################################################ 회원 2차인증 상세 목록 조회
  const getMemberSecondDetail = async () => {
    const body = {
      second_auth_code: type
    };
    try {
      const { success, data } = await get_member_second_detail(body);
      if(success) {
        if(data.result_code == '0000') {
          data.auth_detail_list.map(({img_file_path, order_seq} : {img_file_path: any; order_seq: any;}) => {
              if(order_seq == 1) {
                setAuthFile_01(img_file_path);
              } else if(order_seq == 2) {
                setAuthFile_02(img_file_path);
              } else if(order_seq == 3) {
                setAuthFile_03(img_file_path);
              }
          });

        } else {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {}
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  }

  
  // 첫 렌더링 때 fetchNews() 한 번 실행
  React.useEffect(() => {
    //getMemberSecondDetail();
  }, [isFocus]);


  return (
    <View style={layoutStyle.flex1}>
      <View style={modalStyle.modalHeaderContainer}>
        <CommonText fontWeight={'700'} type={'h3'}>
          {title} 인증
        </CommonText>
        <TouchableOpacity onPress={props.onCloseFn}>
          <Image source={ICON.xBtn} style={styles.iconSize24} />
        </TouchableOpacity>
      </View>

      <View style={modalStyle.modalBody}>
        {itemNm != '' ? (
          <View>
            <SpaceView mb={32}>
              <CommonInput
                label={itemNm}
                placeholder={placeholderTxt}
                onChangeText={(item) => setItem(item)}
                value={item}
              />
            </SpaceView>
          </View>
        ) : null}

        <SpaceView mb={24}>
          <SpaceView mb={16}>
            <View style={styles.dotTextContainer}>
              <View style={styles.dot} />
              <CommonText color={ColorType.gray6666}>{etcTxt01}</CommonText>
            </View>
          </SpaceView>

          {etcTxt02 != '' ? (
            <SpaceView>
              <View style={styles.dotTextContainer}>
                <View style={styles.dot} />
                <CommonText color={ColorType.gray6666}>{etcTxt02}</CommonText>
              </View>
            </SpaceView>
          ) : null}
        </SpaceView>

        {/* <SpaceView mb={24}>
					<CommonBtn value={'등록 및 수정'} height={48} type={'white'} icon={ICON.plus} />
				</SpaceView> */}

        <SpaceView mb={24} viewStyle={[layoutStyle.alignCenter]}>
          <View style={[layoutStyle.row]}>
            <View>
              <ImagePicker
                isBig={false}
                callbackFn={fileCallBackFn01}
                uriParam={props.filePath01}
              />
            </View>
            <View style={[commonStyle.mr10, commonStyle.ml10]}>
              <ImagePicker
                isBig={false}
                callbackFn={fileCallBackFn02}
                uriParam={props.filePath02}
              />
            </View>
            <View>
              <ImagePicker
                isBig={false}
                callbackFn={fileCallBackFn03}
                uriParam={props.filePath03}
              />
            </View>
          </View>
        </SpaceView>

        <SpaceView mb={16}>
          <CommonBtn
            value={'심사 요청'}
            type={'primary'}
            onPress={() => {
              saveSecondAuth();
            }}
          />
        </SpaceView>
      </View>
    </View>
  );
};
