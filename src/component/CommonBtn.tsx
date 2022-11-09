import { TouchableOpacity, StyleSheet, Text, ImageSourcePropType } from 'react-native';
import { FC } from 'react';
import * as React from 'react';
import { Color } from 'assets/styles/Color';
import type { TouchableOpacityProps, StyleProp } from 'react-native';
import { Image } from 'react-native';
import SpaceView from './SpaceView';

type BtnType = 'gray' | 'primary' | 'kakao' | 'purple' | 'white';
type Props = {
	onPress?: () => void;
	value: string;
	type?: BtnType;
	icon?: ImageSourcePropType;
	iconSize?: number;
	iconPosition?: 'left' | 'right';
	height?: number;
} & StyleProp<TouchableOpacityProps>;
/**
 * 공통 버튼
 * @param {function} onPress 누를 시 실행 함수
 * @param {value} value 버튼 텍스트
 * @param {string} type 버튼 색 및 타입, 'gray','primary','kakao','purple','white' 중 하나를 가질 수 있으며, default는 gray
 * @param {ImageSourcePropType} icon 아이콘이 있을 시 아이콘 이미지 주입 필요
 * @param {number} iconSize 아이콘 사이즈
 * @param {string} iconPosition 아이콘 위치 left or right
 * @param {number} height 버튼 높이
 *
 *
 */
export const CommonBtn: FC<Props> = (props) => {
	const style = styles(props);
	return (
		<TouchableOpacity activeOpacity={0.3} onPress={props.onPress} style={style.btnStyle} {...props}>
			{props.icon && props.iconPosition !== 'right' && (
				<SpaceView mr={4}>
					<Image
						source={props.icon}
						style={[
							style.iconStyle,
							props.iconSize ? { width: props.iconSize, height: props.iconSize } : {},
						]}
					/>
				</SpaceView>
			)}
			<Text style={style.btnText}>{props.value}</Text>
			{props.icon && props.iconPosition === 'right' && (
				<SpaceView ml={4}>
					<Image
						source={props.icon}
						style={[
							style.iconStyle,
							props.iconSize ? { width: props.iconSize, height: props.iconSize } : {},
						]}
					/>
				</SpaceView>
			)}
		</TouchableOpacity>
	);
};

const styles = (props: Props) => {
	let backgroundColor = Color.grayEEEE;
	let textColor = Color.black2222;
	let borderColor = Color.grayEEEE;
	switch (props.type) {
		case 'gray':
			backgroundColor = Color.grayEEEE;
			textColor = Color.black2222;
			break;
		case 'primary':
			backgroundColor = Color.primary;
			textColor = 'white';
			break;
		case 'purple':
			backgroundColor = Color.purple;
			textColor = 'white';
			break;
		case 'kakao':
			backgroundColor = '#FEE500';
			textColor = Color.black2222;
			break;
		case 'white':
			backgroundColor = 'white';
			textColor = Color.black2222;
			borderColor = Color.grayDDDD;
			break;
		default:
			backgroundColor = Color.grayEEEE;
			textColor = Color.black2222;
			break;
	}
	return StyleSheet.create({
		btnStyle: {
			height: props.height ? props.height : 56,
			borderRadius: 12,
			backgroundColor: backgroundColor,
			alignItems: 'center',
			justifyContent: 'center',
			borderWidth: 1,
			borderColor,
			flexDirection: 'row',
		},
		btnText: {
			fontSize: 16,
			lineHeight: 26,
			color: textColor,
			fontFamily: 'AppleSDGothicNeoM00',
		},
		iconStyle: {
			width: 16,
			height: 16,
		},
	});
};
