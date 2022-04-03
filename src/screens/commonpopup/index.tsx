import { Modal, View, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { useState } from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import { layoutStyle, modalStyle } from 'assets/styles/Styles';
import { ColorType } from '@types';
import SpaceView from 'component/SpaceView';
import CommonHeader from 'component/CommonHeader';

export const CommonPopup = () => {
	const [popup1, setPopup1] = useState(false);
	const [popup2, setPopup2] = useState(false);
	return (
		<>
			<CommonHeader title={'팝업'} />
			<View>
				<CommonBtn value={'찐심'} onPress={() => setPopup1(true)} type={'primary'} />
				<CommonBtn value={'사용자 신고하기'} onPress={() => setPopup2(true)} type={'primary'} />
			</View>

			<Modal visible={popup1} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								찐심
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>보유 찐심 [0]</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity style={modalStyle.modalBtn} onPress={() => setPopup1(false)}>
								<CommonText fontWeight={'500'} color={ColorType.gray8888}>
									취소
								</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
							<TouchableOpacity style={modalStyle.modalBtn}>
								<CommonText fontWeight={'500'} color={ColorType.primary}>
									구매
								</CommonText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal visible={popup2} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								사용자 신고하기
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>해당 사용자를 신고하시겠습니까?</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity style={modalStyle.modalBtn} onPress={() => setPopup2(false)}>
								<CommonText fontWeight={'500'}>취소</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
							<TouchableOpacity style={modalStyle.modalBtn}>
								<CommonText fontWeight={'500'} color={ColorType.red}>
									신고
								</CommonText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};
