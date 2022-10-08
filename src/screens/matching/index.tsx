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
import { RouteProp, useNavigation } from '@react-navigation/native';
import { jwt_token, api_domain} from 'utils/properties';
import { ColorType, BottomParamList, Interview, ProfileImg, FileInfo, MemberData, CommonCode, LabelObj} from '@types';
import { Modalize } from 'react-native-modalize';
import { CommonCheckBox } from 'component/CommonCheckBox';
import axios from 'axios';

/* ################################################################################################################
매칭
###################ttt############################################################################################# */
interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Matching = (props : Props) => {
	
	// 매치 회원 정보
	const [matchMemberData, setMatchMemberData] = useState(MemberData);
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
		insertMatchInfo(activeType);
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

		const result = await axios.post(api_domain + '/match/insertReport', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'report_type_code_list' : checkReportType.join()
			, 'member_seq' : matchMemberData.member_seq
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token()) 
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			Alert.alert('신고처리되었습니다.');
			report_onClose();
			console.log('insertReport ::: ', response.data);
		})
		.catch(function (error) {
			console.log('insertReport error ::: ' , error);
		});
	}
	
	const insertMatchInfo = async (activeType:string) => {
		const result = await axios.post(api_domain + '/match/insertMatchInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'active_type' : activeType
			, 'member_seq' : matchMemberData.member_seq
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token()) 
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

			getMatchProfileInfo();
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

		secondAuthList.forEach((e, i) => {
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
						{!asset && <View style={styles.disabled} />} 
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
						{!job && <View style={styles.disabled} />} 
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
		
		const result = await axios.post(api_domain + '/common/selectGroupCodeList/' +jwt_token, {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'group_code' : 'DECLAR'
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token())
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){	
				return false;
			}

			let tmpReportTypeList = [{text: '', value: ''}];
			let commonCodeList = [CommonCode];
			commonCodeList = response.data.result;
			
			// CommonCode
			commonCodeList.map(commonCode => {
				tmpReportTypeList.push({text: commonCode.code_name, value: commonCode.common_code})
			});

			 setReportTypeList(tmpReportTypeList.filter(x => x.text));
		})
		.catch(function (error) {
			console.log('getFaceType error ::: ' , error);
		});
	}

	const getMatchProfileInfo = async () => {

		const result = await axios.post(api_domain + '/match/selectMatchProfileInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
		}
		, {
			headers: {
				'jwt-token' : String(await jwt_token()) 
			}
		})
		.then(function (response) {
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			}

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
									url : api_domain + fileInfo.file_path
									, member_seq : fileInfo.member_seq
									, name : fileInfo.name
									, comment : fileInfo.comment
									, age : fileInfo.age
									, profile_type : fileInfo.profile_type
				})
			});

			tmpProfileImgList = tmpProfileImgList.filter(x => x.url);
			setProfileImgList(tmpProfileImgList);

			// 2차인증
			setSecondAuthList(response.data.result.second_auth_list);
			
			// 인터뷰 
			setInterviewList(response.data.result.interview_list);
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
	}, []);



	return (
		<>
			<TopNavigation currentPath={'LIMEETED'} />
			<ScrollView>
				{profileImgList.length && <ViualSlider 
											isNew={profileImgList[0].profile_type=='NEW'?true:false} 
											onlyImg={false}
											imgUrls={profileImgList}
											profileName={profileImgList[0].name}
											age={profileImgList[0].age}
											comment={profileImgList[0].comment}
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

					{secondAuthList && createSecondAuthListBody()}

					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 활동지수
							</CommonText>
						</SpaceView>

						<MainProfileSlider />
					</SpaceView>

					<SpaceView mb={24}>
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
										interviewList.length? 
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
								interviewList.length ?
									interviewList.map(interview => (
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
					</SpaceView>

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
	);
};
