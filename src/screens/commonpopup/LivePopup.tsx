import { FC, useRef, useEffect, useState} from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as React from 'react';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import RatingStar from 'component/RatingStar';
import { ColorType } from '@types';

interface Props {
	callBackFunction: (flag:boolean, faceType:string, score:string) => void;
	faceType: string;
}
// export const LivePopup = () => {
export const LivePopup: FC<Props> = (props) => {
	const modalizeRef = useRef<Modalize>(null);
	let checkScore = '';

	const onOpen = () => {
		modalizeRef.current?.open();
	}; 

	const onClose = (flag:boolean) => {
		modalizeRef.current?.close();
		checkScore = flag?checkScore:'';
		props.callBackFunction(false, '', checkScore);
	};

	const callBackFunction = (score:string) =>{
		checkScore = score;
	}

	useEffect(() => {
		onOpen();
	 }, []);

	return (
		<Modalize
			ref={modalizeRef}
			adjustToContentHeight={true}
			handleStyle={modalStyle.modalHandleStyle}
			modalStyle={modalStyle.modalContainer}
			closeOnOverlayTap={false}
			onClosed={() => onClose(false)}
		>
			<View style={modalStyle.modalHeaderContainer}>
				<CommonText fontWeight={'700'} type={'h3'}>
					프로필 평가
				</CommonText>
				<TouchableOpacity onPress={() => onClose(false)}>
					<Image source={ICON.xBtn} style={styles.iconSize24} />
				</TouchableOpacity>
			</View>

			<View style={modalStyle.modalBody}>
				<SpaceView mb={16} viewStyle={modalStyle.textContainer}>
					<CommonText
						fontWeight={'700'}
						color={ColorType.primary}
						textStyle={layoutStyle.textCenter}
					>
						{props.faceType}
					</CommonText>
					<CommonText>인상을 가진 상대에 대한 내 호감도</CommonText>
				</SpaceView>
				<SpaceView viewStyle={layoutStyle.alignCenter} mb={24}>
					<RatingStar callBackFunction={callBackFunction}/>
				</SpaceView>
				<SpaceView mb={16}>
					<CommonBtn value={'확인'} type={'primary'} onPress={() =>{
						onClose(true);
					}}/>
				</SpaceView>
			</View>
		</Modalize>		
	);
};
