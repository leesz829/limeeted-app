import { Alert, Linking } from 'react-native';
import { parse as URLParse } from 'ale-url-parser';
// import * as RootNavigation from '@navigator/navigation';

export const deepLinkRoutes = {
	// home: () => RootNavigation.navigate('Home'),
	// // pointing://notice/237
	// notice: ([serial]) => RootNavigation.navigate('NoticeView', { serial }),
	// event: ([serial]) => RootNavigation.navigate('EventView', { serial }),
	// payment: ([paymentState, serial]) => {
	//   RootNavigation.navigate('Receipt', { serial });
	// },
	// charge: (queries) => {
	//   const serial = queries?.[0];
	//   RootNavigation.navigate('ChargePoint', { serial });
	// },
	// receipt: ([transaction_type, transaction_serial]) => {
	//   RootNavigation.navigate('TransactionReceipt', {
	//     transaction_type,
	//     transaction_serial,
	//   });
	// },
	// ['self-charge']: ([coupon], query) => {
	//   RootNavigation.navigate('PaymentsCard', { coupon });
	// },
	// brand: ([serial]) => {
	//   RootNavigation.navigate('NewPayment', { serial });
	// },
	// transactions: () => {
	//   RootNavigation.navigate('TransactionList');
	// },
	// ['dev-login']: () => {
	//   RootNavigation.navigate('HiddenAppleBypass');
	// },
	// url: ([], query) => {
	//   // pointing://url?url=https://github.com
	//   console.log(query?.url);
	//   Linking.openURL(query?.url);
	// },
};

export const navigateWithDeepLinkURL = (url, callback) => {
	const { host, path = [], query = {} } = URLParse(url);

	const route = Object.keys(deepLinkRoutes).find((key) => key === host);

	console.log(url);

	if (route) {
		try {
			console.log(route);
			deepLinkRoutes?.[route](path, query);
			if (callback) {
				callback();
			}
		} catch (error) {
			console.log('error', error);
			Alert.alert('올바른 링크가 아니에요! 🙅');
		}
		return;
	}
	Alert.alert('존재하지 않는 경로에요! 😖');
};
