import { useRef } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as React from 'react';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { ColorType } from '@types';

export const SignupPopUp = () => {
	const modalizeRef = useRef<Modalize>(null);
	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	return (
		<View style={layoutStyle.flex1}>
			<CommonHeader title={'SignupPopUp'} />
			<CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

			<Modalize
				ref={modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						직업 인증
					</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<View>
						<SpaceView mb={32}>
							<CommonInput label="직업" placeholder={'직업을 입력해주세요. (예 : 프로그래머)'} />
						</SpaceView>
					</View>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									자신의 커리어를 증명할 수 있는 명함 또는 증명서를 올려주세요.
								</CommonText>
							</View>
						</SpaceView>

						<SpaceView>
							<View style={styles.dotTextContainer}>
								<View style={styles.dot} />
								<CommonText color={ColorType.gray6666}>
									허용 증명서 : 재직증명서, 건강보험자격득실확인서, 직업라이센스
								</CommonText>
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={24}>
						<CommonBtn value={'등록 및 수정'} height={48} type={'white'} icon={ICON.plus} />
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>
		</View>
	);
};
