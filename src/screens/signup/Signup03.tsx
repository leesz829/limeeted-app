import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

	const int_modalizeRef = useRef<Modalize>(null);
	const int_onOpen = () => { int_modalizeRef.current?.open(); };
	const int_onClose = () => {	int_modalizeRef.current?.close(); };

	// 관심사 설정 변수
	const [checkIntValue_01, setCheckIntValue_01] = React.useState([{ code_name: "", common_code: "", group_code: "" }]);	// 문화생활
	
	// 관심사 등록 확인 함수
	const int_confirm = () => {
		
		int_modalizeRef.current?.close();
	};

	/*
	 * 최초 실행
	 */
	React.useEffect(() => {
		
		// 회원 관심사 정보 조회
		axios.post(properties.api_domain + '/join/getMemberIntro/', {
			member_seq : props.route.params.memberSeq
		})
		.then(function (response) {
			console.log("response selectMemberIntro ::: " + JSON.stringify(response.data));

			if(null != response.data.member) {
				setNickname(response.data.member.nickname);
				setComment(response.data.member.comment);
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
									placeholder={'닉네임을 입력해 주세요.'}
									placeholderTextColor={'#c6ccd3'}
									value={nickname}
									onChangeText={nickname => setNickname(nickname)}  />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" 
									placeholder={'한줄 소개를 입력해 주세요.'}
									placeholderTextColor={'#c6ccd3'}
									value={comment}
									onChangeText={comment => setComment(comment)}
									maxLength={20} />
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
					{checkIntValue_01.map((i, index) => {
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
									if(nickname == '' || typeof nickname == 'undefined') {
										Alert.alert("알림",	"닉네임을 입력해 주세요.",	[{text: "확인"}]);
										return;
									}

									if(comment == '' || typeof comment == 'undefined') {
										Alert.alert("알림",	"한줄 소개를 입력해 주세요.",	[{text: "확인"}]);
										return;
									}

									if(checkIntValue_01.length < 2){
										Alert.alert("알림",	"관심사를 입력해 주세요.",	[{text: "확인"}]);
										return;
									}


									axios.post(properties.api_domain + '/join/insertMemberIntro/', {
										member_seq : props.route.params.memberSeq,
										nickname : nickname,
										comment: comment,
										interest_list : checkIntValue_01
									})
									.then(function (response) {
										console.log(response.data.result_code);

										if(response.data.result_code == "0000") {
											navigation.reset({
												routes: [{
													name: 'Approval'
													, params: {
														memberSeq: props.route.params.memberSeq,
														accessType: 'JOIN'
													}
												}]
											});

											/* navigation.navigate('Approval', {
												memberSeq: props.route.params.memberSeq,
												accessType: 'JOIN'
											}); */
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
				adjustToContentHeight = {false}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
				FooterComponent={
					<>
						<SpaceView mb={16}>
							<CommonBtn value={'확인'} 
										type={'primary'}
										onPress={int_confirm}/>
						</SpaceView>
					</>
				}
				HeaderComponent={
				<>
					<View style={modalStyle.modalHeaderContainer}>
						<CommonText fontWeight={'700'} type={'h3'}>
							관심사 등록
						</CommonText>
						<TouchableOpacity onPress={int_onClose}>
							<Image source={ICON.xBtn} style={styles.iconSize24} />
						</TouchableOpacity>
					</View>
				</>}
			>
				

				<View style={modalStyle.modalBody}>
					
					<SpaceView mb={24}>
						<SpaceView mb={16}>
							<CommonText fontWeight={'500'}>라이프 스타일</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: '여행', common_code: 'CONC_01_00', group_code: 'CONCERN_01'}
								, { code_name: '새로운 것 도전', common_code: 'CONC_01_01', group_code: 'CONCERN_01'}
								, { code_name: '사진', common_code: 'CONC_01_02', group_code: 'CONCERN_01'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{ code_name: '인스타그래머블..', common_code: 'CONC_01_03', group_code: 'CONCERN_01'}
								, { code_name: '반려동물과 산책', common_code: 'CONC_01_04', group_code: 'CONCERN_01'}
								, { code_name: '파티', common_code: 'CONC_01_05', group_code: 'CONCERN_01'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'쇼핑', common_code:'CONC_01_06', group_code:'CONCERN_01'}
								, {code_name:'브런치', common_code:'CONC_01_07', group_code:'CONCERN_01'}
								, {code_name:'채식', common_code:'CONC_01_08', group_code:'CONCERN_01'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'비건', common_code:'CONC_01_09', group_code:'CONCERN_01'}
								, {code_name:'세계 여행', common_code:'CONC_01_10', group_code:'CONCERN_01'}
								, {code_name:'아웃도어 액티..', common_code:'CONC_01_11', group_code: 'CONCERN_01'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'피크닉', common_code:'CONC_01_12', group_code:'CONCERN_01'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>레저</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'등산',common_code:'CONC_02_00', group_code:'CONCERN_02'}
								, {code_name:'낚시',common_code:'CONC_02_01', group_code:'CONCERN_02'}
								, {code_name:'크로스핏',common_code:'CONC_02_02', group_code:'CONCERN_02'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'클라이밍',common_code:'CONC_02_03', group_code:'CONCERN_02'}
								, {code_name:'캠핑',common_code:'CONC_02_04', group_code:'CONCERN_02'}
								, {code_name:'서핑',common_code:'CONC_02_05', group_code:'CONCERN_02'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'드라이브',common_code:'CONC_02_06', group_code:'CONCERN_02'}
								, {code_name:'등산',common_code:'CONC_02_07', group_code:'CONCERN_02'}
								, {code_name:'볼링',common_code:'CONC_02_08', group_code:'CONCERN_02'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'당구',common_code:'CONC_02_09', group_code:'CONCERN_02'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>운동</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'산책',common_code:'CONC_04_00', group_code:'CONCERN_04'}
								, {code_name:'러닝',common_code:'CONC_04_01', group_code:'CONCERN_04'}
								, {code_name:'골프',common_code:'CONC_04_02', group_code:'CONCERN_04'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'스포츠',common_code:'CONC_04_03', group_code:'CONCERN_04'}
								, {code_name:'동네 산책',common_code:'CONC_04_04', group_code:'CONCERN_04'}
								, {code_name:'운동',common_code:'CONC_04_05', group_code:'CONCERN_04'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'자전거',common_code:'CONC_04_06', group_code:'CONCERN_04'}
								, {code_name:'수영',common_code:'CONC_04_07', group_code:'CONCERN_04'}
								, {code_name:'피트니스',common_code:'CONC_04_08', group_code:'CONCERN_04'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'요가',common_code:'CONC_04_09', group_code:'CONCERN_04'}
								, {code_name:'야구 보기',common_code:'CONC_04_10', group_code:'CONCERN_04'}
								, {code_name:'축구 보기',common_code:'CONC_04_11', group_code:'CONCERN_04'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'골프',common_code:'CONC_04_12', group_code:'CONCERN_04'}
								, {code_name:'필라테스',common_code:'CONC_04_13', group_code:'CONCERN_04'}
								, {code_name:'홈 트레이닝',common_code:'CONC_04_14', group_code:'CONCERN_04'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>사교 활동</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'심심할 때 수다',common_code:'CONC_05_00', group_code:'CONCERN_05'}
								, {code_name:'노래방',common_code:'CONC_05_01', group_code:'CONCERN_05'}
								, {code_name:'술 한 잔',common_code:'CONC_05_02', group_code:'CONCERN_05'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'남사친',common_code:'CONC_05_03', group_code:'CONCERN_05'}
								, {code_name:'여사친',common_code:'CONC_05_04', group_code:'CONCERN_05'}
								, {code_name:'홈카페',common_code:'CONC_05_05', group_code:'CONCERN_05'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'코인 노래방',common_code:'CONC_05_06', group_code:'CONCERN_05'}
								, {code_name:'수다',common_code:'CONC_05_07', group_code:'CONCERN_05'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
								{code_name:'맛집',common_code:'CONC_03_00', group_code:'CONCERN_03'}
								, {code_name:'한강에서 치맥',common_code:'CONC_03_01', group_code:'CONCERN_03'}
								, {code_name:'베이킹',common_code:'CONC_03_02', group_code:'CONCERN_03'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'바',common_code:'CONC_03_03', group_code:'CONCERN_03'}
								, {code_name:'요리',common_code:'CONC_03_04', group_code:'CONCERN_03'}
								, {code_name:'달달한 디저트',common_code:'CONC_03_05', group_code:'CONCERN_03'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'먹방',common_code:'CONC_03_06', group_code:'CONCERN_03'}
								, {code_name:'수제 맥주',common_code:'CONC_03_07', group_code:'CONCERN_03'}
								, {code_name:'차 한 잔',common_code:'CONC_03_08', group_code:'CONCERN_03'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'와인',common_code:'CONC_03_09', group_code:'CONCERN_03'}
								, {code_name:'요리',common_code:'CONC_03_10', group_code:'CONCERN_03'}
								, {code_name:'맥주',common_code:'CONC_03_11', group_code:'CONCERN_03'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'떡볶이 맛집',common_code:'CONC_03_12', group_code:'CONCERN_03'}
								, {code_name:'고기 맛집',common_code:'CONC_03_13', group_code:'CONCERN_03'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>소셜/미디어</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'인스타그램',common_code:'CONC_06_00', group_code:'CONCERN_06'}
								, {code_name:'블로그',common_code:'CONC_06_01', group_code:'CONCERN_06'}
								, {code_name:'팟캐스트',common_code:'CONC_06_02', group_code:'CONCERN_06'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'브이로그',common_code:'CONC_06_03', group_code:'CONCERN_06'}
								, {code_name:'유투브',common_code:'CONC_06_04', group_code:'CONCERN_06'}
								, {code_name:'틱톡',common_code:'CONC_06_05', group_code:'CONCERN_06'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'인스타그램',common_code:'CONC_06_06', group_code:'CONCERN_06'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>엔터테인먼트</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'연극',common_code:'CONC_07_00', group_code:'CONCERN_07'}
								, {code_name:'영화',common_code:'CONC_07_01', group_code:'CONCERN_07'}
								, {code_name:'한국 드라마',common_code:'CONC_07_02', group_code:'CONCERN_07'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'해외 드라마',common_code:'CONC_07_03', group_code:'CONCERN_07'}
								, {code_name:'페스티벌',common_code:'CONC_07_04', group_code:'CONCERN_07'}
								, {code_name:'콘서트',common_code:'CONC_07_05', group_code:'CONCERN_07'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'코미디',common_code:'CONC_07_06', group_code:'CONCERN_07'}
								, {code_name:'넷플릭스',common_code:'CONC_07_07', group_code:'CONCERN_07'}
								, {code_name:'APPLE TV',common_code:'CONC_07_08', group_code:'CONCERN_07'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'디즈니+',common_code:'CONC_07_09', group_code:'CONCERN_07'}
								, {code_name:'디즈니',common_code:'CONC_07_10', group_code:'CONCERN_07'}
								, {code_name:'덕질',common_code:'CONC_07_11', group_code:'CONCERN_07'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'TV예능',common_code:'CONC_07_12', group_code:'CONCERN_07'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>게임/만화</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'웹툰',common_code:'CONC_08_00', group_code:'CONCERN_08'}
								, {code_name:'코믹스 북',common_code:'CONC_08_01', group_code:'CONCERN_08'}
								, {code_name:'PC방',common_code:'CONC_08_02', group_code:'CONCERN_08'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'VR 체험',common_code:'CONC_08_03', group_code:'CONCERN_08'}
								, {code_name:'방탈출 카페',common_code:'CONC_08_04', group_code:'CONCERN_08'}
								, {code_name:'만화카페',common_code:'CONC_08_05', group_code:'CONCERN_08'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'E스포츠',common_code:'CONC_08_06', group_code:'CONCERN_08'}
								, {code_name:'애니메이션',common_code:'CONC_08_07', group_code:'CONCERN_08'}
								, {code_name:'게임',common_code:'CONC_08_08', group_code:'CONCERN_08'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'보드게임',common_code:'CONC_08_09', group_code:'CONCERN_08'}
								, {code_name:'LOL',common_code:'CONC_08_10', group_code:'CONCERN_08'}
								, {code_name:'배틀그라운드',common_code:'CONC_08_11', group_code:'CONCERN_08'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'로블록스',common_code:'CONC_08_12', group_code:'CONCERN_08'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
								{code_name:'K-POP',common_code:'CONC_09_00', group_code:'CONCERN_09'}
								, {code_name:'댄스',common_code:'CONC_09_01', group_code:'CONCERN_09'}
								, {code_name:'예술',common_code:'CONC_09_02', group_code:'CONCERN_09'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'미술관',common_code:'CONC_09_03', group_code:'CONCERN_09'}
								, {code_name:'멜론',common_code:'CONC_09_04', group_code:'CONCERN_09'}
								, {code_name:'지니',common_code:'CONC_09_05', group_code:'CONCERN_09'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'SPOTIFY',common_code:'CONC_09_06', group_code:'CONCERN_09'}
								, {code_name:'APLLE MUSIC',common_code:'CONC_09_07', group_code:'CONCERN_09'}
								, {code_name:'악기 연주',common_code:'CONC_09_08', group_code:'CONCERN_09'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'댄스',common_code:'CONC_09_09', group_code:'CONCERN_09'}
								, {code_name:'그림 그리기',common_code:'CONC_09_10', group_code:'CONCERN_09'}
								, {code_name:'디제잉',common_code:'CONC_09_11', group_code:'CONCERN_09'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'랩',common_code:'CONC_09_12', group_code:'CONCERN_09'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>라이프 스타일</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'독서',common_code:'CONC_10_00', group_code:'CONCERN_10'}
								, {code_name:'무협/판타지',common_code:'CONC_10_01', group_code:'CONCERN_10'}
								, {code_name:'비주얼 노벨',common_code:'CONC_10_02', group_code:'CONCERN_10'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'전시회 관람',common_code:'CONC_10_03', group_code:'CONCERN_10'}
								, {code_name:'정치',common_code:'CONC_10_04', group_code:'CONCERN_10'}
								, {code_name:'외국어/어학',common_code:'CONC_10_05', group_code:'CONCERN_10'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'카공',common_code:'CONC_10_06', group_code:'CONCERN_10'}
								, {code_name:'원데이클래스',common_code:'CONC_10_07', group_code:'CONCERN_10'}
								, {code_name:'자격증 따기',common_code:'CONC_10_08', group_code:'CONCERN_10'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'글쓰기',common_code:'CONC_10_09', group_code:'CONCERN_10'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>MBTI</CommonText>
						</SpaceView>

						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'INFJ',common_code:'CONC_00_00', group_code:'CONCERN_00'}
								, {code_name:'INTJ',common_code:'CONC_00_01', group_code:'CONCERN_00'}
								, {code_name:'ISTJ',common_code:'CONC_00_02', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'ISFJ',common_code:'CONC_00_03', group_code:'CONCERN_00'}
								, {code_name:'ISTP',common_code:'CONC_00_04', group_code:'CONCERN_00'}
								, {code_name:'ISFP',common_code:'CONC_00_05', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'ESFJ',common_code:'CONC_00_06', group_code:'CONCERN_00'}
								, {code_name:'ENFJ',common_code:'CONC_00_07', group_code:'CONCERN_00'}
								, {code_name:'ENTP',common_code:'CONC_00_08', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'ESTJ',common_code:'CONC_00_09', group_code:'CONCERN_00'}
								, {code_name:'ENTJ',common_code:'CONC_00_10', group_code:'CONCERN_00'}
								, {code_name:'INFP',common_code:'CONC_00_11', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'ESFP',common_code:'CONC_00_12', group_code:'CONCERN_00'}
								, {code_name:'ENFP',common_code:'CONC_00_13', group_code:'CONCERN_00'}
								, {code_name:'INTP',common_code:'CONC_00_14', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'ESTP',common_code:'CONC_00_15', group_code:'CONCERN_00'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
							<CommonText fontWeight={'500'}>기타</CommonText>
						</SpaceView>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'스타트업',common_code:'CONC_99_00', group_code:'CONCERN_99'}
								, {code_name:'패션',common_code:'CONC_99_01', group_code:'CONCERN_99'}
								, {code_name:'DIY',common_code:'CONC_99_02', group_code:'CONCERN_99'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'타로카드',common_code:'CONC_99_03', group_code:'CONCERN_99'}
								, {code_name:'애견인',common_code:'CONC_99_04', group_code:'CONCERN_99'}
								, {code_name:'봉사활동',common_code:'CONC_99_05', group_code:'CONCERN_99'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'환경 운동',common_code:'CONC_99_06', group_code:'CONCERN_99'}
								, {code_name:'애묘인',common_code:'CONC_99_07', group_code:'CONCERN_99'}
								, {code_name:'인테리어',common_code:'CONC_99_08', group_code:'CONCERN_99'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'미용',common_code:'CONC_99_09', group_code:'CONCERN_99'}
								, {code_name:'뷰티',common_code:'CONC_99_10', group_code:'CONCERN_99'}
								, {code_name:'코디',common_code:'CONC_99_11', group_code:'CONCERN_99'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
						<View style={[layoutStyle.row, layoutStyle.justifyBetween]}>
							{[
								{code_name:'사진 촬영',common_code:'CONC_99_12', group_code:'CONCERN_99'}
								, {code_name:'주식 투자',common_code:'CONC_99_13', group_code:'CONCERN_99'}
								, {code_name:'가상화폐 투자',common_code:'CONC_99_14', group_code:'CONCERN_99'}
							].map((i, index) => {
								let tmpCommonCode = '';
								let tmpCnt = 0;

								for (let j = 0; j < checkIntValue_01.length; j++) {
									if(checkIntValue_01[j].common_code == i.common_code){
										tmpCommonCode = i.common_code
										tmpCnt = j;
										break;
									}									
								}

								return (
									<SpaceView>
										<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
															onPress={() => {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
																		}else{
																			setCheckIntValue_01(intValue => [...intValue, i])
																		}
																	}
															} >
											<CommonText
												fontWeight={'500'}
												color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								);
							})}
						</View>
					</SpaceView>
				</View>
			</Modalize>

		</>
	);
};
