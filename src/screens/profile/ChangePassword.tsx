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
###### 비밀번호 변경 화면
###################################################################################################################
################################################################################################################ */

interface Props {
	
}

export const ChangePassword = (props : Props) => {
	const [oldPassword,    		setOldPassword]         = React.useState('');
	const [compareOldPassword,  setCompareOldPassword]  = React.useState('');
	const [newPassword,    		setNewPassword]    		= React.useState('');
	const [newPasswordChk, 		setNewPasswordChk]      = React.useState('');

  	// 오류메시지 상태저장
  	const [oldPasswordConfirmMessage,    setOldPasswordConfirmMessage]    = React.useState<string>('');
  	const [newPasswordConfirmMessage,    setNewPasswordConfirmMessage]    = React.useState<string>('');
  	const [newPasswordChkConfirmMessage, setNewPasswordChkConfirmMessage] = React.useState<string>('');

  	// 오류메시지 폰트컬러 상태저장
  	const [oldPasswordConfirmMessageColor,    setOldPasswordConfirmMessageColor]    = React.useState<string>('');
  	const [newPasswordConfirmMessageColor,    setNewPasswordConfirmMessageColor]    = React.useState<string>('');
  	const [newPasswordChkConfirmMessageColor, setNewPasswordChkConfirmMessageColor] = React.useState<string>('');

	// 유효성 검사
	const [isOldPassword,    setIsOldPassword]    = React.useState<boolean>(false);
	const [isNewPassword,    setIsNewPassword]    = React.useState<boolean>(false);
	const [isNewPasswordChk, setIsNewPasswordChk] = React.useState<boolean>(false);

	const jwtToken = hooksMember.getJwtToken(); // 토큰 추출

	// 회원 기본 정보
	const memberBase = useUserInfo(); // 회원 기본정보
	
	// ################### 팝업 관련 #####################
	const [newPasswordUpdatePopup,   setNewPasswordUpdatePopup]   = React.useState(false); // 비밀번호 변경 팝업
	const [newPasswordCompletePopup, setNewPasswordCompletePopup] = React.useState(false); // 비밀번호 변경 완료 팝업

	const dispatch   = useDispatch();
	const navigation = useNavigation<ScreenNavigationProp>();

	// 최초 실행
	React.useEffect(() => {
		// 현재 비빌번호 조회 및 셋팅
		axios.post(
				properties.api_domain + '/changePassword/selectOldPassword',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					member_seq: memberBase.member_seq,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				console.log("response setOldPassword ::: " + JSON.stringify(response.data));

				if(null != response.data.result.password) {
//					Alert.alert('알림', response.data.result.password, [{ text: '확인' }]);
//					setOldPassword(response.data.result.password);
					setCompareOldPassword(response.data.result.password);
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	}, []);

	// 새 비밀번호 변경 버튼 클릭
	const updateNewPassword = async () => {
		const result = await axios
		.post(
			properties.api_domain + '/changePassword/updateNewPassword',
			{
				'api-key': 'U0FNR09CX1RPS0VOXzAx',
				member_seq : memberBase.member_seq,
				newPassword: newPassword
			},
			{
				headers: {
					'jwt-token': jwtToken,
				},
			},
		)
		.then(function (response) {
			setNewPasswordUpdatePopup(false);

			if (response.data.result_code != '0000') {
				return false;
			} else {
				setNewPasswordCompletePopup(true);
			}
		})
		.catch(function (error) {
			console.log('error ::: ', error);
		});		
	};

	// 변경 완료 버튼 클릭
	const updateNewPasswordComplete = async () => {
		// #todo pushtoken 비워줄 로그아웃 api
		await AsyncStorage.clear();
		dispatch(clearPrincipal());
		//#todo mbr base = > principal reducer
		 navigation.navigate(STACK.AUTH, { screen: ROUTES.LOGIN });
	};

	return (
		<>
			<CommonHeader title={'비밀번호 변경'} />
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
						label="현재 비밀번호"
						value={oldPassword}
						onChangeText={(oldPassword) => setOldPassword(oldPassword)}
						isMasking={true}
						maxLength={20}

					/>
					{isOldPassword && (<Text style={{color: oldPasswordConfirmMessageColor}}>{oldPasswordConfirmMessage}</Text>)}
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="새 비밀번호 입력"
						value={newPassword}
						onChangeText={(newPassword) => setNewPassword(newPassword)}
						isMasking={true}
						maxLength={20}
					/>
					{isNewPassword && (<Text style={{color: newPasswordConfirmMessageColor}}>{newPasswordConfirmMessage}</Text>)}
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput
						label="새 비밀번호 재입력"
						value={newPasswordChk}
						onChangeText={(newPasswordChk) => setNewPasswordChk(newPasswordChk)}
						isMasking={true}
						maxLength={20}
					/>
					{isNewPasswordChk && (<Text style={{color: newPasswordChkConfirmMessageColor}}>{newPasswordChkConfirmMessage}</Text>)}
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn
						value={'비밀번호 변경'}
						type={'primary'}
						onPress={() => { 
							setIsOldPassword(false);
							setIsNewPassword(false);
							setIsNewPasswordChk(false);

							setOldPasswordConfirmMessage("");
							setNewPasswordConfirmMessage("");
							setNewPasswordChkConfirmMessage("");

							if(oldPassword == '') {
								setOldPasswordConfirmMessage("현재 사용하고 계신 비밀번호를 입력해주세요.");
								setOldPasswordConfirmMessageColor('#8854D2');
								return;
							}

							if(oldPassword != compareOldPassword) {
								setIsOldPassword(true);
								setOldPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
								setOldPasswordConfirmMessageColor('#E04136');
								return;
							}

							if(newPassword == '') {
								setIsNewPassword(true);
								setNewPasswordConfirmMessage("새로 사용하실 비밀번호를 입력해주세요.");
								setNewPasswordConfirmMessageColor('#8854D2');
								return;
							}

							let regPass = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
							if((!regPass.test(newPassword))){
								setIsNewPassword(true);
								setNewPasswordConfirmMessage("영문(소문자) + 숫자 + 특수문자 조합 8자리 이상 입력해주세요.");
								setNewPasswordConfirmMessageColor('#E04136');
								return;
							}

							if(newPasswordChk == '') {
								setIsNewPasswordChk(true);
								setNewPasswordChkConfirmMessage("새 비밀번호를 재입력해주세요.");
								setNewPasswordChkConfirmMessageColor('#8854D2');
								return;
							}

							if (newPassword != newPasswordChk) {
								setIsNewPasswordChk(true);
								setNewPasswordChkConfirmMessage("새 비밀번호가 일치하지 않습니다.");
								setNewPasswordChkConfirmMessageColor('#E04136');
							 	return;
							}

							setOldPasswordConfirmMessage("정상 입력되었습니다.");
							setNewPasswordConfirmMessage("정상 입력되었습니다.");
							setNewPasswordChkConfirmMessage("정상 입력되었습니다.");
							setOldPasswordConfirmMessageColor('#43AB90');
							setNewPasswordConfirmMessageColor('#43AB90');
							setNewPasswordChkConfirmMessageColor('#43AB90');

							setNewPasswordUpdatePopup(true); 
						}}
					/>
				</SpaceView>
 
				<Modal visible={newPasswordUpdatePopup} transparent={true}>
					<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								비밀번호 변경
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>비밀번호 변경하시겠습니까?</CommonText>
							<CommonText type={'h5'}>변경 처리 후 바로 로그인됩니다.</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setNewPasswordUpdatePopup(false)}
							>
								<CommonText fontWeight={'500'}>취소</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
								<TouchableOpacity 
									style={modalStyle.modalBtn}
									onPress={() => updateNewPassword()}
								>
									<CommonText fontWeight={'500'}>
										변경
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal visible={newPasswordCompletePopup} transparent={true}>
					<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								변경 완료
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>비밀번호 변경이 완료되었습니다.</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<View style={modalStyle.modalBtnline} />
								<TouchableOpacity 
									style={modalStyle.modalBtn}
									onPress={() => updateNewPasswordComplete()}
								>
									<CommonText fontWeight={'500'}>
										확인
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
