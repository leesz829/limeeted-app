import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { LogBox, SafeAreaView, StatusBar, StyleSheet, Alert, Linking, Platform, Modal, View, Text, PermissionsAndroid } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { enableScreens } from 'react-native-screens';
import { Provider, useDispatch } from 'react-redux';
import store from 'redux/store';
import MainNaviagtion from './src/navigation/MainNaviagtion';

import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import { JWT_TOKEN } from 'constants/storeKey';

import codePush from 'react-native-code-push';
import { withIAPContext } from 'react-native-iap';
import { myProfile } from 'redux/reducers/authReducer';
import getFCMToken from 'utils/FCM/getFCMToken';
import { PopupProvider } from 'Context/index';
import SplashScreen from 'react-native-splash-screen';
import { Color } from 'assets/styles/Color';
import VersionCheck from 'react-native-version-check';
import { get_app_version } from 'api/models';
import RNExitApp from 'react-native-exit-app';

import { BasePopup } from 'screens/commonpopup/BasePopup';

enableScreens();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

// ####################################### 앱 버전 체크
const appVersionCheck = async () => {
  const body = {
    device_type: Platform.OS == 'android' ? 'AOS' : 'IOS',
  };
  const { success, data } = await get_app_version(body);
  if(success) {
    console.log('data :::::::: ', data);
    console.log('getCurrentVersion  ::::::: ', VersionCheck.getCurrentVersion());
    console.log('getCurrentBuildNumber  ::::::: ', VersionCheck.getCurrentBuildNumber());

    const versionName = data?.version_name.toString().replace(/\./g, '').padStart(5, "0");
    const currentVersion = VersionCheck.getCurrentVersion().toString().replace(/\./g, '').padStart(5, "0");
    
    if(
      (Platform.OS == 'android' && data?.version_code > VersionCheck.getCurrentBuildNumber()) || 
      (Platform.OS == 'ios' && versionName > currentVersion)
    ) {
      return false;
    } else {
      return true;
    };
  } else {
    return true;
  };
};

// ####################################### 코드푸시 업데이트 체크 함수
const codepushVersionCheck = async () => {
  const update = await codePush.checkForUpdate();
  return update;
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  // 언제 업데이트를 체크하고 반영할지를 정한다.
  // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
  // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
  //updateDialog: false,
  // 업데이트를 할지 안할지 여부에 대한 노출 (잠수함 패치의 경우 false)
  //installMode: codePush.InstallMode.IMMEDIATE,
  // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFCMToken();
  }
};

const App = () => {
  useEffect(() => {
    // AsyncStorage.clear();
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessage', remoteMessage);

      Notifications.postLocalNotification({
        body: remoteMessage.notification?.body,
        title: remoteMessage.notification?.title,
        sound: 'chime.aiff',
        silent: false,
        category: 'SOME_CATEGORY',
        userInfo: {},
        type: 'alert',
        // fireDate: new Date(),
      });
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <SafeAreaView />
          <SafeAreaView style={style.container}>
            <PopupProvider>
              <StatusBar
                animated={true}
                barStyle="dark-content"
                backgroundColor="white"
              />
              <NavigationContainer>
                <PreFetcher>
                  <MainNaviagtion />
                </PreFetcher>
              </NavigationContainer>
            </PopupProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </>
  );
};

function PreFetcher(props) {
  const dispatch = useDispatch();

  const [updateStatusCode, setUpdateStatusCode] = useState('');
  const [popupVisible, setPopupVisible] = useState(true);

  // 스토어 업데이트
  const storeUpdate = async () => {
    // 구글 플레이 스토어 링크
    const GOOGLE_PLAY_STORE_LINK = 'market://details?id=com.appsquad.limeeted';
    const APPLE_PLAY_STORE_LINK = 'https://apps.apple.com/app/6447423352';

    if(Platform.OS == 'android') {
      Linking.openURL(GOOGLE_PLAY_STORE_LINK);
    } else {
      Linking.openURL(APPLE_PLAY_STORE_LINK);
    }
    
    RNExitApp.exitApp();
  };

  // 코드푸시 업데이트
  const codepushUpdate = async (needUpdate:any) => {
    try {
      const newPackage = await needUpdate.download(({totalBytes, receivedBytes}) => {
          if (totalBytes === 0) {
              return;
          }
          const newPercent = parseInt(receivedBytes/totalBytes * 100);
          console.log('newPercent :::::: ' , newPercent);
          //setPercent( newPercent);
      });
      if (!newPackage) {
          return;
      };
      newPackage.install().then(() => {
          authCheck();
          setUpdateStatusCode('NONE');
          //codePush.restartApp();
      });
    } catch (error) {
      console.log('error :::::: ' ,error);
    };
  };

  useEffect(() => {
    appVersionCheck().then((result) => {
      if(result) {
        codepushVersionCheck().then((update) => {
          console.log('update :::::: ' , update);
          if(update) {
              codepushUpdate(update);
          } else {
            setUpdateStatusCode('NONE');
            authCheck();
          }
        });
      } else {
        setUpdateStatusCode('STORE');
      }
    });
  }, []);

  async function authCheck() {
    const token = await AsyncStorage.getItem(JWT_TOKEN);
    if (token) {
      prefetch();
    } else {
      /* setTimeout(() => {
        SplashScreen.hide();
      }, 1300); */
      SplashScreen.hide();
    }
  };

  async function prefetch() {
    dispatch(myProfile());
  };

  return (
    <>
      {updateStatusCode == 'NONE' && props.children}
      {(updateStatusCode == 'STORE' || updateStatusCode == 'CODEPUSH') &&
        <BasePopup
          popupVisible={popupVisible}
          setPopupVIsible={setPopupVisible}
          title={'알림'}
          text={'필수 업데이트 사항이 있습니다.\n업데이트를 진행해 주세요.'}
          subText={''}
          isConfirm={false}
          confirmCallbackFunc={
            updateStatusCode == 'STORE' ? storeUpdate : codepushUpdate
          }
          cancelCallbackFunc={null}
          cancelConfirmText={'확인'}
        /> 
      }
    </>
  )
}

//export default withIAPContext(App)
export default codePush(codePushOptions)(withIAPContext(App));

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.tabColor,
  },
});
