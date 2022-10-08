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
	value?: string;
	callBackFunction?: (value:string, check:boolean) => void;
}

/**
 * 공통 체크박스
 * @param {string} label 체크박스 라벨
 *
 *
 */
export const CommonCheckBox: FC<Props> = (props) => {
	const [check, setIsCheck] = useState(false);

	const callBackFunction = (value:string) =>{
		setIsCheck(!check);
		props.callBackFunction && props.callBackFunction(value, !check);
	}


	return (
		<TouchableOpacity
			style={styles.checkWrap}
			onPress={() => 
				callBackFunction(props.value?props.value:'')
			}
			activeOpacity={0.3}
		>
			<View style={[styles.checkContainer, check && styles.active]}>
				<Image source={check ? ICON.checkOn : ICON.checkOff} style={styles.iconStyle} />
			</View>
			<SpaceView ml={8}>
				<CommonText fontWeight={'500'}>{props.label}</CommonText>
			</SpaceView>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	checkWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 12,
		paddingBottom: 12,
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
