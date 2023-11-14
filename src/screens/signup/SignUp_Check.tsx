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
import { Image, ScrollView, StyleSheet, View, Platform, Text, Dimensions } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { SUCCESS, MEMBER_EMAIL_DUP } from 'constants/reusltcode';
import { regist_member_base_info } from 'api/models';
import { ROUTES } from 'constants/routes';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';


interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_Check'>;
  route: RouteProp<StackParamList, 'SignUp_Check'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Check = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const { show } = usePopup();  // 공통 팝업
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  const birthday = props.route.params?.birthday; // 생년월일
  const ci = props.route.params?.ci; // CI
  const name = props.route.params?.name; // 이름
  const gender = props.route.params?.gender; // 성별
  const mrktAgreeYn = props.route.params?.marketing_agree_yn; // 마케팅 정보 동의 여부
  const [age, setAge] = React.useState(function () { // 나이
    let age_d;
    let today = new Date();
    let birthDay = props.route.params?.birthday;
    let birthYear = birthDay?.substring(0, 4);
    age_d = Number(today.getFullYear()) - Number(birthYear) + 1;
    return age_d.toString();
  });
  const [mobile, setMobile] = React.useState( // 전화번호
    props.route.params?.mobile
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
  );

  // ########################################################### 다음 이동
  const goNext = async () => {
    navigation.navigate({
      name : ROUTES.SIGNUP_ID,
      params : {
        birthday: '19900829',
        ci: 'test',
        name: '테스터',
        gender: 'M',
        marketing_agree_yn: 'Y',
        mobile: '01051079809',
      }
    });
  };

  return (
    <>
      <ScrollView>
        <LinearGradient
          colors={['#3D4348', '#1A1E1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={_styles.signUpContainer}
        >
          <SpaceView viewStyle={{paddingHorizontal:16, marginTop: 50}}>
            <Text style={_styles.signUpText}><Text style={_styles.memberInfoText}>{mobile}</Text>로 인증된 회원님의 성함은 <Text style={_styles.memberInfoText}>{name}</Text> <Text style={_styles.memberInfoText}>만 {age}세 {gender === 'M' ? '남자' : '여자'}</Text> 이시군요!</Text>
            <Text style={[_styles.signUpText, {marginTop: 20}]}>입력된 회원 정보가 맞으신가요?</Text>
          
          <SpaceView mt={160}>
            <CommonBtn
              value={'네, 맞아요!'}
              type={'reNewId'}
              borderRadius={5}
              onPress={() => {
                goNext();
              }}
            />
          </SpaceView>
          <SpaceView mt={20}>
            <CommonBtn
              value={'처음으로'}
              type={'reNewGoBack'}
              isGradient={false}
              fontFamily={'Pretendard-Light'}
              fontSize={14}
              borderRadius={5}
              onPress={() => {
                navigation.navigate('Login');
              }}
            />
          </SpaceView>
          </SpaceView>
        </LinearGradient>
      </ScrollView>
    </>
  );
};


const _styles = StyleSheet.create({
  signUpContainer: {
    minHeight: height,
    paddingTop: 60,
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 30,
    lineHeight: 40,
    color: '#D5CD9E',
    fontFamily: 'Pretendard-Medium'
  },
  memberInfoText: {
    fontSize: 30,
    color: '#F3E270',
  },
});