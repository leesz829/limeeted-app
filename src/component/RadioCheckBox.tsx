import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as React from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';

interface Props {
	items: { label: string; value: string }[];
}

export const RadioCheckBox: FC<Props> = (props) => {
	const [checkIndex, setCheckIndex] = useState(-1);

	return props.items ? (
		<>
			{props.items.map((item, index) => {
				return (
					<SpaceView mb={index === props.items.length - 1 ? 48 : 8} key={index + 'check'}>
						<TouchableOpacity
							style={[styles.checkWrap, index === checkIndex && styles.wrapActive]}
							onPress={() => setCheckIndex(index)}
							activeOpacity={0.3}
						>
							<SpaceView>
								<CommonText>{item.label}</CommonText>
							</SpaceView>

							<View style={[styles.checkContainer, index === checkIndex && styles.active]}>
								<Image
									source={index === checkIndex ? ICON.checkOn : ICON.checkOff}
									style={styles.iconStyle}
								/>
							</View>
						</TouchableOpacity>
					</SpaceView>
				);
			})}
		</>
	) : (
		<></>
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
		backgroundColor: 'white',
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
