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
import { regist_introduce, get_member_introduce_guide, get_common_code_list } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonTextarea } from 'component/CommonTextarea';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { useUserInfo } from 'hooks/useUserInfo';


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

	const [value, setValue] = React.useState<any>(null);
	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	const [business, setBusiness] = React.useState<any>('');
	const [local, setLocal] = React.useState<any>('');
	const memberBase = useUserInfo(); // 회원 기본정보

	// ############################################################ 업종 그룹 코드 목록
	const busiGrpCdList = [
		{ label: '일반', value: 'JOB_00' },
		{ label: '공군/군사', value: 'JOB_01' },
		{ label: '교육/지식/연구', value: 'JOB_02' },
		{ label: '경영/사무', value: 'JOB_03' },
		{ label: '기획/통계', value: 'JOB_04' },
		{ label: '건설/전기', value: 'JOB_05' },
		{ label: '금융/회계', value: 'JOB_06' },
		{ label: '기계/기술', value: 'JOB_07' },
		{ label: '보험/부동산', value: 'JOB_08' },
		{ label: '생활', value: 'JOB_09' },
		{ label: '식음료/여가/오락', value: 'JOB_10' },
		{ label: '법률/행정', value: 'JOB_11' },
		{ label: '생산/제조/가공', value: 'JOB_12' },
		{ label: '영업/판매/관리', value: 'JOB_13' },
		{ label: '운송/유통', value: 'JOB_14' },
		{ label: '예체능/예술/디자인', value: 'JOB_15' },
		{ label: '의료/건강', value: 'JOB_16' },
		{ label: '인터넷/IT', value: 'JOB_17' },
		{ label: '미디어', value: 'JOB_18' },
		{ label: '기타', value: 'JOB_19' },
	];

	// 직업 그룹 코드 목록
	const [jobCdList, setJobCdList] = React.useState([{ label: '', value: '' }]);

	// 출신지 지역 코드 목록
	const bLocalGrpCdList = [
	{ label: '서울', value: 'LOCA_00' },
	{ label: '경기', value: 'LOCA_01' },
	{ label: '충북', value: 'LOCA_02' },
	{ label: '충남', value: 'LOCA_03' },
	{ label: '강원', value: 'LOCA_04' },
	{ label: '경북', value: 'LOCA_05' },
	{ label: '경남', value: 'LOCA_06' },
	{ label: '전북', value: 'LOCA_07' },
	{ label: '전남', value: 'LOCA_08' },
	{ label: '제주', value: 'LOCA_09' },
	];

	// 직업 그룹 코드 목록
	const [bLocalCdList, setBLocalCdList] = React.useState([{ label: '', value: '' }]);

	// 남자 체형 항목 목록
	const manBodyItemList = [
	{ label: '보통', value: 'NORMAL' },
	{ label: '마른 체형', value: 'SKINNY' },
	{ label: '근육질', value: 'FIT' },
	{ label: '건장한', value: 'GIANT' },
	{ label: '슬림 근육', value: 'SLIM' },
	{ label: '통통한', value: 'CHUBBY' },
	];

	// 여자 체형 항목 목록
	const womanBodyItemList = [
	{ label: '보통', value: 'NORMAL' },
	{ label: '마른 체형', value: 'SKINNY' },
	{ label: '섹시한', value: 'SEXY' },
	{ label: '글래머', value: 'GLAMOUR' },
	{ label: '아담한', value: 'COMPACT' },
	{ label: '모델핏', value: 'MODEL' },
	{ label: '통통한', value: 'CHUBBY' },
	];

	// 종교 항목 목록
	const religionItemList = [
	{ label: '무교(무신론자)', value: 'NONE' },
	{ label: '무교(유신론자)', value: 'THEIST' },
	{ label: '기독교', value: 'JEJUS' },
	{ label: '불교', value: 'BUDDHA' },
	{ label: '이슬람', value: 'ALLAH' },
	{ label: '천주교', value: 'MARIA' },
	];

	// 음주 항목 목록
	const drinkItemList = [
	{ label: '안마심', value: 'NONE' },
	{ label: '가볍게 마심', value: 'LIGHT' },
	{ label: '자주 즐김', value: 'HARD' },
	];

	// 흡연 항목 목록
	const smokItemList = [
	{ label: '비흡연', value: 'NONE' },
	{ label: '가끔 흡연', value: 'LIGHT' },
	{ label: '자주 흡연', value: 'HARD' },
	];

	// ############################################################ 직업, 지역 코드 목록 조회 함수
	const getCommonCodeList = async (value: string) => {
		const isType = /JOB/.test(value);
		const body = {
			group_code: value,
		};
		try {
		setIsLoading(true);
		const { success, data } = await get_common_code_list(body);

		if(success) {
			switch (data.result_code) {
			case SUCCESS:
			let dataList = new Array();
			data.code_list?.map(
				({
				group_code,
				common_code,
				code_name,
				}: {
				group_code: any;
				common_code: any;
				code_name: any;
				}) => {
				let dataMap = { label: code_name, value: common_code };
				dataList.push(dataMap);
				}
			);
			if(isType) {
				setJobCdList(dataList);
			}else {
				setBLocalCdList(dataList);
			}
			
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
			setIsLoading(false);
		}

	};

	// 셀렉트 박스 콜백 함수
	const busiCdCallbackFn = (value: string) => {
		setBusiness(value);
		getCommonCodeList(value);
		setValue(value);
	};

	// 셀렉트 박스 콜백 함수
	const localCdCallbackFn = (value: string) => {
		setLocal(value);
		getCommonCodeList(value);
		setValue(value);
	};

	// 첫 렌더링 때 실행
	React.useEffect(() => {
	

	}, [isFocus]);

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
								<TextInput maxLength={3} style={_styles.optionSelect}/>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>직업</Text>
								<View style={{flexDirection: 'row', justifyContent: 'space-between', width: '74%'}}>
									<RNPickerSelect
										placeholder={{label: '선택', value: ''}}
										style={{
											inputIOS: {
												...pickerSelectStyles.inputIOS,
												width: 120,
											},
											inputAndroid: {
												...pickerSelectStyles.inputAndroid,
												width: 120,
											},
										}}
										useNativeAndroidPickerStyle={false}
										onValueChange={busiCdCallbackFn}
										items={busiGrpCdList}
									/>
									<RNPickerSelect
										placeholder={{label: '선택', value: ''}}
										style={{
											inputIOS: {
												...pickerSelectStyles.inputIOS,
												width: 120,
											},
											inputAndroid: {
												...pickerSelectStyles.inputAndroid,
												width: 120,
											},
										}}
										useNativeAndroidPickerStyle={false}
										onValueChange={(value) => setValue(value)}
										items={jobCdList}
									/>
								</View>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>체형</Text>
								<RNPickerSelect
									placeholder={{label: '선택', value: ''}}
									style={pickerSelectStyles}
									useNativeAndroidPickerStyle={false}
									onValueChange={(value) => setValue(value)}
									items={memberBase?.gender == 'M' ? manBodyItemList : womanBodyItemList}
								/>
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
								<View style={{flexDirection: 'row', justifyContent: 'space-between', width: '62%'}}>
									<RNPickerSelect
										placeholder={{label: '선택', value: ''}}
										style={pickerSelectStyles}
										useNativeAndroidPickerStyle={false}
										onValueChange={localCdCallbackFn}
										items={bLocalGrpCdList}
									/>
									<RNPickerSelect
										placeholder={{label: '선택', value: ''}}
										style={pickerSelectStyles}
										useNativeAndroidPickerStyle={false}
										onValueChange={(value) => setValue(value)}
										items={bLocalCdList}
									/>
								</View>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>종교</Text>
								<RNPickerSelect
									placeholder={{label: '선택', value: ''}}
									style={pickerSelectStyles}
									useNativeAndroidPickerStyle={false}
									onValueChange={(value) => setValue(value)}
									items={religionItemList}
								/>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>음주</Text>
								<RNPickerSelect
									placeholder={{label: '선택', value: ''}}
									style={pickerSelectStyles}
									useNativeAndroidPickerStyle={false}
									onValueChange={(value) => setValue(value)}
									items={drinkItemList}
								/>
							</View>
							<View style={_styles.option}>
								<Text style={_styles.optionTitle}>흡연</Text>
								<RNPickerSelect
									placeholder={{label: '선택', value: ''}}
									style={pickerSelectStyles}
									useNativeAndroidPickerStyle={false}
									onValueChange={(value) => setValue(value)}
									items={smokItemList}
								/>
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
		width: 100,
		height: 30,
		backgroundColor:'#445561',
		borderRadius: 50,
		textAlign: 'center',
		color: '#F3E270',
		justifyContent: 'center',
	},
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		width: 100,
		height: 30,
		backgroundColor:'#445561',
		borderRadius: 50,
		textAlign: 'center',
		color: '#F3E270',
		justifyContent: 'center',
	},
	inputAndroid: {
		width: 100,
		height: 30,
		backgroundColor:'#445561',
		borderRadius: 50,
		textAlign: 'center',
		color: '#F3E270',
		justifyContent: 'center',
	},
  });