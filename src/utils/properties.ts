import { AsyncStorage } from 'react-native';

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