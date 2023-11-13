import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, styles } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, View, Platform, Text } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { SUCCESS, MEMBER_EMAIL_DUP } from 'constants/reusltcode';
import { regist_member_base_info } from 'api/models';
import { ROUTES } from 'constants/routes';
import { isEmptyData } from 'utils/functions';


interface Props {
  navigation: StackNavigationProp<StackParamList, 'Signup00_02'>;
  route: RouteProp<StackParamList, 'Signup00_02'>;
}

export const Signup00_02 = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const { show } = usePopup();  // 공통 팝업
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  const birthday = props.route.params?.birthday; // 생년월일
  const ci = props.route.params?.ci; // CI
  const name = props.route.params?.name; // 이름
  const gender = props.route.params?.gender; // 성별
  const age = props.route.params?.age; // 나이
  const mobile = props.route.params?.mobile; // 전화번호
  const mrktAgreeYn = props.route.params?.marketing_agree_yn; // 마케팅 정보 동의 여부
  const memberSeq = props.route.params?.memberSeq; // 회원 번호
  const orgEmailId = props.route.params?.emailId; // 기존 이메일 ID

  // 입력 변수
  const [emailId, setEmailId] = React.useState(props.route.params?.emailId);
  const [password, setPassword] = React.useState('');
  const [passwordChk, setPasswordChk] = React.useState('');

  // ######################################################################################################## 이메일 유효성 체크
  const emailValidChk = async () => {
    let isResult = true;

    if(emailId == '') {
      show({ content: '아이디를 입력해 주세요.' });
      isResult = false;
    }

    let regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if(!regEmail.test(emailId)) {
      show({ content: '이메일 형식의 아이디가 아닙니다.' });
      isResult = false;
    }

    return isResult;
  };

  // ########################################################### 다음 이동
  const goNext = async () => {
    navigation.navigate({
      name : ROUTES.SIGNUP00_02,
      params : {
        birthday: birthday,
        ci: ci,
        name: name,
        gender: gender,
        marketing_agree_yn: mrktAgreeYn,
        mobile: mobile,
        emailId: emailId,
      }
    });
  };

  return (
    <>
      <ScrollView style={[styles.scrollContainerAll]}>
        <SpaceView>
          <Text></Text>
        </SpaceView>

        <SpaceView viewStyle={[commonStyle.paddingHorizontal20, commonStyle.mb70]}>

          <SpaceView mb={24}>
            <CommonInput
              label="이메일"
              value={emailId}
              onChangeText={(value) => setEmailId(emailId)}
              maxLength={50}
              placeholderTextColor={'#c6ccd3'}
              placeholder={'이메일 주소'}
              borderBottomType={'black'}
            />
          </SpaceView>
        </SpaceView>
      </ScrollView>

      <SpaceView>
        <CommonBtn
          value={'다음 (1/4)'}
          type={'primary'}
          height={60}
          borderRadius={1}
          onPress={() => {
            goNext();
          }}
        />
      </SpaceView>
    </>
  );
};

const selectStyles = StyleSheet.create({
  selectImgContainer: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    right: 16,
  },
  selectContainer: {},
  labelContainer: {
    marginBottom: 8,
  },
  labelStyle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'AppleSDGothicNeoR00',
    color: Color.gray6666,
    marginBottom: 8,
  },
  inputContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Color.grayDDDD,
  },
  icon: {
    width: 16,
    height: 16,
    transform: [{ rotate: '90deg' }],
  },
});