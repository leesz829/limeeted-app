import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar, StyleSheet } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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

enableScreens();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  // 언제 업데이트를 체크하고 반영할지를 정한다.
  // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
  // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
  updateDialog: false,
  // 업데이트를 할지 안할지 여부에 대한 노출 (잠수함 패치의 경우 false)
  installMode: codePush.InstallMode.IMMEDIATE,
  // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
};

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.log('enabled : ', enabled);
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
    <Provider store={store}>
      <SafeAreaProvider>
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
  );
};

function PreFetcher(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    authCheck();
  }, []);

  async function authCheck() {
    const token = await AsyncStorage.getItem(JWT_TOKEN);

    if (token) {
      prefetch();
    } else {
      SplashScreen.hide();
    }
  }
  async function prefetch() {
    dispatch(myProfile());
  }

  return props.children;
}
export default codePush(codePushOptions)(withIAPContext(App));

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
