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
        <SpaceView>
          <Image
            source={IMAGE.logoRenew}
            style={styles.logoRenew}
            resizeMode="contain"
          />
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

      <SpaceView viewStyle={styles.bottomBtnContainer} mb={24}>
        {/* CSP 05. 02 퍼블 이식 후 삭제요망 */}
        <SpaceView mb={10} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'Im_storage'}
            type={'g_blue'}
            isGradient={true}
            onPress={() => {
              navigation.navigate('Im_storage');
              //signInWithKakao();
            }}
          />
        </SpaceView>
        <SpaceView mb={10} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'Im_storage_list'}
            type={'g_blue'}
            isGradient={true}
            onPress={() => {
              navigation.navigate('Im_storage_list', { pageIndex: 1 });
              //signInWithKakao();
            }}
          />
        </SpaceView>
        <SpaceView mb={10} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'Im_live'}
            type={'g_blue'}
            isGradient={true}
            onPress={() => {
              navigation.navigate('Im_live');
              //signInWithKakao();
            }}
          />
        </SpaceView>
        <SpaceView mb={10} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'lm_superLike'}
            type={'g_blue'}
            isGradient={true}
            onPress={() => {
              navigation.navigate('lm_superLike');
              //signInWithKakao();
            }}
          />
        </SpaceView>
        {/* CSP 05. 02 퍼블 이식 후 삭제요망 */}
        <SpaceView mb={10} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'리미티드 계정으로 로그인'}
            type={'g_blue'}
            isGradient={true}
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
        <SpaceView mb={16} viewStyle={{ paddingHorizontal: '7%' }}>
          <CommonBtn
            value={'회원가입'}
            type={'white'}
            iconSize={24}
            onPress={() => {
              navigation.navigate('Policy');
            }}
          />
        </SpaceView>
      </SpaceView>
    </View>
  );
};
