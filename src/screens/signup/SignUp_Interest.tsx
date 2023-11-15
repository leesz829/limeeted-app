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
import { usePopup } from 'Context';
import { regist_member_add_info, get_member_introduce_guide } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';



/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 관심사
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Interest'>;
	route : RouteProp<StackParamList, 'SignUp_Interest'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Interest = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	const memberSeq = props.route.params?.memberSeq; // 회원 번호
	const gender = props.route.params?.gender; // 성별
	const mstImgPath = props.route.params?.mstImgPath; // 대표 사진 경로
	const nickname = props.route.params?.nickname; // 닉네임

	// ############################################################## 관심사 등록 팝업 관련
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

	// ############################################################ 회원 소개 정보 조회
	const getMemberIntro = async() => {
		const body = {
			member_seq : memberSeq
		};
		try {
			const { success, data } = await get_member_introduce_guide(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:

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
					show({ content: '오류입니다. 관리자에게 문의해주세요.' });
					break;
				}
			} else {
				show({ content: '오류입니다. 관리자에게 문의해주세요.' });
			}
		} catch (error) {
			console.log(error);
		} finally {
			
		}
	};

	// ############################################################################# 저장 함수
	const saveFn = async () => {
		if(checkIntList.length < 1){
			show({ content: '관심사를 입력해 주세요.' });
			return;
		}

		// 중복 클릭 방지 설정
		if(isClickable) {
			setIsClickable(false);
			setIsLoading(true);

			const body = {
				member_seq: memberSeq,
				interest_list: checkIntList,
				join_status: '02',
			};
			try {
			const { success, data } = await regist_member_add_info(body);
			if (success) {
				switch (data.result_code) {
					case SUCCESS:
						navigation.navigate(ROUTES.SIGNUP_INTRODUCE, {
							memberSeq: memberSeq,
							gender: gender,
							mstImgPath: mstImgPath,
							nickname: nickname,
						});
						break;
					default:
						show({
						content: '오류입니다. 관리자에게 문의해주세요.',
						confirmCallback: function () {},
						});
					break;
				}
			} else {
				show({
				content: '오류입니다. 관리자에게 문의해주세요.',
				confirmCallback: function () {},
				});
			}
			} catch (error) {
			console.log(error);
			} finally {
			setIsClickable(true);
			setIsLoading(false);
			};
		}
	};

	// ############################################################ 최초 실행
	React.useEffect(() => {
		getMemberIntro();		
	}, [isFocus]);

	return (
		<>
			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<SpaceView mt={20}>
						<Text style={_styles.title}>관심사 등록하기</Text>
						<Text style={_styles.subTitle}>나와 관심사를 공유할 수 있는 사람을 찾을 수 있어요.</Text>
					</SpaceView>

					<SpaceView mb={10}>
						<TouchableOpacity style={_styles.regiBtn} onPress={int_onOpen}>
							<Text style={_styles.regiBtnText}>관심사 등록</Text>
						</TouchableOpacity>
					</SpaceView>

					<SpaceView viewStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
						{checkIntList.map((i, index) => {
							return isEmptyData(i.code_name) && (
								<SpaceView mr={5} key={index + 'reg'}>
									{/* <TouchableOpacity style={[styles.interestBox, styles.boxActive]}>
										<CommonText color={ColorType.blue697A}>
											{i.code_name}
										</CommonText>
									</TouchableOpacity> */}
									<TouchableOpacity disabled={true} style={_styles.interBox}>
										<Text style={_styles.interText}>{i.code_name}</Text>
									</TouchableOpacity>
								</SpaceView>	
							);
						})}

						{/* <TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>동네 산책</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>반려견과 함께</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>인스타그램</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity> */}
					</SpaceView>

					{/* <SpaceView mb={40} mt={25} viewStyle={_styles.rowStyle}>
						{intList.map((item, index) => (
							<SpaceView mb={20} key={item.list[index].group_code + '_' + index}>
								{item.list.map((i, idx) => {
									let tmpCommonCode = '';
									let tmpCnt = 0;

									for (let j = 0; j < checkIntList.length; j++) {
										if(checkIntList[j].common_code == i.common_code){
										tmpCommonCode = i.common_code;
										tmpCnt = j;
										break;
										}
									}
									return (
										<SpaceView key={i.common_code}>
											<TouchableOpacity style={[_styles.interestBox, i.common_code === tmpCommonCode && _styles.interestActive]}
												onPress={() => {
												if(i.common_code === tmpCommonCode){
													setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
												} else {
													setCheckIntList(intValue => [...intValue, i])
												}
											}}>
												<CommonText color={'#697AE6'}>
													{i.code_name}
												</CommonText>
											</TouchableOpacity>
										</SpaceView>
									);
								})}	
							</SpaceView>
						))}
					</SpaceView> */}

					<SpaceView mt={205}>
						<CommonBtn
							value={'프로필 추가 정보 입력하기(선택)'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
								saveFn();
							}}
						/>
					</SpaceView>

					<SpaceView mt={20}>
						<CommonBtn
							value={'이전으로'}
							type={'reNewGoBack'}
							isGradient={false}
							fontFamily={'Pretendard-Light'}
							fontSize={14}
							borderRadius={5}
							onPress={() => {
								navigation.goBack();
							}}
						/>
					</SpaceView>
				</ScrollView>
			</LinearGradient>


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
											<TouchableOpacity 
												style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
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
												}}
											>
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



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}
const _styles = StyleSheet.create({
	wrap: {
		minHeight: height,
		padding: 30,
	},
	title: {
		fontSize: 30,
		fontFamily: 'Pretendard-Bold',
		color: '#D5CD9E',
	},
	subTitle: {
		fontSize: 12,
		fontFamily: 'Pretendard-Bold',
		color: '#D5CD9E',
	},
	regiBtn: {
		width: '100%',
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 10,
		marginTop: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	regiBtnText: {
		fontFamily: 'AppleSDGothicNeoB00',
		fontSize: 16,
		color: '#D5CD9E',
	},
	interBox: {
		padding: 10,
		borderRadius: 5,
		marginRight: 8,
		marginTop: 10,
		borderWidth: 1,
		borderColor: '#D5CD9E',
	},
	interText: {
		color: '#D5CD9E',
		fontFamily: 'AppleSDGothicNeoR00',
	},
	interestActive: {
		height: 40,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#697AE6',
		backgroundColor: '#FFF',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 5,
		marginRight: 5,
		paddingHorizontal: 10,
	}, 
	interestBox: {
		height: 40,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: '#697AE6',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 5,
		marginRight: 5,
		paddingHorizontal: 10,
	},

	rowStyle : {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
});