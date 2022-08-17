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

		// const profile11 = awaitg etKakaoProfile();
		// console.log(profile11);

		// 테스트 버전
		const profile = {
			id : "test1",
			nickname : "테스트"
		};

		console.log('profile :: ' , profile);

		// 실버전
		/* const profile = await getKakaoProfile();
		console.log(profile); */

		//setKakaoResult(JSON.stringify(token));

		axios.post('http://192.168.35.131:8080/member/getKakaoIdchk/', {
			kakaoId : profile.id
		})
		.then(function (response) {
			const resultCode = response.data.result_code;
			const status = response.data.status;

			if(resultCode == "0000" || (resultCode == "0001" && status == "PROCEED")) {

				/* navigation.navigate('Signup0', { 
					kakaoId : profile.id
					, name : profile.nickname
				}); */

				navigation.navigate('Signup03', { 
					memberSeq : 39
				});

			}else if(resultCode == "0002"){
				console.log('alert 추가!!!!! 로그인 실패');
			} else {
				// token set
				AsyncStorage.setItem('jwt-token', response.data.token_param.jwt_token);

				navigation.navigate('Main', { 
					screen: 'Roby'
					, params : {
						memberSeq : response.data.member_seq
						, name : response.data.name
						, age : response.data.age
						, comment : response.data.comment
						, jobName: response.data.job_name
						, height : response.data.height
						, mstImg : response.data.mst_img_path
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
				<SpaceView mb={8}>
					<Image source={IMAGE.logo} style={styles.logo} />
				</SpaceView>
				<SpaceView mb={200}>
					<CommonText>믿음가는 사람들의 인연</CommonText>
				</SpaceView>
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
