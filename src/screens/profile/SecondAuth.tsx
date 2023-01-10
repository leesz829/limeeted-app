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
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import * as hooksMember from 'hooks/member';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';

/* ################################################################################################################
###################################################################################################################
###### 2차 인증 정보
###################################################################################################################
################################################################################################################ */

export const SecondAuth = () => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const dispatch = useDispatch();	

	const jwtToken = hooksMember.getJwtToken();		// 토큰
	const memberSeq = hooksMember.getMemberSeq();	// 회원번호

	const [secondData, setSecondData] = React.useState({
		orgJobFileUrl: '',
		orgEduFileUrl: '',
		orgIncomeFileUrl: '',
		orgAssetFileUrl: '',
		orgSnsFileUrl: '',
		orgVehicleFileUrl: '',
		jobItem: '',
		eduItem: '',
		snsItem: '',
		vehicleItem: '',
		jobFile: { uri: '', name: '', type: '' },
		eduFile: { uri: '', name: '', type: '' },
		incomeFile: { uri: '', name: '', type: '' },
		assetFile: { uri: '', name: '', type: '' },
		snsFile: { uri: '', name: '', type: '' },
		vehicleFile: { uri: '', name: '', type: '' },
	});

	// 직업 Pop
	const job_modalizeRef = useRef<Modalize>(null);
	const job_onOpen = () => {
		job_modalizeRef.current?.open();
	};
	const job_onClose = () => {
		job_modalizeRef.current?.close();
	};

	// 학위 Pop
	const edu_modalizeRef = useRef<Modalize>(null);
	const edu_onOpen = () => {
		edu_modalizeRef.current?.open();
	};
	const edu_onClose = () => {
		edu_modalizeRef.current?.close();
	};

	// 소득 Pop
	const income_modalizeRef = useRef<Modalize>(null);
	const income_onOpen = () => {
		income_modalizeRef.current?.open();
	};
	const income_onClose = () => {
		income_modalizeRef.current?.close();
	};

	// 자산 Pop
	const asset_modalizeRef = useRef<Modalize>(null);
	const asset_onOpen = () => {
		asset_modalizeRef.current?.open();
	};
	const asset_onClose = () => {
		asset_modalizeRef.current?.close();
	};

	// SNS Pop
	const sns_modalizeRef = useRef<Modalize>(null);
	const sns_onOpen = () => {
		sns_modalizeRef.current?.open();
	};
	const sns_onClose = () => {
		sns_modalizeRef.current?.close();
	};

	// 차량 Pop
	const vehicle_modalizeRef = useRef<Modalize>(null);
	const vehicle_onOpen = () => {
		vehicle_modalizeRef.current?.open();
	};
	const vehicle_onClose = () => {
		vehicle_modalizeRef.current?.close();
	};

	// 직업 파일 callBack 함수
	const jobFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				jobItem: item,
				jobFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// 학위 파일 callBack 함수
	const eduFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				eduItem: item,
				eduFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// 소득 파일 callBack 함수
	const incodeFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				incomeFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// 자산 파일 callBack 함수
	const assetFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				assetFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// SNS 파일 callBack 함수
	const snsFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				snsItem: item,
				snsFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// 차량 파일 callBack 함수
	const vehicleFileCallBack = (
		uri: string,
		fileName: string,
		fileSize: number,
		type: string,
		item: string,
	) => {
		if ((uri != null && uri != '') || item != '') {
			setSecondData({
				...secondData,
				vehicleItem: item,
				vehicleFile: { uri: uri, name: fileName, type: type },
			});
		}
	};

	/*
	 * 최초 실행
	 */
	React.useEffect(() => {
		getMemberProfileSecondAuth();
	}, []);

	// 프로필 2차 인증 정보 조회 함수
	const getMemberProfileSecondAuth = async () => {
		const result = await axios
			.post(
				properties.api_domain + '/member/getMemberProfileSecondAuth',
				{
					'api-key': 'U0FNR09CX1RPS0VOXzAx',
					member_seq: memberSeq,
				},
				{
					headers: {
						'jwt-token': jwtToken,
					},
				},
			)
			.then(function (response) {
				console.log('getMemberProfileSecondAuth data :::: ', response.data);

				let jobFileUrl: any = '';
				let eduFileUrl: any = '';
				let incomeFileUrl: any = '';
				let assetFileUrl: any = '';
				let snsFileUrl: any = '';
				let vehicleFileUrl: any = '';

				let o_jobItem: any = '';
				let o_eduItem: any = '';
				let o_snsItem: any = '';
				let o_vehicleItem: any = '';

				const imgUrl = properties.api_domain + '/uploads';

				if (null != response.data.auth_list) {
					response.data?.auth_list?.map(
						({
							file_gubun,
							file_name,
							file_path,
						}: {
							file_gubun: any;
							file_name: any;
							file_path: any;
						}) => {
							if (file_gubun == 'F_JOB') {
								jobFileUrl = imgUrl + file_path + file_name;
							} else if (file_gubun == 'F_EDU') {
								eduFileUrl = imgUrl + file_path + file_name;
							} else if (file_gubun == 'F_INCOME') {
								incomeFileUrl = imgUrl + file_path + file_name;
							} else if (file_gubun == 'F_ASSET') {
								assetFileUrl = imgUrl + file_path + file_name;
							} else if (file_gubun == 'F_SNS') {
								snsFileUrl = imgUrl + file_path + file_name;
							} else if (file_gubun == 'F_VEHICLE') {
								vehicleFileUrl = imgUrl + file_path + file_name;
							}
						},
					);
				}

				if (null != response.data.add_info) {
					o_jobItem = response.data.add_info.job_name;
					o_eduItem = response.data.add_info.edu_ins;
					o_snsItem = response.data.add_info.instagram_id;
					o_vehicleItem = response.data.add_info.vehicle;
				}

				setSecondData({
					...secondData,
					orgJobFileUrl: jobFileUrl,
					orgEduFileUrl: eduFileUrl,
					orgIncomeFileUrl: incomeFileUrl,
					orgAssetFileUrl: assetFileUrl,
					orgSnsFileUrl: snsFileUrl,
					orgVehicleFileUrl: vehicleFileUrl,
					jobItem: o_jobItem,
					eduItem: o_eduItem,
					snsItem: o_snsItem,
					vehicleItem: o_vehicleItem,
				});
			})
			.catch(function (error) {
				console.log('error ::: ', error);
			});
	};

	// 인증 정보 저장 함수
	const saveSecondAuth = async () => {
		const data = new FormData();

		let mbrSeq = memberSeq;

		data.append('member_seq', mbrSeq);
		data.append('job_name', secondData.jobItem);
		data.append('edu_ins', secondData.eduItem);
		data.append('instagram_id', secondData.snsItem);
		data.append('vehicle', secondData.vehicleItem);

		if (secondData.jobFile.uri != '') {
			data.append('job_file', secondData.jobFile);
		}
		if (secondData.eduFile.uri != '') {
			data.append('edu_file', secondData.eduFile);
		}
		if (secondData.incomeFile.uri != '') {
			data.append('income_file', secondData.incomeFile);
		}
		if (secondData.assetFile.uri != '') {
			data.append('asset_file', secondData.assetFile);
		}
		if (secondData.snsFile.uri != '') {
			data.append('sns_file', secondData.snsFile);
		}
		if (secondData.vehicleFile.uri != '') {
			data.append('vehicle_file', secondData.vehicleFile);
		}

		console.log('data ::: ', data);

		fetch(properties.api_domain + '/member/saveProfileSecondAuth/', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				'jwt-token': jwtToken,
			},
			body: data,
		})
			.then((response) => response.json())
			.then((response) => {
				const goPress = async () => {
					try {
						dispatch(mbrReducer.setBase(JSON.stringify(response.base)));
						dispatch(mbrReducer.setSecondAuth(JSON.stringify(response.second_auth_list)));
						navigation.navigate('Profile1');
					} catch (error) {
						console.log(error);
					}
				};

				goPress();
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

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
							<TouchableOpacity style={styles.halfItemLeft} onPress={job_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										내 커리어를 확인할 수 있는 명함 또는 증명서를 올려주세요
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight} onPress={edu_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										대학교/대학원의 재학증명서/졸업증명를 올려주세요.
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft} onPress={income_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										내 소득 자료를 올려주세요.
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight} onPress={asset_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										은행에서 발급해주는 잔고 증명서를 올려주세요.
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>

					<SpaceView>
						<View style={styles.halfContainer}>
							<TouchableOpacity style={styles.halfItemLeft} onPress={sns_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										내 인스타 ID가 보이는 스크린샷을 올려주세요.
									</CommonText>
								</View>
							</TouchableOpacity>

							<TouchableOpacity style={styles.halfItemRight} onPress={vehicle_onOpen}>
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

									<CommonText color={ColorType.gray6666} type={'h6'} lineHeight={15}>
										차량 등록등 또는 자동차보험가입 증빙 자료를 올려주세요.
									</CommonText>
								</View>
							</TouchableOpacity>
						</View>
					</SpaceView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn
						value={'확인'}
						type={'primary'}
						onPress={() => {
							saveSecondAuth();
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
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'JOB'}
					onCloseFn={job_onClose}
					callbackFn={jobFileCallBack}
					orgFileUrl={secondData.orgJobFileUrl}
					itemTxt={secondData.jobItem}
				/>
			</Modalize>

			{/* ###############################################
								학위 인증 팝업
			############################################### */}
			<Modalize
				ref={edu_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'EDU'}
					onCloseFn={edu_onClose}
					callbackFn={eduFileCallBack}
					orgFileUrl={secondData.orgEduFileUrl}
					itemTxt={secondData.eduItem}
				/>
			</Modalize>

			{/* ###############################################
								소득 인증 팝업
			############################################### */}
			<Modalize
				ref={income_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'INCOME'}
					onCloseFn={income_onClose}
					callbackFn={incodeFileCallBack}
					orgFileUrl={secondData.orgIncomeFileUrl}
					itemTxt={''}
				/>
			</Modalize>

			{/* ###############################################
								자산 인증 팝업
			############################################### */}
			<Modalize
				ref={asset_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'ASSET'}
					onCloseFn={asset_onClose}
					callbackFn={assetFileCallBack}
					orgFileUrl={secondData.orgAssetFileUrl}
					itemTxt={''}
				/>
			</Modalize>

			{/* ###############################################
								SNS 인증 팝업
			############################################### */}
			<Modalize
				ref={sns_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'SNS'}
					onCloseFn={sns_onClose}
					callbackFn={snsFileCallBack}
					orgFileUrl={secondData.orgSnsFileUrl}
					itemTxt={secondData.snsItem}
				/>
			</Modalize>

			{/* ###############################################
								차량 인증 팝업
			############################################### */}
			<Modalize
				ref={vehicle_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<SecondAuthPopup
					type={'VEHICLE'}
					onCloseFn={vehicle_onClose}
					callbackFn={vehicleFileCallBack}
					orgFileUrl={secondData.orgVehicleFileUrl}
					itemTxt={secondData.vehicleItem}
				/>
			</Modalize>
		</>
	);
};
