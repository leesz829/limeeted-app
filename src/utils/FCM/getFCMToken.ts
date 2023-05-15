import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {Platform, Alert} from 'react-native';

export default async function getFCMToken() {

  /* const firebaseConfig = {
    apiKey: "AIzaSyAZUNI6SD-BBPp_3ep7LRSxUzlgjicSByA",
    //authDomain: "limeeted-ea344.firebaseapp.com",
    databaseURL: "https://limeeted-ea344.firebaseio.com",
    projectId: "limeeted-ea344",
    storageBucket: "limeeted-ea344.appspot.com",
    messagingSenderId: "535563482959",
    appId: "1:535563482959:android:d21b373a4e414cdf07b73a",
  };

  firebase.initializeApp(firebaseConfig); */

  /* if (Platform.OS === 'android') {
    if (!firebase.apps.length) {
      
    }
  }*/

  const storedFcmToken = await AsyncStorage.getItem('fcmToken');
  let fCMToken = storedFcmToken;

  await messaging().registerDeviceForRemoteMessages();

  fCMToken = storedFcmToken || (await messaging().getToken());

  //Alert.alert('fcmToken', fCMToken);
  //console.log('FCMToken : ', FCMToken);
  // const token = await AsyncStorage.getItem('jwt')

  if (fCMToken) {
    AsyncStorage.setItem('FCM_TOKEN', fCMToken);
    // console.log('Firebase Token:', FCMToken);

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
  } else {
    messaging().onTokenRefresh((token) => {
      AsyncStorage.setItem('FCM_TOKEN', token);
      fCMToken = token;
    });
  }
    

  return fCMToken;
}
