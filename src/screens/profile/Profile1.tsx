import React, { useRef } from 'react';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Image, ScrollView, TextInput, View, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import { ProfileItem } from 'component/MainProfileSlider';
import CommonHeader from 'component/CommonHeader';
import { CommonBtn } from 'component/CommonBtn';
import axios from 'axios';
import * as properties from 'utils/properties';
import AsyncStorage from '@react-native-community/async-storage';
import { Modalize } from 'react-native-modalize';

/* ################################################################################################################
###################################################################################################################
###### 프로필 관리
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Profile1'>;
	route: RouteProp<StackParamList, 'Profile1'>;
}

export const Profile1 = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	// 프로필 사진
	const [imgData, setImgData] = React.useState<any>({
		orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
		orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
		orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
		orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
		orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
		imgFile01: { uri: '', name: '', type: '' },
		imgFile02: { uri: '', name: '', type: '' },
		imgFile03: { uri: '', name: '', type: '' },
		imgFile04: { uri: '', name: '', type: '' },
		imgFile05: { uri: '', name: '', type: '' },
	});

	// 프로필 이미지 삭제 시퀀스 문자열
	const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

	// 프로필 2차 인증 여부
	const [isJob, setIsJob] = React.useState<any>(false);
	const [isEdu, setIsEdu] = React.useState<any>(false);
	const [isIncome, setIsIncome] = React.useState<any>(false);
	const [isAsset, setIsAsset] = React.useState<any>(false);
	const [isSns, setIsSns] = React.useState<any>(false);
	const [isVehicle, setIsVehicle] = React.useState<any>(false);

	// 인터뷰 목록
	const [interviewList, setInterviewList] = React.useState<any>(props.route.params.interviewList);

	// 인증 갯수
	const [authCnt, setAuthCnt] = React.useState(0);

	const fileCallBack1 = (uri: string, fileName: string, fileSize: number, type: string) => {
		if (uri != null && uri != '') {
			setImgData({
				...imgData,
				imgFile01: { uri: uri, name: fileName, type: type },
			});
		}
	};
	const fileCallBack2 = (uri: string, fileName: string, fileSize: number, type: string) => {
		if (uri != null && uri != '') {
			setImgData({
				...imgData,
				imgFile02: { uri: uri, name: fileName, type: type },
			});
		}
	};
	const fileCallBack3 = (uri: string, fileName: string, fileSize: number, type: string) => {
		if (uri != null && uri != '') {
			setImgData({
				...imgData,
				imgFile03: { uri: uri, name: fileName, type: type },
			});
		}
	};
	const fileCallBack4 = (uri: string, fileName: string, fileSize: number, type: string) => {
		if (uri != null && uri != '') {
			setImgData({
				...imgData,
				imgFile04: { uri: uri, name: fileName, type: type },
			});
		}
	};
	const fileCallBack5 = (uri: string, fileName: string, fileSize: number, type: string) => {
		if (uri != null && uri != '') {
			setImgData({
				...imgData,
				imgFile05: { uri: uri, name: fileName, type: type },
			});
		}
	};

	// 사진삭제 컨트롤 변수
	const [isDelImgData, setIsDelImgData] = React.useState<any>({
		img_seq: '',
		order_seq: '',
	});

	/*
	 * 최초 실행
	 */
	React.useEffect(() => {
		if (props.route.params.imgList != null) {
			let imgData: any = {
				orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
				orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
				orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
				orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
				orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
				imgFile01: { uri: '', name: '', type: '' },
				imgFile02: { uri: '', name: '', type: '' },
				imgFile03: { uri: '', name: '', type: '' },
				imgFile04: { uri: '', name: '', type: '' },
				imgFile05: { uri: '', name: '', type: '' },
			};

			props.route.params.imgList.map(
				({
					member_img_seq,
					file_name,
					file_path,
					order_seq,
				}: {
					member_img_seq: any;
					file_name: any;
					file_path: any;
					order_seq: any;
				}) => {
					let data = {
						member_img_seq: member_img_seq,
						url: properties.img_domain + file_path + file_name,
						delYn: 'N',
					};
					if (order_seq == 1) {
						imgData.orgImgUrl01 = data;
					}
					if (order_seq == 2) {
						imgData.orgImgUrl02 = data;
					}
					if (order_seq == 3) {
						imgData.orgImgUrl03 = data;
					}
					if (order_seq == 4) {
						imgData.orgImgUrl04 = data;
					}
					if (order_seq == 5) {
						imgData.orgImgUrl05 = data;
					}
				},
			);

			setImgData({ ...imgData, imgData });
		}

		if (props.route.params.authList != null) {
			let authCnt = 0;
			props.route.params.authList.map(({ second_auth_code }: { second_auth_code: any }) => {
				if (second_auth_code == 'JOB') {
					setIsJob(true);
				}
				if (second_auth_code == 'EDU') {
					setIsEdu(true);
				}
				if (second_auth_code == 'INCOME') {
					setIsIncome(true);
				}
				if (second_auth_code == 'ASSET') {
					setIsAsset(true);
				}
				if (second_auth_code == 'SNS') {
					setIsSns(true);
				}
				if (second_auth_code == 'VEHICLE') {
					setIsVehicle(true);
				}

				authCnt++;
			});

			setAuthCnt(authCnt);
		}
	}, [props.route]);

	// 프로필 관리 저장
	const saveMemberProfile = async () => {
		const member_seq = Number(await properties.get_json_data('member_seq'));
		const data = new FormData();

		console.log('imgDelSeqStr :::: ', imgDelSeqStr);

		data.append('memberSeq', member_seq);
		//data.append("interviewList", JSON.stringify(interviewList));
		//data.append("data", new Blob([JSON.stringify(interviewList[0])], {type: "application/json"}));
		data.append('data', JSON.stringify(interviewList));
		if (imgData.imgFile01.uri != '') {
			data.append('file01', imgData.imgFile01);
		}
		if (imgData.imgFile02.uri != '') {
			data.append('file02', imgData.imgFile02);
		}
		if (imgData.imgFile03.uri != '') {
			data.append('file03', imgData.imgFile03);
		}
		if (imgData.imgFile04.uri != '') {
			data.append('file04', imgData.imgFile04);
		}
		if (imgData.imgFile05.uri != '') {
			data.append('file05', imgData.imgFile05);
		}
		data.append('imgDelSeqStr', imgDelSeqStr);

		//console.log('data :::: ', data);

		const result = await fetch(properties.api_domain + '/member/saveProfileImage/', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				'jwt-token': String(await properties.jwt_token()),
			},
			body: data,
		})
			.then((res) => res.json())
			.then((res) => {
				//console.log('res :::: ', res);

				if (res.result_code == '0000') {
					AsyncStorage.setItem('memberBase', JSON.stringify(res.memberBase));
					AsyncStorage.setItem('memberImgList', JSON.stringify(res.memberImgList));
					AsyncStorage.setItem('memberInterviewList', JSON.stringify(res.memberInterviewList));

					navigation.navigate('Main', {
						screen: 'Roby',
						params: {
							memberBase: res.memberBase,
						},
					});
				}
			})
			.catch((error) => {
				console.log('error', error);
			});
	};

	/* 인터뷰 답변 핸들러 */
	const answerChangeHandler = (v_code: any, text: any) => {
		setInterviewList(
			interviewList.map((item: any) =>
				item.common_code === v_code ? { ...item, answer: text } : item,
			),
		);
	};

	// 사진 삭제 팝업
	const imgDel_modalizeRef = useRef<Modalize>(null);
	const imgDel_onOpen = (img_seq: any, order_seq: any) => {
		setIsDelImgData({
			img_seq: img_seq,
			order_seq: order_seq,
		});
		imgDel_modalizeRef.current?.open();
	};
	const imgDel_onClose = () => {
		imgDel_modalizeRef.current?.close();
	};

	// 사진 삭제
	const imgDelProc = () => {
		if (isDelImgData.order_seq == '1') {
			setImgData({
				...imgData,
				orgImgUrl01: {
					member_img_seq: imgData.orgImgUrl01.member_img_seq,
					url: imgData.orgImgUrl01.url,
					delYn: 'Y',
				},
			});
		}
		if (isDelImgData.order_seq == '2') {
			setImgData({ ...imgData, orgImgUrl02: { ...imgData.orgImgUrl02, delYn: 'Y' } });
		}
		if (isDelImgData.order_seq == '3') {
			setImgData({ ...imgData, orgImgUrl03: { ...imgData.orgImgUrl03, delYn: 'Y' } });
		}
		if (isDelImgData.order_seq == '4') {
			setImgData({ ...imgData, orgImgUrl04: { ...imgData.orgImgUrl04, delYn: 'Y' } });
		}
		if (isDelImgData.order_seq == '5') {
			setImgData({ ...imgData, orgImgUrl05: { ...imgData.orgImgUrl05, delYn: 'Y' } });
		}

		let delArr = imgDelSeqStr;
		if (delArr == '') {
			delArr = isDelImgData.img_seq;
		} else {
			delArr = ',' + isDelImgData.img_seq;
		}
		setImgDelSeqStr(delArr);
		imgDel_onClose();
	};

	return (
		<>
			<CommonHeader title={'프로필 관리'} />
			<ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
				<SpaceView viewStyle={styles.container}>
					{/* ########### 프로필 이미지 ########### */}
					<SpaceView mb={48} viewStyle={styles.halfContainer}>
						<View style={styles.halfItemLeft}>
							{imgData.orgImgUrl01.url != '' && imgData.orgImgUrl01.delYn == 'N' ? (
								<TouchableOpacity
									onPress={() => {
										imgDel_onOpen(imgData.orgImgUrl01.member_img_seq, 1);
									}}
								>
									<Image
										resizeMode="cover"
										resizeMethod="scale"
										style={styles.tempBoxBig}
										key={imgData.orgImgUrl01.url}
										source={{ uri: imgData.orgImgUrl01.url }}
									/>
								</TouchableOpacity>
							) : (
								<ImagePicker isBig={true} callbackFn={fileCallBack1} uriParam={''} />
							)}
						</View>

						<View style={styles.halfItemRight}>
							<SpaceView mb={16} viewStyle={layoutStyle.row}>
								<SpaceView mr={8}>
									{imgData.orgImgUrl02.url != '' && imgData.orgImgUrl02.delYn == 'N' ? (
										<TouchableOpacity
											onPress={() => {
												imgDel_onOpen(imgData.orgImgUrl02.member_img_seq, 2);
											}}
										>
											<Image
												resizeMode="cover"
												resizeMethod="scale"
												style={styles.tempBoxSmall}
												key={imgData.orgImgUrl02.url}
												source={{ uri: imgData.orgImgUrl02.url }}
											/>
										</TouchableOpacity>
									) : (
										<ImagePicker isBig={false} callbackFn={fileCallBack2} uriParam={''} />
									)}
								</SpaceView>
								<SpaceView ml={8}>
									{imgData.orgImgUrl03.url != '' && imgData.orgImgUrl03.delYn == 'N' ? (
										<TouchableOpacity
											onPress={() => {
												imgDel_onOpen(imgData.orgImgUrl03.member_img_seq, 3);
											}}
										>
											<Image
												resizeMode="cover"
												resizeMethod="scale"
												style={styles.tempBoxSmall}
												key={imgData.orgImgUrl03.url}
												source={{ uri: imgData.orgImgUrl03.url }}
											/>
										</TouchableOpacity>
									) : (
										<ImagePicker isBig={false} callbackFn={fileCallBack3} uriParam={''} />
									)}
								</SpaceView>
							</SpaceView>

							<SpaceView viewStyle={layoutStyle.row}>
								<SpaceView mr={8}>
									{imgData.orgImgUrl04.url != '' && imgData.orgImgUrl04.delYn == 'N' ? (
										<TouchableOpacity
											onPress={() => {
												imgDel_onOpen(imgData.orgImgUrl04.member_img_seq, 4);
											}}
										>
											<Image
												resizeMode="cover"
												resizeMethod="scale"
												style={styles.tempBoxSmall}
												key={imgData.orgImgUrl04.url}
												source={{ uri: imgData.orgImgUrl04.url }}
											/>
										</TouchableOpacity>
									) : (
										<ImagePicker isBig={false} callbackFn={fileCallBack4} uriParam={''} />
									)}
								</SpaceView>
								<SpaceView ml={8}>
									{imgData.orgImgUrl05.url != '' && imgData.orgImgUrl05.delYn == 'N' ? (
										<TouchableOpacity
											onPress={() => {
												imgDel_onOpen(imgData.orgImgUrl05.member_img_seq, 5);
											}}
										>
											<Image
												resizeMode="cover"
												resizeMethod="scale"
												style={styles.tempBoxSmall}
												key={imgData.orgImgUrl05.url}
												source={{ uri: imgData.orgImgUrl05.url }}
											/>
										</TouchableOpacity>
									) : (
										<ImagePicker isBig={false} callbackFn={fileCallBack5} uriParam={''} />
									)}
								</SpaceView>
							</SpaceView>
						</View>
					</SpaceView>

					{/* ########### 프로필 2차 인증 ########### */}
					<SpaceView mb={54}>
						<SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
							<View>
								<TouchableOpacity
									style={[layoutStyle.row, layoutStyle.alignCenter]}
									onPress={() => {
										navigation.navigate('SecondAuth');
									}}
								>
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
									{!isJob ? <View style={styles.disabled} /> : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.degree} style={styles.iconSize48} />
									<CommonText type={'h5'}>학위</CommonText>
									{!isEdu ? <View style={styles.disabled} /> : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.income} style={styles.iconSize48} />
									<CommonText type={'h5'}>소득</CommonText>
									{!isIncome ? <View style={styles.disabled} /> : null}
								</View>
							</SpaceView>

							<View style={[layoutStyle.rowBetween]}>
								<View style={styles.profileBox}>
									<Image source={ICON.asset} style={styles.iconSize48} />
									<CommonText type={'h5'}>자산</CommonText>
									{!isAsset ? <View style={styles.disabled} /> : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.sns} style={styles.iconSize48} />
									<CommonText type={'h5'}>SNS</CommonText>
									{!isSns ? <View style={styles.disabled} /> : null}
								</View>

								<View style={styles.profileBox}>
									<Image source={ICON.vehicle} style={styles.iconSize48} />
									<CommonText type={'h5'}>차량</CommonText>
									{!isVehicle ? <View style={styles.disabled} /> : null}
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
									{interviewList.length ? (
										<>
											<CommonText fontWeight={'700'} type={'h5'}>
												{interviewList.length}개의 질의
											</CommonText>
											가 등록되어있어요
										</>
									) : (
										<>
											<CommonText fontWeight={'700'} type={'h5'}>
												등록된 질의가 없습니다.
											</CommonText>
										</>
									)}
								</CommonText>
							</View>
						</SpaceView>
						<View style={styles.interviewContainer}>
							{interviewList.length > 0 ? (
								interviewList.map(
									({
										common_code,
										code_name,
										answer,
									}: {
										common_code: any;
										code_name: any;
										answer: any;
									}) => (
										<View key={common_code}>
											<SpaceView mb={32} viewStyle={layoutStyle.row}>
												<SpaceView mr={16}>
													<Image source={ICON.manage} style={styles.iconSize40} />
												</SpaceView>

												<View style={layoutStyle.row}>
													<View style={styles.interviewLeftTextContainer}>
														<CommonText type={'h5'}>{code_name}</CommonText>
													</View>

													{/* <SpaceView ml={8}>
													<TouchableOpacity 
														onPress={() => {
															navigation.navigate('Profile2');
														}}>
														<Image source={ICON.penCircleGray} style={styles.iconSize24} />
													</TouchableOpacity>
												</SpaceView> */}
												</View>
											</SpaceView>

											<SpaceView mb={32} viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}>
												<SpaceView viewStyle={styles.interviewRightTextContainer} mr={16}>
													<TextInput
														defaultValue={answer}
														onChangeText={(text) => answerChangeHandler(common_code, text)}
														style={[styles.inputTextStyle_type02]}
														multiline={true}
														placeholder={'대답을 등록해주세요!'}
														placeholderTextColor={'#c6ccd3'}
														//numberOfLines={2}
													/>
												</SpaceView>
												<SpaceView>
													<Image source={ICON.boy} style={styles.iconSize40} />
												</SpaceView>
											</SpaceView>
										</View>
									),
								)
							) : (
								<>
									<SpaceView mb={32} viewStyle={layoutStyle.row}>
										<SpaceView mr={16}>
											<Image source={ICON.manage} style={styles.iconSize40} />
										</SpaceView>

										<View style={styles.interviewLeftTextContainer}>
											<CommonText type={'h5'}>질문을 등록해주세요</CommonText>
										</View>
									</SpaceView>
								</>
							)}
						</View>
					</SpaceView>
				</SpaceView>

				<View style={styles.bottomBtnContainer}>
					<CommonBtn
						value={'저장'}
						type={'primary'}
						onPress={() => {
							saveMemberProfile();
						}}
					/>
				</View>
			</ScrollView>

			{/* ###############################################
							사진 삭제 팝업
			############################################### */}
			<Modalize
				ref={imgDel_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						프로필 사진 삭제
					</CommonText>
					<TouchableOpacity onPress={imgDel_onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={[modalStyle.modalBody, layoutStyle.flex1, layoutStyle.mb20]}>
					<View>
						<CommonBtn value={'사진 삭제'} type={'primary'} onPress={imgDelProc} />
						<CommonBtn value={'취소'} type={'primary'} onPress={imgDel_onClose} />
					</View>
				</View>
			</Modalize>
		</>
	);
};
