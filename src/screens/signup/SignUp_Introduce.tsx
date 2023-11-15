import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RadioCheckBox_2 } from 'component/RadioCheckBox_2';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { regist_introduce, get_member_introduce_guide } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonTextarea } from 'component/CommonTextarea';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';



/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 프로필 소개
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Introduce'>;
	route : RouteProp<StackParamList, 'SignUp_Introduce'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Introduce = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	return (
		<>
			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView>
					<SpaceView mt={20}>
						<Text style={_styles.title}><Text style={{color: '#F3E270'}}>닉네임</Text>님의{'\n'}프로필 소개 작성하기(선택)</Text>
					</SpaceView>

					<SpaceView mt={20}>
						<TextInput 
							placeholder='프로필 카드 상단에 공개되는 내 상세 소개 입력'
							placeholderTextColor={'#FFFDEC'}
							style={[_styles.textInputBox, {height: 110}]}
						/>
					</SpaceView>

					<SpaceView mt={20}>
						<SpaceView>
							<Text style={_styles.introduceText}>Q. 나의 이상형에 대해 구체적으로 알려주세요.</Text>
							<TextInput
								placeholder='인터뷰 답변 입력(가입 후 변경 가능)'
								placeholderTextColor={'#FFFDEC'}
								style={_styles.textInputBox}
							/>
						</SpaceView>
						<SpaceView mt={10}>
							<Text style={_styles.introduceText}>Q. 자랑하고 싶은 나의 장점은 무엇인가요.</Text>
							<TextInput
								placeholder='인터뷰 답변 입력(가입 후 변경 가능)'
								placeholderTextColor={'#FFFDEC'}
								style={_styles.textInputBox}
							/>
						</SpaceView>
						<SpaceView mt={10}>
							<Text style={_styles.introduceText}>Q. 최근에 하는 취미 활동이 있다면 무엇인가요?</Text>
							<TextInput
								placeholder='인터뷰 답변 입력(가입 후 변경 가능)'
								placeholderTextColor={'#FFFDEC'}
								style={_styles.textInputBox}
							/>
						</SpaceView>
					</SpaceView>

					<SpaceView mt={40}>
						<CommonBtn
							value={'멤버쉽 인증하기(선택)'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
							navigation.navigate({
									name : ROUTES.SIGNUP_AUTH
								});
							}}
						/>
					</SpaceView>

					<SpaceView mt={20}>
						<CommonBtn
							value={'이전으로'}
							type={'reNewGoBack'}
							isGradient={false}
							fontFamily={'Pretendard-Light'}
							fontSize={14}
							borderRadius={5}
							onPress={() => {
								navigation.navigate('Login');
							}}
						/>
					</SpaceView>
				</ScrollView>
			</LinearGradient>
		</>
	);
};



/* ################################################################################################################
###### Style 영역
################################################################################################################ */
const _styles = StyleSheet.create({
	wrap: {
		minHeight: height,
		padding: 30,
	},
	title: {
		fontSize: 30,
		fontFamily: 'Pretendard-Bold',
		color: '#D5CD9E',
	},
	textInputBox: {
		width: '100%',
		height: 70,
		backgroundColor: '#445561',
		borderRadius: 10,
		textAlign: 'center',
		fontFamily: 'Pretendard-Light',
		color: '#FFFDEC',
	},
	introduceText: {
		fontFamily: 'Pretendard-Regular',
		color: '#FFDD00',
		marginBottom: 10,
	},
});