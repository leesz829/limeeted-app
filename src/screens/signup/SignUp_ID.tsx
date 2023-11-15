import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, View, Platform, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { SUCCESS, MEMBER_EMAIL_DUP } from 'constants/reusltcode';
import { regist_member_base_info } from 'api/models';
import { ROUTES } from 'constants/routes';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';



interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_ID'>;
  route: RouteProp<StackParamList, 'SignUp_ID'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_ID = (props: Props) => {
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

    if(isResult === true) {
      goNext();
    };
  };

  // ########################################################### 다음 이동
  const goNext = async () => {
    navigation.navigate({
      name : ROUTES.SIGNUP_PASSWORD,
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
      <ScrollView>
        <LinearGradient
          colors={['#3D4348', '#1A1E1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={_styles.signUpContainer}
        >
        
          <SpaceView mt={30} mb={20} viewStyle={{paddingHorizontal:16}}>
            <CommonText textStyle={_styles.title}>
              아이디로 사용하실{'\n'}이메일을 입력해주세요.
            </CommonText>
          </SpaceView>

          <SpaceView mt={80} viewStyle={[_styles.container]}>
            <View style={{width: '100%'}}>
              <Text style={_styles.emailPwdText}>이메일</Text>
            </View>
            <SpaceView mb={10} viewStyle={[commonStyle.width100]}>
              <CommonInput
                label=""
                value={emailId}
                onChangeText={(emailId) => setEmailId(emailId)}
                maxLength={50}
                borderBottomType={'#F3E270'}
                fontSize={14}
                style={{color: '#F3E270', marginTop: 10,}}
              />
              <TouchableOpacity 
                style={_styles.removeTextBtn}
                onPress={() => { setEmailId(''); }}
              >
                <Image source={ICON.xYellow} style={styles.iconSquareSize(10)} />
              </TouchableOpacity>
            </SpaceView>
            <View style={{width: '100%'}}>
              <Text style={_styles.noticeText}>실제 사용하시는 이메일을 입력해주세요.</Text>
            </View>

            <SpaceView mt={235}>
              <CommonBtn
                value={'비밀번호 만들기'}
                type={'reNewId'}
                borderRadius={5}
                onPress={() => {
                  emailValidChk();
                  //goNext();
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



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}
const _styles = StyleSheet.create({
  signUpContainer: {
    minHeight: height,
    paddingTop: 60,
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 1,
  },
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flex: 1,
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    color: '#D5CD9E',
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 15,
  },
  emailPwdText: {
    fontFamily: 'Pretendard-Bold',
    color: '#F3E270',
    fontSize: 14,
  },
  noticeText: {
    fontFamily: 'Pretendard-Light',
    color: '#D5CD9E',
    fontSize: 12,
  },
  removeTextBtn: {
    position: 'absolute',
    top: 15,
    right: 0,
  },
});