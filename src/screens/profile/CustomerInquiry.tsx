import { styles, modalStyle, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonTextarea } from 'component/CommonTextarea';
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
import * as mbrReducer from 'redux/reducers/mbrReducer';
import { clearPrincipal } from 'redux/reducers/authReducer';
//import Textarea from 'react-native-textarea';

/* ################################################################################################################
###################################################################################################################
###### 고객문의 화면
###################################################################################################################
################################################################################################################ */

interface Props {
	
}

export const CustomerInquiry = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [title,    setTitle]    = React.useState('');
	const [contents, setContents] = React.useState('');
	
	const jwtToken  = hooksMember.getJwtToken();   // 토큰
	const memberSeq = hooksMember.getMemberSeq(); // 회원번호
	
	// ################### 팝업 관련 #####################
	const [customerInquiryCompletePopup, setCustomerInquiryCompletePopup] = React.useState(false); // 문의 완료 팝업

	 // 문의 저장
	const insertCustomerInquiry = async () => {
		const result = await axios
		  .post(
			properties.api_domain + '/customerInquiry/insertCustomerInquiry',
			{
			  'api-key': 'U0FNR09CX1RPS0VOXzAx',
			  member_seq: memberSeq,
			  title     : title,
			  contents  : contents,
			},
			{
			  headers: {
				'jwt-token': jwtToken,
			  },
			}
		  )
		  .then(function (response) {
			if (response.data.result_code != '0000') {
				console.log(response.data.result_msg);
			  	return false;
			} else {
				setCustomerInquiryCompletePopup(true);
			}
		  })
		  .catch(function (error) {
			console.log('error ::: ', error);
		  });
	};

	// 문의 완료 팝업의 확인 버튼 클릭
	const insertCustomerInquiryComplete = async () => {
		setCustomerInquiryCompletePopup(false);
		navigation.navigate('Main', {
			screen: 'Roby',
		});
	};

	return (
		<>
			<CommonHeader title={'고객문의'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				
				<SpaceView>
					<SpaceView>	
						<CommonInput
							label={'제목'}
							value={title}
							onChangeText={(title) => setTitle(title)}
							placeholder={'제목을 입력해 주세요.'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={30}
						/>
					</SpaceView>

					<SpaceView mb={16}>
						<CommonTextarea
							label={'내용'} 
							value={contents}
							onChangeText={(contents) => setContents(contents)}
							placeholder={'내용을 입력해 주세요.'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={240}
							exceedCharCountColor={'#990606'}
						/>
					</SpaceView>

					<SpaceView mb={16}>
          				<CommonBtn
            				value={'문의하기'}
            				type={'primary'}
            				onPress={() => {
              					insertCustomerInquiry();
            				}}
          				/>
        			</SpaceView>

					<SpaceView mb={16}>
						<View style={layoutStyle.alignCenter}>
          					<CommonText type={'h3'}>등록해주신 문의내용은 관리자 확인 후{'\n'}
							우편함으로 답변드립니다.</CommonText>
        				</View>
					</SpaceView>
				</SpaceView>

				<Modal visible={customerInquiryCompletePopup} transparent={true}>
					<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								문의 완료
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>문의하신 내용이 접수되었습니다.{'\n'}
							문의 내용은 관리자 확인 후 우편함으로 답변드릴 예정입니다.
							</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<View style={modalStyle.modalBtnline} />
								<TouchableOpacity 
									style={modalStyle.modalBtn}
									onPress={() => insertCustomerInquiryComplete()}
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
