import { useRef } from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as React from 'react';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { CommonDatePicker } from 'component/CommonDatePicker';
import { Color } from 'assets/styles/Color';

const { width, height } = Dimensions.get('window');
export const Board1 = () => {
	const modalizeRef = useRef<Modalize>(null);
	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	return (
		<View style={layoutStyle.flex1}>
			<CommonHeader title={'이용약관'} />
			<CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

			<Modalize
				ref={modalizeRef}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						이용약관
					</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={[modalStyle.modalBody, layoutStyle.flex1]}>
					<SpaceView mb={24}>
						<CommonDatePicker />
					</SpaceView>

					<SpaceView
						mb={24}
						viewStyle={{ width: width - 32, height: height - 300, backgroundColor: Color.grayF8F8 }}
					/>

					<View>
						<CommonBtn value={'확인'} type={'primary'} />
					</View>
				</View>
			</Modalize>
		</View>
	);
};
