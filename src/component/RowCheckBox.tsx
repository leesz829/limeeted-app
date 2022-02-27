import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as React from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';

interface Props {
	label: string;
}
/**
 * 체크박스 일자형
 * @param {string} label 체크박스 라벨
 * @returns
 */
export const RowCheckBox: FC<Props> = (props) => {
	const [check, setIsCheck] = useState(false);

	return (
		<TouchableOpacity
			style={[styles.checkWrap, check && styles.wrapActive]}
			onPress={() => setIsCheck(!check)}
			activeOpacity={0.3}
		>
			<SpaceView>
				<CommonText>{props.label}</CommonText>
			</SpaceView>

			<View style={[styles.checkContainer, check && styles.active]}>
				<Image source={check ? ICON.checkOn : ICON.checkOff} style={styles.iconStyle} />
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	checkWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderWidth: 1,
		borderColor: Color.grayEEEE,
		borderRadius: 16,
	},
	wrapActive: {
		borderColor: Color.primary,
	},
	iconStyle: {
		width: 12,
		height: 8,
	},
	checkContainer: {
		width: 24,
		height: 24,
		borderWidth: 1,
		borderRadius: 12,
		borderColor: Color.grayDDDD,
		alignItems: 'center',
		justifyContent: 'center',
	},
	active: {
		backgroundColor: Color.primary,
		borderColor: Color.primary,
	},
});
