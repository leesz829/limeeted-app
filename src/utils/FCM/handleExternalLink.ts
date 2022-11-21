import { Alert } from 'react-native';
import { openInAppBrowser } from './inAppBrowser';
import { navigateWithDeepLinkURL } from './deepLinkRouter';

export const handleExternalLink = (link, externelLinkYN) => {
	if (!link) {
		Alert.alert('올바른 링크가 아니에요! 🙅');
		return;
	}

	if (externelLinkYN === 'Y') {
		try {
			openInAppBrowser(link);
		} catch (e) {
			console.log(e.message);
			Alert.alert('올바른 링크가 아니에요! 🙅');
		}
		return;
	}
	navigateWithDeepLinkURL(link);
};
