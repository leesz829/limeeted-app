import * as React from 'react';
import { ScreenNavigationProp, StackParamList } from '@types';
import { jwt_token, api_domain } from 'utils/properties';
import { useNavigation, CommonActions, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { usePopup } from 'Context';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { nice_auth, update_phone_number, create_temp_password } from 'api/models';
import { useUserInfo } from 'hooks/useUserInfo';
import { myProfile } from 'redux/reducers/authReducer';
import { STACK } from 'constants/routes';
import { useDispatch } from 'react-redux';


/* ################################################################################################################
###################################################################################################################
###### 나이스 본인인증 웹뷰 화면
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'NiceAuth'>;
	route: RouteProp<StackParamList, 'NiceAuth'>;
}

export const NiceAuth = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const { show } = usePopup();  // 공통 팝업
	const dispatch = useDispatch();

	const type = props.route.params.type;
	const memberBase = useUserInfo(); //hooksMember.getBase();
	const phoneNumber = props.route.params.phoneNumber;
	const emailId = props.route.params.emailId;

	const [niceWebViewBody, setNiceWebViewBody] = React.useState(String);

	/* const tt = () => {
		navigation.navigate('Main', { 
			screen: 'Storage'
		});
	} */

	/* web -> native */
	const webToNative = (data: any) => {
		console.log('webToNative data :::: ', data);

		let dataJson = JSON.parse(data);

		if (dataJson.dupYn == 'Y' && type !== 'SEARCH') {
			show({ 
				content: '이미 등록된 회원 입니다.' ,
				confirmCallback: async function() {
					navigation.dispatch(
						CommonActions.reset({
							index: 1,
							routes: [
								{ name: 'Login01' }
							],
						})
					);
				}
			});

		} else {
			// ########## 회원가입 진행
			if(type == 'JOIN') {
				if (null != dataJson) {
					navigation.dispatch(
						CommonActions.reset({
							index: 1,
							routes: [
								{ name: 'Login01' }
								, {
									name: 'Signup00'
									, params: {
										ci: dataJson.ci,
										name: dataJson.name,
										gender: dataJson.gender,
										mobile: dataJson.mobile,
										birthday: dataJson.birthday
									}
								}
							],
						})
					);
				}

			// ########## 전화번호 수정
			} else if(type == 'MODFY') {
				if(memberBase.name != dataJson.name) {
					show({ 
						content: '본인인증이 일치하지 않아 수정이 불가능합니다.' ,
						confirmCallback: async function() {
							navigation.navigate(STACK.TAB, { screen: 'Roby' });
						}
					});
				} else {
					updatePhoneNumber(dataJson);
				}

			// ########### 비밀번호 찾기
			} else if(type == 'SEARCH') {
				let phoneNumberFmt = phoneNumber.replace(/-/g, "");
				console.log('phoneNumberFmt ::::: ', phoneNumberFmt);

				if(phoneNumberFmt != dataJson.mobile) {
					show({ 
						content: '등록된 전화번호와 본인인증이 일치하지 않습니다.' ,
						confirmCallback: async function() {
							navigation.navigate('Login01');
						}
					});
				} else {

					// 임시 비밀번호 생성
					createTempPassword(phoneNumber, emailId);
				}
			}
		}		
	};

	// ######################################################### 전화번호 변경 실행
	const updatePhoneNumber = async (dataJson: any) => {
		const body = {
			phone_number: dataJson.mobile.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			, ci: dataJson.ci
		};
		try {
			const { success, data } = await update_phone_number(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:
					show({
						content: '전화번호가 변경되었습니다.' ,
						confirmCallback: async function() {
							dispatch(myProfile());
							navigation.navigate(STACK.TAB, { screen: 'Roby' });
						}
					});
					break;
				default:
					show({
					content: '오류입니다. 관리자에게 문의해주세요.' ,
					confirmCallback: function() {}
					});
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
		
		}
	}

	// ######################################################### 전화번호 변경 실행
	const createTempPassword = async (phoneNumber: string, emailId: string) => {

		const body = {
			email_id: emailId,
			phone_number: phoneNumber
		};
		try {
		  const { success, data } = await create_temp_password(body);
		  console.log('data ::::: ' , data);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				show({
					content: '임시 비밀번호가 메일로 전송되었습니다.\n로그인 후 비밀번호 변경 부탁드립니다.' ,
					confirmCallback: async function() {
						navigation.navigate('Login01');
					}
				});
				break;
			  default:
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
		  
		}
	}



	// ######################################################### 나이스 웹뷰 화면 생성
	const createNiceWebViewBody = async () => {
		try {
			const { success, data } = await nice_auth();
			if(success) {
			  switch (data.result_code) {
				case SUCCESS:				
					console.log('createNiceWebViewBody ::: ', data);

					let webViewBody =
						'<form id="frm" name="frm"  method="post" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" accept-charset="euc-kr">' +
						'<input type="hidden" id="m" name="m" value="service" />' +
						'<input type="hidden" id="token_version_id" name="token_version_id" value="' +
						data.token_version_id +
						'" />' +
						'<input type="hidden" id="enc_data" name="enc_data" value="' +
						data.enc_data +
						'" />' +
						'<input type="hidden" id="integrity_value" name="integrity_value" value="' +
						data.integrity_value +
						'" />' +
						'</form>' +
						'<script>' +
						'document.getElementById("frm").submit()' +
						'</script>';

					setNiceWebViewBody(webViewBody);

					break;
				default:
					show({
						content: '오류입니다. 관리자에게 문의해주세요.' ,
						confirmCallback: function() {}
					});
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
		
		}
	};

	// 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {
		createNiceWebViewBody();
	}, []);

	return (
		<WebView
			originWhitelist={['*']}
			source={{ html: niceWebViewBody }}
			onMessage={(event) => {
				//받은 데이터(React) :
				webToNative(event.nativeEvent.data);
			}}
		/>
	);
};
