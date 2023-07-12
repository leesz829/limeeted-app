import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import {Platform, Alert} from 'react-native';
import axios from 'axios';


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

  // 토큰 storage 저장 함수
  const saveTokenToStorage = async (token) => {
    try {
      await AsyncStorage.setItem('FCM_TOKEN', token);
      //console.log('Token saved to storage:', token);
    } catch (error) {
      console.log('Error saving token to storage:', error);
    }
  };

  // 신규 토큰 생성 함수
  const registerTokenRefreshListener = () => {
    messaging().onTokenRefresh((token) => {
      saveTokenToStorage(token);
    });
  };

  // 토큰 유효성 체크
  const checkTokenValidity = async (token) => {
    try {
      const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
        // FCM 메시지 요청을 보낼 때 필요한 데이터를 포함합니다.
        // 수신자로 토큰을 지정하고, 실제 메시지 내용은 필요하지 않으므로 빈 객체를 전송합니다.
        to: token,
        data: {},
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=e76bf1bfdb96bdc0a32a192d83abd64a686ad27b',
        },
      });
  
      // 응답을 통해 토큰이 유효한지 확인할 수 있습니다.
      const { success, failure } = response.data;
  
      if (success) {
        return true;
      } else if (failure) {
        return false;
      }
    } catch (error) {
      console.log('Error checking token validity:', error);
    }
  };

  await messaging().registerDeviceForRemoteMessages();
  let fcmToken = await messaging().getToken();

  if(fcmToken) {
    saveTokenToStorage(fcmToken);
  }

  /* if (!fcmToken) {
    // 토큰이 저장되어 있지 않은 경우 새로운 토큰을 가져옵니다.
    fcmToken = await messaging().getToken();
    saveTokenToStorage(fcmToken);
  } else {
    let isResult = checkTokenValidity(fcmToken);
    console.log('isResult :::: ' ,isResult);
  } */

  registerTokenRefreshListener(); // 토큰 갱신 리스너 등록

  return null;
};