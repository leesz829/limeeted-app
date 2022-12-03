import { NavigationContainer } from '@react-navigation/native';
import NestedNavigation from './src/navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { Alert, LogBox, StatusBar, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import store from 'redux/store';
import { Notifications } from 'react-native-notifications';

import { withIAPContext } from 'react-native-iap';
import messaging from '@react-native-firebase/messaging';
import getFCMToken from 'utils/FCM/getFCMToken';

enableScreens();
LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
	"[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
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
		// AsyncStorage.clear()
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
					<StatusBar animated={true} barStyle="dark-content" backgroundColor="white" />
					<NavigationContainer>
						<NestedNavigation />
					</NavigationContainer>
				</SafeAreaView>
			</SafeAreaProvider>
		</Provider>
	);
};

export default withIAPContext(App);

const style = StyleSheet.create({
	container: {
		flex: 1,
	},
});
