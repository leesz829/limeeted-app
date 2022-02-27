import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as React from 'react';
import { useState } from 'react';
import { CommonText } from './CommonText';
import type { FC } from 'react';
import { ColorType } from '@types';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';

interface Props {
	title: string;
	desc: string;
	label: string;
}
/**
 * 이벤트 페이지 행
 * @param {string} title 타이틀
 * @param {string} desc 클릭 시 나오는 설명
 * @param {string} label 분류라벨
 *
 *
 */
export const EventRow: FC<Props> = (props) => {
	const [openRow, setOpenRow] = useState(false);

	return (
		<View>
			<View style={styles.rowContainer}>
				<TouchableOpacity
					style={styles.inner}
					onPress={() => setOpenRow(!openRow)}
					activeOpacity={0.3}
				>
					<View style={styles.labelContainer}>
						<CommonText type={'h5'} color={ColorType.gray6666}>
							{props.label}
						</CommonText>
					</View>
					<View style={[styles.titleContainer, openRow && styles.active]}>
						<CommonText>{props.title}</CommonText>
					</View>
				</TouchableOpacity>

				<View style={[styles.iconContainer, openRow && styles.activeIcon]}>
					<Image source={ICON.arrRight} style={styles.iconStyle} />
				</View>
			</View>

			{openRow && (
				<View style={styles.descContainer}>
					<CommonText>{props.desc}</CommonText>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		right: 32,
		transform: [{ rotate: '90deg' }],
	},
	activeIcon: {
		transform: [{ rotate: '-90deg' }],
	},
	inner: {
		width: '100%',
	},
	labelContainer: {
		marginBottom: 8,
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 84,
	},
	iconStyle: {
		width: 24,
		height: 24,
	},
	titleContainer: {
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderColor: Color.grayDDDD,
	},
	active: {
		borderBottomWidth: 0,
	},
	descContainer: {
		backgroundColor: Color.grayF8F8,
		padding: 16,
	},
});
