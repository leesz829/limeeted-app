import * as React from 'react';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Image, ScrollView, TextInput, View, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import { ProfileItem } from 'component/MainProfileSlider';
import CommonHeader from 'component/CommonHeader';
import { CommonBtn } from 'component/CommonBtn';
import axios from 'axios';
import * as properties from 'utils/properties';
import { AsyncStorage } from 'react-native';

/* ################################################################################################################
###################################################################################################################
###### 프로필 관리
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Profile1'>;
	route : RouteProp<StackParamList, 'Profile1'>;
}

export const Profile1 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [imgData, setImgData] = React.useState({
		orgImgUrl01: ''
		, orgImgUrl02: ''
		, orgImgUrl03: ''
		, orgImgUrl04: ''
		, orgImgUrl05: ''
		, imgFile01: { uri : "", name : "", type : ""	}
		, imgFile02: { uri : "", name : "", type : ""	}
		, imgFile03: { uri : "", name : "", type : ""	}
		, imgFile04: { uri : "", name : "", type : ""	}
		, imgFile05: { uri : "", name : "", type : ""	}
	});

	// 프로필 사진
	const [orgImgUrl01, setOrgImgUrl01] = React.useState<any>(null);
	const [orgImgUrl02, setOrgImgUrl02] = React.useState<any>(null);
	const [orgImgUrl03, setOrgImgUrl03] = React.useState<any>(null);
	const [orgImgUrl04, setOrgImgUrl04] = React.useState<any>(null);
	const [orgImgUrl05, setOrgImgUrl05] = React.useState<any>(null);

	// 프로필 2차 인증 여부
	const [isJob, setIsJob] = React.useState<any>(false);
	const [isEdu, setIsEdu] = React.useState<any>(false);
	const [isIncome, setIsIncome] = React.useState<any>(false);
	const [isAsset, setIsAsset] = React.useState<any>(false);
	const [isSns, setIsSns] = React.useState<any>(false);
	const [isVehicle, setIsVehicle] = React.useState<any>(false);

	// 인증 갯수
	const [authCnt, setAuthCnt] = React.useState(0);

	const fileCallBack1 = (uri:string, fileName:string, fileSize: number, type: string) => {
		if(uri != null && uri != '') {
			setImgData({
				...imgData
				, imgFile01 : {uri: uri, name: fileName, type: type}
			})
		}
	};
	const fileCallBack2 = (uri:string, fileName:string, fileSize: number, type: string) => {
		if(uri != null && uri != '') {
			setImgData({
				...imgData
				, imgFile02 : {uri: uri, name: fileName, type: type}
			})
		}
	};
	const fileCallBack3 = (uri:string, fileName:string, fileSize: number, type: string) => {
		if(uri != null && uri != '') {
			setImgData({
				...imgData
				, imgFile03 : {uri: uri, name: fileName, type: type}
			})
		}
	};
	const fileCallBack4 = (uri:string, fileName:string, fileSize: number, type: string) => {
		if(uri != null && uri != '') {
			setImgData({
				...imgData
				, imgFile04 : {uri: uri, name: fileName, type: type}
			})
		}
	};
	const fileCallBack5 = (uri:string, fileName:string, fileSize: number, type: string) => {
		if(uri != null && uri != '') {
			setImgData({
				...imgData
				, imgFile05 : {uri: uri, name: fileName, type: type}
			})
		}
	};

	/*
	 * 최초 실행
	 */
	React.useEffect(() => {
		if(props.route.params.imgList != null) {
			props.route.params.imgList.map(({ file_name, file_path, order_seq }: { file_name: any, file_path: any, order_seq: any }) => {
				if(order_seq == 1) { setOrgImgUrl01(properties.img_domain + file_path + file_name);	}
				if(order_seq == 2) { setOrgImgUrl02(properties.img_domain + file_path + file_name);	}
				if(order_seq == 3) { setOrgImgUrl03(properties.img_domain + file_path + file_name);	}
				if(order_seq == 4) { setOrgImgUrl04(properties.img_domain + file_path + file_name);	}
				if(order_seq == 5) { setOrgImgUrl05(properties.img_domain + file_path + file_name);	}
			});
		}

		if(props.route.params.authList != null) {
			let authCnt = 0;
			props.route.params.authList.map(({ second_auth_code }: { second_auth_code: any }) => {
				if(second_auth_code == 'JOB') { setIsJob(true); }
				if(second_auth_code == 'EDU') { setIsEdu(true); }
				if(second_auth_code == 'INCOME') { setIsIncome(true); }
				if(second_auth_code == 'ASSET') { setIsAsset(true); }
				if(second_auth_code == 'SNS') { setIsSns(true); }
				if(second_auth_code == 'VEHICLE') { setIsVehicle(true); }

				authCnt++;
			});

			setAuthCnt(authCnt);
		}

		// 회원 이미지 정보 조회
		//getMemberImage();

	}, [props.route]);


	// 회원 이미지 정보 조회
	const getMemberImage = async () => {

		const result = await axios.post(properties.api_domain + '/join/selectMemberImage', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : String(await properties.get_json_data('member_seq'))
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {	
			if(null != response.data.imgList) {
	
				response.data?.imgList?.map(({ order_seq, file_name, file_path }: { order_seq: any, file_name: any, file_path: any }) => {
					const localDomain = properties.api_domain + '/uploads';

					if(order_seq == '1') { setOrgImgUrl01(localDomain + file_path + file_name); }
					else if(order_seq == '2') { setOrgImgUrl02(localDomain + file_path + file_name); }
					else if(order_seq == '3') { setOrgImgUrl03(localDomain + file_path + file_name); }
					else if(order_seq == '4') { setOrgImgUrl04(localDomain + file_path + file_name); }
					else if(order_seq == '5') { setOrgImgUrl05(localDomain + file_path + file_name); }
				});
			}
		})
		.catch(function (error) {
			console.log('error ::: ' , error);
		});
	}

	// 프로필 관리 저장
	const saveMemberProfile = async () => {
		const member_seq = Number(await properties.get_json_data('member_seq'));
		const data = new FormData();

		data.append("memberSeq", member_seq);
		if(imgData.imgFile01.uri != "") {	data.append("file01", imgData.imgFile01); }
		if(imgData.imgFile02.uri != "") {	data.append("file02", imgData.imgFile02); }
		if(imgData.imgFile03.uri != "") {	data.append("file03", imgData.imgFile03); }
		if(imgData.imgFile04.uri != "") {	data.append("file04", imgData.imgFile04); }
		if(imgData.imgFile05.uri != "") {	data.append("file05", imgData.imgFile05); }

		const result = await fetch(properties.api_domain + '/member/saveProfileImage/', {
			method: 'POST',
			headers: {
				"Content-Type": "multipart/form-data",
				'jwt-token' : String(await properties.jwt_token())
			},
			body: data,
		})
		.then((res) => res.json())
		.then((res) => {
			if(res.result_code == "0000") {

				AsyncStorage.setItem('memberBase', JSON.stringify(res.memberBase));
				AsyncStorage.setItem('memberImgList', JSON.stringify(res.memberImgList));

				navigation.navigate('Main', {
					screen: 'Roby',
					params: {
						memberBase: res.memberBase
					}
				});
			}
		})
		.catch((error) => {
			console.log('error', error);
		});
	}


	return (
		<>
			<CommonHeader title={'프로필 관리'} />
			<ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
				<SpaceView viewStyle={styles.container}>

					{/* ########### 프로필 이미지 ########### */}
					<SpaceView mb={48} viewStyle={styles.halfContainer}>

						<View style={styles.halfItemLeft}>
							<ImagePicker isBig={true} callbackFn={fileCallBack1} uriParam={orgImgUrl01} />
						</View>

						<View style={styles.halfItemRight}>
							<SpaceView mb={16} viewStyle={layoutStyle.row}>
								<SpaceView mr={8}>
									<ImagePicker isBig={false} callbackFn={fileCallBack2} uriParam={orgImgUrl02} />
								</SpaceView>
								<SpaceView ml={8}>
									<ImagePicker isBig={false} callbackFn={fileCallBack3} uriParam={orgImgUrl03} />
								</SpaceView>
							</SpaceView>

							<SpaceView viewStyle={layoutStyle.row}>
								<SpaceView mr={8}>
									<ImagePicker isBig={false} callbackFn={fileCallBack4} uriParam={orgImgUrl04} />
								</SpaceView>
								<SpaceView ml={8}>
									<ImagePicker isBig={false} callbackFn={fileCallBack5} uriParam={orgImgUrl05} />
								</SpaceView>
							</SpaceView>
						</View>

					</SpaceView>

					{/* ########### 프로필 2차 인증 ########### */}
					<SpaceView mb={54}>

						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<TouchableOpacity style={[layoutStyle.row, layoutStyle.alignCenter]}
													onPress={() => {
														navigation.navigate('SecondAuth');
													}}>
									<CommonText type={'h3'} fontWeight={'700'}>
										프로필 2차 인증
									</CommonText>
									<Image source={ICON.arrRight} style={styles.iconSize} />
								</TouchableOpacity>
							</View>

							<View style={[layoutStyle.rowBetween]}>
								<View style={styles.statusBtn}>
									<CommonText type={'h6'} color={ColorType.white}>
										TIER {authCnt}
									</CommonText>
								</View>
								<Image source={ICON.medalAll} style={styles.iconSize32} />
							</View>
						</SpaceView>

						<SpaceView mb={48}>
							<SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
								<View style={styles.profileBox}>
									<Image source={ICON.job} style={styles.iconSize48} />
									<CommonText type={'h5'}>직업</CommonText>
									{!isJob ? (
										<View style={styles.disabled} />
									) : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.degree} style={styles.iconSize48} />
									<CommonText type={'h5'}>학위</CommonText>
									{!isEdu ? (
										<View style={styles.disabled} />
									) : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.income} style={styles.iconSize48} />
									<CommonText type={'h5'}>소득</CommonText>
									{!isIncome ? (
										<View style={styles.disabled} />
									) : null}
								</View>
							</SpaceView>

							<View style={[layoutStyle.rowBetween]}>
								<View style={styles.profileBox}>
									<Image source={ICON.asset} style={styles.iconSize48} />
									<CommonText type={'h5'}>자산</CommonText>
									{!isAsset ? (
										<View style={styles.disabled} />
									) : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.sns} style={styles.iconSize48} />
									<CommonText type={'h5'}>SNS</CommonText>
									{!isSns ? (
										<View style={styles.disabled} />
									) : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.vehicle} style={styles.iconSize48} />
									<CommonText type={'h5'}>차량</CommonText>
									{!isVehicle ? (
										<View style={styles.disabled} />
									) : null}
								</View>
							</View>
						</SpaceView>
					</SpaceView>

					{/* ########### 인터뷰 ########### */}
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
									<CommonText fontWeight={'700'} type={'h5'}>
										15개의 질의
									</CommonText>
									가 등록되어있어요
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							<SpaceView mb={32} viewStyle={layoutStyle.row}>
								<SpaceView mr={16}>
									<Image source={ICON.manage} style={styles.iconSize40} />
								</SpaceView>

								<View style={layoutStyle.row}>
									<View style={styles.interviewLeftTextContainer}>
										<TextInput
											value={'첫번째 질문이에요 질문에 성실하게 답해주세요'}
											multiline={true}
											style={styles.inputTextStyle}
										/>
									</View>
									<SpaceView ml={8}>
										<Image source={ICON.penCircleGray} style={styles.iconSize24} />
									</SpaceView>
								</View>
							</SpaceView>

							<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
								<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
									<CommonText type={'h5'} color={ColorType.white}>
										첫번째 질문에 대한 답변이에요{'\n'}
										저는 이렇게 생각해요{'\n'}
										관현악이며, 새 풀이 것이다. 얼음 뛰노는{'\n'}
										예가 많이 인생에 힘있다.
									</CommonText>
								</SpaceView>
								<SpaceView>
									<Image source={ICON.boy} style={styles.iconSize40} />
								</SpaceView>
							</SpaceView>

							<SpaceView mb={32} viewStyle={layoutStyle.row}>
								<SpaceView mr={16}>
									<Image source={ICON.manage} style={styles.iconSize40} />
								</SpaceView>

								<View style={layoutStyle.row}>
									<View style={styles.interviewLeftTextContainer}>
										<TextInput
											value={'두번째 질문이에요'}
											multiline={true}
											style={styles.inputTextStyle}
										/>
									</View>
									<SpaceView ml={8}>
										<Image source={ICON.penCircleGray} style={styles.iconSize24} />
									</SpaceView>
								</View>
							</SpaceView>

							<SpaceView viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
								<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
									<CommonText type={'h5'} color={ColorType.white}>
										그림자는 때까지 내려온 얼마나{'\n'}
										봄바람을 수 무한한 끓는다.
									</CommonText>
								</SpaceView>
								<SpaceView>
									<Image source={ICON.boy} style={styles.iconSize40} />
								</SpaceView>
							</SpaceView>
						</View>
					</SpaceView>
				</SpaceView>
			</ScrollView>
			<View style={styles.bottomBtnContainer}>
				<CommonBtn value={'저장'} 
							type={'primary'}
							onPress={() => {
								saveMemberProfile();
							}} />
			</View>
		</>
	);
};
