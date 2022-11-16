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
import { View, Image, ScrollView, Alert, StyleSheet, Text } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import axios from 'axios';
import { Color } from 'assets/styles/Color';
import RNPickerSelect from 'react-native-picker-select';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from '@react-native-google-signin/google-signin';

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Login01'>;
	route: RouteProp<StackParamList, 'Login01'>;
}

GoogleSignin.configure({
	webClientId: '369959009315-6q3qrqkfkd797nlvtrtcdbvsc7og2ie1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
	forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
	accountName: '', // [Android] specifies an account name on the device that should be used
	iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
	googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
	openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
	profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});
export const Login01 = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [id, setId] = React.useState('test2');
	const [password, setPassword] = React.useState('1234');

	const google_signIn = async () => {
		try {
			// Check if your device supports Google Play
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
			// Get the users ID token
			const { idToken } = await GoogleSignin.signIn();
			Alert.alert('로그인 성공', idToken, [{ text: '확인', onPress: () => {} }]);

			// Create a Google credential with the token
			//   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

			// Sign-in the user with the credential
			//   return auth().signInWithCredential(googleCredential);
			// await GoogleSignin.hasPlayServices();
			// const userInfo = await GoogleSignin.signIn();
			// console.log('google_signIn  : ', JSON.stringify(userInfo));
		} catch (error) {
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

	const loginProc = async () => {
		console.log(
			properties.api_domain + '/join/getLoginchk/',
			JSON.stringify({
				kakao_id: id,
				password: password,
			}),
		);
		axios
			.post(properties.api_domain + '/join/getLoginchk/', {
				kakao_id: id,
				password: password,
			})
			.then(function (response) {
				console.log('response.data ::: ', response.data);

				const resultCode = response.data.result_code;
				let status: any = '';
				let joinStatus: any = '';

				if (typeof response.data.base != 'undefined') {
					status = response.data.base.status;
					joinStatus = response.data.base.join_status;
				}

				/*
				 * ## 인증 결과 코드 정의
				 * 0000 : 회원미존재
				 * 0001 : 회원존재
				 * 0002 : 에러
				 */
				if (
					resultCode == '0000' ||
					(resultCode == '0001' && (status == 'PROCEED' || status == 'APROVAL'))
				) {
					if (resultCode == '0001' && (status == 'PROCEED' || status == 'APROVAL')) {
						if (status == 'APROVAL') {
							navigation.navigate('Approval');
							//navigation.navigate('Signup02', { memberSeq : response.data.member_seq });
						} else {
							if (null != response.data.base.join_status) {
								if (joinStatus == '01') {
									navigation.navigate('Signup01', { memberSeq: response.data.base.member_seq });
								} else if (joinStatus == '02') {
									navigation.navigate('Signup02', {
										memberSeq: response.data.base.member_seq,
										gender: response.data.base.gender,
									});
								} else if (joinStatus == '03') {
									navigation.navigate('Signup03', { memberSeq: response.data.base.member_seq });
								} else if (joinStatus == '04') {
									navigation.navigate('Approval');
								}
							}
						}
					} else {
						Alert.alert('알림', '일치하는 회원이 없습니다.', [{ text: '확인' }]);

						/* navigation.navigate('Signup00', { 
						ci : profile.ci
						, birthday : profile.birthday
						, name : profile.name
						, gender : profile.gender
						, mobile : profile.hp
					}); */
					}
				} else if (resultCode == '0002') {
					console.log('alert 추가!!!!! 로그인 실패');
				} else {
					console.log('response.data.token_param ::: ', response.data.token_param.jwt_token);

					AsyncStorage.clear();

					// token set
					AsyncStorage.setItem('jwt-token', response.data.token_param.jwt_token);
					AsyncStorage.setItem('member_seq', String(response.data.base.member_seq));
					AsyncStorage.setItem('memberBase', JSON.stringify(response.data.base));
					AsyncStorage.setItem('memberImgList', JSON.stringify(response.data.memberImgList));
					AsyncStorage.setItem(
						'memberSndAuthList',
						JSON.stringify(response.data.memberSndAuthList),
					);
					AsyncStorage.setItem('memberIdealType', JSON.stringify(response.data.memberIdealType));
					AsyncStorage.setItem(
						'memberInterviewList',
						JSON.stringify(response.data.memberInterviewList),
					);

					navigation.navigate('Main', {
						screen: 'Roby',
						params: {
							memberBase: response.data.base,
						},
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			});

		/* navigation.navigate('Signup02', {
			memberSeq : 38
		}); */
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
						<SpaceView mb={5}>
							<CommonBtn value={'구글로그인'} onPress={google_signIn} />
							<CommonBtn
								value={'로그인'}
								onPress={() => {
									if (id == '') {
										Alert.alert('알림', '아이디를 입력해 주세요.', [{ text: '확인' }]);
										return;
									}
									if (password == '') {
										Alert.alert('알림', '비밀번호를 입력해 주세요.', [{ text: '확인' }]);
										return;
									}

									loginProc();
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
