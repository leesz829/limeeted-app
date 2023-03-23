import { styles, modalStyle, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import { usePopup } from 'Context';
import { REFUSE, SUCCESS, SUCESSION } from 'constants/reusltcode';
import { select_emailId_from_phoneNumber, select_password_from_emailId } from 'api/models';


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
	
	const { show } = usePopup();

	const jwtToken = hooksMember.getJwtToken(); // 토큰 추출
	
	// ################### 팝업 관련 #####################
	const [selectEmailIdPopup,  setSelectEmailIdPopup]  = React.useState(false); // 아이디 찾기 팝업
	const [selectPasswordPopup, setSelectPasswordPopup] = React.useState(false); // 비밀번호 찾기 팝업

	const dispatch   = useDispatch();
	const navigation = useNavigation<ScreenNavigationProp>();




	// ############################################# 아이디 찾기 전송 팝업
	const searchIdPopup = async () => {
		show({ 
		  content: '아이디 찾기' ,
		  cancelCallback: function() {
			
		  },
		  confirmCallback: async function() {
			btnSelectEmailIdFromPhoneNumber();
		  }
		});
	};

	// ############################################# 비밀번호 찾기 전송 팝업
	const searchPwdPopup = async () => {
		show({ 
		  content: '비밀번호 찾기' ,
		  cancelCallback: function() {
			
		  },
		  confirmCallback: async function() {
			btnSelectPasswordFromEmailId();
		  }
		});
	};

	// 아이디 찾기 버튼 클릭
	const btnSelectEmailIdFromPhoneNumber = async () => {
		const body = {
			phoneNumber: phoneNumber
		};
		
		try {
		  const { success, data } = await select_emailId_from_phoneNumber(body);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				show({
					content: data.emailId ,
					confirmCallback: function() {}
				});
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
	}

	// 비밀번호 찾기 버튼 클릭
	const btnSelectPasswordFromEmailId = async () => {
		const body = {
			emailId: emailId
		};
		
		try {
		  const { success, data } = await select_password_from_emailId(body);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				show({
					content: '비밀번호 발급 완료!' ,
					confirmCallback: function() {}
				});
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
	}

	return (
		<>
			<CommonHeader title={'아이디/비밀번호 찾기'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer, { justifyContent: 'space-between' }]}>

				<View>
					<View style={layoutStyle.alignCenter}>
						<SpaceView>
							<Image source={IMAGE.logoMark} style={styles.logoMark} resizeMode="contain" />
						</SpaceView>
						<SpaceView mb={15}>
							<Image source={IMAGE.logoText} style={styles.logo} resizeMode="contain" />
						</SpaceView>
					</View>

					<SpaceView mb={50}>
						<CommonInput
							label={'아이디 찾기'}
							value={phoneNumber}
							onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
							isMasking={true}
							maxLength={100}
							placeholder="휴대폰 번호를 입력해주세요."
							placeholderTextColor={'#c6ccd3'} />

						<View style={[_styles.inputBtn]}>
							<CommonBtn value={'전송'} type={'primary'} height={35} width={70} fontSize={13}
										onPress={() => {
											searchIdPopup();
											//setSelectEmailIdPopup(true)
										}} />
						</View>

						{/* <CommonInput
							label="아이디 찾기"
							placeholder="휴대폰 번호를 입력해주세요."
							value={phoneNumber}
							onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
							isMasking={true}
							maxLength={100}

						/>
						<CommonBtn value={'전송'} type={'purple'} onPress={() => setSelectEmailIdPopup(true)} /> */}
					</SpaceView>

					<SpaceView mb={24}>
						<CommonInput
							label={'비밀번호 찾기'}
							value={emailId}
							onChangeText={(emailId) => setEmailId(emailId)}
							placeholder="이메일을 입력해주세요."
							placeholderTextColor={'#c6ccd3'} />

						<View style={[_styles.inputBtn]}>
							<CommonBtn value={'전송'} type={'primary'} height={35} width={70} fontSize={13}
										onPress={() => {
											searchPwdPopup();
											//setSelectPasswordPopup(true)
										}} />
						</View>

						{/* <CommonInput
							label="비밀번호 찾기"
							placeholder="이메일을 입력해주세요."
							value={emailId}
							onChangeText={(emailId) => setEmailId(emailId)}
							isMasking={true}
							maxLength={13}

						/>
						<CommonBtn value={'전송'} type={'purple'} onPress={() => setSelectPasswordPopup(true)} /> */}
					</SpaceView>

				</View>

				<SpaceView mb={24}>
					<CommonBtn
						value={'로그인하기'}
						type={'primary'}
						onPress={() => {
							navigation.navigate('Login');
						}}
					/>
				</SpaceView>





				{/* <Modal visible={selectEmailIdPopup} transparent={true}>
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
									onPress={() => btnSelectEmailIdFromPhoneNumber()}
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
									onPress={() => btnSelectPasswordFromEmailId()}
								>
									<CommonText fontWeight={'500'}>
										찾기
									</CommonText>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>		 */}

			</ScrollView>
		</>
	);
};


const _styles = StyleSheet.create({
	inputBtn: {
	  position: 'absolute',
	  right: 0,
	  top: 12,
	  height: '100%',
	  justifyContent: 'center',
	},
  
  });