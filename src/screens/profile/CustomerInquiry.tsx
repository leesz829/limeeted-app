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
	
	// ################### 팝업 관련 #####################
	const [customerInquiryCompletePopup, setCustomerInquiryCompletePopup] = React.useState(false); // 문의 완료 팝업

	 // 문의 저장
	const insertCustomerInquiry = async () => {

		console.log('title :::::::: ', title.length);

		if(title.length < 10 || title.length > 30) {
			show({
				title: '알림',
				content: '제목은 10_30글자 이내로 입력해 주셔야해요.' ,
				confirmCallback: function() {

				}
			});
		}

		return;


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
				<SpaceView mb={25}>
					<View style={layoutStyle.alignStart}>
						<CommonText type={'h4'}>등록해주신 문의내용은 관리자 확인 후{'\n'}우편함으로 답변드립니다.</CommonText>
					</View>
				</SpaceView>
				
				<SpaceView>
					<SpaceView mb={25} pl={10} pr={10}>	
						<CommonInput
							label={'제목'}
							value={title}
							onChangeText={(title) => setTitle(title)}
							placeholder={'제목을 입력해 주세요.'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={30}
						/>
					</SpaceView>

					<SpaceView mb={35} pl={10} pr={10}>
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

					<SpaceView mb={16} pl={8} pr={8}>
          				<CommonBtn
            				value={'문의하기'}
            				type={'primary'}
            				onPress={() => {
              					insertCustomerInquiry();
            				}}
          				/>
        			</SpaceView>
				</SpaceView>

			</ScrollView>
		</>
	);
};
