import React, { useRef, useState, useEffect } from 'react';
import { ColorType, ScreenNavigationProp } from '@types';
import { commonStyle, layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import SpaceView from 'component/SpaceView';
import { View, Image, Alert, Linking, Platform  } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import {
	getProfile as getKakaoProfile,
	login,
	loginWithKakaoAccount,
	logout,
	unlink,
} from '@react-native-seoul/kakao-login';
import VersionCheck from 'react-native-version-check';
import { usePopup } from 'Context';
import RNExitApp from 'react-native-exit-app';
import { get_app_version } from 'api/models';


export const Login = () => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [kakaoResult, setKakaoResult] = React.useState('');

	const isFocus = useIsFocused();
	const { show } = usePopup(); // 공통 팝업

	/* 앱버전 체크 */
	async function appVersionCheck() {

		// 구글 플레이 스토어 링크
		const GOOGLE_PLAY_STORE_LINK = 'market://details?id=com.appsquad.limeeted';
		const APPLE_PLAY_STORE_LINK = 'https://apps.apple.com/app/limeeted/6447423352';

		const body = {
			device_type: Platform.OS == 'android' ? 'AOS' : 'IOS',
		};
		const { success, data } = await get_app_version(body);
		console.log('data :::::::: ', data);

		console.log('getPackageName  ::::::: ', VersionCheck.getPackageName());
		console.log('getCurrentVersion  ::::::: ', VersionCheck.getCurrentVersion());
		console.log('getCurrentBuildNumber  ::::::: ', VersionCheck.getCurrentBuildNumber());

		if(data?.version_code == VersionCheck.getCurrentBuildNumber()) {
			
		} else {

			show({ 
				title: '앱 버전 알림',
				content: '새로운 앱버전이 있습니다.\n업데이트 해주세요.',
				confirmCallback: function() {
					if(Platform.OS == 'android') {
						Linking.openURL(GOOGLE_PLAY_STORE_LINK);
					} else {
						Linking.openURL(APPLE_PLAY_STORE_LINK);
					}
					
					RNExitApp.exitApp();
				},
			});
		}
	}

	useEffect(() => {
		//appVersionCheck();
	}, [isFocus]);

/*
	const signInWithKakao = async () => {
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
							sns_type: '',
							sns_token: ''
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
				}); 
					navigation.navigate('Main', {
						screen: 'Roby'
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		/* navigation.navigate('Signup02', {
			memberSeq : 38
		}); 
	};*/ 
	
	return (
		<View style={[styles.container, layoutStyle.justifyCenter]}>
			<View style={layoutStyle.alignCenter}>
				{/* <SpaceView>
					<Image source={IMAGE.logoRenew} style={styles.logoRenew} resizeMode="contain" />
				</SpaceView> */}

				<SpaceView viewStyle={{alignItems:'center', justifyContent:'center'}}>
					<Image source={IMAGE.logoMark} style={[styles.iconSize65, {marginBottom: -105}]} resizeMode="contain" />
					<Image source={IMAGE.logoRenewText} style={{width:200, marginBottom: 150 }} resizeMode="contain" />
				</SpaceView>

				{/* <SpaceView>
					<Image source={IMAGE.heartIcon} style={styles.logoMark} resizeMode="contain" />
				</SpaceView>
				<SpaceView>
					<Image source={IMAGE.logoNew} style={styles.logo} resizeMode="contain" />
				</SpaceView>
				<SpaceView mb={200}>
					<CommonText textStyle={styles.logoText} lineHeight={30}>믿음가는 사람들의 인연</CommonText>
				</SpaceView> */}
			</View>
			<SpaceView viewStyle={[styles.bottomBtnContainer, commonStyle.paddingHorizontal25]} mb={24}>
				<SpaceView mb={10}>
					<CommonBtn
						value={'리미티드 계정으로 로그인'}
						type={'g_blue'}
						isGradient={true}
						fontSize={13}
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
				<SpaceView mb={16}>
					<CommonBtn
						value={'회원가입'}
						type={'white'}
						iconSize={24}
						fontSize={13}
						onPress={() => {
							navigation.navigate('Policy');
						}}
					/>
				</SpaceView>

			</SpaceView>
		</View>
	);
};
