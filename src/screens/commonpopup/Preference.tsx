import { useRef } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import * as React from 'react';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSelect } from 'component/CommonSelect';
import { CommonInput } from 'component/CommonInput';

export const Preference = () => {
	const modalizeRef = useRef<Modalize>(null);
	const onOpen = () => {
		modalizeRef.current?.open();
	};

	const onClose = () => {
		modalizeRef.current?.close();
	};

	return (
		<View style={layoutStyle.flex1}>
			<CommonHeader title={'내 선호 이성'} />
			<CommonBtn value={'Open the modal'} onPress={onOpen} type={'primary'} />

			<Modalize
				ref={modalizeRef}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						내 선호 이성
					</CommonText>
					<TouchableOpacity onPress={onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<ScrollView contentContainerStyle={modalStyle.modalBody}>
					<SpaceView mb={32}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h4'}>
								나이
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={styles.halfContainer}>
							<View style={styles.halfItemLeft}>
								<CommonInput label={'최소'} placeholder={'입력'} />
							</View>

							<View style={styles.halfItemRight}>
								<CommonInput label={'최대'} placeholder={'입력'} />
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={32}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h4'}>
								거리
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={styles.halfContainer}>
							<View style={styles.halfItemLeft}>
								<CommonInput label={'최소'} placeholder={'입력'} />
							</View>

							<View style={styles.halfItemRight}>
								<CommonInput label={'최대'} placeholder={'입력'} />
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={32}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h4'}>
								직업
							</CommonText>
						</SpaceView>
						<SpaceView mb={24} viewStyle={styles.halfContainer}>
							<View style={styles.halfItemLeft}>
								<CommonSelect label={'업종'} />
							</View>

							<View style={styles.halfItemRight}>
								<CommonSelect label={'직업'} />
							</View>
						</SpaceView>
						<SpaceView mb={24} viewStyle={styles.halfContainer}>
							<View style={styles.halfItemLeft}>
								<CommonSelect label={'업종'} />
							</View>

							<View style={styles.halfItemRight}>
								<CommonSelect label={'직업'} />
							</View>
						</SpaceView>
						<SpaceView viewStyle={styles.halfContainer}>
							<View style={styles.halfItemLeft}>
								<CommonSelect label={'업종'} />
							</View>

							<View style={styles.halfItemRight}>
								<CommonSelect label={'직업'} />
							</View>
						</SpaceView>
					</SpaceView>

					<SpaceView mb={40}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h4'}>
								인상
							</CommonText>
						</SpaceView>
						<SpaceView mb={24}>
							<CommonSelect label={'인상'} />
						</SpaceView>
						<SpaceView mb={24}>
							<CommonSelect label={'인상'} />
						</SpaceView>
						<SpaceView>
							<CommonSelect label={'인상'} />
						</SpaceView>
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'저장'} type={'primary'} />
					</SpaceView>
				</ScrollView>
			</Modalize>
		</View>
	);
};
