import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RadioCheckBox_2 } from 'component/RadioCheckBox_2';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { regist_introduce, get_member_introduce_guide } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonTextarea } from 'component/CommonTextarea';
import { isEmptyData } from 'utils/functions';



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
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const { width, height } = Dimensions.get('window');

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	const [nickname, setNickname] = React.useState('');	// 닉네임
	const [comment, setComment] = React.useState(''); // 한줄 소개
	const [introduceComment, setIntroduceComment] = React.useState<any>(''); // 프로필 소개

	const int_modalizeRef = useRef<Modalize>(null);
	const int_onOpen = () => { int_modalizeRef.current?.open(); };
	const int_onClose = () => {	int_modalizeRef.current?.close(); };

	// 관심사 목록
	const [intList, setIntList] = React.useState([]);

	// 관심사 체크 목록
	const [checkIntList, setCheckIntList] = React.useState([{code_name: "", common_code: "", interest_seq: ""}]);

	// 관심사 등록 확인 함수
	const int_confirm = () => {
		int_modalizeRef.current?.close();
	};


	// ############################################################ 소개 정보 저장
	const saveInterest = async() => {
		let special_pattern = /[^a-zA-Z0-9ㄱ-힣]/g;

		if(nickname == '' || typeof nickname == 'undefined' || nickname == null || !nickname.trim()) {
			show({ content: '닉네임을 입력해 주세요.' });
			return;
		}
		if(comment == '' || typeof comment == 'undefined') {
			show({ content: '한줄 소개를 입력해 주세요.' });
			return;
		}
		if(checkIntList.length < 1){
			show({ content: '관심사를 입력해 주세요.' });
			return;
		}

		if(nickname.length > 12 || special_pattern.test(nickname) == true) {
			show({ content: '한글, 영문, 숫자 12글자까지 입력할 수 있어요.' });
			return;
		}

		// 중복 클릭 방지 설정
		if(isClickable) {
			setIsClickable(false);
			setIsLoading(true);

			const body = {
				member_seq: props.route.params.memberSeq,
				nickname: nickname,
				comment: comment,
				interest_list: checkIntList,
				introduce_comment: introduceComment,
			};
	
			try {
				const { success, data } = await regist_introduce(body);
				if(success) {
					switch (data.result_code) {
						case SUCCESS:
							navigation.reset({
								routes: [
									{
										name : ROUTES.LOGIN01
									}
									, {
										name: ROUTES.APPROVAL
										, params: {
											memberSeq: props.route.params.memberSeq,
										}
									}
								]
							});
							break;
						case MEMBER_NICKNAME_DUP: 
							show({
								content: '이미 사용하고 있는 닉네임 입니다.' ,
							});
							break;
	
						default:
							show({
								content: '오류입니다. 관리자에게 문의해주세요.' ,
								confirmCallback: function() {}
							});
							break;
						}
				} else {
					show({
						content: '오류입니다. 관리자에게 문의해주세요.' ,
						confirmCallback: function() {}
					});
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsClickable(true);
				setIsLoading(false);
			}
		}
	}

	// ############################################################ 회원 소개 정보 조회
	const getMemberIntro = async() => {
		const body = {
			member_seq : props.route.params.memberSeq
		};
		try {
			const { success, data } = await get_member_introduce_guide(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:
					if(null != data.member) {
						setNickname(data.member.nickname);
						setComment(data.member.comment);
						setIntroduceComment(data.member.introduce_comment);
					}
		
					setIntList(data.int_list);
		
					let setList = new Array();
					data.int_list.map((item, index) => {
						item.list.map((obj, idx) => {
							if(obj.interest_seq != null) {
								setList.push(obj);
							}
						})
					})
		
					setCheckIntList(setList);
					break;
				default:
					show({
						content: '오류입니다. 관리자에게 문의해주세요.' ,
						confirmCallback: function() {}
					});
					break;
				}
			} else {
				show({
					content: '오류입니다. 관리자에게 문의해주세요.' ,
					confirmCallback: function() {}
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			
		}
	};

	const handleTextChange = (text: String) => {
		if (text.split('\n').length <= 3) {
		  setComment(text);
		}
	  };

	// ############################################################ 최초 실행
	React.useEffect(() => {
		getMemberIntro();		
	}, [isFocus]);

	// handleScroll function
	const handleScroll = (event) => {
		let contentOffset = event.nativeEvent.contentOffset;
		let index = Math.floor(contentOffset.x / 300);
		setCurrentIndex(index);
	};

	return (
		<>
			{isLoading && <CommonLoading />}

			<CommonHeader title={'닉네임과 한줄소개'} />
			<ScrollView style={[ styles.scrollContainerAll ]}>
				<View style={commonStyle.paddingHorizontal20}>
					<SpaceView mb={40}>
						<CommonText>리미티드에서 사용할</CommonText>
						<CommonText fontWeight={'700'}>닉네임과 한줄소개를 입력해주세요.</CommonText>
					</SpaceView>

					<SpaceView mb={24}>
						<CommonInput 
							label="닉네임" 
							placeholder={'한글, 영문, 숫자 12글자까지 입력할 수 있어요.'}
							placeholderTextColor={'#c6ccd3'}
							value={nickname}
							maxLength={20}
							onChangeText={nickname => setNickname(nickname)}  />
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={10} viewStyle={{flexDirection: 'row', alignItems: 'flex-end'}}>
							<CommonText textStyle={_styles.labelStyle2}>한줄 소개</CommonText>
							<Text style={_styles.countText}>({isEmptyData(comment) ? comment.length : 0}/50)</Text>
						</SpaceView>
						<CommonTextarea
							label={''} 
							value={comment}
							onChangeText={(comment) => setComment(comment)}
							placeholder={'한줄 소개를 입력 하세요.'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={50}
							height={70}
							borderRadius={10}
							fontSize={12}
							fontColor={'#333333'}
							onChangeText={ handleTextChange }
						/>

						{/* <CommonInput 
							label="한줄 소개" 
							placeholder={'한줄 소개를 입력해 주세요.'}
							placeholderTextColor={'#c6ccd3'}
							value={comment}
							maxLength={50}
							onChangeText={comment => setComment(comment)} /> */}
					</SpaceView>

					<SpaceView mb={24}>
						<SpaceView mb={10} viewStyle={{flexDirection: 'row', alignItems: 'flex-end'}}>
							<CommonText textStyle={_styles.labelStyle2}>프로필 소개</CommonText>
							<Text style={_styles.countText}>({isEmptyData(introduceComment) ? introduceComment.length : 0}/3000)</Text>
						</SpaceView>
						<CommonTextarea
							label={''}
							value={introduceComment}
							onChangeText={(introduceComment) => setIntroduceComment(introduceComment)}
							placeholder={'자유롭게 나 자신을 소개해 주세요!\n구체적으로 작성할수록 이성에게\n좋은 매력 포인트가 될 수 있어요 😊'}
							placeholderTextColor={'#c6ccd3'}
							maxLength={3000}
							height={130}
							borderRadius={10}
							fontSize={12}
							fontColor={'#333333'} />
					</SpaceView>

					<SpaceView mb={15}>
						<SpaceView mb={1}>
							<CommonText type={'h4'} fontWeight={'200'}>관심사 표현하기(최대 20개)</CommonText>
						</SpaceView>
						<CommonText color={'#B1B1B1'} type={'h5'}>
							같은 관심사를 가진 이성을 소개할 수 있도록 도와드릴게요!
						</CommonText>
					</SpaceView>

					<SpaceView mb={10}>
						<TouchableOpacity style={_styles.btnStyle} onPress={int_onOpen}>
							<Image source={ICON.plus_gray} style={styles.iconSize18} />
							<CommonText color={'#C7C7C7'} type={'h5'} fontWeight={'200'} textStyle={{marginLeft: 5}}>관심사 등록</CommonText>
						</TouchableOpacity>
					</SpaceView>

					<SpaceView mb={40} mt={5} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
						{checkIntList.map((i, index) => {
							return (
								i.code_name != "" ? (
									<SpaceView mr={5} key={index + 'reg'}>
										<TouchableOpacity style={[styles.interestBox, styles.boxActive]}>
											<CommonText color={ColorType.blue697A}>
												{i.code_name}
											</CommonText>
										</TouchableOpacity>
									</SpaceView>
								) : null
							);
						})}
					</SpaceView>
				</View>
			</ScrollView>

			<SpaceView>
				<CommonBtn value={'다음 (4/4)'} 
							type={'primary'}
							height={60}
							borderRadius={1}
							onPress={() => {
								saveInterest();
							}} 
				/>
			</SpaceView>


			{/* #############################################################################
											관심사 설정 팝업
			############################################################################# */}

			<Modalize
				ref={int_modalizeRef}
				adjustToContentHeight = {false}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={modalStyle.modalContainer}
				modalHeight={height - 150}
				FooterComponent={
					<>
						<SpaceView>
							<CommonBtn value={'저장(' + checkIntList.length + '/20)'} 
										type={'primary'}
										height={60}
										borderRadius={1}
										onPress={int_confirm}/>
						</SpaceView>
					</>
				}
				HeaderComponent={
					<>
						<View style={modalStyle.modalHeaderContainer}>
							<CommonText fontWeight={'700'} type={'h4'}>
								관심사 등록
							</CommonText>
							<TouchableOpacity onPress={int_onClose}>
								<Image source={ICON.xBtn2} style={styles.iconSize18} />
							</TouchableOpacity>
						</View>
					</>
				} >	

				<View style={[modalStyle.modalBody]}>
					{intList.map((item, index) => (
						<SpaceView mt={20} mb={10} key={item.group_code + '_' + index}>
							<SpaceView mb={16}>
								<CommonText fontWeight={'700'}>{item.group_code_name}</CommonText>
							</SpaceView>

							<View style={[_styles.rowStyle]}>
								{item.list.map((i, idx) => {
									let tmpCommonCode = '';
									let tmpCnt = 0;
	
									for (let j = 0; j < checkIntList.length; j++) {
										if(checkIntList[j].common_code == i.common_code){
											tmpCommonCode = i.common_code
											tmpCnt = j;
											break;
										}
									}

									return (
										<SpaceView key={i.common_code} mr={5}>
											<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
																onPress={() => {
																	console.log('checkIntList.length :::: ' , checkIntList.length);

																	if(checkIntList.length > 19 && i.common_code !== tmpCommonCode) {

																	} else {
																		if(i.common_code === tmpCommonCode){
																			setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
																		} else {
																			setCheckIntList(intValue => [...intValue, i])
																		}
																	}
																}}>
												<CommonText
													fontWeight={'500'}
													color={i.common_code === tmpCommonCode ? ColorType.blue697A : ColorType.grayb1b1} >
													{i.code_name}
												</CommonText>
											</TouchableOpacity>
										</SpaceView>
									)
								})}	
							</View>
						</SpaceView>
					))}
				</View>
			</Modalize>

		</>
	);
};



const RenderItem = (data: any) => {
	const group_code = data.obj.item.group_code;
	const group_code_name = data.obj.item.group_code_name;
	const list = data.obj.item.list;

	const checkIntList = data.obj.item.checkIntList;

	let tmpCommonCode = '';
	let tmpCnt = 0;


	return (
		<SpaceView mb={24}>
			<SpaceView mb={16}>
				<CommonText fontWeight={'500'}>{group_code_name}</CommonText>
			</SpaceView>

			<View style={[_styles.rowStyle, layoutStyle.justifyBetween]}>
				{list.map((item, index) => (
					<SpaceView>
						<TouchableOpacity style={[styles.interestBox]} 
											onPress={() => {
													if(item.common_code === tmpCommonCode){
														//setCheckIntValue_01(checkIntValue_01.filter(checkIntValue => checkIntValue.common_code != tmpCommonCode))
													} else {
														//setCheckIntValue_01(intValue => [...intValue, i])
													}
												}
											}>
							<CommonText
								fontWeight={'500'}
								color={ColorType.gray8888} >
								{item.code_name}
							</CommonText>
						</TouchableOpacity>
					</SpaceView>
				))}
			</View>
		</SpaceView>
	);
  };


const _styles = StyleSheet.create({
	rowStyle : {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	btnStyle: {
		width: '100%',
		height: 50,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderStyle: 'dotted',
		borderColor: '#C7C7C7',
		flexDirection: 'row',
	  },
	  labelStyle2: {
		fontSize: 17,
		lineHeight: 23,
		fontFamily: 'AppleSDGothicNeoEB00',
		color: '#333333',
	  },
	  countText: {
		marginLeft: 3,
		fontFamily: 'AppleSDGothicNeoR00',
		fontSize: 13,
		color: '#363636',
	  },


  });