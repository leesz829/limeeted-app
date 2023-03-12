import { styles, modalStyle, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import { clearPrincipal } from 'redux/reducers/authReducer';
import { useUserInfo } from 'hooks/useUserInfo';


/* ################################################################################################################
###################################################################################################################
###### 아이디/비밀번호 찾기 화면
###################################################################################################################
################################################################################################################ */

interface Props {
	
}

export const SearchIdAndPwd = (props : Props) => {
	const [phoneNumber,	setPhoneNumber] = React.useState('');
	const [emailId,    	setEmailId]     = React.useState('');


	const jwtToken = hooksMember.getJwtToken(); // 토큰 추출
	
	// ################### 팝업 관련 #####################
	const [selectEmailIdPopup,  setSelectEmailIdPopup]  = React.useState(false); // 아이디 찾기 팝업
	const [selectPasswordPopup, setSelectPasswordPopup] = React.useState(false); // 비밀번호 찾기 팝업

	const dispatch   = useDispatch();
	const navigation = useNavigation<ScreenNavigationProp>();

	// 아이디 찾기 버튼 클릭
	const selectEmailIdFromPhoneNumber = async () => {
		const result = await axios
		.post(
			properties.api_domain + '/member/selectEmailIdFromPhoneNumber',
			{
				'api-key': 'U0FNR09CX1RPS0VOXzAx',
				phoneNumber: phoneNumber
			},
			{
				headers: {
					'jwt-token': jwtToken,
				},
			},
		)
		.then(function (response) {
			if (response.data.result_code != '0000') {
				return false;
			} else {
				
			}
		})
		.catch(function (error) {
			console.log('error ::: ', error);
		});		
	};

	// 비밀번호 찾기 버튼 클릭
	const selectPasswordFromEmailId = async () => {
		const result = await axios
		.post(
			properties.api_domain + '/member/selectPasswordFromEmailId',
			{
				'api-key': 'U0FNR09CX1RPS0VOXzAx',
				emailId: emailId
			},
			{
				headers: {
					'jwt-token': jwtToken,
				},
			},
		)
		.then(function (response) {
			if (response.data.result_code != '0000') {
				return false;
			} else {

			}
		})
		.catch(function (error) {
			console.log('error ::: ', error);
		});		
	};

	return (
		<>
			<CommonHeader title={'아이디/비밀번호 찾기'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				
				<View style={layoutStyle.alignCenter}>
					<SpaceView>
						<Image source={IMAGE.logoMark} style={styles.logoMark} resizeMode="contain" />
					</SpaceView>
					<SpaceView mb={15}>
						<Image source={IMAGE.logoText} style={styles.logo} resizeMode="contain" />
					</SpaceView>
				</View>

				<SpaceView mb={24}>
					<CommonInput
						label="아이디 찾기"
						placeholder="휴대폰 번호를 입력해주세요."
						value={phoneNumber}
						onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
						isMasking={true}
						maxLength={100}

					/>
					<CommonBtn value={'전송'} type={'purple'} onPress={() => setSelectEmailIdPopup(true)} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="비밀번호 찾기"
						placeholder="이메일을 입력해주세요."
						value={emailId}
						onChangeText={(emailId) => setEmailId(emailId)}
						isMasking={true}
						maxLength={13}

					/>
					<CommonBtn value={'전송'} type={'purple'} onPress={() => setSelectPasswordPopup(true)} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn
						value={'로그인하기'}
						type={'primary'}
						onPress={() => {
							navigation.navigate('Login');
						}}
					/>
				</SpaceView>

				<Modal visible={selectEmailIdPopup} transparent={true}>
					<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								아이디 찾기
							</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setSelectEmailIdPopup(false)}
							>
								<CommonText fontWeight={'500'}>닫기</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
								<TouchableOpacity 
									style={modalStyle.modalBtn}
									onPress={() => selectEmailIdFromPhoneNumber()}
								>
									<CommonText fontWeight={'500'}>
										찾기
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal visible={selectPasswordPopup} transparent={true}>
					<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								아이디 찾기
							</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setSelectEmailIdPopup(false)}
							>
								<CommonText fontWeight={'500'}>닫기</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
								<TouchableOpacity 
									style={modalStyle.modalBtn}
									onPress={() => selectPasswordFromEmailId()}
								>
									<CommonText fontWeight={'500'}>
										찾기
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>						

			</ScrollView>
		</>
	);
};
