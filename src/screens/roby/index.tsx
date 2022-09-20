import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp} from '@types';
import { useState, useEffect} from 'react';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { Image, ScrollView, View, TouchableOpacity, ImagePropTypes } from 'react-native';
import { ICON, IMAGE, PROFILE_IMAGE } from 'utils/imageUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MemberData } from '@types';
import * as properties from 'utils/properties';
import axios from 'axios';
//import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';
import { api_domain } from 'utils/properties';

/* ################################################################################################################
###### 로비
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<BottomParamList, 'Roby'>;
	route : RouteProp<BottomParamList, 'Roby'>;
}

export const Roby = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	// 회원 번호
	const [memberSeq, setMemberSeq] = React.useState('');

	// 회원 정보
	const [memberInfo, setMemberInfo] = React.useState<any>(MemberData);
	const [memberInfo2, setMemberInfo2] = React.useState({
		nickname : String,
		gender : String,
		age : String,
		comment : '',
		mst_img_path : '',
		profile_tier : String
	});

	// 새 관심 목록
	const [resLikeCnt, setResLikeCnt] = React.useState<any>();
	const [resLikeList, setResLikeList] = React.useState([{
		req_member_seq : String,
		img_path : ''
	}]);





	const getMemberInfo = async () => {
		AsyncStorage.getItem('member_info', (err, result : any) => {
			const member = JSON.parse(result);
			//console.log('member ::: ', member);

			setMemberInfo(member);
			setMemberInfo2({
				nickname : member.nickname,
				gender : member.gender,
				age : member.age,
				comment : member.comment,
				mst_img_path : member.mst_img_path,
				profile_tier : member.profile_tier
			})
		});
	}

	// 첫 렌더링 때 fetchNews() 한 번 실행
	React.useEffect(() => {

		//getMemberInfo();
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
			console.log("resLikeList :::: ", response.data.resLikeList);
			
			if(response.data.result_code != '0000'){
				console.log(response.data.result_msg);
				return false;
			} else {
				const member = JSON.parse(JSON.stringify(response.data));

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

				setMemberInfo(member);

				// 관심 목록 셋팅
				let resLikeDataList = new Array();
				response.data?.resLikeList?.map(({ req_member_seq, file_name, file_path }: { req_member_seq: any, file_name: any, file_path: any }) => {
					console.log("req_member_seq ::: ", req_member_seq);

					const img_path = properties.api_domain + '/uploads' + file_path + file_name;
					const resLikeDataJson = { req_member_seq : String, img_path : '' };

					resLikeDataJson.req_member_seq(req_member_seq);
					resLikeDataJson.img_path = img_path;

					resLikeDataList.push(resLikeDataJson);
				});
				setResLikeList(resLikeDataList);
				setResLikeCnt(resLikeDataList.length);

			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

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
						<Image source={{ uri : memberInfo.mst_img_path }} style={styles.profileImg} />
						{/* <Image source={PROFILE_IMAGE.profileM1} style={styles.profileImg} /> */}
						{/* <Image source={{uri : props.route.params.mstImg}} style={styles.profileImg} /> */}
						<View style={styles.profilePenContainer}>
							<TouchableOpacity onPress={() => {
													navigation.navigate('Introduce', {
														member_seq : memberInfo.member_seq
														, introduce_comment : memberInfo.introduce_comment
														, business : memberInfo.business
														, job : memberInfo.job
														, job_name : memberInfo.job_name
														, height : memberInfo.height
														, form_body : memberInfo.form_body
														, religion : memberInfo.religion
														, drinking : memberInfo.drinking
														, smoking : memberInfo.smoking
													});
												}}>
								<Image source={ICON.pen} style={styles.iconSize24} />
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={4}>
						<CommonText fontWeight={'700'} type={'h4'}>
							{memberInfo.nickname}, {memberInfo.age}
						</CommonText>
					</SpaceView>
					<SpaceView mb={16} viewStyle={styles.levelContainer}>
						<CommonText color={ColorType.gray6666} type={'h6'}>
							LV.{memberInfo.profile_tier != null ? memberInfo.profile_tier : 0}
						</CommonText>
					</SpaceView>

					<CommonText color={ColorType.gray6666}>{memberInfo.introduce_comment}</CommonText>
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
								<CommonText color={ColorType.primary}> {resLikeCnt}</CommonText>건
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
							{resLikeList.map(({ img_path }: { img_path: string }) => (
								<SpaceView viewStyle={styles.circleBox} mr={16}>
									<Image source={{ uri: img_path !== "" ? img_path : undefined }} style={styles.circleBoxImg} />
								</SpaceView>
							))}
						</ScrollView>
					</SpaceView>

					<View style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>
							새 매칭
							<CommonText color={ColorType.primary}> 0</CommonText>건
						</CommonText>

						<Image source={ICON.arrRight} style={styles.iconSize} />
					</View>

					<ScrollView horizontal={true}>
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} mr={16} />
						<SpaceView viewStyle={styles.circleBox} />
					</ScrollView>
				</SpaceView>

				<SpaceView mb={48}>
					<SpaceView mb={16}>
						<CommonText fontWeight={'700'} type={'h3'}>
							매칭 설정
						</CommonText>
					</SpaceView>

					<TouchableOpacity style={styles.rowStyle}>
						<CommonText fontWeight={'500'}>내 선호 이성</CommonText>
						<Image source={ICON.arrRight} style={styles.iconSize} />
					</TouchableOpacity>

					<View style={styles.rowStyle}>
						<ToolTip title={'내 프로필 공개'} desc={'내 프로필 공개'} />
						<CommonSwich />
					</View>

					<View style={styles.rowStyle}>
						<ToolTip title={'아는 사람 소개'} desc={'아는 사람 소개'} />
						<CommonSwich />
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
		</>
	);
};
