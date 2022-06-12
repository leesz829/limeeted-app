import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as React from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';
import { styles } from 'assets/styles/Styles';
import { ColorType } from '@types';

interface Props {
	items: { label: string; value: string }[];
}

export const RadioCheckBox: FC<Props> = (props) => {
	const [checkIndex, setCheckIndex] = useState(-1);

	return props.items ? (
		<>
			{props.items.map((item, index) => {
				return (
					<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
						<TouchableOpacity 
							style={[styles.interestBox, index === checkIndex && styles.boxActive]}
									onPress={() => {
										console.log('ddd ::: ' + item.label);
									}} >
							<CommonText
								fontWeight={'500'}
								color={index === checkIndex ? ColorType.primary : ColorType.gray8888} >
								{item.label}
							</CommonText>
						</TouchableOpacity>
					</SpaceView>
					
				);
			})}
		</>
	) : (
		<></>
	);
};
