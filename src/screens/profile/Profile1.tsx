import * as React from 'react';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Image, ScrollView, TextInput, View } from 'react-native';
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

/* ################################################################################################################
###################################################################################################################
###### 프로필 관리
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup02'>;
	route : RouteProp<StackParamList, 'Signup02'>;
}

export const Profile1 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [orgImgUrl01, setOrgImgUrl01] = React.useState<any>(null);
	const [orgImgUrl02, setOrgImgUrl02] = React.useState<any>(null);
	const [orgImgUrl03, setOrgImgUrl03] = React.useState<any>(null);
	const [orgImgUrl04, setOrgImgUrl04] = React.useState<any>(null);
	const [orgImgUrl05, setOrgImgUrl05] = React.useState<any>(null);

	const imgFileData01 = { uri : "", fileName : "", type : "" }
	const imgFileData02 = { uri : "", fileName : "", type : "" }
	const imgFileData03 = { uri : "", fileName : "", type : "" }
	const imgFileData04 = { uri : "", fileName : "", type : "" }
	const imgFileData05 = { uri : "", fileName : "", type : "" }

	const imgFileJson = {
		uri : "",
		fileName : "",
		type : ""
	}

	const fileCallBack1 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData01.uri = uri; imgFileData01.fileName = fileName;	imgFileData01.type = type;
	};

	const fileCallBack2 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData02.uri = uri; imgFileData02.fileName = fileName;	imgFileData02.type = type;
	};

	const fileCallBack3 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData03.uri = uri; imgFileData03.fileName = fileName;	imgFileData03.type = type;
	};

	const fileCallBack4 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData04.uri = uri; imgFileData04.fileName = fileName;	imgFileData04.type = type;
	};

	const fileCallBack5 = (uri:string, fileName:string, fileSize: number, type: string) => {
		imgFileData05.uri = uri; imgFileData05.fileName = fileName;	imgFileData05.type = type;
	};


	// 회원 이미지 정보 조회
	const getMemberImage = async () => {

		const result = await axios.post('http://211.104.55.151:8080/join/selectMemberImage', {
			'api-key' : 'U0FNR09CX1RPS0VOXzAx'
			, 'member_seq' : String(await properties.get_json_data('member_seq'))
		}
		, {
			headers: {
				'jwt-token' : String(await properties.jwt_token())
			}
		})
		.then(function (response) {
			console.log("response ::: " + JSON.stringify(response.data));
	
			if(null != response.data.imgList) {
				console.log("imgList ::: ", response.data.imgList);
	
				response.data?.imgList?.map(({ order_seq, file_name, file_path }: { order_seq: any, file_name: any, file_path: any }) => {
					console.log("file_name ::: ", file_name);
					console.log("file_path ::: ", file_path);

					const localDomain = 'http://211.104.55.151:8080/uploads';

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

		const file01 = { uri: imgFileData01.uri, type: imgFileData01.type, name: imgFileData01.fileName };
		const file02 = { uri: imgFileData02.uri, type: imgFileData02.type, name: imgFileData02.fileName };
		const file03 = { uri: imgFileData03.uri, type: imgFileData03.type, name: imgFileData03.fileName };
		const file04 = { uri: imgFileData04.uri, type: imgFileData04.type, name: imgFileData04.fileName };
		const file05 = { uri: imgFileData05.uri, type: imgFileData05.type, name: imgFileData05.fileName };

		data.append("memberSeq", member_seq);
		if(imgFileData01.uri != "" && typeof imgFileData01.uri != "undefined") {	data.append("file01", file01); }
		if(imgFileData02.uri != "" && typeof imgFileData02.uri != "undefined") {	data.append("file02", file02); }
		if(imgFileData03.uri != "" && typeof imgFileData03.uri != "undefined") {	data.append("file03", file03); }
		if(imgFileData04.uri != "" && typeof imgFileData04.uri != "undefined") {	data.append("file04", file04); }
		if(imgFileData05.uri != "" && typeof imgFileData05.uri != "undefined") {	data.append("file05", file05); }

		console.log("data :::: ", data);

		const result = await fetch('http://211.104.55.151:8080/join/insertMemberProfile/', {
			method: 'POST',
			body: data,
		})
		.then((response) => response.json())
		.then((response) => {
			console.log('response :::: ', response);

			if(response.result_code == "0000") {
				navigation.navigate('Main', {
					screen: 'Roby'
				});
			}
		})
		.catch((error) => {
			console.log('error', error);
		});
	}


	/*
	 * 최초 실행
	 */
	React.useEffect(() => {

		// 회원 이미지 정보 조회
		getMemberImage();

	}, []);

	return (
		<>
			<CommonHeader title={'프로필 관리'} />
			<ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
				<SpaceView viewStyle={styles.container}>
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

					{/* <SpaceView mb={54}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'700'} type={'h3'}>
								내 프로필 평점
							</CommonText>
						</SpaceView>

						<SpaceView>
							<ProfileItem isOnlyProfileItem={true} />
						</SpaceView>
					</SpaceView> */}

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
