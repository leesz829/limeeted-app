import {
	ColorType,
	StackParamList,
	BottomParamList,
	ScreenNavigationProp,
	MemberBaseData,
	MemberIdealTypeData,
} from '@types';
import { useState, useEffect } from 'react';
import React, { useRef } from 'react';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { Color } from 'assets/styles/Color';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import {
	Image,
	ScrollView,
	View,
	TouchableOpacity,
	ImagePropTypes,
	Dimensions,
	Modal,
} from 'react-native';
import { ICON, IMAGE, PROFILE_IMAGE } from 'utils/imageUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import * as properties from 'utils/properties';
import axios from 'axios';
import { CommonDatePicker } from 'component/CommonDatePicker';
import * as dataUtils from 'utils/data';
import AsyncStorage from '@react-native-community/async-storage';
import { useUserInfo } from 'hooks/useUserInfo';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import { Terms } from 'screens/commonpopup/terms';
import { Privacy } from 'screens/commonpopup/privacy';


/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<BottomParamList, 'Roby'>;
	route: RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const isFocus = useIsFocused();
	const dispatch = useDispatch();

	const jwtToken = hooksMember.getJwtToken(); // 토큰 추출

	// 회원 기본 정보
	const memberBase = JSON.parse(hooksMember.getBase());

	/*
	 * 회원 실시간 데이터
	 * - 받은관심, 매칭대상, 평점
	 */

	// 회원 받은 관심 목록
	const [resLikeCnt, setResLikeCnt] = React.useState<any>('');
	const [resLikeList, setResLikeList] = React.useState<any>([
		{
			req_member_seq: String,
			img_path: '',
		},
	]);

	// 회원 매칭 대상 목록
	const [matchCnt, setMatchCnt] = React.useState<any>('');
	const [matchList, setMatchList] = React.useState<any>([
		{
			req_member_seq: String,
			img_path: '',
		},
	]);

	// 툴팁 상태 관리
	const [isTestTooltip, setIsTestTooltip] = React.useState<boolean>(false);



	// ###### 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {
		getRealTimeMemberInfo();
	}, [isFocus]);

	// ###### 실시간성 회원 데이터 조회
	const getRealTimeMemberInfo = async () => {

		const result = await axios
			.post(
				properties.api_domain + '/member/getRealTimeMemberInfo',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					img_acct_cnt: memberBase.img_acct_cnt,
					auth_acct_cnt: memberBase.auth_acct_cnt,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				console.log('response :::: ', response);

				// 관심 목록 셋팅
				let resLikeDataList = new Array();
				response.data?.res_like_list?.map(
					({
						req_member_seq,
						file_name,
						file_path,
					}: {
						req_member_seq: any;
						file_name: any;
						file_path: any;
					}) => {
						const img_path = properties.api_domain + '/uploads' + file_path + file_name;
						const dataJson = { req_member_seq: String, img_path: '' };

						dataJson.req_member_seq(req_member_seq);
						dataJson.img_path = img_path;

						resLikeDataList.push(dataJson);
					},
				);

				// 매칭 목록 셋팅
				let matchDataList = new Array();
				response.data?.match_trgt_list?.map(
					({
						trgt_member_seq,
						file_name,
						file_path,
					}: {
						trgt_member_seq: any;
						file_name: any;
						file_path: any;
					}) => {
						const img_path = properties.img_domain + file_path + file_name;
						const dataJson = { trgt_member_seq: String, img_path: '' };

						dataJson.trgt_member_seq(trgt_member_seq);
						dataJson.img_path = img_path;

						matchDataList.push(dataJson);
					},
				);

				// 프로필 이미지 목록 저장
				if(response.data?.img_list.length > 0) {
					dispatch(mbrReducer.setProfileImg(JSON.stringify(response.data.img_list)));
				}

				if(response.data?.second_auth_list.length > 0) {
					dispatch(mbrReducer.setSecondAuth(JSON.stringify(response.data.second_auth_list)));
				}

				if(response.data?.img_list.length > 0 || response.data?.second_auth_list.length > 0) {
					dispatch(mbrReducer.setBase(JSON.stringify(response.data.base)));
				}

				// 새 관심, 새 매칭 목록 저장
				setResLikeCnt(resLikeDataList.length);
				setResLikeList(resLikeDataList);
				setMatchCnt(matchDataList.length);
				setMatchList(matchDataList);
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 회원 정보 수정
	const updateMemberInfo = async (type: string, value: string) => {
		let matchYnParam = '';
		let friendMatchParam = '';

		let dataJson = {};

		/*
		 * 01 : 내 프로필 공개
		 * 02 : 아는 사람 소개
		 */
		if (type == '01') {
			matchYnParam = value;
			friendMatchParam = memberBase.friend_match_yn;

			dataJson = {
				'api-key': 'U0FNR09CX1RPS0VOXzAx'
				, use_pass_yn: 'N'
				, match_yn: matchYnParam
			};
		} else {
			matchYnParam = memberBase.match_yn;
			friendMatchParam = value;

			dataJson = {
				'api-key': 'U0FNR09CX1RPS0VOXzAx'
				, use_pass_yn: 'N'
				, friend_match_yn: friendMatchParam
			};
		}

		const result = await axios
			.post(properties.api_domain + '/member/saveMemberBase', dataJson, {
				headers: {
					'jwt-token': jwtToken,
				},
			})
			.then(function (response) {
				console.log('response.data :::: ', response.data);
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 프로필 재심사 실행
	const profileReexProc = async () => {
		const result = await axios
			.post(
				properties.api_domain + '/member/updateProfileReex',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx'
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
					setProfileReAprPopup(false);
				}
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 별점 이미지 적용
	const showStarImg = (score:number) => {
		let starCnt = score/2;
		let starIntegerCnt = Math.floor(starCnt);
		let starDecimalScore = score - Math.floor(score)
  
		let starImgArr = [];
  
		for(let i = 1; i <= starIntegerCnt; i++){
		   starImgArr.push(<Image source={ICON.star} style={styles.iconSize24} />);
		}
  
		if(starDecimalScore) starImgArr.push(<Image source={ICON.starHalf} style={styles.iconSize24} />);
  
		return starImgArr;
	 };




	// ####################################################### 팝업 관련 #######################################################

	const [profileReAprPopup, setProfileReAprPopup] = useState(false); // 프로필 재심사 팝업
	const [useReportPopup, setUseReportPopup] = useState(false); // 사용자 신고하기 팝업

	// 내 선호 이성 Pop
	const ideal_modalizeRef = useRef<Modalize>(null);
	const ideal_onOpen = () => {
		ideal_modalizeRef.current?.open();
	};
	const ideal_onClose = () => {
		ideal_modalizeRef.current?.close();
	};

	// 이용약관 팝업
	const terms_modalizeRef = useRef<Modalize>(null);
	const terms_onOpen = () => {
		terms_modalizeRef.current?.open();
	};
	const terms_onClose = () => {
		terms_modalizeRef.current?.close();
	};

	// 개인정보 취급방침 팝업
	const privacy_modalizeRef = useRef<Modalize>(null);
	const privacy_onOpen = () => {
		privacy_modalizeRef.current?.open();
	};
	const privacy_onClose = () => {
		privacy_modalizeRef.current?.close();
	};

	const { width, height } = Dimensions.get('window');

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={16}>
					<CommonText fontWeight={'700'} type={'h3'}>
						내 정보
					</CommonText>
				</SpaceView>

				<SpaceView mb={48} viewStyle={layoutStyle.alignCenter}>
					<SpaceView mb={8}>
						<Image
							source={{ uri: properties.img_domain + memberBase.mst_img_path }}
							style={styles.profileImg}
						/>
						{/* <Image source={PROFILE_IMAGE.profileM1} style={styles.profileImg} /> */}
						{/* <Image source={{uri : props.route.params.mstImg}} style={styles.profileImg} /> */}
						<View style={styles.profilePenContainer}>
							<TouchableOpacity
								onPress={() => { navigation.navigate('Introduce'); }} >
								<Image source={ICON.pen} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={4}>
						<CommonText fontWeight={'700'} type={'h4'}>
							{memberBase.nickname}, {memberBase.age}
						</CommonText>
					</SpaceView>

					{memberBase.auth_acct_cnt > 0 ? (
						<>
							<SpaceView mb={16} viewStyle={styles.levelContainer}>
								<CommonText color={ColorType.gray6666} type={'h6'}>
									LV.{memberBase.auth_acct_cnt}
								</CommonText>
							</SpaceView>
						</>
					) : null}

					<CommonText color={ColorType.gray6666}>{memberBase.comment}</CommonText>
				</SpaceView>

				<View>
					<SpaceView mb={16}>
						<TouchableOpacity
							style={[layoutStyle.row, layoutStyle.alignCenter]}
							onPress={() => {
								navigation.navigate('Profile1');
							}}
						>
							<CommonText type={'h3'} fontWeight={'700'}>
								프로필 관리
							</CommonText>
							<Image source={ICON.arrRight} style={styles.iconSize} />
						</TouchableOpacity>
					</SpaceView>

					<SpaceView mb={16} viewStyle={styles.halfContainer}>
						<View style={[styles.halfItemLeft, styles.profileContainer, layoutStyle.alignCenter]}>
							<SpaceView mb={4}>
								<CommonText fontWeight={'700'} type={'h2'}>
									{memberBase.profile_score}
								</CommonText>
							</SpaceView>

							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								{/* <Image source={ICON.star} style={styles.iconSize24} /> */}
								{memberBase.profile_score < 1 ? (<Image source={ICON.star} style={styles.iconSize24} />) : showStarImg(memberBase.profile_score)}
							</SpaceView>
							<ToolTip
								position={'bottomLeft'}
								title={'프로필 평점'}
								desc={'<라이브>에 소개된 내 프로필에 다른 이성들이 부여한 프로필 평점'}
							/>
						</View>

						<View style={[styles.halfItemRight, styles.profileContainer, layoutStyle.alignCenter]}>
							<SpaceView mb={4}>
								<CommonText fontWeight={'700'} type={'h2'}>
									0.0
								</CommonText>
							</SpaceView>
							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								<Image source={ICON.star} style={styles.iconSize24} />
							</SpaceView>
							<ToolTip
								position={'bottomRight'}
								title={'기여 평점'}
								desc={'LIMEETED에서 발생한 활동 지표를 통해 부여된 기여 평점'}
							/>
						</View>
					</SpaceView>

					<SpaceView mb={48}>
						<CommonBtn
							type="purple"
							value="프로필 재심사"
							icon={ICON.refresh}
							iconSize={24}
							iconPosition={'right'}
							onPress={() => setProfileReAprPopup(true)}
						/>
					</SpaceView>
				</View>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								보관함
							</CommonText>
						</SpaceView>

						<View style={styles.rowStyle}>
							<CommonText fontWeight={'500'}>
								새 관심
								<CommonText color={ColorType.primary}> {resLikeCnt}</CommonText>건
							</CommonText>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('Main', {
										screen: 'Storage',
									});
								}}
							>
								<Image source={ICON.arrRight} style={styles.iconSize} />
							</TouchableOpacity>
						</View>

						<ScrollView horizontal={true}>
							{resLikeList.map(
								({ match_seq, req_member_seq, img_path }: { match_seq: any; req_member_seq: any; img_path: string }) => (
									<SpaceView key={match_seq} viewStyle={styles.circleBox} mr={16}>
										<Image
											source={{ uri: img_path !== '' ? img_path : undefined }}
											style={styles.circleBoxImg}
										/>
									</SpaceView>
								),
							)}
						</ScrollView>
					</SpaceView>

					<View style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>
							새 매칭
							<CommonText color={ColorType.primary}> {matchCnt}</CommonText>건
						</CommonText>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('Main', {
									screen: 'Storage',
								});
							}}
						>
							<Image source={ICON.arrRight} style={styles.iconSize} />
						</TouchableOpacity>
					</View>

					<ScrollView horizontal={true}>
						{matchList.map(
							({ match_seq, trgt_member_seq, img_path }: { match_seq: any; trgt_member_seq: any; img_path: string }) => (
								<SpaceView key={match_seq} viewStyle={styles.circleBox} mr={16}>
									<Image
										source={{ uri: img_path !== '' ? img_path : undefined }}
										style={styles.circleBoxImg}
									/>
								</SpaceView>
							),
						)}
					</ScrollView>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							매칭 설정
						</CommonText>
					</SpaceView>

					<TouchableOpacity
						style={styles.rowStyle}
						onPress={() => {
							navigation.navigate('Preference');
						}} >
						<CommonText fontWeight={'500'}>내 선호 이성</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>

					<View style={styles.rowStyle}>
						<ToolTip
							title={'내 프로필 공개'}
							desc={'내 프로필을 이성들에게 공개할지 설정하는 기능입니다.'}
						/>
						<CommonSwich
							callbackFn={(value: boolean) => {
								updateMemberInfo('01', value ? 'Y' : 'N');
							}}
							isOn={memberBase.match_yn == 'Y' ? true : false}
						/>
					</View>

					<View style={styles.rowStyle}>
						<ToolTip
							title={'아는 사람 소개'}
							desc={'아는 사람에게 내 프로필을 공개할지 설정할지 하는 기능입니다.'}
						/>
						<CommonSwich
							callbackFn={(value: boolean) => {
								updateMemberInfo('02', value ? 'Y' : 'N');
							}}
							isOn={memberBase.friend_match_yn == 'Y' ? true : false}
						/>
					</View>
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							그 외
						</CommonText>
					</SpaceView>
					<TouchableOpacity
						style={styles.rowStyle}
						onPress={() => {
							// 실시간성 회원 데이터 조회
							const goPage = async () => {
								const result = await axios
									.post(
										properties.api_domain + '/board/selectBoardList',
										{
											'api-key': 'U0FNR09CX1RPS0VOXzAx',
										},
										{
											headers: {
												'jwt-token': jwtToken,
											},
										},
									)
									.then(function (response) {
										navigation.navigate('Board0', {
											boardList: response.data.boardList,
										});

										// 게시판 목록 셋팅
										let boardList = new Array();
										/* response.data?.boardList?.map(({ board_seq, board_code, title, contents }: { board_seq: any, board_code: any, title: any, contents: any }) => {
											const dataJson = { req_member_seq : String, img_path : '' };

											dataJson.req_member_seq(req_member_seq);
											dataJson.img_path = img_path;

											resLikeDataList.push(dataJson);
										}); */
									})
									.catch(function (error) {
										console.log('error ::: ', error);
									});
							};

							goPage();
						}}
					>
						<CommonText fontWeight={'500'}>최근 소식</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.rowStyle}
						onPress={() => {
							navigation.navigate('Profile');
						}}
					>
						<CommonText fontWeight={'500'}>내 계정 정보</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle} onPress={terms_onOpen}>
						<CommonText fontWeight={'500'}>이용약관</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle} onPress={privacy_onOpen}>
						<CommonText fontWeight={'500'}>개인정보 취급방침</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
				</SpaceView>
			</ScrollView>

			{/* ###############################################
                     내 선호 이성 팝업
         ############################################### */}
			{/* <Modalize
            ref={ideal_modalizeRef}
            adjustToContentHeight={false}
            handleStyle={modalStyle.modalHandleStyle}
            modalStyle={modalStyle.modalContainer}>

            <Preference onCloseFn={ideal_onClose} idealTypeData={member.idealType} />
         </Modalize> */}

			{/* ###############################################
                     프로필 재심사 팝업
         ############################################### */}
			<Modal visible={profileReAprPopup} transparent={true}>
				<View style={modalStyle.modalBackground}>
					<View style={modalStyle.modalStyle1}>
						<SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
							<CommonText fontWeight={'700'} type={'h4'}>
								프로필 재심사
							</CommonText>
						</SpaceView>

						<SpaceView viewStyle={layoutStyle.alignCenter}>
							<CommonText type={'h5'}>프로필 재심사 대기열에 등록하시겠습니까?</CommonText>
							<CommonText type={'h5'} color={ColorType.red}>패스 x10</CommonText>
						</SpaceView>

						<View style={modalStyle.modalBtnContainer}>
							<TouchableOpacity
								style={modalStyle.modalBtn}
								onPress={() => setProfileReAprPopup(false)}
							>
								<CommonText fontWeight={'500'}>취소</CommonText>
							</TouchableOpacity>
							<View style={modalStyle.modalBtnline} />
							<TouchableOpacity style={modalStyle.modalBtn} onPress={() => profileReexProc()}>
								<CommonText fontWeight={'500'} color={ColorType.red}>
									확인
								</CommonText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* ###############################################
                     이용약관 팝업
         ############################################### */}
			<Modalize
				ref={terms_modalizeRef}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
				adjustToContentHeight={false}

				FooterComponent={
					<>
					   <SpaceView mb={16}>
						  <CommonBtn value={'확인'} 
								   type={'primary'}
								   onPress={terms_onClose}/>
					   </SpaceView>
					</>
				 }

				 HeaderComponent={
					<>
						<View style={modalStyle.modalHeaderContainer}>
							<CommonText fontWeight={'700'} type={'h3'}>
								이용약관
							</CommonText>
							<TouchableOpacity onPress={terms_onClose}>
								<Image source={ICON.xBtn} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</>
				} >
				
				<View style={[modalStyle.modalBody, layoutStyle.flex1]}>
					{/* <SpaceView mb={24}>
						<CommonDatePicker />
					</SpaceView> */}

					<SpaceView mb={24} viewStyle={{ width: width - 32, backgroundColor: Color.grayF8F8 }}>
						<Terms />
					</SpaceView>
				</View>
			</Modalize>

			{/* ###############################################
                     개인정보 취급방침 팝업
         ############################################### */}
			<Modalize
				ref={privacy_modalizeRef}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
				adjustToContentHeight={false}
				FooterComponent={
					<>
					   <SpaceView mb={16}>
						  <CommonBtn value={'확인'} 
								   type={'primary'}
								   onPress={privacy_onClose}/>
					   </SpaceView>
					</>
				 }

				 HeaderComponent={
					<>
						<View style={modalStyle.modalHeaderContainer}>
							<CommonText fontWeight={'700'} type={'h3'}>
								개인정보 취급방침
							</CommonText>
							<TouchableOpacity onPress={privacy_onClose}>
								<Image source={ICON.xBtn} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</>
				} >
				
				<View style={[modalStyle.modalBody, layoutStyle.flex1]}>
					{/* <SpaceView mb={24}>
						<CommonDatePicker />
					</SpaceView> */}

					<SpaceView mb={24} viewStyle={{ width: width - 32, backgroundColor: Color.grayF8F8 }}>
						<Privacy />
					</SpaceView>
				</View>
			</Modalize>
		</>
	);
};
