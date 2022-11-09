import { ColorType, ScreenNavigationProp } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
	getProfile as getKakaoProfile,
	login,
	loginWithKakaoAccount,
	logout,
	unlink,
} from '@react-native-seoul/kakao-login';

import * as properties from 'utils/properties';

export const Login = () => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [kakaoResult, setKakaoResult] = React.useState('');

	const signInWithKakao = async () => {
		/* ### 실 버전 */
		// const result = await loginWithKakaoAccount();
		// console.log(JSON.stringify(result));
		// return;

		//const profile11 = await getKakaoProfile();
		// console.log(profile11);

		/* ### 테스트 버전 */
		const profile = {
			id: 'test2',
			//id : "2233743623",
			name: '손흥민',
			gender: 'M',
			age: '31',
			hp: '010-1234-5678',
			birthday: '',
			ci: '',
		};

		console.log('profile :: ', profile);

		//setKakaoResult(JSON.stringify(token));

		axios
			.post(properties.api_domain + '/join/getKakaoIdchk/', {
				kakaoId: profile.id,
			})
			.then(function (response) {
				console.log('response.data ::: ', response.data);

				const resultCode = response.data.result_code;
				const status = response.data.base.status;
				const joinStatus = response.data.base.join_status;

				console.log('resultCode ::: ', response.data.result_code);
				console.log('status ::: ', response.data.base.status);

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
						navigation.navigate('Signup00', {
							ci: profile.ci,
							birthday: profile.birthday,
							name: profile.name,
							gender: profile.gender,
							mobile: profile.hp,
						});
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

					/* AsyncStorage.setItem('memberBase', JSON.stringify(response.data.base), (err)=> {
					if(err){
						console.log("an error");
						throw err;
					}
					console.log("success");
				}).catch((err)=> {
					console.log("error is: " + err);
				}); */

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
		<View style={[styles.container, layoutStyle.justifyCenter]}>
			<View style={layoutStyle.alignCenter}>
				{/* <SpaceView mb={8}>
					<CommonText color={ColorType.grayAAAA} type={'h5'}>
						LIMIT + MEET
					</CommonText>
				</SpaceView> */}

				<SpaceView>
					<Image source={IMAGE.logoMark} style={styles.logoMark} resizeMode="contain" />
				</SpaceView>

				<SpaceView mb={200}>
					<Image source={IMAGE.logoText} style={styles.logo} resizeMode="contain" />
				</SpaceView>

				{/* <SpaceView mb={150}>
					<Image source={IMAGE.logo} style={styles.logo} resizeMode='contain' />
				</SpaceView> */}

				{/* <SpaceView mb={200}>
					<CommonText>믿음가는 사람들의 인연</CommonText>
				</SpaceView> */}
			</View>
			<SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
				<SpaceView mb={16}>
					<CommonBtn
						value={'로그인'}
						onPress={() => {
							navigation.navigate('Login01');

							//signInWithKakao();
						}}
					/>
				</SpaceView>
				{/* <CommonBtn value={'카카오로 시작하기'} 
							type={'kakao'} 
							icon={ICON.kakao} 
							iconSize={24} 
							onPress={() => {
								signInWithKakao();
							}}
				/> */}

				<CommonBtn
					value={'회원가입'}
					type={'kakao'}
					iconSize={24}
					onPress={() => {
						signInWithKakao();
						// navigation.navigate('NiceAuth');
					}}
				/>
			</SpaceView>
		</View>
	);
};
