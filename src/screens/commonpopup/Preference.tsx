import { useRef } from 'react';
import { Image, ScrollView, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Modalize } from 'react-native-modalize';
import type { FC, useState, useEffect } from 'react';
import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp } from '@types';
import CommonHeader from 'component/CommonHeader';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSelect } from 'component/CommonSelect';
import { CommonInput } from 'component/CommonInput';
import axios from 'axios';
import * as properties from 'utils/properties';
import { Color } from 'assets/styles/Color';
import AsyncStorage from '@react-native-community/async-storage';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';


/* ################################################################################################################
###################################################################################################################
###### 내 선호 이성
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Preference'>;
	route: RouteProp<StackParamList, 'Preference'>;
}

export const Preference = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const isFocus = useIsFocused();
	const dispatch = useDispatch();

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	const mbrBase = JSON.parse(hooksMember.getBase());
	const mbrIdealType = JSON.parse(hooksMember.getIdealType());

	const [idealTypeSeq, setIdealTypeSeq] = React.useState<any>(mbrIdealType?.ideal_type_seq);
	const [wantLocal1, setWantLocal1] = React.useState<any>(mbrIdealType?.want_local1);
	const [wantLocal2, setWantLocal2] = React.useState<any>(mbrIdealType?.want_local2);
	const [wantAgeMin, setWantAgeMin] = React.useState<any>(mbrIdealType?.want_age_min);
	const [wantAgeMax, setWantAgeMax] = React.useState<any>(mbrIdealType?.want_age_max);
	const [wantBusiness1, setWantBusiness1] = React.useState<any>(mbrIdealType?.want_business1);
	const [wantBusiness2, setWantBusiness2] = React.useState<any>(mbrIdealType?.want_business2);
	const [wantBusiness3, setWantBusiness3] = React.useState<any>(mbrIdealType?.want_business3);
	const [wantJob1, setWantJob1] = React.useState<any>(mbrIdealType?.want_job1);
	const [wantJob2, setWantJob2] = React.useState<any>(mbrIdealType?.want_job2);
	const [wantJob3, setWantJob3] = React.useState<any>(mbrIdealType?.want_job3);
	const [wantPerson1, setWantPerson1] = React.useState<any>(mbrIdealType?.want_person1);
	const [wantPerson2, setWantPerson2] = React.useState<any>(mbrIdealType?.want_person2);
	const [wantPerson3, setWantPerson3] = React.useState<any>(mbrIdealType?.want_person3);

	// 업종 그룹 코드 목록
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
	const [jobCdList1, setJobCdList1] = React.useState([{ label: '', value: '' }]);
	const [jobCdList2, setJobCdList2] = React.useState([{ label: '', value: '' }]);
	const [jobCdList3, setJobCdList3] = React.useState([{ label: '', value: '' }]);

	// 여자 인상 항목 목록
	const gFaceItemList = [
		{ label: '다정해보여요', value: 'FACE_G_01' },
		{ label: '웃는게 예뻐요', value: 'FACE_G_02' },
		{ label: '스타일이 남달라요', value: 'FACE_G_03' },
		{ label: '피부가 좋아요', value: 'FACE_G_04' },
		{ label: '눈이 예뻐요', value: 'FACE_G_05' },
		{ label: '현모양처상', value: 'FACE_G_06' },
	];

	// 남자 인상 항목 목록
	const mFaceItemList = [
		{ label: '다정해보여요', value: 'FACE_M_01' },
		{ label: '패션 감각이 좋아 보여요', value: 'FACE_M_02' },
		{ label: '피부가 좋아요', value: 'FACE_M_03' },
		{ label: '오똑한 콧날', value: 'FACE_M_04' },
		{ label: '넓은 어깨', value: 'FACE_M_05' },
		/* { label: '요섹남', value: 'FACE_M_06' }, */
	];

	// 직업 코드 목록 조회 함수
	const getJobCodeList = async (type: string) => {
		let paramBusinessCd = '';

		if (type == '01') {
			paramBusinessCd = wantBusiness1;
		} else if (type == '02') {
			paramBusinessCd = wantBusiness2;
		} else if (type == '03') {
			paramBusinessCd = wantBusiness3;
		}

		const result = await axios
			.post(
				properties.api_domain + '/common/selectCommonCodeList',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					group_code: paramBusinessCd,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				if (response.data.result_code != '0000') {
					console.log('fail ::: ', response.data.result_msg);
					return false;
				} else {
					if (null != response.data.result) {
						let dataList = new Array();
						response.data?.result?.map(
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
							},
						);

						if (type == '01') {
							setJobCdList1(dataList);
						} else if (type == '02') {
							setJobCdList2(dataList);
						} else if (type == '03') {
							setJobCdList3(dataList);
						}
					}
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 내 선호이성 저장
	const saveMemberIdealType = async () => {
		const result = await axios
			.post(
				properties.api_domain + '/member/saveMemberIdealType',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					member_seq: memberSeq,
					ideal_type_seq: idealTypeSeq,
					want_local1: wantLocal1,
					want_local2: wantLocal2,
					want_age_min: wantAgeMin,
					want_age_max: wantAgeMax,
					want_business1: wantBusiness1,
					want_business2: wantBusiness2,
					want_business3: wantBusiness3,
					want_job1: wantJob1,
					want_job2: wantJob2,
					want_job3: wantJob3,
					want_person1: wantPerson1,
					want_person2: wantPerson2,
					want_person3: wantPerson3,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				if (response.data.result_code != '0000') {
					console.log(response.data.result_msg);
					return false;
				} else {
					dispatch(mbrReducer.setIdealType(JSON.stringify(response.data.member_ideal_type)));

					navigation.navigate('Main', {
						screen: 'Roby'
					});
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 셀렉트 박스 콜백 함수
	const busi1CallbackFn = (value: string) => {
		setWantBusiness1(value);
	};
	const busi2CallbackFn = (value: string) => {
		setWantBusiness2(value);
	};
	const busi3CallbackFn = (value: string) => {
		setWantBusiness3(value);
	};
	const jobCd1CallbackFn = (value: string) => {
		setWantJob1(value);
	};
	const jobCd2CallbackFn = (value: string) => {
		setWantJob2(value);
	};
	const jobCd3CallbackFn = (value: string) => {
		setWantJob3(value);
	};
	const wantPerson1CallbackFn = (value: string) => {
		setWantPerson1(value);
	};
	const wantPerson2CallbackFn = (value: string) => {
		setWantPerson2(value);
	};
	const wantPerson3CallbackFn = (value: string) => {
		setWantPerson3(value);
	};

	// 첫 렌더링 때 실행
	React.useEffect(() => {
		
	}, []);

	// 업종 상태 관리
	React.useEffect(() => {
		if (wantBusiness1 != '' && typeof wantBusiness1 !== 'undefined') {
			getJobCodeList('01');
		}
	}, [wantBusiness1]);
	React.useEffect(() => {
		if (wantBusiness2 != '' && typeof wantBusiness2 !== 'undefined') {
			getJobCodeList('02');
		}
	}, [wantBusiness2]);
	React.useEffect(() => {
		console.log('1212131');
		if (wantBusiness3 != '' && typeof wantBusiness3 !== 'undefined') {
			getJobCodeList('03');
		}
	}, [wantBusiness3]);

	return (
		<>
			<CommonHeader title={'내 선호 이성'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h4'}>
							나이
						</CommonText>
					</SpaceView>

					<SpaceView viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonInput
								label={'최소'}
								keyboardType="number-pad"
								value={wantAgeMin}
								onChangeText={(wantAgeMin) => setWantAgeMin(wantAgeMin)}
								maxLength={2}
								placeholder={'ex) 22'}
								placeholderTextColor={'#c6ccd3'}
							/>
						</View>

						<View style={styles.halfItemRight}>
							<CommonInput
								label={'최대'}
								keyboardType="number-pad"
								value={wantAgeMax}
								onChangeText={(wantAgeMax) => setWantAgeMax(wantAgeMax)}
								maxLength={2}
								placeholder={'ex) 35'}
								placeholderTextColor={'#c6ccd3'}
							/>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h4'}>
							거리
						</CommonText>
					</SpaceView>

					<SpaceView viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonInput
								label={'최소(km)'}
								keyboardType="number-pad"
								value={wantLocal1}
								onChangeText={(wantLocal1) => setWantLocal1(wantLocal1)}
								maxLength={2}
								placeholder={'ex) 1'}
								placeholderTextColor={'#c6ccd3'}
							/>
						</View>

						<View style={styles.halfItemRight}>
							<CommonInput
								label={'최대(km)'}
								keyboardType="number-pad"
								value={wantLocal2}
								onChangeText={(wantLocal2) => setWantLocal2(wantLocal2)}
								maxLength={2}
								placeholder={'ex) 50'}
								placeholderTextColor={'#c6ccd3'}
							/>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={32}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h4'}>
							직업
						</CommonText>
					</SpaceView>
					<SpaceView mb={24} viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonSelect
								label={'업종'}
								items={busiGrpCdList}
								selectValue={wantBusiness1}
								callbackFn={busi1CallbackFn}
							/>
						</View>
						<View style={styles.halfItemRight}>
							<CommonSelect
								label={'직업'}
								items={jobCdList1}
								selectValue={wantJob1}
								callbackFn={jobCd1CallbackFn}
							/>
						</View>
					</SpaceView>
					<SpaceView mb={24} viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonSelect
								label={'업종'}
								items={busiGrpCdList}
								selectValue={wantBusiness2}
								callbackFn={busi2CallbackFn}
							/>
						</View>
						<View style={styles.halfItemRight}>
							<CommonSelect
								label={'직업'}
								items={jobCdList2}
								selectValue={wantJob2}
								callbackFn={jobCd2CallbackFn}
							/>
						</View>
					</SpaceView>
					<SpaceView viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							<CommonSelect
								label={'업종'}
								items={busiGrpCdList}
								selectValue={wantBusiness3}
								callbackFn={busi3CallbackFn}
							/>
						</View>
						<View style={styles.halfItemRight}>
							<CommonSelect
								label={'직업'}
								items={jobCdList3}
								selectValue={wantJob3}
								callbackFn={jobCd3CallbackFn}
							/>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h4'}>
							인상
						</CommonText>
					</SpaceView>
					<SpaceView mb={24}>
						<CommonSelect
							label={'인상'}
							items={mbrBase.gender == 'M' ? gFaceItemList : mFaceItemList}
							selectValue={wantPerson1}
							callbackFn={wantPerson1CallbackFn}
						/>
					</SpaceView>
					<SpaceView mb={24}>
						<CommonSelect
							label={'인상'}
							items={mbrBase.gender == 'M' ? gFaceItemList : mFaceItemList}
							selectValue={wantPerson2}
							callbackFn={wantPerson2CallbackFn}
						/>
					</SpaceView>
					<SpaceView>
						<CommonSelect
							label={'인상'}
							items={mbrBase.gender == 'M' ? gFaceItemList : mFaceItemList}
							selectValue={wantPerson3}
							callbackFn={wantPerson3CallbackFn}
						/>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn
						value={'저장'}
						type={'primary'}
						onPress={() => {
							saveMemberIdealType();
						}}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};

const styles1 = StyleSheet.create({
	selectImgContainer: {
		position: 'absolute',
		height: '100%',
		justifyContent: 'center',
		right: 16,
	},
	selectContainer: {},
	labelContainer: {
		marginBottom: 8,
	},
	labelStyle: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: 'AppleSDGothicNeoR00',
		color: Color.gray6666,
		marginBottom: 8,
	},
	inputContainer: {
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: Color.grayDDDD,
	},
	icon: {
		width: 16,
		height: 16,
		transform: [{ rotate: '90deg' }],
	},
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM00',
		padding: 0,
		marginTop: 8,
	},
	inputAndroid: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM00',
		padding: 0,
	},
});
