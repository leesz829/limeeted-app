import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { LogBox, SafeAreaView, StatusBar, StyleSheet, Alert, Linking, Platform, Modal, View, Text, PermissionsAndroid, Image, Dimensions } from 'react-native';
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
import { GIF_IMG } from 'utils/imageUtils';

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
    console.log('appVersionCheck data :::::::: ', data);
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
  try {
    const update = await codePush.checkForUpdate();
    return update;
  } catch (error) {
    console.log('error :::: ' , error);
    return null; 
  }  
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
          <SafeAreaView style={_style.container}>
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
  const [updatePercent, setUpdatePercent] = useState(0);

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
      setUpdateStatusCode('CODEPUSH');

      const newPackage = await needUpdate.download(({totalBytes, receivedBytes}) => {
          if (totalBytes === 0) {
              return;
          }
          const newPercent = parseInt(receivedBytes/totalBytes * 100);
          console.log('newPercent :::::: ' , newPercent);
          setUpdatePercent(newPercent);
      });
      if (!newPackage) {
          return;
      };
      /* newPackage.install().then(() => {
          //authCheck();
          //setUpdateStatusCode('NONE');
          //codePush.restartApp();
      }); */
      newPackage.install(codePush.InstallMode.IMMEDIATE).then(() => {
        console.log('test!!!!!!!!!!!!!');
        // 업데이트 설치 완료 후 로직
        codePush.notifyAppReady();
        //codePush.restartApp();

        setTimeout(() => {
          authCheck();
        }, 300);
      });
    } catch (error) {
      console.log('error :::::: ' ,error);
      authCheck();
    } finally {
      
    }
  };

  useEffect(() => {
    appVersionCheck().then((result) => {
      if(result) {
        codepushVersionCheck().then((update) => {
          console.log('update :::::: ' , update);
          if(update) {
              codepushUpdate(update);
          } else {
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
      SplashScreen.hide();
      setUpdateStatusCode('NONE');
    }
  };

  async function prefetch() {
    dispatch(myProfile());
    setUpdateStatusCode('NONE');
  };

  return (
    <>
      {updateStatusCode == 'NONE' && props.children}
      {updateStatusCode == 'STORE' &&
        <>
          <BasePopup
            popupVisible={popupVisible}
            setPopupVIsible={setPopupVisible}
            title={'알림'}
            text={'필수 업데이트 사항이 있어요.\n스토어에서 업데이트를 진행해 주세요.'}
            subText={''}
            isConfirm={false}
            confirmCallbackFunc={storeUpdate}
            cancelCallbackFunc={null}
            cancelConfirmText={'확인'}
          /> 
        </>
      }
      {updateStatusCode == 'CODEPUSH' && (
        <>
          <BasePopup
            popupVisible={popupVisible}
            setPopupVIsible={setPopupVisible}
            title={'알림'}
            text={'업데이트가 진행 중이에요.\n잠시 기다려 주세요.'}
            subText={updatePercent + '%'}
            isConfirm={false}
            confirmCallbackFunc={null}
            cancelCallbackFunc={null}
            cancelConfirmText={'확인'}
          /> 
        </>
      )}

      {/* <Modal>
        <View style={_style.loadingArea}>
          <Text>dasdsada</Text>
          <Image source={GIF_IMG.soon} style={_style.loadingIcon} />
        </View>

      </Modal> */}
      {/* <View style={_style.loadingArea}>
        <Text>dasdsada</Text>
        <Image source={GIF_IMG.soon} style={_style.loadingIcon} />
      </View>

      <Text>dasdsada</Text> */}
    </>
  )
}

//export default withIAPContext(App)
export default codePush(codePushOptions)(withIAPContext(App));



const { width, height } = Dimensions.get('window');

const _style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.tabColor,
  },
  loadingArea: {
    width: width,
    height: height,
    position: 'relative',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },

});
