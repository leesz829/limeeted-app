import * as React from 'react';
import { useState, useEffect, useRef} from 'react';
import { Image, ScrollView, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ColorType, ScreenNavigationProp, BottomParamList, Interview, ProfileImg, FileInfo, MemberBaseData, CommonCode, LabelObj, StackParamList} from '@types';
import { ViualSlider } from 'component/ViualSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import axios from 'axios';
import * as properties from 'utils/properties';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { MatchSearch } from 'screens/matching/MatchSearch';

/* ################################################################################################################
###### 매칭 상대 프로필 상세
################################################################################################################ */


interface Props {
	navigation: StackNavigationProp<StackParamList, 'StorageProfile'>;
	route: RouteProp<StackParamList, 'StorageProfile'>;
}

export const StorageProfile = (props : Props) => {
	console.log('props.route.params.matchSeq :::: ', props.route.params.matchSeq);

	const navigation = useNavigation<ScreenNavigationProp>();
	const isFocus = useIsFocused();

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	// 매칭 번호
	const matchSeq = props.route.params.matchSeq;

	const [data, setData] = useState<any>({
		memberBase: {}
		, profileImgList: []
		, secondAuthList: []
		, interviewList: []
	});

	// 회원 기본 정보
	const [memberBase, setMemberBase] = useState<any>({MemberBaseData});

	// 회원 프로필 사진 정보
	const [profileImgList, setProfileImgList] = useState<any>([{}]);

	// 2차인증 정보 
	const [secondAuthList, setSecondAuthList] = useState<any>([{}]);

	// 인터뷰 정보
	const [interviewList, setInterviewList] = useState<any>([{}]);


	// 매칭 회원 정보 조회
	const selectMatchMemberInfo = async () => {
		const result = await axios.post(properties.api_domain + '/match/selectMatchMemberInfo',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					member_seq: props.route.params.memberSeq
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

					let tmpProfileImgList = new Array(); // 프로필 이미지 목록
					let tmpSecondAuthList = new Array(); // 2차 인증 목록
					let tmpInterviewList = new Array(); // 인터뷰 목록

					// 회원 프로필 이미지 정보 구성
					response.data?.profileImgList?.map(
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
					response.data?.secondAuthList?.map(
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
					response.data?.interviewList?.map(
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
						, memberBase: response.data.memberBase
						, profileImgList: tmpProfileImgList
						, secondAuthList: tmpSecondAuthList
						, interviewList: tmpInterviewList
					})

				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 매칭 상태 변경
	const updateMatchStatus = async (status:any) => {
		const result = await axios
			.post(
				properties.api_domain + '/match/updateMatchStatus',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					match_seq: matchSeq,
					match_status: status,
					member_seq: memberSeq
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				console.log(response);
				if (response.data.result_code != '0000') {
					console.log(response.data.result_msg);
					Alert.alert('오류입니다. 관리자에게 문의해주세요.');
				} else {
					navigation.navigate('Main', {
						screen: 'Storage',
					});
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	const clipBoard = async () => {
		
	}


	// 관심 여부 체크
	const profileCallbackFn = (activeType:string) => {
		
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


	// 첫 렌더링
	useEffect(() => {
		//console.log('props.route.params.memberSeq ::::: ', props.route.params.memberSeq);
		selectMatchMemberInfo();
	}, [isFocus]);

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView>
				{profileImgList.length > 0 && <ViualSlider 
													onlyImg={true}
													isNew={data.memberBase.profile_type == 'NEW' ? true : false} 
													imgUrls={data.profileImgList}
													profileName={data.memberBase.name}
													age={data.memberBase.age}
													comment={data.memberBase.comment}
													callBackFunction={profileCallbackFn} />}

				<SpaceView viewStyle={styles.container}>

					{props.route.params.type == 'REQ' ? (
						<>
							<SpaceView viewStyle={styles.halfContainer} mb={48}>
								<View style={styles.halfItemLeft4}>
									<CommonBtn value={'거절'} height={48} onPress={() => { updateMatchStatus('REFUSE') }} />
								</View>
								<View style={styles.halfItemRight4}>
									<CommonBtn value={'수락'} type={'primary'} height={48} onPress={() => { updateMatchStatus('ACCEPT') }} />
								</View>
							</SpaceView>
						</>
					) : null}

					{props.route.params.type == 'RES' ? (
						<>
							<SpaceView viewStyle={styles.textContainer} mb={48}>
								<SpaceView mb={8}>
									<Image source={ICON.wait} style={styles.iconSize48} />
								</SpaceView>
								<CommonText fontWeight={'700'}>매칭 대기중</CommonText>
								<CommonText
									fontWeight={'500'}
									color={ColorType.gray6666}
									textStyle={layoutStyle.textCenter}
								>
									상대방이 회원님의 관심을 두고 고민 중인가봐요.
								</CommonText>
							</SpaceView>
						</>
					) : null}

					{props.route.params.type == 'MATCH' ? (
						<>
							<SpaceView mb={48}>
								<SpaceView mb={8}>
									<CommonText fontWeight={'700'} type={'h3'}>
										인사말 건네기
									</CommonText>
								</SpaceView>

								<SpaceView mb={16}>
									<CommonText>상대 이성에게 반가운 인사말을 건내보세요.</CommonText>
								</SpaceView>


								<TouchableOpacity onPress={() => { clipBoard(); }}>
									<SpaceView mb={8} viewStyle={styles.textContainer}>
										<CommonText fontWeight={'500'}>연락처 정보</CommonText>
										<CommonText type={'h5'} textStyle={layoutStyle.textCenter}>
											{data.memberBase.phone_number}
											{/* 영역을 터치하면 상대 이성의 연락처가 복사됩니다 */}
										</CommonText>
									</SpaceView>
								</TouchableOpacity>

								{/* <SpaceView mb={8} viewStyle={styles.textContainer}>
									<CommonText fontWeight={'500'}>카카오톡 ID</CommonText>
									<CommonText type={'h5'} textStyle={layoutStyle.textCenter}>
										영역을 터치하면 상대 이성의 카카오톡 ID가 복사됩니다
									</CommonText>
								</SpaceView> */}

								{/* <CommonBtn value={'카카오톡 열기'} type={'kakao'} icon={ICON.kakao} iconSize={24} /> */}
							</SpaceView>
						</>
					) : null}

					<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
						<View>
							<CommonText fontWeight={'700'} type={'h3'}>
								프로필 2차 인증
							</CommonText>
						</View>

						{/* <View style={[layoutStyle.rowBetween]}>
							<View style={styles.statusBtn}>
								<CommonText type={'h6'} color={ColorType.white}>
									ALL
								</CommonText>
							</View>
							<Image source={ICON.medalAll} style={styles.iconSize32} />
						</View> */}
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

						{/* ###############################################
											인터뷰 영역
						############################################### */}
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
				</SpaceView>
			</ScrollView>
		</>
	);
};
