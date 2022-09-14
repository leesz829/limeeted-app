import { styles, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Modalize } from 'react-native-modalize';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ImagePicker } from 'component/ImagePicker';
import { SecondAuthPopup } from 'screens/commonpopup/SecondAuthPopup';
import axios from 'axios';

/* ################################################################################################################
###################################################################################################################
###### 2차 인증 정보
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup01'>;
	route : RouteProp<StackParamList, 'Signup01'>;

	jobFile: string;
}

export const Signup01 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	console.log("## Signup01 memberSeq ::: ", props.route.params.memberSeq);
	console.log("## Signup01 params ::: ", props.route.params);

	const [orgJobFileUrl, setOrgJobFileUrl] = React.useState<any>(null);
	const [orgEduFileUrl, setOrgEduFileUrl] = React.useState<any>(null);
	const [orgIncomeFileUrl, setOrgIncomeFileUrl] = React.useState<any>(null);
	const [orgAssetFileUrl, setOrgAssetFileUrl] = React.useState<any>(null);
	const [orgSnsFileUrl, setOrgSnsFileUrl] = React.useState<any>(null);
	const [orgVehiceFileUrl, setOrgVehiceFileUrl] = React.useState<any>(null);

	let [jobItem, setJobItem] = React.useState('');
	let [eduItem, setEduItem] = React.useState('');
	let [snsItem, setSnsItem] = React.useState('');
	let [vehiceItem, setVehiceItem] = React.useState('');

	let jobFileData = { uri : "", name : "", type : "" }
	let eduFileData = { uri : "", name : "", type : "" }
	let incomeFileData = { uri : "", name : "", type : "" }
	let assetFileData = { uri : "", name : "", type : "" }
	let snsFileData = { uri : "", name : "", type : "" }
	let vehiceFileData = { uri : "", name : "", type : "" }

	/* const {id}  = props.route.params;
	const {name} = props.route.params;
	const {age}  = props.route.params;
	const {gender}  = props.route.params;
	const {hp}  = props.route.params; */

	// 직업 Pop
	const job_modalizeRef = useRef<Modalize>(null);
	const job_onOpen = () => { job_modalizeRef.current?.open(); };
	const job_onClose = () => {	job_modalizeRef.current?.close(); };

	// 학위 Pop
	const edu_modalizeRef = useRef<Modalize>(null);
	const edu_onOpen = () => { edu_modalizeRef.current?.open(); };
	const edu_onClose = () => {	edu_modalizeRef.current?.close(); };

	// 소득 Pop
	const income_modalizeRef = useRef<Modalize>(null);
	const income_onOpen = () => { income_modalizeRef.current?.open(); };
	const income_onClose = () => {	income_modalizeRef.current?.close(); };

	// 자산 Pop
	const asset_modalizeRef = useRef<Modalize>(null);
	const asset_onOpen = () => { asset_modalizeRef.current?.open(); };
	const asset_onClose = () => {	asset_modalizeRef.current?.close(); };

	// SNS Pop
	const sns_modalizeRef = useRef<Modalize>(null);
	const sns_onOpen = () => { sns_modalizeRef.current?.open(); };
	const sns_onClose = () => {	sns_modalizeRef.current?.close(); };

	// 차량 Pop
	const vehice_modalizeRef = useRef<Modalize>(null);
	const vehice_onOpen = () => { vehice_modalizeRef.current?.open(); };
	const vehice_onClose = () => {	vehice_modalizeRef.current?.close(); };


	// 직업 파일 callBack 함수
	const jobFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		jobFileData.uri = uri; jobFileData.name = fileName;	jobFileData.type = type;
		setJobItem(item);
	};

	// 학위 파일 callBack 함수
	const eduFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		eduFileData.uri = uri; eduFileData.name = fileName;	eduFileData.type = type;
		setEduItem(item);
	};

	// 소득 파일 callBack 함수
	const incodeFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		incomeFileData.uri = uri; incomeFileData.name = fileName; incomeFileData.type = type;
	};

	// 자산 파일 callBack 함수
	const assetFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		assetFileData.uri = uri; assetFileData.name = fileName;	assetFileData.type = type;
	};

	// SNS 파일 callBack 함수
	const snsFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		snsFileData.uri = uri; snsFileData.name = fileName;	snsFileData.type = type;
		setSnsItem(item);
	};

	// 차량 파일 callBack 함수
	const vehiceFileCallBack = ( uri:string, fileName:string, fileSize: number, type: string, item: string) => {
		vehiceFileData.uri = uri; vehiceFileData.name = fileName;	vehiceFileData.type = type;
		setVehiceItem(item);
	};


	/*
	 * 최초 실행
	 */
	React.useEffect(() => {

		// 인증 정보 조회
		axios.post('http://211.104.55.151:8080/join/selectMemberSecondAuth/', {
			member_seq : props.route.params.memberSeq
		})
		.then(function (response) {
			console.log("response ::: " + JSON.stringify(response.data));
	
			if(null != response.data.authList) {
				console.log("authList ::: ", response.data.authList);
	
				response.data?.authList?.map(({ file_gubun, file_name, file_path }: { file_gubun: any, file_name: any, file_path: any }) => {
					console.log("file_name ::: ", file_name);
					console.log("file_path ::: ", file_path);

					const localDomain = 'http://211.104.55.151:8080/uploads';

					if(file_gubun == 'F_JOB') { setOrgJobFileUrl(localDomain + file_path + file_name); }
					else if(file_gubun == 'F_EDU') { setOrgEduFileUrl(localDomain + file_path + file_name); }
					else if(file_gubun == 'F_INCOME') { setOrgIncomeFileUrl(localDomain + file_path + file_name); }
					else if(file_gubun == 'F_ASSET') { setOrgAssetFileUrl(localDomain + file_path + file_name); }
					else if(file_gubun == 'F_SNS') { setOrgSnsFileUrl(localDomain + file_path + file_name); }
					else if(file_gubun == 'F_VEHICE') { setOrgVehiceFileUrl(localDomain + file_path + file_name); }
				});
			}
		})
		.catch(function (error) {
			console.log(error);
		});

	}, []);
	
	

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	const showImage = () => {
		const options = {
			noData: true,
			mediaType: 'photo' as const
		};

		launchImageLibrary(options, (response) => {
	
			if(response.assets) {
				const imageArray = response.assets[0].uri;
				console.warn(imageArray);
			}
		});

		/*launchCamera({mediaType:'photo'}, response => {
			console.warn(response);
		});*/	
	}

	return (
		<>
			<CommonHeader title={'프로필 2차 인증'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>

				<SpaceView mb={24}>
					<CommonText>
						아래 버튼 선택 후 인증 뱃지를 등록할 수 있습니다.{'\n'}
						뱃지를 추가하여 자신을 어필해보세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={16}>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft} 
												onPress={job_onOpen} >
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.job} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>직업</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										직업 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}
												onPress={edu_onOpen}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.degree} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>학위</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										학위 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft}
												onPress={income_onOpen}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.asset} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>소득</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										소득 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}
												onPress={asset_onOpen}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.income} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>자산</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										자산 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft}
												onPress={sns_onOpen}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.sns} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>SNS</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										SNS 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight}
												onPress={vehice_onOpen}>
								<View style={styles.badgeBox}>
									<SpaceView mb={16}>
										<Image source={ICON.vehicle} style={styles.iconSize40} />
									</SpaceView>

									<SpaceView mb={8}>
										<View style={[layoutStyle.row, layoutStyle.alignCenter]}>
											<CommonText>차량</CommonText>
											<Image source={ICON.arrRight} style={styles.iconSize} />
										</View>
									</SpaceView>

									<CommonText color={ColorType.gray6666} type={'h5'}>
										프로필 2차 인증 위한{'\n'}
										차량 설명 문구
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn 
							value={'다음 (2/4)'} 
							type={'primary'} 
							onPress={() => {
								const data = new FormData();

								data.append("memberSeq", props.route.params.memberSeq);
								data.append("job_name", jobItem);
								data.append("edu_ins", eduItem);
								data.append("instagram_id", snsItem);
								data.append("vehicle", jobItem);

								if(jobFileData.uri != "") {	data.append("jobFile", jobFileData); }
								if(eduFileData.uri != "") {	data.append("eduFile", eduFileData); }
								if(incomeFileData.uri != "") {	data.append("incomeFile", incomeFileData); }
								if(assetFileData.uri != "") {	data.append("assetFile", assetFileData); }
								if(snsFileData.uri != "") {	data.append("snsFile", snsFileData); }
								if(vehiceFileData.uri != "") {	data.append("vehiceFile", vehiceFileData); }

								console.log("data ::: ", data);

								fetch('http://211.104.55.151:8080/join/insertMemberSecondAuth/', {
									method: 'POST',
									body: data,
								})
								.then((response) => response.json())
								.then((response) => {
									console.log('response :::: ', response);

									if(response.result_code == "0000") {
										navigation.navigate('Signup02', {
											memberSeq : props.route.params.memberSeq
										});
									}
								})
								.catch((error) => {
									console.log('error', error);
								});


								//navigation.navigate('Signup02');
							}}
					/>
				</SpaceView>
			</ScrollView>

			
			{/* ###############################################
								직업 인증 팝업
			############################################### */}
			<Modalize
				ref={job_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'JOB'} onCloseFn={job_onClose} callbackFn={jobFileCallBack} orgFileUrl={orgJobFileUrl} />
			</Modalize>

			{/* ###############################################
								학위 인증 팝업
			############################################### */}
			<Modalize
				ref={edu_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'EDU'} onCloseFn={edu_onClose} callbackFn={eduFileCallBack} orgFileUrl={orgEduFileUrl} />
			</Modalize>

			{/* ###############################################
								소득 인증 팝업
			############################################### */}
			<Modalize
				ref={income_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'INCOME'} onCloseFn={income_onClose} callbackFn={incodeFileCallBack} orgFileUrl={orgIncomeFileUrl} />
			</Modalize>

			{/* ###############################################
								자산 인증 팝업
			############################################### */}
			<Modalize
				ref={asset_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'ASSET'} onCloseFn={asset_onClose} callbackFn={assetFileCallBack} orgFileUrl={orgAssetFileUrl} />
			</Modalize>

			{/* ###############################################
								SNS 인증 팝업
			############################################### */}
			<Modalize
				ref={sns_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'SNS'} onCloseFn={sns_onClose} callbackFn={snsFileCallBack} orgFileUrl={orgSnsFileUrl} />
			</Modalize>

			{/* ###############################################
								차량 인증 팝업
			############################################### */}
			<Modalize
				ref={vehice_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}>

				<SecondAuthPopup type={'VEHICE'} onCloseFn={vehice_onClose} callbackFn={vehiceFileCallBack} orgFileUrl={orgVehiceFileUrl} />
			</Modalize>


		</>
	);
};
