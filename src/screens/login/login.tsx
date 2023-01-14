import { NavigationContainer, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import { CommonSelect } from 'component/CommonSelect';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, ScrollView, Alert, StyleSheet, Text, Platform } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import axios from 'axios';
import { Color } from 'assets/styles/Color';
import RNPickerSelect from 'react-native-picker-select';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import appleAuth, {
	AppleAuthRequestOperation,
	AppleAuthRequestScope,
	AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import { get_login_chk, signup_with_social } from 'api/models';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import { useUserInfo } from 'hooks/useUserInfo';
import { BasePopup } from 'screens/commonpopup/BasePopup';


interface Props {
	navigation: StackNavigationProp<StackParamList, 'Login01'>;
	route: RouteProp<StackParamList, 'Login01'>;
}

GoogleSignin.configure({
	webClientId: '535563482959-01e4bap45pcsvvafnis6sqndk1vokr0g.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
	forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
	accountName: '', // [Android] specifies an account name on the device that should be used
	iosClientId: '535563482959-vq2qcp0jb3o67soviq7sj0lihvh9skj6.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
	googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
	openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
	profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
export const Login01 = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const dispatch = useDispatch();
	const [id, setId] = React.useState('');
	const [password, setPassword] = React.useState('');

	const [basePopup, setBasePopup] = React.useState(false);			// 기본 팝업 state
	const [basePopupText, setBasePopupText] = React.useState('');		// 기본 팝업 텍스트

	React.useEffect(() => {
		//dispatch(myProfile());
	}, []);
	const google_signIn = async () => {
		try {
			console.log('google_signIn');
			// Check if your device supports Google Play
			const result = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
			console.log(JSON.stringify(result));
			// Get the users ID token
			const { idToken } = await GoogleSignin.signIn();
			const { success, data } = await signup_with_social('google', { identityToken: idToken });
			if (success) {
				Alert.alert('구글로그인 성공', '', [{ text: '확인', onPress: () => {} }]);
			}
		} catch (error) {
			console.log(error, error.code);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				// user cancelled the login flow
			} else if (error.code === statusCodes.IN_PROGRESS) {
				// operation (e.g. sign in) is in progress already
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				// play services not available or outdated
			} else {
				// some other error happened
			}
		}
	};
	const onAppleButtonPress = async () => {
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			// Note: it appears putting FULL_NAME first is important, see issue #293
			requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
		});
		const credentialState = await appleAuth
			.getCredentialStateForUser(appleAuthRequestResponse.user)
			.catch((e) => {
				console.log('error1', e);
			});
		if (credentialState === appleAuth.State.AUTHORIZED) {
			const { success, data } = await signup_with_social('apple', {
				user: appleAuthRequestResponse.user,
				identityToken: appleAuthRequestResponse.identityToken,
				authorizationCode: appleAuthRequestResponse.authorizationCode,
			});
			if (success) {
				Alert.alert('애플로그인 성공', '', [{ text: '확인', onPress: () => {} }]);
			}
			// user is authenticated
		}
	};
	const loginProc = async () => {
		const { success, data } = await get_login_chk(id, password);
		console.log('success :::: ', success);
		console.log('data :::: ', data.result_code);
		console.log('data.mbr_base ::: ', data.mbr_base);
		if (success) {
			/*
			 * ## 인증 결과 코드 정의
			 * 0000 : 회원존재
			 * 0001 : 회원미존재
			 * 0002 : 에러
			 */
			let resultCode = data.result_code;
			if (resultCode == '0001') {
				setBasePopupText('일치하는 회원이 없습니다.');
				setBasePopup(true);
			} else if(resultCode == '0003') { // 반려
				navigation.navigate('Approval', {
					memberSeq: data.mbr_base.member_seq,
					accessType: 'REFUSE'
				});
			} else if(resultCode == '0003') { // 탈퇴
				setBasePopupText('탈퇴 회원 입니다.');
				setBasePopup(true);
			} else {
				let memberStatus = data.mbr_base.status;
				let joinStatus = data.mbr_base.join_status;

				if (resultCode == '0000' && (memberStatus == 'PROCEED' || memberStatus == 'APROVAL')) {
					if (memberStatus == 'APROVAL') {
						navigation.navigate('Approval', {
							memberSeq: data.mbr_base.member_seq,
							accessType: 'LOGIN'
						});
					} else {
						if (null != joinStatus) {
							if (joinStatus == '01') {
								navigation.navigate('Signup01', { memberSeq: data.mbr_base.member_seq });
							} else if (joinStatus == '02') {
								navigation.navigate('Signup02', {
									memberSeq: data.mbr_base.member_seq,
									gender: data.mbr_base.gender,
								});
							} else if (joinStatus == '03') {
								navigation.navigate('Signup03', { memberSeq: data.mbr_base.member_seq });
							} else if (joinStatus == '04') {
								navigation.navigate('Approval', {
									memberSeq: data.mbr_base.member_seq,
									accessType: 'LOGIN'
								});
							}
						}
					}
				} else {
					AsyncStorage.setItem('jwt-token', data.token_param.jwt_token);

					dispatch(mbrReducer.setJwtToken(data.token_param.jwt_token));
					dispatch(mbrReducer.setMemberSeq(JSON.stringify(data.mbr_base.member_seq)));
					dispatch(mbrReducer.setBase(JSON.stringify(data.mbr_base)));
					dispatch(mbrReducer.setProfileImg(JSON.stringify(data.mbr_img_list)));
					dispatch(mbrReducer.setSecondAuth(JSON.stringify(data.mbr_second_auth_list)));
					dispatch(mbrReducer.setIdealType(JSON.stringify(data.mbr_ideal_type)));
					dispatch(mbrReducer.setInterview(JSON.stringify(data.mbr_interview_list)));

					navigation.navigate('Main', {
						screen: 'Matching',
					});
				}
			}
		}
	};

	return (
		<>
			{/* <CommonHeader title={'로그인'} /> */}

			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<View style={[styles.container]}>
					<View style={layoutStyle.alignCenter}>
						<SpaceView>
							<Image source={IMAGE.logoMark} style={styles.logoMark} resizeMode="contain" />
						</SpaceView>
						<SpaceView mb={15}>
							<Image source={IMAGE.logoText} style={styles.logo} resizeMode="contain" />
						</SpaceView>
					</View>

					<View>
						<CommonInput label="아이디" value={id} onChangeText={(id) => setId(id)} />

						<View style={styles.infoContainer}>
							<SpaceView mt={4}>
								<Image source={ICON.info} style={styles.iconSize} />
							</SpaceView>

							<SpaceView ml={8}>
								<CommonText color={ColorType.gray6666}>아이디는 이메일로 입력해 주세요.</CommonText>
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
										//Alert.alert('알림', '아이디를 입력해 주세요.', [{ text: '확인' }]);
										setBasePopupText('아이디를 입력해 주세요.');
										setBasePopup(true);
										return;
									}
									if (password == '') {
										setBasePopupText('비밀번호를 입력해 주세요.');
										setBasePopup(true);
										return;
									}

									loginProc();

									//dispatch(loginReduce(id, password));
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



			{/* ######################################################################
			##### 팝업 영역
			###################################################################### */}

			{/* ### 기본 팝업 */}
			<BasePopup popupVisible={basePopup} setPopupVIsible={setBasePopup} title={''} text={basePopupText} />

		</>
	);
};
