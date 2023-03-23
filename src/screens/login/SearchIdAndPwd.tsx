import { styles, modalStyle, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import React, { useEffect } from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
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

	const dispatch   = useDispatch();
	const navigation = useNavigation<ScreenNavigationProp>();

	const { show } = usePopup();
	const isFocus = useIsFocused();

	// 아이디 찾기 결과 메시지
	const [searchIdResult, setSearchIdResult] = React.useState({
		code : String
		, message : String
		, textColor : String
	})

	// 비밀번호 전송 결과 메시지
	const [searchPwdResult, setSearchPwdResult] = React.useState({
		code : String
		, message : String
		, textColor : String
	})

	const [phoneNumber,	setPhoneNumber] = React.useState('');
	const [emailId,    	setEmailId]     = React.useState('');
	
	// ################### 팝업 관련 #####################
	const [selectEmailIdPopup,  setSelectEmailIdPopup]  = React.useState(false); // 아이디 찾기 팝업
	const [selectPasswordPopup, setSelectPasswordPopup] = React.useState(false); // 비밀번호 찾기 팝업
	

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
		if(phoneNumber == '') {
			setSearchIdResult({
				code: '9999'
				, message: '휴대폰 번호를 입력해주세요.'
				, textColor: '#8854D2'
			});

			return;
		}

		const body = {
			phoneNumber: phoneNumber
		};
		try {
		  const { success, data } = await select_emailId_from_phoneNumber(body);
		  console.log(data);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				setSearchIdResult({
					code: data.result_code
					, message: data.email_id
					, textColor: '#43AB90'
				});
				break;
			  default:
				setSearchIdResult({
					code: data.result_code
					, message: '존재하지 않은 전화번호 입니다.'
					, textColor: '#E04136'
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
		if(emailId == '') {
			setSearchPwdResult({
				code: '9999'
				, message: '이메일을 입력해주세요.'
				, textColor: '#43AB90'
			});

			return;
		}

		const body = {
			emailId: emailId
		};
		try {
		  const { success, data } = await select_password_from_emailId(body);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				setSearchPwResult({
					code: data.result_code
					, message: '새 비밀번호가 전송되었습니다.'
					, textColor: '#E04136'
				});
				break;
			  default:
				setSearchPwResult({
					code: data.result_code
					, message: '존재하지 않은 이메일 입니다.'
					, textColor: '#E04136'
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



	// ####################################################### 아이디 입력 effect
	React.useEffect(() => {
		if (phoneNumber.length === 10) {
			setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'))
		} else if (phoneNumber.length === 13) {
			setPhoneNumber(phoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
		}
	}, [phoneNumber]);

	// ####################################################### 최초 실행
	React.useEffect(() => {
		//setSearchResultCode('');
		//setSearchId('');
	}, [isFocus]);


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

						<View>
							<CommonInput
								label={'아이디 찾기'}
								value={phoneNumber}
								onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
								isMasking={false}
								maxLength={13}
								placeholder="휴대폰 번호를 입력해주세요."
								placeholderTextColor={'#c6ccd3'} />

							<View style={[_styles.inputBtn]}>
								<CommonBtn value={'찾기'} type={'primary'} height={35} width={70} fontSize={13}
											onPress={() => {
												btnSelectEmailIdFromPhoneNumber();
												//searchIdPopup();
												//setSelectEmailIdPopup(true)
											}} />
							</View>
						</View>

						<View>
							{searchIdResult.code != null ? (
								<Text style={{color: searchIdResult.textColor, marginTop: 10}}>{searchIdResult.message}</Text>
							) : null}
						</View>
						
					</SpaceView>
					

					<SpaceView mb={24}>
						
						<View>
							<CommonInput
								label={'비밀번호 찾기'}
								value={emailId}
								onChangeText={(emailId) => setEmailId(emailId)}
								placeholder="이메일을 입력해주세요."
								placeholderTextColor={'#c6ccd3'} />

							<View style={[_styles.inputBtn]}>
								<CommonBtn value={'전송'} type={'primary'} height={35} width={70} fontSize={13}
											onPress={() => {
												btnSelectPasswordFromEmailId();
												//searchPwdPopup();
												//setSelectPasswordPopup(true)
											}} />
							</View>
						</View>

						<View>
							{searchPwdResult.code != null ? (
								<Text style={{color: searchPwdResult.textColor, marginTop: 10}}>{searchPwdResult.message}</Text>
							) : null}
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
						value={'로그인 하기'}
						type={'primary'}
						onPress={() => {
							navigation.navigate('Login');
						}}
					/>
				</SpaceView>
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