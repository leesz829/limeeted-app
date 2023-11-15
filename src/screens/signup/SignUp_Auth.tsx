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
###### 회원가입 - 프로필 인증
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Auth'>;
	route : RouteProp<StackParamList, 'SignUp_Auth'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Auth = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	const authInfoArr = ['직업', '학력', '소득', '자산', 'SNS', '차량'];
	const data = [0];

	return (
		<>

			<SpaceView mt={20} viewStyle={{backgroundColor: '#445561', padding: 30}}>
				<Text style={_styles.title}>멤버쉽 인증하고{'\n'}내 강점을 드러내기(선택)</Text>
				<Text style={_styles.subTitle}>
					아래 가이드를 참고하시고 멤버쉽 인증 자료를 올려 주세요.{'\n'}
					심사 기준에 따라 프로필에 인증 뱃지가 부여되며{'\n'}
					이성과의 매칭에 유리할 수 있습니다.
				</Text>
				<ScrollView horizontal={true} contentContainerStyle={{justifyContent: 'space-between', width: width * 1.2}}>
					{authInfoArr.map((item, index) => (
						<TouchableOpacity style={_styles.authBox} key={index}>
							<Text style={_styles.authBoxTitle}>{item}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</SpaceView>

			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView contentContainerStyle={{height: height * 1.2}}>
					<View>
						<View style={_styles.authBoxStatus}><Text style={_styles.statusText}>승인</Text></View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>			
							<Text style={_styles.contentsSubtitle}>• 소득 금액 증명원, 근로 소득 원천 징수증, 부가 가치세 증명원, 기타소득 입증자료, 근로계약서</Text>
							<View style={_styles.uploadBoxContainer}>
								{[0, 1, 2].map(() => (
									<TouchableOpacity style={_styles.uploadBox}>
										<Image source={ICON.cloudUpload} style={styles.iconSize32} />
									</TouchableOpacity>
								))}
							</View>
						</View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>인증 소개글(선택)</Text>
							</View>
							<TextInput 
								placeholder='인증 소개글 입력(가입 후 변경 가능)'
								placeholderTextColor={'#FFFDEC'}
								style={_styles.inputContainer}
							/>
						</View>

						<View>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>
							<FlatList
								data={data}
								renderItem={renderItem}
							/>
						</View>
					</View>

					<SpaceView mt={50}>
						<CommonBtn
							value={'가입 신청하기'}
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

	function renderItem(item) {
		
		return (
			<>
				<View style={_styles.authInfoContainer}>
					<View style={[_styles.authInfoBox, {backgroundColor: '#3D4348'}]}>
						<Text style={_styles.authInfoTitle}>레벨</Text>
						<Text style={_styles.authInfoTitle}>연봉</Text>
						<Text style={_styles.authInfoTitle}>연소득</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>1</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>3,000</Text>
						<Text style={_styles.authInfoSubTitle}>4,000</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>2</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>5,000</Text>
						<Text style={_styles.authInfoSubTitle}>6,000</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>3</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>6,000</Text>
						<Text style={_styles.authInfoSubTitle}>7,000</Text>
					</View>
				</View>
			</>
		)
	};
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
	subTitle: {
		fontSize: 12,
		fontFamily: 'Pretendard-Light',
		color: '#F3E270',
		marginTop: 5,
	},
	authBox: {
		marginTop: 20,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#D5CD9E',
	},
	authBoxTitle: {
		fontFamily: 'AppleSDGothicNeoB00',
		fontSize: 16,
		color: '#D5CD9E',
		textAlign: 'center',
		paddingHorizontal: 20,
		paddingVertical: 3,
	},
	authBoxStatus: {
		position: 'absolute',
		top: 0,
		right: 10,
		width: 40,
		height: 20,
		borderRadius: 5,
		backgroundColor: '#FFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusText: {
		fontFamily: 'AppleSDGothicNeoEB00',
		fontSize: 10,
		color: '#15F3DC',
	},
	contentsTitle: {
		fontFamily: 'Pretendard-Regular',
		fontSize: 15,
		color: '#FFDD00',
		marginLeft: 5,
	},
	contentsSubtitle: {
		fontFamily: 'Pretendard-Regular',
		color: '#D5CD9E',
		fontSize: 14,
		marginTop: 10,
	},
	uploadBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	uploadBox: {
		width: 100,
		height: 100,
		borderWidth: 1,
		borderColor: '#E1DFD1',
		borderRadius: 10,
		borderStyle: 'dashed',
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		backgroundColor: '#445561',
		height: 80,
		borderRadius: 10,
		textAlign: 'center',
		marginTop: 10,
		color: '#FFFDEC',
	},
	authInfoContainer: {
		width: '100%',
		borderRadius: 15,
		overflow: 'hidden',
		marginTop: 20,
	},
	authInfoBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	authInfoTitle: {
		fontFamily: 'Pretendard-SemiBold',
		fontSize: 15,
		color: '#FFDD00',
	},
	authInfoSubTitle: {
		fontFamily: 'Pretendard-Regular',
		fontSize: 15,
		color: '#D5CD9E',
	},
});