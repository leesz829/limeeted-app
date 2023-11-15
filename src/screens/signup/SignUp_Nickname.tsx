import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, styles } from 'assets/styles/Styles';
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
import { TextInput } from 'react-native-gesture-handler';


/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 닉네임
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_Nickname'>;
  route: RouteProp<StackParamList, 'SignUp_Nickname'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Nickname = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const { show } = usePopup();  // 공통 팝업
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부


  return (
    <>
      <LinearGradient
        colors={['#3D4348', '#1A1E1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={_styles.wrap}
      >
        <ScrollView>
          <SpaceView mt={20}>
            <Text style={_styles.title}>닉네임을 알려 주세요!</Text>
            <View style={_styles.inputContainer}>
              <TextInput 
                style={_styles.textInput}
              />
              <View style={{marginTop: 10}}>
                <Text style={_styles.validText}><Text>한글 영문 숫자 사용 가능</Text> <Text>최대 12글자 입력 가능</Text></Text>
              </View>
            </View>
          </SpaceView>

          <SpaceView mt={80}>
            <View>
              <Text style={_styles.commentText}>반가워요. <Text style={{color: '#F3E270'}}>닉네임</Text>님.{'\n'}간단한 한줄소개를{'\n'}부탁드려요.</Text>
            </View>
            <View style={_styles.commentInputCont}>
              <TextInput 
                style={_styles.commentInput}
                placeholder='프로필 사진에 공개되는 한줄소개 입력'
                placeholderTextColor={'#FFFDEC'}
              />
            </View>
          </SpaceView>

          <SpaceView mt={160}>
              <CommonBtn
                value={'간편 소개 작성하기'}
                type={'reNewId'}
                fontSize={16}
                fontFamily={'Pretendard-Bold'}
                borderRadius={5}
                onPress={() => {
                  navigation.navigate({
                    name : ROUTES.SIGNUP_ADDINFO
                  });
                }}
              />
            </SpaceView>

            <SpaceView mt={20}>
              <CommonBtn
                value={'이전으로'}
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
        </ScrollView>
      </LinearGradient>      
    </>
  );
};



/* ################################################################################################################
###### Style 영역
################################################################################################################ */
const _styles = StyleSheet.create({
  wrap: {
    minHeight: height,
    padding: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Pretendard-Bold',
    color: '#D5CD9E',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  textInput: {
    width: '100%',
    height: 45,
    backgroundColor: '#333B41',
    borderColor: '#FFFDEC',
    borderWidth: 1,
    borderRadius: 50,
    color: '#F3E270',
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
  },
  validText: {
    fontFamily: 'Pretendard-Light',
    color: '#D5CD9E',
    fontSize: 12,
  },
  commentText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    color: '#D5CD9E',
  },
  commentInputCont: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  commentInput: {
    width: '100%',
    height: 60,
    backgroundColor: '#333B41',
    borderWidth: 1,
    borderColor: '#FFFDEC',
    borderRadius: 5,
    color: '#FFFDEC',
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
  }
});