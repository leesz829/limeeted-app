import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp} from '@types';
import { useState, useEffect} from 'react';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import React, { useRef } from 'react';
import { Image, ScrollView, View, TouchableOpacity, ImagePropTypes } from 'react-native';
import { ICON, IMAGE, PROFILE_IMAGE } from 'utils/imageUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MemberData } from '@types';
import * as properties from 'utils/properties';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { api_domain } from 'utils/properties';
import { Preference } from 'screens/commonpopup/Preference';


/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	// 회원 데이터
	const [member, setMember] = React.useState({
		base : MemberData
		, resLikeCnt : Number
		, resLikeList : [{
			req_member_seq : String,
			img_path : ''
		}]
		, matchCnt : Number
		, matchList : [{
			trgt_member_seq : String,
			img_path : ''
		}]
	});

	// ###### 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {
		selectMemberInfo();
	}, []);

	// 회원 정보 조회
	const selectMemberInfo = async () => {

		const result = await axios.post(api_domain + '/member/selectMemberInfo', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : String(await properties.get_json_data('member_seq'))
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {
			console.log("response.data :::: ", response.data);
			
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			} else {
				const member = JSON.parse(JSON.stringify(response.data));

				// 회원 데이터 AsyncStorage 저장
				AsyncStorage.clear();
				AsyncStorage.setItem('jwt-token', response.data.token_param.jwt_token);
				AsyncStorage.setItem('member_seq', String(response.data.member_seq));
				AsyncStorage.setItem('member_info', JSON.stringify(response.data), (err)=> {
					if(err){
						console.log("an error");
						throw err;
					}
					console.log("success");
				}).catch((err)=> {
					console.log("error is: " + err);
				});

				// 관심 목록 셋팅
				let resLikeDataList = new Array();
				response.data?.resLikeList?.map(({ req_member_seq, file_name, file_path }: { req_member_seq: any, file_name: any, file_path: any }) => {
					console.log("req_member_seq ::: ", req_member_seq);

					const img_path = properties.api_domain + '/uploads' + file_path + file_name;
					const dataJson = { req_member_seq : String, img_path : '' };

					dataJson.req_member_seq(req_member_seq);
					dataJson.img_path = img_path;

					resLikeDataList.push(dataJson);
				});
				
				// 매칭 목록 셋팅
				let matchDataList = new Array();
				response.data?.matchTrgtList?.map(({ trgt_member_seq, file_name, file_path }: { trgt_member_seq: any, file_name: any, file_path: any }) => {
					console.log("trgt_member_seq ::: ", trgt_member_seq);

					const img_path = properties.api_domain + '/uploads' + file_path + file_name;
					const dataJson = { trgt_member_seq : String, img_path : '' };

					dataJson.trgt_member_seq(trgt_member_seq);
					dataJson.img_path = img_path;

					matchDataList.push(dataJson);
				});


				setMember((value) => {
					return {
						...member
						, base: member
						, resLikeCnt: resLikeDataList.length
						, resLikeList: resLikeDataList
						, matchCnt: matchDataList.length
						, matchList: matchDataList
					}
				});

				/* setMember({
					...member
					, base: member
					, resLikeCnt: resLikeDataList.length
					, resLikeList: resLikeDataList
					, matchCnt: matchDataList.length
					, matchList: matchDataList
				});
 */
			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}


	this.setMember({

	});















	// 회원 정보 수정
	const updateMemberInfo = async (type:string, value:string) => {

		let matchYnParam = '';
		let friendMatchParam = '';

		let dataJson = {};

		/*
		 * 01 : 내 프로필 공개 
		 * 02 : 아는 사람 소개
		 */
		if(type == '01') {
			matchYnParam = value;
			friendMatchParam = member.base.friend_match_yn;

			dataJson = {
				'api-key' : 'U0FNR09CX1RPS0VOXzAx'
				, 'member_seq' : String(await properties.get_json_data('member_seq'))
				, 'match_yn' : matchYnParam
			}
		} else {
			matchYnParam = member.base.match_yn;
			friendMatchParam = value;

			dataJson = {
				'api-key' : 'U0FNR09CX1RPS0VOXzAx'
				, 'member_seq' : String(await properties.get_json_data('member_seq'))
				, 'friend_match_yn' : friendMatchParam
			}
		}

		const result = await axios.post(api_domain + '/member/updateMemberBase', dataJson
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {
			console.log("response.data :::: ", response.data);
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 내 선호 이성 Pop
	const ideal_modalizeRef = useRef<Modalize>(null);
	const ideal_onOpen = () => { ideal_modalizeRef.current?.open(); };
	const ideal_onClose = () => {	ideal_modalizeRef.current?.close(); };


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
						<Image source={{ uri : member.base.mst_img_path }} style={styles.profileImg} />
						{/* <Image source={PROFILE_IMAGE.profileM1} style={styles.profileImg} /> */}
						{/* <Image source={{uri : props.route.params.mstImg}} style={styles.profileImg} /> */}
						<View style={styles.profilePenContainer}>
							<TouchableOpacity onPress={() => {
													selectMemberInfo();

													navigation.navigate('Introduce', {
														member_seq : member.base.member_seq
														, introduce_comment : member.base.introduce_comment
														, business : member.base.business
														, job : member.base.job
														, job_name : member.base.job_name
														, height : member.base.height
														, form_body : member.base.form_body
														, religion : member.base.religion
														, drinking : member.base.drinking
														, smoking : member.base.smoking
													});
												}}>
								<Image source={ICON.pen} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={4}>
						<CommonText fontWeight={'700'} type={'h4'}>
							{member.base.nickname}, {member.base.age}
						</CommonText>
					</SpaceView>
					<SpaceView mb={16} viewStyle={styles.levelContainer}>
						<CommonText color={ColorType.gray6666} type={'h6'}>
							LV.{member.base.profile_tier != null ? member.base.profile_tier : 0}
						</CommonText>
					</SpaceView>

					<CommonText color={ColorType.gray6666}>{member.base.introduce_comment}</CommonText>
				</SpaceView>

				<View>
					<SpaceView mb={16}>
						<TouchableOpacity style={[layoutStyle.row, layoutStyle.alignCenter]}
											onPress={() => {
												navigation.navigate('Main', { 
													screen: 'Profile1'
												});
											}}>
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
									0
								</CommonText>
							</SpaceView>
							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								<Image source={ICON.star} style={styles.iconSize24} />
							</SpaceView>
							<ToolTip title={'기여 평점'} desc={'프로필 평점'} position={'bottomLeft'} />
						</View>

						<View style={[styles.halfItemRight, styles.profileContainer, layoutStyle.alignCenter]}>
							<SpaceView mb={4}>
								<CommonText fontWeight={'700'} type={'h2'}>
									0
								</CommonText>
							</SpaceView>

							<SpaceView mb={24} viewStyle={layoutStyle.rowCenter}>
								<Image source={ICON.star} style={styles.iconSize24} />
							</SpaceView>
							<ToolTip position={'bottomRight'} title={'프로필 평점'} desc={'프로필 평점'} />
						</View>
					</SpaceView>

					<SpaceView mb={48}>
						<CommonBtn
							type="purple"
							value="프로필 재심사"
							icon={ICON.refresh}
							iconSize={24}
							iconPosition={'right'}
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
								<CommonText color={ColorType.primary}> {member.resLikeCnt}</CommonText>건
							</CommonText>
							<TouchableOpacity onPress={() => {
													navigation.navigate('Main', { 
														screen: 'Storage'
													});
												}}>
								<Image source={ICON.arrRight} style={styles.iconSize} />
							</TouchableOpacity>						
						</View>

						<ScrollView horizontal={true}>
							{member.resLikeList.map(({ img_path }: { img_path: string }) => (
								<SpaceView viewStyle={styles.circleBox} mr={16}>
									<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.circleBoxImg} />
								</SpaceView>
							))}
						</ScrollView>
					</SpaceView>

					<View style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>
							새 매칭
							<CommonText color={ColorType.primary}> {member.matchCnt}</CommonText>건
						</CommonText>
						<TouchableOpacity onPress={() => {
												navigation.navigate('Main', { 
													screen: 'Storage'
												});
											}}>
							<Image source={ICON.arrRight} style={styles.iconSize} />
						</TouchableOpacity>			
					</View>

					<ScrollView horizontal={true}>
						{member.matchList.map(({ img_path }: { img_path: string }) => (
							<SpaceView viewStyle={styles.circleBox} mr={16}>
								<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.circleBoxImg} />
							</SpaceView>
						))}
					</ScrollView>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							매칭 설정
						</CommonText>
					</SpaceView>

					<TouchableOpacity style={styles.rowStyle} onPress={() => { navigation.navigate('Preference'); }}>
						<CommonText fontWeight={'500'}>내 선호 이성</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>

					<View style={styles.rowStyle}>
						<ToolTip title={'내 프로필 공개'} desc={'내 프로필을 이성들에게 공개할지 설정하는 기능입니다.'} />
						<CommonSwich callbackFn={(value:boolean) => { 
										updateMemberInfo('01', value ? 'Y' : 'N');
									}} 
						 			isOn={member.base.match_yn == 'Y' ? true : false} />
					</View>

					<View style={styles.rowStyle}>
						<ToolTip title={'아는 사람 소개'} desc={'아는 사람에게 내 프로필을 공개할지 설정할지 하는 기능입니다.'} />
						<CommonSwich callbackFn={(value:boolean) => { 
										updateMemberInfo('02', value ? 'Y' : 'N');
									}}  
									isOn={member.base.friend_match_yn == 'Y' ? true : false} />
					</View>
				</SpaceView>

				<SpaceView mb={40}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							그 외
						</CommonText>
					</SpaceView>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>최근 소식</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>내 계정 정보</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>이용약관</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>개인정보 취급방침</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>
				</SpaceView>
			</ScrollView>


			{/* ###############################################
							내 선호 이성 팝업
			############################################### */}
			<Modalize
				ref={ideal_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				{/* <Preference type={'VEHICE'} onCloseFn={vehice_onClose} callbackFn={vehiceFileCallBack} orgFileUrl={orgVehiceFileUrl} /> */}
			</Modalize>
		</>
	);
};
