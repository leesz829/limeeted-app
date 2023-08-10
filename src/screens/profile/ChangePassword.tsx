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
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { usePopup } from 'Context';
import { update_member_password, update_member_exit } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { STACK } from 'constants/routes';
import { myProfile } from 'redux/reducers/authReducer';
import { clearPrincipal } from 'redux/reducers/authReducer';


/* ################################################################################################################
###################################################################################################################
###### 비밀번호 변경 화면
###################################################################################################################
################################################################################################################ */

interface Props {
	
}

export const ChangePassword = (props : Props) => {

	const navigation = useNavigation<ScreenNavigationProp>();
	const { show } = usePopup();  // 공통 팝업
	const dispatch = useDispatch();


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


	// ####################################################### 비밀번호 Validate 체크
	const validatePassword = async () => {

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

		if(newPassword == '') {
			setIsNewPassword(true);
			setNewPasswordConfirmMessage("새로 사용하실 비밀번호를 입력해주세요.");
			setNewPasswordConfirmMessageColor('#8854D2');
			return;
		}

		let regPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
		if((!regPass.test(newPassword))){
			setIsNewPassword(true);
			setNewPasswordConfirmMessage("새 비밀번호를 올바르게 입력해주세요.");
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

		if(oldPassword == newPassword) {
			setIsNewPassword(true);
			setNewPasswordConfirmMessage("동일한 비밀번호는 사용하실 수 없습니다.");
			setNewPasswordChkConfirmMessageColor('#E04136');
			return;
		}


		//setOldPasswordConfirmMessage("정상 입력되었습니다.");
		setNewPasswordConfirmMessage("정상 입력되었습니다.");
		setNewPasswordChkConfirmMessage("정상 입력되었습니다.");
		setOldPasswordConfirmMessageColor('#43AB90');
		setNewPasswordConfirmMessageColor('#43AB90');
		setNewPasswordChkConfirmMessageColor('#43AB90');

		show({ 
			title: '비밀번호 변경',
			content: '비밀번호 변경하시겠습니까?\n변경 처리 후 로그인 상태는 유지됩니다.' ,
			cancelCallback: function() {
			},
			confirmCallback: async function() {
				updatePassword();
			}
		});

	}

	// ####################################################### 비밀번호 변경
	const updatePassword = async () => {
		const body = {
			old_password : oldPassword
			, new_password : newPassword
		};
		try {
		const { success, data } = await update_member_password(body);
		if(success) {
			switch (data.result_code) {
			case SUCCESS:
				show({
					title: '변경완료',
					content: '비밀번호 변경이 완료되었습니다.' ,
					confirmCallback: async function() {
						dispatch(myProfile());
						navigation.navigate(STACK.TAB, {
							screen: 'Roby',
						});
					}
				});
				break;
			case "8001":
				setIsOldPassword(true);
				setOldPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
				setOldPasswordConfirmMessageColor('#E04136');
				break;
			default:
				show({
				content: '오류입니다. 관리자에게 문의해주세요.' ,
				confirmCallback: function() {}
				});
				break;
			}
			
		} else {
			show({
			content: '오류입니다. 관리자에게 문의해주세요.' ,
			confirmCallback: function() {}
			});
		}
		} catch (error) {
		console.log(error);
		} finally {
		
		}
	};

	// ###################################################################### 탈퇴 버튼
	const btnDeleteMyAccount = async () => {
		show({
			title: '회원 탈퇴',
			content: '회원 탈퇴는 24시간 뒤 완료 처리되며, 암호화된\n모든 개인정보 및 보유한 아이템은 자동으로 폐기됩니다.\n단, 24시간 이내에 로그인 시 회원 탈퇴는 자동 철회 됩니다.',
			cancelCallback: function() {},
			confirmCallback: function() {
				exitProc();
			}
		});
	};
	
	// ###################################################################### 탈퇴 처리
	const exitProc = async () => {
		const { success, data } = await update_member_exit();
		if(success) {
			switch (data.result_code) {
				case SUCCESS:
					dispatch(clearPrincipal());
				break;
				default:
					show({ content: '오류입니다. 관리자에게 문의해주세요.' });
				break;
			}
		
		} else {
			show({ content: '오류입니다. 관리자에게 문의해주세요.' });
		}
	};

	// ####################################################### 최초 실행
	React.useEffect(() => {
		
	}, []);

	return (
		<>
			<CommonHeader title={'비밀번호 변경'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<View style={{paddingHorizontal: 10}}>
					<View style={layoutStyle.alignCenter}>
						<SpaceView mt={15}>
							<Image source={IMAGE.logoRenew} style={[styles.logo, {width: 151, height: 105}]} />
						</SpaceView>
						{/* <SpaceView mt={30}>
							<Image source={IMAGE.logoMarkRenew} style={styles.logoMark} />
						</SpaceView> */}
						{/* <SpaceView mb={15}>
							<Image source={IMAGE.logoText} style={styles.logo} resizeMode="contain" />
						</SpaceView> */}
					</View>

					<SpaceView mb={24} mt={60}>
						<CommonInput
							label="현재 비밀번호"
							value={oldPassword}
							onChangeText={(oldPassword) => setOldPassword(oldPassword)}
							isMasking={true}
							maxLength={20}

						/>
						{/* {isOldPassword && (<Text style={{color: oldPasswordConfirmMessageColor}}>{oldPasswordConfirmMessage}</Text>)} */}
						{oldPasswordConfirmMessage !== '' && (<Text style={{marginTop: 10, color: oldPasswordConfirmMessageColor}}>{oldPasswordConfirmMessage}</Text>)}
					</SpaceView>

					<SpaceView mb={24}>
						<CommonInput
							label="새 비밀번호 입력"
							value={newPassword}
							onChangeText={(newPassword) => setNewPassword(newPassword)}
							isMasking={true}
							maxLength={20}
							placeholderTextColor={'#c6ccd3'}
							placeholder={'영문, 숫자, 특수기호(!@#$%^*+=-) 포함 8글자 이상'}
							fontSize={15}
						/>
						{isNewPassword && (<Text style={{color: newPasswordConfirmMessageColor, marginTop: 10}}>{newPasswordConfirmMessage}</Text>)}
					</SpaceView>

					<SpaceView mb={24}>
						<CommonInput
							label="새 비밀번호 재입력"
							value={newPasswordChk}
							onChangeText={(newPasswordChk) => setNewPasswordChk(newPasswordChk)}
							isMasking={true}
							maxLength={20}
							placeholderTextColor={'#c6ccd3'}
							placeholder={'영문, 숫자, 특수기호(!@#$%^*+=-) 포함 8글자 이상'}
							fontSize={15}
						/>
						{isNewPasswordChk && (<Text style={{color: newPasswordChkConfirmMessageColor, marginTop: 10}}>{newPasswordChkConfirmMessage}</Text>)}
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView>
							<CommonBtn
								value={'비밀번호 변경'}
								type={'primary'}
								onPress={() => { 
									validatePassword();
								}}
							/>
						</SpaceView>
						<SpaceView mt={5}>
							<CommonBtn
								value={'탈퇴하기'}
								type={'primary'}
								onPress={() => { 
									btnDeleteMyAccount();
								}}
							/>
						</SpaceView>
					</SpaceView>
				</View>
			</ScrollView>
		</>
	);
};
