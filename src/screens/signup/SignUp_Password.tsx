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
  navigation: StackNavigationProp<StackParamList, 'SignUp_Password'>;
  route: RouteProp<StackParamList, 'SignUp_Password'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Password = (props: Props) => {
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

  // ######################################################################################################## 패스워드 유효성 체크
  const passwordValidChk = async () => {
    let isResult = true;

    if(password == '') {
      show({ content: '비밀번호를 입력해 주세요.' });
      isResult = false;
    };

    let regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if(!regPass.test(password)) {
      show({ content: '영문, 숫자, 특수기호(!@#$%^*+=-) 조합으로\n8-25자리 입력해주세요.' });
      isResult = false;
    };

    if(passwordChk == '') {
      show({ content: '비밀번호 확인을 입력해 주세요.' });
      isResult = false;
    };

    if(password != passwordChk) {
      show({ content: '비밀번호 확인이 맞지 않습니다.' });
      isResult = false;
    };

    return isResult;
  };

  // ######################################################################################################## 회원가입
  const register = async () => {

    // 기존 저장되어 있는 회원 유무 구분 처리
    if(isEmptyData(memberSeq)) {

      if(orgEmailId != emailId || isEmptyData(password)) {
        if(orgEmailId != emailId) {
          const emailChkResult = await emailValidChk();
          if(!emailChkResult) {
            return;
          };
        };
  
        if(isEmptyData(password)) {
          const passwordChkResult = await passwordValidChk();
          if(!passwordChkResult) {
            return;
          };
        };

        saveRegistMember();

      } else {
        navigation.reset({
          routes: [
            {
              name : ROUTES.LOGIN01
            },
            {
              name: ROUTES.SIGNUP_PASSWORD,
              params: {
                ci: ci,
                name: name,
                gender: gender,
                mobile: mobile,
                birthday: birthday,
                memberSeq: memberSeq,
                emailId: emailId
              }
            },
            {
              name: ROUTES.SIGNUP_IMAGE,
              params: {
                memberSeq: memberSeq,
                gender: gender,
              }
            }
          ]
        });
      }

    } else {

      if(!isEmptyData(ci)) {
        show({ content: '본인인증을 다시 진행해 주세요.' });
        return;
      };

      const emailChkResult = await emailValidChk();
      if(!emailChkResult) {
        return;
      };

      const passwordChkResult = await passwordValidChk();
      if(!passwordChkResult) {
        return;
      };
  
      saveRegistMember();
    }
  };

  // ########################################################### 회원가입
  const saveRegistMember = async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);

      const body = {
        email_id: emailId,
        password: password,
        name: name,
        gender: gender,
        phone_number: mobile,
        ci: ci,
        birthday: birthday,
        device_gubun: Platform.OS,
        marketing_agree_yn: mrktAgreeYn,
      };
  
      try {
        const { success, data } = await regist_member_base_info(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:  
              navigation.reset({
                routes: [
                  {
                    name : ROUTES.LOGIN01
                  },
                  {
                    name: ROUTES.SIGNUP_PASSWORD,
                    params: {
                      ci: ci,
                      name: name,
                      gender: gender,
                      mobile: mobile,
                      birthday: birthday,
                      memberSeq: data?.member_seq,
                      emailId: emailId
                    }
                  },
                  {
                    name: ROUTES.SIGNUP_IMAGE,
                    params: {
                      memberSeq: data?.member_seq,
                      gender: gender,
                    }
                  }
                ]
              });
  
              break;
            case MEMBER_EMAIL_DUP:
              show({ content: '이미 사용하고 있는 이메일 입니다.' });
              break;
            default:
              show({ content: '오류입니다. 관리자에게 문의해주세요.' });
              break;
          }
         
        } else {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {}
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsClickable(true);
      }
    }
  }

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
              사용하실{'\n'}비밀번호를 입력해주세요.
            </CommonText>
          </SpaceView>

          <SpaceView mt={30} mb={30} viewStyle={[_styles.container]}>
            <View style={{width: '100%'}}>
              <Text style={[_styles.emailPwdText, {color: '#D5CD9E'}]}>이메일</Text>
            </View>
            <SpaceView mb={30} viewStyle={[commonStyle.width100]}>
              <CommonInput
                label=""
                value={emailId}
                onChangeText={(emailId) => setEmailId(emailId)}
                maxLength={50}
                fontSize={14}
                disabled={true}
                style={{color: '#D5CD9E', marginTop: 10}}
              />
            </SpaceView>

            <View style={{width: '100%'}}>
              <Text style={_styles.emailPwdText}>비밀번호</Text>
            </View>
            <SpaceView viewStyle={[commonStyle.width100]}>
              <CommonInput
                label=""
                value={password}
                onChangeText={(password) => setPassword(password)}
                isMasking={true}
                maxLength={20}
                borderBottomType={'#F3E270'}
                fontSize={14}
                style={{color: '#F3E270', marginTop: 10}}
              />
              <TouchableOpacity 
                style={_styles.removeTextBtn}
                onPress={() => { setPassword(''); }}
              >
                <Image source={ICON.xYellow} style={{width: 10, height: 10}} />
              </TouchableOpacity>
            </SpaceView>
            <View style={{width: '100%'}}>
              <Text style={_styles.noticeText}><Text style={{color: '#FFDD00'}}>8글자 이상</Text>, 영문포함, <Text style={{color: '#FFDD00'}}>숫자포함</Text>, 특수기호 허용</Text>
            </View>

            <View style={{marginTop: 30, width: '100%'}}>
              <Text style={_styles.emailPwdText}>비밀번호 확인</Text>
            </View>
            <SpaceView viewStyle={[commonStyle.width100]}>
              <CommonInput
                label=""
                value={passwordChk}
                onChangeText={(passwordChk) => setPasswordChk(passwordChk)}
                isMasking={true}
                maxLength={20}
                fontSize={14}
                style={{color: '#F3E270', marginTop: 10}}
              />
              <TouchableOpacity 
                style={_styles.removeTextBtn}
                onPress={() => { setPasswordChk(''); }}
              >
                <Image source={ICON.xYellow} style={{width: 10, height: 10}} />
              </TouchableOpacity>
            </SpaceView>
            <View style={{width: '100%'}}>
              {
                passwordChk !== '' && (password !== '' && passwordChk !== '') ? 
                (
                  password === passwordChk
                    ? <Text style={[_styles.noticeText, {color: '#FFDD00'}]}>비밀번호 일치</Text>
                    : <Text style={_styles.noticeText}>비밀번호 불일치</Text>
                ) 
                : <></>
              }
            </View>
            
            <SpaceView mt={50}>
              <CommonBtn
                value={'프로필 사진 등록하기'}
                type={'reNewId'}
                borderRadius={5}
                onPress={() => {
                  register();
                }}
              />
            </SpaceView>

            <SpaceView mt={10}>
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
    marginTop: 5,
  },
  removeTextBtn: {
    position: 'absolute',
    top: 15,
    right: 0,
  },
});