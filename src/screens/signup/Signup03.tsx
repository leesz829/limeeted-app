import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RadioCheckBox_2 } from 'component/RadioCheckBox_2';
import * as properties from 'utils/properties';


/* ################################################################################################################
###################################################################################################################
###### 닉네임과 소개
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'Signup03'>;
	route : RouteProp<StackParamList, 'Signup03'>;
}

export const Signup03 = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();

	const [nickname, setNickname] = React.useState('');
	const [comment, setComment] = React.useState('');

	const [interestJsonArr, setInterestJsonArr] = React.useState([{ code_name: "", common_code: "", group_code: "" }]);

	const int_modalizeRef = useRef<Modalize>(null);
	const int_onOpen = () => { int_modalizeRef.current?.open(); };
	const int_onClose = () => {	int_modalizeRef.current?.close(); };

	// 관심사 설정 변수
	const [checkIntValue_01, setCheckIntValue_01] = React.useState({ code_name: "", common_code: "", group_code: "" });	// 문화생활
	const [checkIntValue_03, setCheckIntValue_03] = React.useState({ code_name: "", common_code: "", group_code: "" });	// 음식문화
	const [checkIntValue_05, setCheckIntValue_05] = React.useState({ code_name: "", common_code: "", group_code: "" });	// 사교활동
	const [checkIntValue_09, setCheckIntValue_09] = React.useState({ code_name: "", common_code: "", group_code: "" });	// 음악/예술

	// 관심사 등록 확인 함수
	const int_confirm = () => {
		let tmpIntApplyList = new Array();
		
		if(checkIntValue_01.code_name != "") { tmpIntApplyList.push(checkIntValue_01); }
		if(checkIntValue_03.code_name != "") { tmpIntApplyList.push(checkIntValue_03); }
		if(checkIntValue_05.code_name != "") { tmpIntApplyList.push(checkIntValue_05); }
		if(checkIntValue_09.code_name != "") { tmpIntApplyList.push(checkIntValue_09); }

		setInterestJsonArr(tmpIntApplyList);
		int_modalizeRef.current?.close();
	};

	/*
	 * 최초 실행
	 */
	React.useEffect(() => {

		// 회원 관심사 정보 조회
		axios.post(properties.api_domain + '/join/selectMemberIntro/', {
			member_seq : props.route.params.memberSeq
		})
		.then(function (response) {
			console.log("response ::: " + JSON.stringify(response.data));

			if(null != response.data.member) {
				setNickname(response.data.member.nickname);
				setComment(response.data.member.comment);
			}

			if(null != response.data.intList) {
				let tmpIntApplyList = new Array();
				response.data?.intList?.map(({ group_code, common_code, code_name }: { group_code: any, common_code: any, code_name: any }) => {
					let dataJson = {group_code: group_code, common_code: common_code, code_name: code_name};
					if(group_code == "CONCERN_01") { setCheckIntValue_01(dataJson) }
					if(group_code == "CONCERN_03") { setCheckIntValue_03(dataJson) }
					if(group_code == "CONCERN_05") { setCheckIntValue_05(dataJson) }
					if(group_code == "CONCERN_09") { setCheckIntValue_09(dataJson) }
					tmpIntApplyList.push(dataJson);
				});

				setInterestJsonArr(tmpIntApplyList);
			}
		})
		.catch(function (error) {
			console.log(error);
		});
		
	}, []);

	return (
		<>
			<CommonHeader title={'닉네임과 소개'} />
			<ScrollView contentContainerStyle={[styles.scrollContainer]}>
				<SpaceView mb={24}>
					<CommonText>
						LIMEETED에서 사용할 닉네임과{'\n'}
						한줄소개를 입력해주세요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonInput label="닉네임" 
									placeholder={'회원명'}
									value={nickname}
									onChangeText={nickname => setNickname(nickname)}  />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" 
									placeholder={'서울사람'}
									value={comment}
									onChangeText={comment => setComment(comment)} />
				</SpaceView>

				<SpaceView mb={24}>
					<SpaceView mb={8}>
						<CommonText>관심사 표현하기</CommonText>
					</SpaceView>
					<CommonText color={ColorType.gray6666}>
						같은 관심사를 가진 이성을 소개할 수 있도록{'\n'}
						도와드릴게요.
					</CommonText>
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn value={'등록 및 수정'} 
								height={48} 
								type={'white'} 
								icon={ICON.plus}
								onPress={int_onOpen} />
				</SpaceView>

				{/* <SpaceView mb={40} mt={24} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
					{[
						{ text: '스타일1', isActive: false },
						{ text: '해외축구', isActive: false },
						{ text: '영화3', isActive: true },
						{ text: '해외축구', isActive: true },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
						{ text: '영화1', isActive: false },
					].map((i, index) => {
						return (
							<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
								<TouchableOpacity style={[styles.interestBox, i.isActive && styles.boxActive]}>
									<CommonText color={i.isActive ? ColorType.primary : ColorType.gray8888}>
										{i.text}
									</CommonText>
								</TouchableOpacity>
							</SpaceView>
						);
					})}
				</SpaceView> */}

				<SpaceView mb={40} mt={15} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
					{interestJsonArr.map((i, index) => {
						return (
							i.code_name != "" ? (
								<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
									<TouchableOpacity style={[styles.interestBox]}>
										<CommonText color={ColorType.gray8888}>
											{i.code_name}
										</CommonText>
									</TouchableOpacity>
								</SpaceView>
							) : null
						);
					})}
				</SpaceView>

				<SpaceView mb={24}>
					<CommonBtn value={'다음 (4/4)'} 
								type={'primary'}
								onPress={() => {

									console.log("nickname :::: ", nickname);
									console.log("interestJsonArr :::: ", interestJsonArr);

									axios.post(properties.api_domain + '/join/insertMemberIntro/', {
										member_seq : props.route.params.memberSeq,
										nickname : nickname,
										introduce_comment: comment,
										interestList : interestJsonArr
									})
									.then(function (response) {
										console.log(response.data.result_code);

										if(response.data.result_code == "0000") {
											navigation.navigate('Approval');
										}
									})
									.catch(function (error) {
										console.log(error);
									});

								}} 
					/>
				</SpaceView>
			</ScrollView>


			{/* #############################################################################
											관심사 설정 팝업
			############################################################################# */}

			<Modalize
				ref={int_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
			>
				<View style={modalStyle.modalHeaderContainer}>
					<CommonText fontWeight={'700'} type={'h3'}>
						관심사 등록
					</CommonText>
					<TouchableOpacity onPress={int_onClose}>
						<Image source={ICON.xBtn} style={styles.iconSize24} />
					</TouchableOpacity>
				</View>

				<View style={modalStyle.modalBody}>
					
					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>문화생활</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: '여행', common_code: 'CONC_01_00', group_code: 'CONCERN_01', isActive: false },
								{ code_name: '새로운 것 도전', common_code: 'CONC_01_01', group_code: 'CONCERN_01', isActive: false },
								{ code_name: '사진', common_code: 'CONC_01_02', group_code: 'CONCERN_01', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.common_code === checkIntValue_01.common_code && styles.boxActive]}
															onPress={() => { setCheckIntValue_01(i); }} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === checkIntValue_01.common_code ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>음식문화</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: '맛집', common_code: 'CONC_03_00', group_code: 'CONCERN_03', isActive: false },
								{ code_name: '한강에서 치맥', common_code: 'CONC_03_01', group_code: 'CONCERN_03', isActive: false },
								{ code_name: '베이킹', common_code: 'CONC_03_02', group_code: 'CONCERN_03', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.common_code === checkIntValue_03.common_code && styles.boxActive]}
															onPress={() => { setCheckIntValue_03(i); }} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === checkIntValue_03.common_code ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>사교활동</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: '노래방', common_code: 'CONC_05_01', group_code: 'CONCERN_05', isActive: false },
								{ code_name: '술 한 잔', common_code: 'CONC_05_02', group_code: 'CONCERN_05', isActive: false },
								{ code_name: '코인 노래방', common_code: 'CONC_05_06', group_code: 'CONCERN_05', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.common_code === checkIntValue_05.common_code && styles.boxActive]}
															onPress={() => { setCheckIntValue_05(i); }} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === checkIntValue_05.common_code ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>음악/예술</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: 'K-POP', common_code: 'CONC_09_00', group_code: 'CONCERN_09', isActive: false },
								{ code_name: '댄스', common_code: 'CONC_09_01', group_code: 'CONCERN_09', isActive: false },
								{ code_name: '예술', common_code: 'CONC_09_02', group_code: 'CONCERN_09', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.common_code === checkIntValue_09.common_code && styles.boxActive]}
															onPress={() => { setCheckIntValue_09(i); }} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === checkIntValue_09.common_code ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>

					<SpaceView mb={16}>
						<CommonBtn value={'확인'} 
									type={'primary'}
									onPress={int_confirm}/>
					</SpaceView>
				</View>
			</Modalize>

		</>
	);
};
