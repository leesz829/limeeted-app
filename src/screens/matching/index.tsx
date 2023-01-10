import * as React from 'react';
import { useState, useEffect, useRef} from 'react';
import { Image, ScrollView, View, TouchableOpacity, Alert, Modal, StyleSheet} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle} from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { Color } from 'assets/styles/Color';
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
import { ToolTip } from 'component/Tooltip';
import { BarGrap } from 'component/BarGrap';

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

	const scrollRef = useRef();

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	// 로딩 상태 체크
	const [isLoad, setIsLoad] = useState(false);

	const [royalPassAmt, setRoyalPassAmt] = useState<any>();

	// 매칭 회원 관련 데이터
	const [data, setData] = useState<any>({
		memberBase: {}
		, profileImgList: []
		, secondAuthList: []
		, interviewList: []
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


	// 
	/* #############################################
	##### 거부/찐심/관심 팝업 Callback 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	############################################# */
	const profileCallbackFn = (activeType:string) => {
		if(activeType == 'interest') {
			setInterestSendPopup(true);
		} else if(activeType == 'sincere') {
			setSincereSendPopup(true);
		} else if(activeType == 'pass') {
			setCancelPopup(true);
		}
	}

	// ##### 사용자 신고하기 - 신고사유 체크 Callback 함수
	const reportCheckCallbackFn = (reportType:string, check:boolean) => {
		if(check){
			checkReportType.push(reportType);
			setCheckReportType(checkReportType.filter((e, index) => checkReportType.indexOf(e) === index && e));
			
		}else{			
			setCheckReportType(checkReportType.filter((e) => e != reportType && e));
		}
	}

	// ##### 사용자 신고하기 - 팝업 활성화
	const popupReport = () => {
		if(!checkReportType.length){
			Alert.alert('알림', '신고항목을 선택해주세요.', [{ text: '확인' }]);

			return false;
		}else{

			setReportPopup(true);
			/*
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
			*/
		}
	}

	// ##### 사용자 신고하기 등록
	const insertReport = async () => {
		const result = await axios.post(properties.api_domain + '/match/insertReport', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'report_type_code_list' : checkReportType.join()
			, 'member_seq' : data.memberBase.member_seq
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
			
			Alert.alert('알림', '신고 처리 되었습니다.', [{ text: '확인' }]);
			getMatchProfileInfo();
			report_onClose();
			setReportPopup(false);

			// 스크롤 최상단 이동
			scrollRef.current?.scrollTo({
				y: 0,
				animated: false,
			});
		})
		.catch(function (error) {
			console.log('insertReport error ::: ' , error);
		});
	}
	
	// ##### 찐심/관심/거부 저장
	const insertMatchInfo = async (activeType:string) => {
		const result = await axios.post(properties.api_domain + '/match/insertMatchInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'active_type' : activeType
			, 'member_seq' : data.memberBase.member_seq
		}
		, {
			headers: {
				'jwt-token' : jwtToken
			}
		})
		.then(function (response) {

			if(response.data.result_code == '0000') {
				getMatchProfileInfo();
				setInterestSendPopup(false)
				setSincereSendPopup(false)
				setCancelPopup(false);
				setIsLoad(false);
			 } else if(response.data.result_code == '6010') {
				Alert.alert('알림', '보유 패스가 부족합니다.', [{ text: '확인' }]);
				return false;
			 } else {
				console.log(response.data.result_msg);
				Alert.alert('알림', '오류입니다. 관리자에게 문의해주세요.', [{ text: '확인' }]);
			 }
			
		})
		.catch(function (error) {
			console.log('insertMatchInfo error ::: ' , error);
		});
	}

	// ##### 프로필 2차 인증 목록 UI 생성
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

	// ##### 신고사유 코드 목록 조회
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

	// ##### 매칭 관련 정보 조회
	const getMatchInfo = async () => {
		
		const result = await axios.post(properties.api_domain + '/match/getMatchInfo',
			{
				'api-key': 'U0FNR09CX1RPS0VOXzAx',
				member_seq: memberSeq
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

				// 잔여 로얄패스 적용
				setRoyalPassAmt(response.data.safe_royal_pass);
	
				// 신고사유 코드 목록 적용
				let tmpReportTypeList = [{text: '', value: ''}];
				let commonCodeList = [CommonCode];
				commonCodeList = response.data.report_code_list;
				
				// CommonCode
				commonCodeList.map(commonCode => {
					tmpReportTypeList.push({text: commonCode.code_name, value: commonCode.common_code})
				});
				console.log('tmpReportTypeList ::: ' , tmpReportTypeList);

				setReportTypeList(tmpReportTypeList.filter(x => x.text));
				
			}
		})
		.catch(function (error) {
			console.log('getFaceType error ::: ' , error);
		});
	}

	// ##### 매칭 프로필 정보 조회
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
					const img_path = properties.img_domain + file_path + file_name;
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
				, memberBase: response.data.match_member_info
				, profileImgList: tmpProfileImgList
				, secondAuthList: tmpSecondAuthList
				, interviewList: tmpInterviewList
			});

			setIsLoad(true);

		})
		.catch(function (error) {
			console.log('getMatchProfileInfo error ::: ' , error);
		});
	}


	// ################### 팝업 관련 #####################
	const [interestSendPopup, setInterestSendPopup] = useState(false); // 관심 보내기 팝업
	const [sincereSendPopup, setSincereSendPopup] = useState(false); // 찐심 보내기 팝업
	const [cancelPopup, setCancelPopup] = useState(false); // 찐심 보내기 팝업
	const [reportPopup, setReportPopup] = useState(false); // 찐심 보내기 팝업
	

	


	// ################################## 렌더링시 마다 실행
	useEffect(() => {

		if(!isLoad) {
			// 프로필 정보 조회
			getMatchProfileInfo();
		}

		// 신고목록 조회
		//selectReportCodeList();
		getMatchInfo();
		
	}, [isFocus]);



	return data.profileImgList.length > 0 && isLoad ? (
		<>
			<TopNavigation currentPath={'LIMEETED'} />

			<ScrollView ref={scrollRef}>
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

						{data.memberBase.auth_acct_cnt > 0 ? (
							<>
								<View style={[layoutStyle.rowBetween]}>
									<View style={styles.statusBtn}>
										<CommonText type={'h6'} color={ColorType.white}>
											LV.{data.memberBase.auth_acct_cnt}
										</CommonText>
									</View>
									<Image source={ICON.medalAll} style={styles.iconSize32} />
								</View>
							</>
						) : null}
					</SpaceView>

					{data.secondAuthList && createSecondAuthListBody()}

					<SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 평점
							</CommonText>
						</SpaceView>

						{/* <MainProfileSlider score={data.memberBase.profile_score} /> */}


						<View style={[styles_m.profileContainer]}>
							<SpaceView mb={8} viewStyle={layoutStyle.alignCenter}>
								<Image source={ICON.party} style={styles_m.iconSize} />
							</SpaceView>

							<SpaceView viewStyle={layoutStyle.alignCenter} mb={29}>

								{data.memberBase.profile_score >= 9 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											더 이상 어떤 분을 소개시켜 드려야할 지 자신이 없어요.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 9 && data.memberBase.profile_score >= 8 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											꼭! 이분에게 관심을 표현하시길 바래요..!
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 8 && data.memberBase.profile_score >= 7 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											매칭되면 후회하지 않을 듯한 느낌이 들어요.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 7 && data.memberBase.profile_score >= 6 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											좋은 분이실지도 몰라서 소개시켜드려요.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 6 && data.memberBase.profile_score >= 5 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											사람의 코드는 예상치 못 하게 맞는 법이잖아요?{'\n'}조심스럽게 소개시켜드려요.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 5 && data.memberBase.profile_score >= 4 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											신중한 관심 표현을 권장드려요.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{data.memberBase.profile_score < 4 ? (
									<>
										<CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
											이 회원분에게 소셜 평점을 높이라고 당부에 당부를 드리는 중입니다.
										</CommonText>
									</>
								) : (
									<></>
								)}

								{/* <CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
									이성들에게
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										선호도가
									</CommonText>
									{'\n'}
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										매우 높은 회원
									</CommonText>
									과 매칭되셨네요!
								</CommonText> */}
							</SpaceView>

							<SpaceView viewStyle={layoutStyle.rowBetween} mb={29}>
								<ToolTip title={'프로필 평점'} desc={'프로필 평점에 대한 툴팁'} />

								<View>
									<CommonText fontWeight={'700'} type={'h2'}>
										{data.memberBase.profile_score}
									</CommonText>
								</View>
							</SpaceView>
							<BarGrap score={data.memberBase.profile_score} />
						</View>


					</SpaceView>


					{/* ###############################################
										인터뷰 영역
					############################################### */}

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
										data.interviewList.length > 0 ? 
											<>
											<CommonText fontWeight={'700'} type={'h5'}>
												{data.interviewList.length}개의 질의
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

					<SpaceView mb={15}>
						<CommonBtn value={'신고'} icon={ICON.siren} iconSize={24} onPress={() => report_onOpen()}/>
					</SpaceView>

				</SpaceView>
			</ScrollView>



			{/* ###############################################
                        사용자 신고하기 팝업
            ############################################### */}
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
							<CommonCheckBox label={i.text} value={i.value} key={index + '_' + i.value} callBackFunction={reportCheckCallbackFn} />
						))}
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'신고하기'} onPress={popupReport} type={'primary'} />
					</SpaceView>
				</View>
			</Modalize>

			{/* ###############################################
                        매칭 취소 팝업
            ############################################### */}
			<Modal visible={cancelPopup} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								매칭 취소
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>이성을 거부하시겠습니까?</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setCancelPopup(false)}
							>
								<CommonText fontWeight={'500'}>취소</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
							<TouchableOpacity style={modalStyle.modalBtn} onPress={() => insertMatchInfo('pass') }>
								<CommonText fontWeight={'500'} color={ColorType.red}>
								확인
								</CommonText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>


			{/* ###############################################
                        관심 보내기 팝업
            ############################################### */}
			<Modal visible={interestSendPopup} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								관심
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>패스를 소모하여 관심을 보내시겠습니까?</CommonText>
							<CommonText type={'h5'} color={ColorType.red}>패스 x5</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setInterestSendPopup(false)}
							>
								<CommonText fontWeight={'500'}>취소</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
							<TouchableOpacity style={modalStyle.modalBtn} onPress={() => insertMatchInfo('interest') }>
								<CommonText fontWeight={'500'} color={ColorType.red}>
								확인
								</CommonText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* ###############################################
                        찐심 보내기 팝업
            ############################################### */}
			<Modal visible={sincereSendPopup} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								찐심
							</CommonText>
						</SpaceView>

						{royalPassAmt <= 0 ? (
							<>
								<SpaceView viewStyle={layoutStyle.alignCenter}>
									<CommonText type={'h5'}>보유 찐심</CommonText>
									<CommonText type={'h5'} color={ColorType.red}>{royalPassAmt}</CommonText>
								</SpaceView>

								<View style={modalStyle.modalBtnContainer}>
									<TouchableOpacity
										style={modalStyle.modalBtn}
										onPress={() => setSincereSendPopup(false)} >
										<CommonText fontWeight={'500'}>취소</CommonText>
									</TouchableOpacity>
									<View style={modalStyle.modalBtnline} />
									<TouchableOpacity style={modalStyle.modalBtn} onPress={() => navigation.navigate('Cashshop') }>
										<CommonText fontWeight={'500'} color={ColorType.red}>
											구매
										</CommonText>
									</TouchableOpacity>
								</View>
							</>
						) : (
							<>
								<SpaceView viewStyle={layoutStyle.alignCenter}>
									<CommonText type={'h5'}>로얄패스를 소모하여 찐심을 보내시겠습니까?</CommonText>
									<CommonText type={'h5'} color={ColorType.red}>로얄패스 x20</CommonText>
								</SpaceView>

								<View style={modalStyle.modalBtnContainer}>
									<TouchableOpacity
										style={modalStyle.modalBtn}
										onPress={() => setSincereSendPopup(false)}
									>
										<CommonText fontWeight={'500'}>취소</CommonText>
									</TouchableOpacity>
									<View style={modalStyle.modalBtnline} />
									<TouchableOpacity style={modalStyle.modalBtn} onPress={() => insertMatchInfo('sincere') }>
										<CommonText fontWeight={'500'} color={ColorType.red}>
										확인
										</CommonText>
									</TouchableOpacity>
								</View>
							</>
						)}
						
					</View>
				</View>
			</Modal>

			


			<Modal visible={reportPopup} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								사용자 신고하기
							</CommonText>
						</SpaceView>
							<>
								<SpaceView viewStyle={layoutStyle.alignCenter}>
									<CommonText type={'h5'}>신고하시겠습니까?</CommonText>									
								</SpaceView>

								<View style={modalStyle.modalBtnContainer}>
									<TouchableOpacity
										style={modalStyle.modalBtn}
										onPress={() => setReportPopup(false)}>
										<CommonText fontWeight={'500'}>취소</CommonText>
									</TouchableOpacity>
									<View style={modalStyle.modalBtnline} />
									<TouchableOpacity style={modalStyle.modalBtn} onPress={() => insertReport() }>
										<CommonText fontWeight={'500'} color={ColorType.red}>
										확인
										</CommonText>
									</TouchableOpacity>
								</View>
							</>
					</View>
				</View>
			</Modal>




		</>
	) : <MatchSearch />;
};




const styles_m = StyleSheet.create({
	profileContainer: {
		backgroundColor: Color.grayF8F8,
		borderRadius: 16,
		padding: 24,
		marginRight: 0,
		paddingBottom: 30,
	},
	iconSize: {
		width: 48,
		height: 48,
	},
	textCenter: { textAlign: 'center' },
});