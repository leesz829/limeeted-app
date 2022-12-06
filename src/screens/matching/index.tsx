import * as React from 'react';
import { useState, useEffect, useRef} from 'react';
import { Image, ScrollView, View, TouchableOpacity, Alert} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle} from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ViualSlider } from 'component/ViualSlider';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import * as properties from 'utils/properties';
import { ColorType, ScreenNavigationProp, BottomParamList, Interview, ProfileImg, FileInfo, MemberBaseData, CommonCode, LabelObj} from '@types';
import { Modalize } from 'react-native-modalize';
import { CommonCheckBox } from 'component/CommonCheckBox';
import axios from 'axios';
import { MatchSearch } from 'screens/matching/MatchSearch';

import * as hooksMember from 'hooks/member';

/* ################################################################################################################
###### 매칭 화면
################################################################################################################### */
interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Matching = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const isFocus = useIsFocused();

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	// 매칭 회원 관련 데이터
	const [data, setData] = useState<any>({
		memberBase: {}
		, profileImgList: []
		, secondAuthList: []
		, interviewList: []
		, reportTypeList: []
		, checkReportType: []
	});


	
	// 매치 회원 정보
	const [matchMemberData, setMatchMemberData] = useState(MemberBaseData);

	// 인터뷰 정보
	const [interviewList, setInterviewList] = useState([Interview]);

	// 2차인증 정보 
	const [secondAuthList, setSecondAuthList] = useState([{'second_auth_code':''}]);

	// 회원 인상 정보
	const [profileImgList, setProfileImgList] = useState([ProfileImg]);

	// 신고목록
	const [reportTypeList, setReportTypeList] = useState([{text: '', value: ''}]);

	// 선택된 신고하기 타입
	const [checkReportType, setCheckReportType] = useState(['']);
	

	// 신고 Pop
	const report_modalizeRef = useRef<Modalize>(null);
	const report_onOpen = () => { report_modalizeRef.current?.open(); };
	const report_onClose = () => {	report_modalizeRef.current?.close(); };

	// 관심 여부 체크
	const profileCallbackFn = (activeType:string) => {
		// pass : 거부, sincere : 찐심, interest : 관심

		let alertTit = '알림';
		let alertMsg = '이성에게 찐심을 보내시겠습니까?';

		if(activeType == 'interest') { 
			alertMsg = '이성에게 관심을 보내시겠습니까?';
		 } else if(activeType == 'pass') {
			alertMsg = '이성을 거부하시겠습니까?';
		 }

		Alert.alert(
			alertTit,
			alertMsg,
			[
			  // The "Yes" button
			  {
				text: "취소",
				onPress: () => {
					return false;
				},
			  },
			  // The "No" button
			  // Does nothing but dismiss the dialog when tapped
			  {
				text: "확인",
				onPress: () => { insertMatchInfo(activeType); },
			  },
			]
		);
	}

	// 신고 여부 체크
	const reportCallbackFn = (reportType:string, check:boolean) => {
		if(check){
			checkReportType.push(reportType);
			setCheckReportType(checkReportType.filter((e, index) => checkReportType.indexOf(e) === index && e));
			
		}else{			
			setCheckReportType(checkReportType.filter((e) => e != reportType && e));
		}
	}

	const insertReportCheck = () => {

		console.log(insertReportCheck, checkReportType.join());

		if(!checkReportType.length){
			Alert.alert('신고항목을 선택해주세요.')
			return false;
		}else{
			Alert.alert(
				"사용자 신고하기",
				"신고하시겠습니까?",
				[
				  // The "Yes" button
				  {
					text: "취소",
					onPress: () => {
						return false;
					},
				  },
				  // The "No" button
				  // Does nothing but dismiss the dialog when tapped
				  {
					text: "확인",
					onPress: () => {insertReport()},
				  },
				]
			);
		}
	}

	const insertReport = async () => {

		console.log('insertReport');

		const result = await axios.post(properties.api_domain + '/match/insertReport', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'report_type_code_list' : checkReportType.join()
			, 'member_seq' : matchMemberData.member_seq
		}
		, {
			headers: {
				'jwt-token' : jwtToken
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			Alert.alert('신고처리되었습니다.');
			report_onClose();
		})
		.catch(function (error) {
			console.log('insertReport error ::: ' , error);
		});
	}
	
	const insertMatchInfo = async (activeType:string) => {
		const result = await axios.post(properties.api_domain + '/match/insertMatchInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'active_type' : activeType
			, 'member_seq' : matchMemberData.member_seq
		}
		, {
			headers: {
				'jwt-token' : jwtToken
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			navigation.navigate('Main', {
				screen: 'Roby'
			});

			// getMatchProfileInfo();

		})
		.catch(function (error) {
			console.log('insertMatchInfo error ::: ' , error);
		});
	}

	const createSecondAuthListBody = () => {
		// 자산
		let asset = false;

		// 학업
		let edu = false;

		// 소득
		let income = false;

		// 직업
		let job = false;

		// sns
		let sns = false;

		// 차량
		let vehice = false;

		data.secondAuthList.forEach((e, i) => {
			switch(e.second_auth_code) {
				case 'ASSET':
					asset = true;
					break;
				case 'EDU':
					edu = true;
					break;
				case 'INCOME':
					income = true;
					break;
				case 'JOB':
					job = true;
					break;
				case 'SNS':
					sns = true;
					break;
				case 'VEHICE':
					vehice = true;
					break;
			}
		})

		return (
			<SpaceView mb={48}>
				<SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
					<View style={styles.profileBox}>
						<Image source={ICON.job} style={styles.iconSize48} />
						<CommonText type={'h5'}>직업</CommonText>
						{!job && <View style={styles.disabled} />} 
					</View>
					<View style={styles.profileBox}>
						<Image source={ICON.degree} style={styles.iconSize48} />
						<CommonText type={'h5'}>학위</CommonText>
						{!edu && <View style={styles.disabled} />} 
					</View>
					<View style={styles.profileBox}>
						<Image source={ICON.income} style={styles.iconSize48} />
						<CommonText type={'h5'}>소득</CommonText>
						{!income && <View style={styles.disabled} />} 
					</View>
				</SpaceView>

				<View style={[layoutStyle.rowBetween]}>
					<View style={styles.profileBox}>
						<Image source={ICON.asset} style={styles.iconSize48} />
						<CommonText type={'h5'}>자산</CommonText>
						{!asset && <View style={styles.disabled} />} 
					</View>
					<View style={styles.profileBox}>
						<Image source={ICON.sns} style={styles.iconSize48} />
						<CommonText type={'h5'}>SNS</CommonText>
						{!sns && <View style={styles.disabled} />} 
					</View>
					<View style={styles.profileBox}>
						<Image source={ICON.vehicle} style={styles.iconSize48} />
						<CommonText type={'h5'}>차량</CommonText>
						{!vehice && <View style={styles.disabled} />} 
					</View>
				</View>
			</SpaceView>
		);
	}

	const selectReportCodeList = async () => {
		
		const result = await axios.post(properties.api_domain + '/common/selectCommonCodeList',
			{
				'api-key': 'U0FNR09CX1RPS0VOXzAx',
				group_code: 'DECLAR',
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

				if (response.data.result) {
					let tmpReportTypeList = [{text: '', value: ''}];
					let commonCodeList = [CommonCode];
					commonCodeList = response.data.result;
					
					// CommonCode
					commonCodeList.map(commonCode => {
						tmpReportTypeList.push({text: commonCode.code_name, value: commonCode.common_code})
					});
					console.log('tmpReportTypeList ::: ' , tmpReportTypeList);

					setReportTypeList(tmpReportTypeList.filter(x => x.text));
				}
			}
		})
		.catch(function (error) {
			console.log('getFaceType error ::: ' , error);
		});
	}

	// ### 매칭 프로필 정보 조회
	const getMatchProfileInfo = async () => {
		const result = await axios.post(properties.api_domain + '/match/selectMatchProfileInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
		}
		, {
			headers: {
				'jwt-token' : jwtToken
			}
		})
		.then(function (response) {
			console.log('reponse ::::: ', response.data.match_memeber_info);

			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			let tmpProfileImgList = new Array(); // 프로필 이미지 목록
			let tmpSecondAuthList = new Array(); // 2차 인증 목록
			let tmpInterviewList = new Array(); // 인터뷰 목록

			// 회원 프로필 이미지 정보 구성
			response.data?.profile_img_list?.map(
				({
					file_name,
					file_path
				}: {
					file_name: any;
					file_path: any;
				}) => {
					const img_path = properties.api_domain + '/uploads' + file_path + file_name;
					const dataJson = { url: img_path };
					tmpProfileImgList.push(dataJson);
				},
			);

			// 회원 2차 인증 목록 정보 구성
			response.data?.second_auth_list?.map(
				({
					second_auth_code
				}: {
					second_auth_code: any;
				}) => {
					const dataJson = { second_auth_code: second_auth_code };
					tmpSecondAuthList.push(dataJson);
				},
			);

			// 회원 인터뷰 목록 정보 구성
			response.data?.interview_list?.map(
				({
					code_name,
					answer
				}: {
					code_name: any;
					answer: any;
				}) => {
					const dataJson = { code_name: code_name, answer: answer };
					tmpInterviewList.push(dataJson);
				},
			);
			
			setData({
				...data
				, memberBase: response.data.match_memeber_info
				, profileImgList: tmpProfileImgList
				, secondAuthList: tmpSecondAuthList
				, interviewList: tmpInterviewList
			})


			
/* 
			// 1. 매칭 회원 정보
			setMatchMemberData(response.data.result.match_memeber_info);

			// 2. 프로필 이미지
			// match_profile_img
			let tmpProfileImgList = [ProfileImg];
			let fileInfoList = [FileInfo]
			fileInfoList = response.data.result.profile_img_list;
			
			// CommonCode
			fileInfoList.map(fileInfo => {
				tmpProfileImgList.push({
									url : properties.img_domain + fileInfo.file_path + fileInfo.file_name
									, member_seq : fileInfo.member_seq
									, name : fileInfo.name
									, comment : fileInfo.comment
									, age : fileInfo.age
									, profile_type : fileInfo.profile_type
				})
			});

			tmpProfileImgList = tmpProfileImgList.filter(x => x.url);
			setProfileImgList(tmpProfileImgList);

			console.log('profileImgList[0].profile_type ::: ' , tmpProfileImgList);

			// 2차인증
			setSecondAuthList(response.data.result.second_auth_list);
			
			// 인터뷰 
			setInterviewList(response.data.result.interview_list);
 */
		})
		.catch(function (error) {
			console.log('getMatchProfileInfo error ::: ' , error);
		});
	}

	// 첫 렌더링
	useEffect(() => {
		// 프로필 정보 조회
		getMatchProfileInfo();

		// 신고목록 조회
		selectReportCodeList();
		
	}, [isFocus]);



	return data.profileImgList.length > 0 ? (
		<>
			<TopNavigation currentPath={'LIMEETED'} />
			<ScrollView>
				{data.profileImgList.length > 0 && <ViualSlider 
											isNew={data.memberBase.profile_type == 'NEW' ? true : false} 
											onlyImg={false}
											imgUrls={data.profileImgList}
											profileName={data.memberBase.name}
											age={data.memberBase.age}
											comment={data.memberBase.comment}
											callBackFunction={profileCallbackFn} />}

				<SpaceView pt={48} viewStyle={styles.container}>
					<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
						<View>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 2차 인증
							</CommonText>
						</View>
						<View style={[layoutStyle.rowBetween]}>
							<View style={styles.statusBtn}>
								<CommonText type={'h6'} color={ColorType.white}>
									TIER {secondAuthList && secondAuthList.length}
								</CommonText>
							</View>
							<Image source={ICON.medalAll} style={styles.iconSize32} />
						</View>
					</SpaceView>

					{data.secondAuthList && createSecondAuthListBody()}

					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 활동지수
							</CommonText>
						</SpaceView>

						<MainProfileSlider />
					</SpaceView>


					{/* ###############################################
										인터뷰 영역
					############################################### */}

					<SpaceView>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<CommonText fontWeight={'700'} type={'h3'}>
									인터뷰
								</CommonText>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<SpaceView mr={6}>
									<Image source={ICON.info} style={styles.iconSize} />
								</SpaceView>
								<CommonText type={'h5'}>
									{
										data.interviewList.length > 0 ? 
											<>
											<CommonText fontWeight={'700'} type={'h5'}>
												{interviewList.length}개의 질의
											</CommonText>
											가 등록되어있어요
											</>
										: <>
											<CommonText fontWeight={'700'} type={'h5'}>
												등록된 질의가 없습니다.
											</CommonText>
										</>
									}
								</CommonText>
							</View>
						</SpaceView>

						<View style={styles.interviewContainer}>
							{
								data.interviewList.length > 0 ? (
									data.interviewList.map(({ common_code, code_name, answer } : { common_code: any, code_name: any, answer: any}) =>
									<>
										<SpaceView mb={32} viewStyle={layoutStyle.row}>
											<SpaceView mr={16}>
												<Image source={ICON.manage} style={styles.iconSize40} />
											</SpaceView>
		
											<View style={styles.interviewLeftTextContainer}>
												<CommonText type={'h5'}>
													{code_name}
												</CommonText>
											</View>
										</SpaceView>
		
										<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
											<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
												<CommonText type={'h5'} color={ColorType.white}>
													{answer != null ? answer : '미등록 답변입니다.'}
												</CommonText>
											</SpaceView>
											<SpaceView>
												<Image source={ICON.boy} style={styles.iconSize40} />
											</SpaceView>
										</SpaceView>
									</>
									)
								) : (
									<>
										<SpaceView mb={32} viewStyle={layoutStyle.row}>
											<SpaceView mr={16}>
												<Image source={ICON.manage} style={styles.iconSize40} />
											</SpaceView>

											<View style={styles.interviewLeftTextContainer}>
												<CommonText type={'h5'}>
													질문을 등록해주세요
												</CommonText>
											</View>
										</SpaceView>
									</>
								)
							}
						</View>
					</SpaceView>



					{/* <SpaceView mb={24}>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<CommonText fontWeight={'700'} type={'h3'}>
									인터뷰
								</CommonText>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<SpaceView mr={6}>
									<Image source={ICON.info} style={styles.iconSize} />
								</SpaceView>
								<CommonText type={'h5'}>
									{
										data.interviewList.length > 0 ? 
											<>
											<CommonText fontWeight={'700'} type={'h5'}>
												{interviewList.length}개의 질의
											</CommonText>
											가 등록되어있어요
											</>
										: <>
											<CommonText fontWeight={'700'} type={'h5'}>
												등록된 질의가 없습니다.
											</CommonText>
										</>
									}
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							{
								data.interviewList.length > 0 ?
									data.interviewList.map(interview => (
										<>
										<SpaceView mb={32} viewStyle={layoutStyle.row}>
											<SpaceView mr={16}>
												<Image source={ICON.manage} style={styles.iconSize40} />
											</SpaceView>

											<View style={styles.interviewLeftTextContainer}>
												<CommonText type={'h5'}>
													{interview.code_name}
												</CommonText>
											</View>
										</SpaceView>

										<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
											<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
												<CommonText type={'h5'} color={ColorType.white}>
													{interview.answer}
												</CommonText>
											</SpaceView>
											<SpaceView>
												<Image source={ICON.boy} style={styles.iconSize40} />
											</SpaceView>
										</SpaceView>
										</>
									)) :
									<>
									<SpaceView mb={32} viewStyle={layoutStyle.row}>
										<SpaceView mr={16}>
											<Image source={ICON.manage} style={styles.iconSize40} />
										</SpaceView>

										<View style={styles.interviewLeftTextContainer}>
											<CommonText type={'h5'}>
												질문을 등록해주세요
											</CommonText>
										</View>
									</SpaceView>
									</>
							}
						</View>
					</SpaceView> */}

					<SpaceView mb={40}>
						<CommonBtn value={'신고'} icon={ICON.siren} iconSize={24} onPress={() => report_onOpen()}/>
					</SpaceView>

				</SpaceView>
			</ScrollView>

			<Modalize
				ref={report_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						사용자 신고하기
					</CommonText>
					<TouchableOpacity onPress={report_onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					<SpaceView mb={16}>
						<CommonText>신고 사유를 선택해주세요.</CommonText>
					</SpaceView>

					{/*
					<SpaceView mb={24}>
						{[
							{ text: '비속어 사용' },
							{ text: '과도한 성적 표현' },
							{ text: '불쾌감을 주는 표현' },
							{ text: '성차별 적 표현' },
							{ text: '기타' },
						].map((i, index) => (
							<CommonCheckBox label={i.text} key={index + 'checkbox'} />
						))}
					</SpaceView>
						*/}

					<SpaceView mb={24}>
						{reportTypeList.length && reportTypeList.map((i, index) => (
							<CommonCheckBox label={i.text} value={i.value} key={index + '_' + i.value} callBackFunction={reportCallbackFn} />
						))}
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'신고하기'} onPress={insertReportCheck} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>
		</>
	) : <MatchSearch />;
};