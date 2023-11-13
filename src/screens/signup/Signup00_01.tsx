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
  navigation: StackNavigationProp<StackParamList, 'Signup00_01'>;
  route: RouteProp<StackParamList, 'Signup00_01'>;
}

export const Signup00_01 = (props: Props) => {
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
      name : ROUTES.SIGNUP00_02,
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
      <ScrollView style={[styles.scrollContainerAll]}>
        <Text>{mobile}로 인증된 회원님의 성함은 {name} 만 {age}세 {gender}이시군요!</Text>
        <Text>입력된 회원 정보가 맞으신가요?</Text>
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


const _styles = StyleSheet.create({
  
});