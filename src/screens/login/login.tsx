import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { ColorType } from '@types';
import { signin } from 'api/models';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { SUCCESS, LOGIN_REFUSE, LOGIN_EMPTY, LOGIN_WAIT, LOGIN_EXIT, SANCTIONS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import storeKey, { JWT_TOKEN } from 'constants/storeKey';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, TouchableOpacity, View, Platform, PermissionsAndroid } from 'react-native';
import { useDispatch } from 'react-redux';
import { setPrincipal } from 'redux/reducers/authReducer';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import { ICON, IMAGE } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { Color } from 'assets/styles/Color';
import Geolocation from 'react-native-geolocation-service';


GoogleSignin.configure({
  webClientId:
    '535563482959-01e4bap45pcsvvafnis6sqndk1vokr0g.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '535563482959-vq2qcp0jb3o67soviq7sj0lihvh9skj6.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
export const Login01 = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { show } = usePopup();
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const me = useUserInfo();
  const { width, height } = Dimensions.get('window');

  const [latitude, setLatitude] = React.useState();     // 위도
  const [longitude, setLongitude] = React.useState();   // 경도

  const [granted, setGranted] = React.useState('');

  const loginProc = async () => {
    const body = {
      email_id: id,
      password,
      latitude: latitude,
      longitude: longitude
    };
    const { success, data } = await signin(body);
    
    if (success) {
      switch (data.result_code) {
        case SUCCESS:
          await AsyncStorage.setItem(JWT_TOKEN, data.token_param.jwt_token);
          await AsyncStorage.setItem(
            storeKey.MEMBER_SEQ,
            data.mbr_base.member_seq + ''
          );
          delete data.result_code;
          dispatch(setPrincipal(data));
          dispatch(mbrReducer.setJwtToken(data.token_param.jwt_token));
          dispatch(mbrReducer.setMemberSeq(data.mbr_base.member_seq));
          dispatch(mbrReducer.setBase(data.mbr_base));
          dispatch(mbrReducer.setProfileImg(data.mbr_img_list));
          dispatch(mbrReducer.setSecondAuth(data.mbr_second_auth_list));
          dispatch(mbrReducer.setIdealType(data.mbr_ideal_type));
          dispatch(mbrReducer.setInterview(data.mbr_interview_list));
          dispatch(mbrReducer.setUserInfo(data));
          break;

        case LOGIN_WAIT:
          let memberStatus = data.mbr_base.status;
          let joinStatus = data.mbr_base.join_status;

          if (memberStatus == 'PROCEED' || memberStatus == 'APPROVAL') {
            if (memberStatus == 'APPROVAL') {
              navigation.navigate(ROUTES.APPROVAL, {
                memberSeq: data.mbr_base.member_seq,
                gender: data.mbr_base.gender,
                accessType: 'LOGIN',
              });
            } else {
              if (null != joinStatus) {
                if (joinStatus == '01') {
                  navigation.navigate(ROUTES.SIGNUP01, {
                    memberSeq: data.mbr_base.member_seq,
                    gender: data.mbr_base.gender,
                  });
                } else if (joinStatus == '02') {
                  navigation.navigate(ROUTES.SIGNUP02, {
                    memberSeq: data.mbr_base.member_seq,
                    gender: data.mbr_base.gender,
                  });
                } else if (joinStatus == '03') {
                  navigation.navigate(ROUTES.SIGNUP03, {
                    memberSeq: data.mbr_base.member_seq,
                    gender: data.mbr_base.gender,
                  });
                } else if (joinStatus == '04') {
                  navigation.navigate(ROUTES.APPROVAL, {
                    memberSeq: data.mbr_base.member_seq,
                    gender: data.mbr_base.gender,
                    accessType: 'LOGIN',
                  });
                }
              }
            }
          }
          break;

        case LOGIN_REFUSE:
          navigation.navigate(ROUTES.APPROVAL, {
            memberSeq: data.mbr_base.member_seq,
            accessType: 'REFUSE',
            refuseImgCnt: data.refuse_img_cnt,
            refuseAuthCnt: data.refuse_auth_cnt,
          });
          break;

        case LOGIN_EMPTY:
          show({ content: '일치하는 회원이 없습니다.' });
          break;

        case LOGIN_EXIT:
          show({ content: '탈퇴 회원 입니다.' });
          break;

        case SANCTIONS:
          show({ titem: '제재 알림', content: '<이용 약관>에 근거하여 회원 제재 상태로 전환되었습니다. \n' + data.sanctions.sanctions_msg});
          break;
          
        default:
          break;
      }
    }
  };
  
  // 사용자 위치 확인
  async function requestPermissions() {
    try {
      // IOS 위치 정보 수집 권한 요청
      if (Platform.OS === 'ios') {
        return await Geolocation.requestAuthorization('whenInUse');
      }

      // AOS 위치 정보 수집 권한 요청
      if(Platform.OS === 'android') {
        return await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    requestPermissions().then(result => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        error => {
           console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, []);


  return (
    <>
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
      <View style={[styles.container]}>
        <View style={layoutStyle.alignCenter}>
          <SpaceView>
            <Image
              source={IMAGE.logoMark}
              style={styles.logoMark}
              resizeMode="contain"
            />
          </SpaceView>
          <SpaceView mb={15}>
            <Image
              source={IMAGE.logoText}
              style={styles.logo}
              resizeMode="contain"
            />
          </SpaceView>
        </View>

        <View>
          <CommonInput
            label="아이디"
            value={id}
            onChangeText={(id) => setId(id)}
          />

          <View style={styles.infoContainer}>
            <SpaceView mt={4}>
              <Image source={ICON.info} style={styles.iconSize} />
            </SpaceView>

            <SpaceView ml={8}>
              <CommonText color={ColorType.gray6666}>
                아이디는 이메일로 입력해 주세요.
              </CommonText>
            </SpaceView>
          </View>

          <SpaceView mb={30}>
            <CommonInput
              label="비밀번호"
              value={password}
              onChangeText={(password) => setPassword(password)}
              isMasking={true}
              maxLength={20}
            />
          </SpaceView>
        </View>

        <SpaceView mb={20}>
          {/* {Platform.OS === 'ios' ? (
							<SpaceView mb={5}>
								<CommonBtn value={'애플로그인'} onPress={onAppleButtonPress} />
							</SpaceView>
						) : null}
						{Platform.OS === 'android' ? (
							<SpaceView mb={5}>
								<CommonBtn value={'구글로그인'} onPress={google_signIn} />
							</SpaceView>
						) : null} */}
          <SpaceView mb={5}>
            <CommonBtn
              value={'로그인'}
              onPress={() => {
                if (id == '') {
                  return show({ content: '아이디를 입력해 주세요.' });
                }
                if (password == '') {
                  return show({ content: '비밀번호를 입력해 주세요.' });
                }

                //requestPermissions();

                loginProc();
                //dispatch(loginReduce(id, password));
              }}
            />
          </SpaceView>
          <SpaceView mb={5}>
            <CommonBtn
              value={'아이디/비밀번호 찾기'}
              onPress={() => {
                navigation.navigate('SearchIdAndPwd');
              }}
            />
          </SpaceView>
          <CommonBtn
            value={'처음으로'}
            type={'kakao'}
            iconSize={24}
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
        </SpaceView>
      </View>
    </ScrollView>
    
    </>
  );
};
// const google_signIn = async () => {
//   try {
//     console.log('google_signIn');
//     // Check if your device supports Google Play
//     const result = await GoogleSignin.hasPlayServices({
//       showPlayServicesUpdateDialog: true,
//     });
//     console.log(JSON.stringify(result));
//     // Get the users ID token
//     const { idToken } = await GoogleSignin.signIn();
//     const { success, data } = await signup_with_social('google', {
//       identityToken: idToken,
//     });
//     if (success) {
//       Alert.alert('구글로그인 성공', '', [
//         { text: '확인', onPress: () => {} },
//       ]);
//     }
//   } catch (error) {
//     console.log(error, error.code);
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // user cancelled the login flow
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // operation (e.g. sign in) is in progress already
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // play services not available or outdated
//     } else {
//       // some other error happened
//     }
//   }
// };
// const onAppleButtonPress = async () => {
//   const appleAuthRequestResponse = await appleAuth.performRequest({
//     requestedOperation: appleAuth.Operation.LOGIN,
//     // Note: it appears putting FULL_NAME first is important, see issue #293
//     requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
//   });
//   const credentialState = await appleAuth
//     .getCredentialStateForUser(appleAuthRequestResponse.user)
//     .catch((e) => {
//       console.log('error1', e);
//     });
//   if (credentialState === appleAuth.State.AUTHORIZED) {
//     const { success, data } = await signup_with_social('apple', {
//       user: appleAuthRequestResponse.user,
//       identityToken: appleAuthRequestResponse.identityToken,
//       authorizationCode: appleAuthRequestResponse.authorizationCode,
//     });
//     if (success) {
//       Alert.alert('애플로그인 성공', '', [
//         { text: '확인', onPress: () => {} },
//       ]);
//     }
//     // user is authenticated
//   }
// };
