import { useRef } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as React from 'react';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import RatingStar from 'component/RatingStar';
import { ColorType } from '@types';

export const LivePopup = () => {
	const modalizeRef = useRef<Modalize>(null);
	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	return (
		<View style={layoutStyle.flex1}>
			<CommonHeader title={'Live Popup'} />
			<CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

			<Modalize
				ref={modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText type={'h3'}>프로필 평가</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<SpaceView mb={16} viewStyle={modalStyle.textContainer}>
						<CommonText color={ColorType.primary} textStyle={layoutStyle.textCenter}>
							봄같은 분위기{'\n'}
							싱그러운
						</CommonText>
						<CommonText>인상을 가진 상대에 대한 내 호감도</CommonText>
					</SpaceView>
					<SpaceView viewStyle={layoutStyle.alignCenter} mb={24}>
						<RatingStar />
					</SpaceView>
					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>
		</View>
	);
};
