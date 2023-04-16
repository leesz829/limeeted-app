import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonTextarea } from 'component/CommonTextarea';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import React, { memo, useEffect, useState } from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as properties from 'utils/properties';
import * as hooksMember from 'hooks/member';
import { insert_member_inquiry } from 'api/models';
import { usePopup } from 'Context';
import { SUCCESS } from 'constants/reusltcode';
import { STACK } from 'constants/routes';
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
	const { show } = usePopup(); // 공통 팝업

	const [title,    setTitle]    = React.useState('');
	const [contents, setContents] = React.useState('');
	
	const jwtToken  = hooksMember.getJwtToken();   // 토큰
	const memberSeq = hooksMember.getMemberSeq(); // 회원번호

	const [comfirmModalVisible, setComfirmModalVisible] = useState(false);
	
	// ################### 팝업 관련 #####################
	const [customerInquiryCompletePopup, setCustomerInquiryCompletePopup] = React.useState(false); // 문의 완료 팝업

	 // 문의 저장
	const insertCustomerInquiry = async () => {
		
		if(title.length < 10 || title.length > 30) {
			show({
				title: '알림',
				content: '제목은 10~30글자 이내로 입력해 주셔야해요.' ,
				confirmCallback: function() {

				}
			});

			return;
		}

		const body = {
			title: title
			, contents: contents
		};
		try {
			const { success, data } = await insert_member_inquiry(body);
			if(success) {
				switch (data.result_code) {
					case SUCCESS:
						show({
							title: '문의 완료',
							content: '문의하신 내용이 접수되었습니다.\n문의 내용은 관리자 확인 후 우편함으로\n답변드릴 예정입니다.' ,
							confirmCallback: function() {
								navigation.navigate(STACK.TAB, {
									screen: 'Roby',
								});
							}
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
	};

	

	return (
		<>
			<CommonHeader title={'고객문의'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView>
					<View style={layoutStyle.alignStart}>
						<CommonText	type={'h4'}	textStyle={_styles.titleText}>궁금한점, 불편한점{'\n'}저희에게 문의주세요 :)</CommonText>
					</View>
				</SpaceView>
				
				<SpaceView>
					<SpaceView>	
						<CommonInput
//							label={'제목'}
							value={title}
							onChangeText={(title) => setTitle(title)}
							placeholder={'문의 제목'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={30}
						/>
					</SpaceView>

					<SpaceView mb={15}>
						<CommonTextarea
//							label={'내용'} 
							value={contents}
							onChangeText={(contents) => setContents(contents)}
							placeholder={'문의 내용'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={240}
							exceedCharCountColor={'#990606'}
						/>
					</SpaceView>

					<SpaceView mb={16}>
          				<CommonBtn
            				value={'저장'}
            				type={'black'}
            				onPress={() => {
              					insertCustomerInquiry();
            				}}
          				/>
        			</SpaceView>

					<SpaceView mb={45}>
						<View style={_styles.bottomArea}>
							<CommonText type={'h3'} textStyle={_styles.bottomText}>등록해주신 문의내용은 관리자 확인 후 우편함으로 답변드립니다.</CommonText>
						</View>
					</SpaceView>
				</SpaceView>

			</ScrollView>
		</>
	);
};
const { width, height } = Dimensions.get('window');
const _styles = StyleSheet.create({
	titleText: {
		width: 250,
		height: 61,
		fontFamily: "AppleSDGothicNeoEB00",
		fontSize: 23,
		fontWeight: "normal",
		fontStyle: "normal",
		lineHeight: 30,
		color: "#333333"
	},
	bottomArea: {
		backgroundColor: '#F6F7FE',
		paddingHorizontal: 5,
		paddingVertical: 15,
		borderRadius: 20,
	},
	bottomText: {
		fontFamily: "AppleSDGothicNeoM00",
		fontSize: 13,
		fontWeight: "normal",
		fontStyle: "normal",
		letterSpacing: 0,
		textAlign: "center",
		color: "#C7C7C7",
		
	}
});

const modalStyleProduct = StyleSheet.create({
	modal: {
	  flex: 1,
	  margin: 0,
	  justifyContent: 'flex-end',
	},
	close: {
	  width: 19.5,
	  height: 19.5,
	},
	infoContainer: {
	  flex: 1,
	  backgroundColor: 'white',
	  marginTop: 13
	},
	rowBetween: {
	  flexDirection: `row`,
	  alignItems: `center`,
	  justifyContent: 'space-between',
	},
	modalStyle1: {
		width: width - 32,
		backgroundColor: 'white',
		borderRadius: 16,
		height: 215,
		paddingTop: 32,
		paddingLeft: 16,
		paddingRight: 16,
	  },
  });
