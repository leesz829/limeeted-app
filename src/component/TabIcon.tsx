import { Image, StyleSheet } from 'react-native';
import { ICON } from 'utils/imageUtils';
import * as React from 'react';

const TabIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
	switch (name) {
		case 'Roby': {
			if (isFocused) {
				return <Image style={style.iconSize} source={ICON.robyOn} />;
			} else {
				return <Image style={style.iconSize} source={ICON.roby} />;
			}
		}
		case 'Cashshop': {
			if (isFocused) {
				return <Image style={style.iconSize} source={ICON.cashshopOn} />;
			} else {
				return <Image style={style.iconSize} source={ICON.cashshop} />;
			}
		}
		case 'Mailbox': {
			if (isFocused) {
				return <Image style={style.iconSize} source={ICON.mailboxOn} />;
			} else {
				return <Image style={style.iconSize} source={ICON.mailbox} />;
			}
		}
		case 'Storage': {
			if (isFocused) {
				return <Image style={style.iconSize} source={ICON.storageOn} />;
			} else {
				return <Image style={style.iconSize} source={ICON.storage} />;
			}
		}
		default:
			return <Image style={style.iconSize} source={ICON.roby} />;
	}
};

export default TabIcon;

const style = StyleSheet.create({
	iconSize: {
		width: 24,
		height: 24,
	},
});
