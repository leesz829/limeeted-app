import { ColorType, ScreenNavigationProp } from '@types';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
//import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
	getProfile as getKakaoProfile,
	login,
	logout,
	unlink,
} from '@react-native-seoul/kakao-login';
import { DocumentDirectoryPath } from 'react-native-fs';

export const Login = () => {

	const navigation = useNavigation<ScreenNavigationProp>();

	const [kakaoResult, setKakaoResult] = React.useState('');
	
	const signInWithKakao = async () => {

		/* ### 실 버전 */
		//const profile11 = await getKakaoProfile();
		// console.log(profile11);

		/* ### 테스트 버전 */
		const profile = {
			id : "test2",
			//id : "2233743623",
			name : "김연우",
			gender : "M",
			age : '34',
			hp : '010-1234-5678'
		};

		console.log('profile :: ' , profile);

		//setKakaoResult(JSON.stringify(token));

		axios.post('http://211.104.55.151:8080/join/getKakaoIdchk/', {
			kakaoId : profile.id
		})
		.then(function (response) {
			console.log("response.data ::: ", response.data.memberImgList);

			const resultCode = response.data.result_code;
			const status = response.data.status;

			/*
			 * ## 인증 결과 코드 정의
			 * 0000 : 회원미존재
			 * 0001 : 회원존재
			 * 0002 : 에러
			 */
			if(resultCode == "0000" || (resultCode == "0001" && (status == "PROCEED" || status == "APROVAL"))) {

				if(resultCode == "0001" && (status == "PROCEED" || status == "APROVAL")) {
					if(status == "APROVAL") {
						navigation.navigate('Approval');
						//navigation.navigate('Signup02', { memberSeq : response.data.member_seq });
					} else {
						if(null != response.data.join_status) {
							if(response.data.join_status == "01") {
								navigation.navigate('Signup01', { memberSeq : response.data.member_seq });
							} else if(response.data.join_status == "02") {
								navigation.navigate('Signup02', { memberSeq : response.data.member_seq });
							} else if(response.data.join_status == "03") {
								navigation.navigate('Signup03', { memberSeq : response.data.member_seq });
							} else if(response.data.join_status == "04") {
								navigation.navigate('Approval');
							}
						}
					}
				} else {
					navigation.navigate('Signup00', { 
						kakaoId : profile.id
						, name : profile.name
						, gender : profile.gender
						, age : profile.age
						, hp : profile.hp
					});
				}

			} else if(resultCode == "0002"){
				console.log('alert 추가!!!!! 로그인 실패');
			} else {
				console.log('response.data.token_param ::: ', response.data.token_param.jwt_token);

				AsyncStorage.clear();
			
				// token set
				AsyncStorage.setItem('jwt-token', response.data.token_param.jwt_token);
				AsyncStorage.setItem('member_seq', String(response.data.base.member_seq));
				AsyncStorage.setItem('memberBase', JSON.stringify(response.data.base));
				AsyncStorage.setItem('memberImgList', JSON.stringify(response.data.memberImgList));
				AsyncStorage.setItem('memberSndAuthList', JSON.stringify(response.data.memberSndAuthList));
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
						memberBase : response.data.base
					}
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
					<Image source={IMAGE.logoMark} style={styles.logoMark} resizeMode='contain' />
				</SpaceView>

				<SpaceView mb={200}>
					<Image source={IMAGE.logoText} style={styles.logo} resizeMode='contain' />
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
					<CommonBtn value={'로그인'} 
								onPress={() => {
									//navigation.navigate('Main', { screen: 'Roby' });

									signInWithKakao();
								}}/>
				</SpaceView>
				<CommonBtn value={'카카오로 시작하기'} 
							type={'kakao'} 
							icon={ICON.kakao} 
							iconSize={24} 
							onPress={() => {

								signInWithKakao();

								/*axios.post('http://192.168.35.29:8080/member/login/', {
									kakao_id: 'kakaotestid'
								})
								.then(function (response) {
									console.log(response);
								})
								.catch(function (error) {
									console.log(error);
								});*/

								//navigation.navigate('Signup0');
							}}
				/>


				<CommonBtn value={'본인인증'} 
							iconSize={24} 
							onPress={() => {
								console.log('test');
								
							}}
				/>

			</SpaceView>
		</View>
	);
};
