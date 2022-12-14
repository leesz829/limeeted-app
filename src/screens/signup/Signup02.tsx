import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import axios from 'axios';
import { Value } from 'react-native-reanimated';
import * as properties from 'utils/properties';
import { Modalize } from 'react-native-modalize';

/* ################################################################################################################
###################################################################################################################
###### 근사한 프로필 만들기
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Signup02'>;
	route: RouteProp<StackParamList, 'Signup02'>;
}

export const Signup02 = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const isFocus = useIsFocused();

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
		// 회원 이미지 정보 조회
		axios
			.post(properties.api_domain + '/join/selectMemberImage/', {
				member_seq: props.route.params.memberSeq,
			})
			.then(function (response) {
				console.log('response ::: ' + JSON.stringify(response.data));

				if (null != response.data.imgList) {
					console.log('imgList ::: ', response.data.imgList);

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

					response.data?.imgList?.map(
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
			})
			.catch(function (error) {
				console.log(error);
			});

		const localDomain = properties.img_domain;

		/* if (order_seq == '1') {
			setOrgImgUrl01(localDomain + file_path + file_name);
		} else if (order_seq == '2') {
			setOrgImgUrl02(localDomain + file_path + file_name);
		} else if (order_seq == '3') {
			setOrgImgUrl03(localDomain + file_path + file_name);
		} else if (order_seq == '4') {
			setOrgImgUrl04(localDomain + file_path + file_name);
		} else if (order_seq == '5') {
			setOrgImgUrl05(localDomain + file_path + file_name);
		} */
	}, [isFocus]);

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
			<CommonHeader title={'근사한 프로필 만들기'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText fontWeight={'500'}>
						다양한 분위기의 내 모습이 담긴 사진을{'\n'}
						등록해보세요.
					</CommonText>
				</SpaceView>

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

						{/* <ImagePicker isBig={true} callbackFn={fileCallBack1} uriParam={orgImgUrl01} /> */}
					</View>

					<View style={styles.halfItemRight}>
						<SpaceView mb={16} viewStyle={layoutStyle.row}>
							<SpaceView mr={8}>
								{imgData.orgImgUrl02.url != '' && imgData.orgImgUrl02.delYn == 'N' ? (
									<TouchableOpacity
										onPress={() => {
											imgDel_onOpen(imgData.orgImgUrl02.member_img_seq, 1);
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
											imgDel_onOpen(imgData.orgImgUrl03.member_img_seq, 1);
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
											imgDel_onOpen(imgData.orgImgUrl04.member_img_seq, 1);
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
											imgDel_onOpen(imgData.orgImgUrl05.member_img_seq, 1);
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

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText fontWeight={'500'}>어떤 사진을 올려야 할까요?</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						얼굴이 선명히 나오는 사진은 최소 1장 필수에요.{'\n'}
						멋진 무드 속에 담긴 모습이 좋아요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={40}>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						{props.route.params.gender == 'M' ? (
							<>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp1} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp2} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp3} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp4} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp5} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.manTmp6} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
							</>
						) : (
							<>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp1} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp2} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp3} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp4} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp5} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp6} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
								<SpaceView mr={16}>
									<View style={styles.tempBoxMiddle}>
										<Image source={PROFILE_IMAGE.womanTmp7} style={styles.profileTmpImg} />
									</View>
								</SpaceView>
							</>
						)}
					</ScrollView>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn
						value={'다음 (3/4)'}
						type={'primary'}
						onPress={() => {
							const data = new FormData();

							/* const file01 = {
								uri: imgFileData01.uri,
								type: imgFileData01.type,
								name: imgFileData01.fileName,
							};
							const file02 = {
								uri: imgFileData02.uri,
								type: imgFileData02.type,
								name: imgFileData02.fileName,
							};
							const file03 = {
								uri: imgFileData03.uri,
								type: imgFileData03.type,
								name: imgFileData03.fileName,
							};
							const file04 = {
								uri: imgFileData04.uri,
								type: imgFileData04.type,
								name: imgFileData04.fileName,
							};
							const file05 = {
								uri: imgFileData05.uri,
								type: imgFileData05.type,
								name: imgFileData05.fileName,
							}; */

							data.append('memberSeq', props.route.params.memberSeq);
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

							console.log('imgData :::: ' , imgData);

							let tmpCnt = 0;
							for(var key in imgData) {
								console.log('key :: ' , imgData[key]);
								if(imgData[key].url || imgData[key].uri){
									tmpCnt++;
								}	
							}
							
							console.log('tmpCnt out :: ' , tmpCnt);


							if (tmpCnt < 3) {
								Alert.alert('알림', '프로필 사진 최소 3장 등록해주세요', [{ text: '확인' }]);
								return;
							}

							fetch(properties.api_domain + '/join/insertMemberProfile/', {
								method: 'POST',
								body: data,
							})
								.then((response) => response.json())
								.then((response) => {
									console.log('response :::: ', response);

									fetch(properties.api_domain + '/join/insertMemberProfile/', {
										method: 'POST',
										body: data,
									})
										.then((response) => response.json())
										.then((response) => {
											console.log('response :::: ', response);

											if (response.result_code == '0000') {
												navigation.navigate('Signup03', {
													memberSeq: props.route.params.memberSeq,
												});
											}
										})
										.catch((error) => {
											console.log('error', error);
										});
								});
						}}
					/>
				</SpaceView>
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
