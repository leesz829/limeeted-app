import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, AsyncStorage } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp} from '@types';
import axios from 'axios';
import * as properties from 'utils/properties';

/* ################################################################################################################
###################################################################################################################
###### 내 소개하기
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Introduce'>;
	route : RouteProp<StackParamList, 'Introduce'>;
}

export const Introduce = (props : Props) => {

	const navigation = useNavigation<ScreenNavigationProp>();

	const [introduce_comment, setIntroduce_comment] = React.useState<any>(props.route.params.introduce_comment);
	const [business, setBusiness] = React.useState<any>(props.route.params.business);
	const [job, setJob] = React.useState<any>(props.route.params.job);
	const [job_name, setJob_name] = React.useState<any>(props.route.params.job_name);
	//const [birthLocal, setBirthLocal] = React.useState(props.route.params.birth_local);
	//const [activeLocal, setActiveLocal] = React.useState(props.route.params.active_local);
	const [height, setHeight] = React.useState<any>(props.route.params.height);
	const [form_body, setForm_body] = React.useState<any>(props.route.params.form_body);
	const [religion, setReligion] = React.useState<any>(props.route.params.religion);
	const [drinking, setDrinking] = React.useState<any>(props.route.params.drinking);
	const [smoking, setSmoking] = React.useState<any>(props.route.params.smoking);

	const [memberInfo, setMemberInfo] = React.useState({
		comment : String
	});

	// 업종 그룹 코드 목록
	const busiGrpCdList = [
		{label: '일반', value: 'JOB_00' },
		{label: '공군/군사', value: 'JOB_01' },
		{label: '교육/지식/연구', value: 'JOB_02' },
		{label: '경영/사무', value: 'JOB_03' },
		{label: '기획/통계', value: 'JOB_04' },
		{label: '건설/전기', value: 'JOB_05' },
		{label: '금융/회계', value: 'JOB_06' },
		{label: '기계/기술', value: 'JOB_07' },
		{label: '보험/부동산', value: 'JOB_08' },
		{label: '생활', value: 'JOB_09' },
		{label: '식음료/여가/오락', value: 'JOB_10' },
		{label: '법률/행정', value: 'JOB_11' },
		{label: '생산/제조/가공', value: 'JOB_12' },
		{label: '영업/판매/관리', value: 'JOB_13' },
		{label: '운송/유통', value: 'JOB_14' },
		{label: '예체능/예술/디자인', value: 'JOB_15' },
		{label: '의료/건강', value: 'JOB_16' },
		{label: '인터넷/IT', value: 'JOB_17' },
		{label: '미디어', value: 'JOB_18' },
		{label: '기타', value: 'JOB_19' },
	];

	// 직업 그룹 코드 목록
	const [jobCdList, setJobCdList] = React.useState([{	label: '', value: '' }]);

	// 출신지 지역 코드 목록
	const bLocalGrpCdList = [
		{label: '서울', value: 'LOCA_00' },
		{label: '경기', value: 'LOCA_01' },
		{label: '충북', value: 'LOCA_02' },
		{label: '충남', value: 'LOCA_03' },
		{label: '강원', value: 'LOCA_04' },
		{label: '경북', value: 'LOCA_05' },
		{label: '경남', value: 'LOCA_06' },
		{label: '전북', value: 'LOCA_07' },
		{label: '전남', value: 'LOCA_08' },
		{label: '제주', value: 'LOCA_09' }
	];

	// 활동지 항목 목록

	// 체형 항목 목록
	const bodyItemList = [
		{label: '보통', value: 'NORMAL'},
		{label: '마른 체형', value: 'SKINNY'},
		{label: '근육질', value: 'FIT'},
		{label: '건장한', value: 'GIANT'}
	];

	// 종교 항목 목록
	const religionItemList = [
		{label: '무교', value: 'NONE'},
		{label: '기독교', value: 'JEJUS'},
		{label: '불교', value: 'BUDDHA'},
		{label: '이슬람', value: 'ALLAH'},
		{label: '천주교', value: 'MARIA'}
	];

	// 음주 항목 목록
	const drinkItemList = [
		{label: '안마심', value: 'NONE'},
		{label: '가볍게 마심', value: 'LIGHT'},
		{label: '자주 즐김', value: 'HARD'}
	];

	// 흡연 항목 목록
	const smokItemList = [
		{label: '비흡연', value: 'NONE'},
		{label: '가끔 흡연', value: 'LIGHT'},
		{label: '자주 흡연', value: 'HARD'}
	];

	// 직업 코드 목록 조회 함수
	const getJobCodeList = async () => {
		const result = await axios.post(properties.api_domain + '/common/selectGroupCodeList', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'group_code' : business
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {			
			if(response.data.result_code != '0000') {
				console.log(response.data.result_msg);
				return false;
			} else {
				if(null != response.data.result) {
					let dataList = new Array();
					response.data?.result?.map(({ group_code, common_code, code_name }: { group_code: any, common_code: any, code_name: any }) => {
						let dataMap = {label: code_name, value: common_code};
						dataList.push(dataMap);
					});
					setJobCdList(dataList);
				}
			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 내 소개하기 저장
	const saveMemberAddInfo = async () => {
		const result = await axios.post(properties.api_domain + '/member/saveMemberAddInfo'
		, {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : props.route.params.member_seq
			, 'introduce_comment' : introduce_comment
			, 'business' : business
			, 'job' : job
			, 'job_name' : job_name
			, 'height' : height
			, 'form_body' : form_body
			, 'religion' : religion
			, 'drinking' : drinking
			, 'smoking' : smoking
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {
			console.log("job code :::: ", response.data);

			if(response.data.result_code != '0000') {
				console.log(response.data.result_msg);
				return false;
			} else {
				//props.route.params.callbackFn();

				AsyncStorage.setItem('memberBase', JSON.stringify(response.data.memberBase));

				navigation.navigate('Main', {
					screen: 'Roby',
					params: {
						memberBase: response.data.memberBase
					}
				});
			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 셀렉트 박스 콜백 함수
	const busiCdCallbackFn = (value : string) => { setBusiness(value); };
	const jobCdCallbackFn = (value : string) => { setJob(value); };
	const bodyCdCallbackFn = (value : string) => { setForm_body(value); };
	const religionCdCallbackFn = (value : string) => { setReligion(value); };
	const drinkCdCallbackFn = (value : string) => { setDrinking(value); };
	const smokCdCallbackFn = (value : string) => { setSmoking(value); };

	// 첫 렌더링 때 실행
	React.useEffect(() => {
		if(business != '') { getJobCodeList(); }
	}, []);

	// 업종 상태 관리
	React.useEffect(() => {	if(business != '') { getJobCodeList(); } }, [business]);

	return (
		<>
			<CommonHeader title={'내 소개하기'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={24}>
					<CommonInput 
							label={'한줄 소개'}
							value={introduce_comment} 
							onChangeText={introduce_comment => setIntroduce_comment(introduce_comment)} />
				</SpaceView>

				<SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'업종'} items={busiGrpCdList} selectValue={business} callbackFn={busiCdCallbackFn} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={'직업'} items={jobCdList} selectValue={job} callbackFn={jobCdCallbackFn} />
					</View>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput 
							label={'회사명'} 
							value={job_name} 
							onChangeText={jobName => setJob_name(jobName)} />
				</SpaceView>

				{/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'출신지'} items={bLocalGrpCdList} setValue={bir} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView> */}

				{/* <SpaceView mb={24} viewStyle={styles.halfContainer}>
					<View style={styles.halfItemLeft}>
						<CommonSelect label={'활동지역'} />
					</View>

					<View style={styles.halfItemRight}>
						<CommonSelect label={''} />
					</View>
				</SpaceView> */}

				<SpaceView mb={24}>
					<CommonInput 
							label={'키'} 
							value={height} 
							onChangeText={height => setHeight(height)} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'체형'} items={bodyItemList} selectValue={form_body} callbackFn={bodyCdCallbackFn} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'종교'} items={religionItemList} selectValue={religion} callbackFn={religionCdCallbackFn} />
				</SpaceView>

				<SpaceView mb={24}>
					<CommonSelect label={'음주'} items={drinkItemList} selectValue={drinking} callbackFn={drinkCdCallbackFn} />
				</SpaceView>

				<SpaceView mb={40}>
					<CommonSelect label={'흡연'} items={smokItemList} selectValue={smoking} callbackFn={smokCdCallbackFn} />
				</SpaceView>

				<SpaceView mb={16}>
					<CommonBtn 
						value={'저장'} 
						type={'primary'} 
						onPress={() => {
							saveMemberAddInfo();
						}}
					/>
				</SpaceView>
			</ScrollView>
		</>
	);
};
