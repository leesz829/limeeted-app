import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

export default async function getFCMToken() {
	const storedFcmToken = await AsyncStorage.getItem('fcmToken');
	const FCMToken = storedFcmToken || (await messaging().getToken());
	// const token = await AsyncStorage.getItem('jwt')

	if (FCMToken) {
		console.log('Firebase Token:', FCMToken);

		//   const config = {
		//     url: `${baseurl}/push/subscribe/main`,
		//     method: 'POST',
		//     headers: {
		//       'Content-Type': 'application/json',
		//       accept: 'application/json',
		//       Authorization: `Bearer ${token}`,
		//     },
		//     data: {
		//       token: FCMToken,
		//     },
		//   }

		//   await axios(config)
		//     .then(async res => {
		//       console.log('성공', res)
		//     })
		//     .catch(async e => {
		//       console.log('error:', e)
		//     })
		// } else {
		//   console.log('Failed', 'No token received')
	}
	return FCMToken;
}
