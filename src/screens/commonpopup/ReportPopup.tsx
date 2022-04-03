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
import { CommonCheckBox } from 'component/CommonCheckBox';

export const ReportPopup = () => {
	const modalizeRef = useRef<Modalize>(null);
	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	return (
		<View style={layoutStyle.flex1}>
			<CommonHeader title={'관심사 등록'} />
			<CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

			<Modalize
				ref={modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						사용자 신고하기
					</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<SpaceView mb={16}>
						<CommonText>신고 사유를 선택해주세요.</CommonText>
					</SpaceView>

					<SpaceView mb={24}>
						{[
							{ text: '비속어 사용' },
							{ text: '과도한 성적 표현' },
							{ text: '불쾌감을 주는 표현' },
							{ text: '성차별 적 표현' },
							{ text: '기타' },
						].map((i, index) => (
							<CommonCheckBox label={i.text} key={index + 'checkbox'} />
						))}
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'취소'} />
					</SpaceView>
				</View>
			</Modalize>
		</View>
	);
};
