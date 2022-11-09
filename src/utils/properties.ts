import AsyncStorage from '@react-native-community/async-storage';

// api 서버 도메인
//export const api_domain = "http://211.104.55.151:8080";
export const api_domain = 'http://118.67.134.149:8080';

// 이미지 서버 경로
export const img_domain = api_domain + '/uploads';

// token 값
export const jwt_token = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const value = await AsyncStorage.getItem('jwt-token');
			resolve(value);
		} catch (error) {
			reject(new Error('Error getting item from AsyncStorage'));
		}
	});
};

// json 데이터
export const get_json_data = (key: string) => {
	return new Promise(async (resolve, reject) => {
		try {
			const value = await AsyncStorage.getItem(key);
			resolve(value);
		} catch (error) {
			reject(new Error('Error getting item from AsyncStorage'));
		}
	});
};

export default { api_domain, img_domain, jwt_token, get_json_data };
