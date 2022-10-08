import { AsyncStorage } from 'react-native';

// api 서버 도메인
export const api_domain = "http://192.168.1.2:8080";

// token 값 
export const jwt_token = () => {
	return new Promise( async (resolve, reject) => {
		try {
			const value = await AsyncStorage.getItem('jwt-token');
			resolve(value);
		} catch (error) {
			reject(new Error('Error getting item from AsyncStorage'))
		}
	});
} 

// json 데이터 
export const get_json_data = (key: string) => {
	return new Promise( async (resolve, reject) => {
		try {
			console.log('key :::: ', key);
			const value = await AsyncStorage.getItem(key);
			console.log('value :::: ', value);
			resolve(value);
		} catch (error) {
			reject(new Error('Error getting item from AsyncStorage'))
		}
	});
}