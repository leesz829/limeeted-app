import * as React from 'react';
import { ScreenNavigationProp } from '@types';
import { jwt_token, api_domain } from 'utils/properties';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { Alert } from 'react-native';

export const NiceAuth = () => {
	const navigation = useNavigation<ScreenNavigationProp>();

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

		if (null != dataJson) {
			if (dataJson.dupYn == 'Y') {
				Alert.alert('알림', '이미 등록된 회원 입니다.', [
					{
						text: '확인',
						onPress: () => {
							navigation.navigate('Login');
						},
					},
				]);
			} else {
				navigation.navigate('Signup00', {
					ci: dataJson.ci,
					name: dataJson.name,
					gender: dataJson.gender,
					mobile: dataJson.mobile,
					birthday: dataJson.birthday,
				});
			}
		}

		/* navigation.navigate('Main', { 
			screen: 'Storage'
		}); */
	};

	const createNiceWebViewBody = async () => {
		const result = await axios
			.post(
				api_domain + '/nice/authtoken',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
				},
				{
					headers: {
						'jwt-token': String(await jwt_token()),
					},
				},
			)
			.then(function (response) {
				console.log('createNiceWebViewBody ::: ', response.data);

				if (response.data.result_code != '0000') {
					return false;
				}

				let webViewBody =
					'<form id="frm" name="frm"  method="post" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" accept-charset="euc-kr">' +
					'<input type="hidden" id="m" name="m" value="service" />' +
					'<input type="hidden" id="token_version_id" name="token_version_id" value="' +
					response.data.token_version_id +
					'" />' +
					'<input type="hidden" id="enc_data" name="enc_data" value="' +
					response.data.enc_data +
					'" />' +
					'<input type="hidden" id="integrity_value" name="integrity_value" value="' +
					response.data.integrity_value +
					'" />' +
					'</form>' +
					'<script>' +
					'document.getElementById("frm").submit()' +
					'</script>';

				console.log('webViewBody :::: ', webViewBody);

				setNiceWebViewBody(webViewBody);
			})
			.catch(function (error) {
				console.log('createNiceWebViewBody error ::: ', error);
			});
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
