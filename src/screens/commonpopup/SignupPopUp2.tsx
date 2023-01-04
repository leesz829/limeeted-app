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
import { ColorType } from '@types';

export const SignupPopUp2 = () => {
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

			<Modalize ref={modalizeRef} adjustToContentHeight={true} handleStyle={modalStyle.modalHandleStyle} modalStyle={modalStyle.modalContainer}>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						관심사 등록
					</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>문화생활</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '스타일1', isActive: true },
								{ text: '해외축구', isActive: false },
								{ text: '영화1', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText fontWeight={'500'} color={i.isActive ? ColorType.primary : ColorType.gray8888}>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>영화</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '영화1', isActive: true },
								{ text: '영화2', isActive: false },
								{ text: '영화3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'movie'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText fontWeight={'500'} color={i.isActive ? ColorType.primary : ColorType.gray8888}>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>스타일</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '스타일1', isActive: true },
								{ text: '스타일2', isActive: false },
								{ text: '스타일3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'style'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText fontWeight={'500'} color={i.isActive ? ColorType.primary : ColorType.gray8888}>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>음식</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ text: '음식', isActive: true },
								{ text: '음식2', isActive: false },
								{ text: '음식3', isActive: false },
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'food'}>
										<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
											<CommonText fontWeight={'500'} color={i.isActive ? ColorType.primary : ColorType.gray8888}>
												{i.text}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>
		</View>
	);
};
