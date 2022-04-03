import * as React from 'react';
import { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ICON } from 'utils/imageUtils';
import type { FC } from 'react';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';
import { Color } from 'assets/styles/Color';

const { width, height } = Dimensions.get('window');

interface Props {
	title: string;
	desc: string;
	position?: 'topRight' | 'topLeft' | 'bottomLeft' | 'bottomRight';
}

/**
 *
 * @param {string} title 툴팁 타이틀
 * @param {string} desc 툴팁 설명
 * @param {string} position 툴팁 위치
 * @returns
 */
export const ToolTip: FC<Props> = (props) => {
	const [isVisible, setIsVisible] = useState(false);
	let descPositon: {
		top?: number;
		right?: number;
		left?: number;
		bottom?: number;
	} = { top: 30, left: 0 };
	switch (props.position) {
		case 'topLeft':
			descPositon = { top: -110, left: 0 };
			break;
		case 'topRight':
			descPositon = { top: -110, right: 0 };
			break;
		case 'bottomLeft':
			descPositon = { top: 45, left: 0 };
			break;
		case 'bottomRight':
			descPositon = { top: 45, right: 0 };
			break;
	}
	return (
		<>
			{isVisible && (
				<TouchableOpacity
					activeOpacity={0}
					onPress={() => setIsVisible(false)}
					style={styles.tooltipBackground}
				/>
			)}
			<View style={styles.tooltipWrap}>
				<TouchableOpacity
					activeOpacity={0.3}
					style={styles.tooltipTextContainer}
					onPress={() => setIsVisible(!isVisible)}
				>
					<CommonText fontWeight={'500'}>{props.title}</CommonText>
					<SpaceView ml={4}>
						<Image source={ICON.tooltip} style={styles.tooltipIcon} />
					</SpaceView>
				</TouchableOpacity>

				{isVisible && (
					<>
						<View style={[styles.tooltipDescContainer, { ...descPositon }]}>
							<TouchableOpacity
								activeOpacity={0.3}
								style={styles.tooptipCloseBtnContainer}
								onPress={() => setIsVisible(false)}
							>
								<Image source={ICON.xBtn} style={styles.tooltipIcon} />
							</TouchableOpacity>
							<CommonText>{props.desc}</CommonText>
						</View>
					</>
				)}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	tooltipBackground: {
		width,
		height,
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 10,
	},
	tooltipWrap: {
		overflow: 'visible',
	},
	tooltipTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tooltipDescContainer: {
		position: 'absolute',
		padding: 24,
		justifyContent: 'center',
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: Color.grayDDDD,
		borderRadius: 12,
		maxWidth: 300,
		minWidth: 250,
		zIndex: 20,
	},
	tooltipIcon: {
		width: 16,
		height: 16,
	},
	tooptipCloseBtnContainer: {
		position: 'absolute',
		right: 8,
		top: 8,
	},
});
