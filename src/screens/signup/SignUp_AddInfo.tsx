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
###### 회원가입 - 간편정보
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_AddInfo'>;
	route : RouteProp<StackParamList, 'SignUp_AddInfo'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_AddInfo = (props : Props) => {
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
					<SpaceView viewStyle={_styles.titleContainer}>
						<Image style={_styles.addInfoImg} />
						<Text style={_styles.title}><Text style={{color: '#F3E270'}}>닉네임</Text>님의{'\n'}간편소개 정보를{'\n'}선택해 주세요.</Text>
					</SpaceView>

					<SpaceView mt={30}>
						<View>
							<Text style={_styles.essentialTitle}>필수</Text>
						</View>
						<View style={_styles.underline}></View>
						<View style={_styles.essentialOption}>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>키(cm)</Text>
								<TextInput style={_styles.optionSelect}/>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>직업</Text>
								<TouchableOpacity style={[_styles.optionSelect, {marginLeft: 'auto', marginRight: 5}]}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>체형</Text>
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
						</View>
					</SpaceView>

					<SpaceView mt={20}>
						<View>
							<Text style={_styles.choiceTitle}>선택</Text>
						</View>
						<View style={_styles.underline}></View>
						<View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>선호지역</Text>
								<TouchableOpacity style={[_styles.optionSelect, {marginLeft: 'auto', marginRight: 5}]}><Text style={_styles.optionText}>선택</Text></TouchableOpacity> 
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>종교</Text>
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>음주</Text>
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>흡연</Text>
								<TouchableOpacity style={_styles.optionSelect}><Text style={_styles.optionText}>선택</Text></TouchableOpacity>
							</View>
						</View>
					</SpaceView>

					<SpaceView mt={30}>
						<CommonBtn
							value={'관심사 등록하기'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
							navigation.navigate({
									name : ROUTES.SIGNUP_INTEREST
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
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	title: {
		fontSize: 30,
		fontFamily: 'Pretendard-Bold',
		color: '#D5CD9E',
	},
	addInfoImg: {
		width: 110,
		height: 160,
		borderWidth: 2,
		borderColor: '#D5CD9E',
		borderRadius: 5,
		backgroundColor: '#FFF',
	},
	essentialCont : {

	},
	essentialTitle: {
		fontFamily: 'Pretendard-SemiBold',
		color: '#D5CD9E',
		fontSize: 20,
	},
	essentialOption: {

	},
	choiceCont: {

	},
	choiceTitle: {
		fontFamily: 'Pretendard-SemiBold',
		color: '#D5CD9E',
		fontSize: 20,
	},
	choiceOption: {

	},
	underline: {
		width: '100%',
		height: 1,
		backgroundColor: '#D5CD9E',
		marginTop: 10,
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
	},
	optionTitle: {
		fontFamily: 'Pretendard-Regular',
		color: '#F3E270',
	},
	optionText: {
		fontFamily: 'Pretendard-Light',
		color: '#E1DFD1',
		textAlign: 'center',
	},
	optionSelect: {
		width: 80,
		height: 30,
		backgroundColor:'#333B41',
		borderWidth: 1,
		borderColor: '#FFFDEC',
		borderRadius: 50,
		textAlign: 'center',
		color: '#F3E270',
		justifyContent: 'center',
	},
});