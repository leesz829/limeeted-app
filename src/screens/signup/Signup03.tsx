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

	// 관심사 적용 변수
	let apply_int = new Array();

	// 관심사 설정 변수
	const [checkIntValue_01, setCheckIntValue_01] = useState('');	// 문화생활
	const [checkIntValue_03, setCheckIntValue_03] = useState('');	// 음식문화
	const [checkIntValue_05, setCheckIntValue_05] = useState('');	// 사교활동
	const [checkIntValue_09, setCheckIntValue_09] = useState('');	// 음악/예술

	const int_confirm = () => {
		apply_int = new Array();
		let int_json = { key: "", value: "" }
		if(checkIntValue_01 != "") { int_json = { key: "CONCERN_01", value: checkIntValue_01 }; apply_int.push(int_json); }
		if(checkIntValue_03 != "") { int_json = { key: "CONCERN_03", value: checkIntValue_03 }; apply_int.push(int_json); }
		if(checkIntValue_05 != "") { int_json = { key: "CONCERN_05", value: checkIntValue_05 }; apply_int.push(int_json); }
		if(checkIntValue_09 != "") { int_json = { key: "CONCERN_09", value: checkIntValue_09 }; apply_int.push(int_json); }
		int_modalizeRef.current?.close();
	};

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
									onChangeText={nickname => setNickname(nickname)}  />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" 
									placeholder={'서울사람'}
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

				<SpaceView mb={24}>
					<CommonBtn value={'다음 (4/4)'} 
								type={'primary'}
								onPress={() => {

									console.log("nickname :::: " + nickname);
									console.log(JSON.parse(JSON.stringify(apply_int)));

									axios.post('http://211.104.55.151:8080/member/insertMember04/', {
										memberSeq : props.route.params.memberSeq,
										nickname : nickname,
										comment: comment,
										interestList : apply_int
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
								{ text: '여행', value: 'CONC_01_00', isActive: true },
								{ text: '새로운 것 도전', value: 'CONC_01_01', isActive: false },
								{ text: '사진', value: 'CONC_01_02', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.value === checkIntValue_01 && styles.boxActive]}
															onPress={() => { setCheckIntValue_01(i.value); }} >
											<CommonText
												fontWeight={'500'}
												color={i.value === checkIntValue_01 ? ColorType.primary : ColorType.gray8888} >
												{i.text}
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
								{ text: '맛집', value: 'CONC_03_00', isActive: true },
								{ text: '한강에서 치맥', value: 'CONC_03_01', isActive: false },
								{ text: '베이킹', value: 'CONC_03_02', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.value === checkIntValue_03 && styles.boxActive]}
															onPress={() => { setCheckIntValue_03(i.value); }} >
											<CommonText
												fontWeight={'500'}
												color={i.value === checkIntValue_03 ? ColorType.primary : ColorType.gray8888} >
												{i.text}
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
								{ text: '노래방', value: 'CONC_05_01', isActive: true },
								{ text: '술 한 잔', value: 'CONC_05_02', isActive: false },
								{ text: '코인 노래방', value: 'CONC_05_06', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.value === checkIntValue_05 && styles.boxActive]}
															onPress={() => { setCheckIntValue_05(i.value); }} >
											<CommonText
												fontWeight={'500'}
												color={i.value === checkIntValue_05 ? ColorType.primary : ColorType.gray8888} >
												{i.text}
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
								{ text: 'K-POP', value: 'CONC_09_00', isActive: true },
								{ text: '댄스', value: 'CONC_09_01', isActive: false },
								{ text: '예술', value: 'CONC_09_02', isActive: false }
							].map((i, index) => {
								return (
									<SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, i.value === checkIntValue_09 && styles.boxActive]}
															onPress={() => { setCheckIntValue_09(i.value); }} >
											<CommonText
												fontWeight={'500'}
												color={i.value === checkIntValue_09 ? ColorType.primary : ColorType.gray8888} >
												{i.text}
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
