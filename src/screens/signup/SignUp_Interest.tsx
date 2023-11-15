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

	// 관심사 목록
	const [intList, setIntList] = React.useState([]);

	// 관심사 체크 목록
	const [checkIntList, setCheckIntList] = React.useState([{code_name: "", common_code: "", interest_seq: ""}]);

	// ############################################################ 회원 소개 정보 조회
	const getMemberIntro = async() => {
		const body = {
			member_seq : 1024
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
				<ScrollView>
					<SpaceView mt={20}>
						<Text style={_styles.title}>관심사 등록하기</Text>
						<Text style={_styles.subTitle}>나와 관심사를 공유할 수 있는 사람을 찾을 수 있어요.</Text>
					</SpaceView>

					<SpaceView>
						<TouchableOpacity style={_styles.regiBtn}>
							<Text style={_styles.regiBtnText}>관심사 등록</Text>
						</TouchableOpacity>
					</SpaceView>

					<SpaceView viewStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>동네 산책</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>반려견과 함께</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>인스타그램</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>캠핑</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
						<TouchableOpacity style={_styles.interBox}><Text style={_styles.interText}>집에서 영화보기</Text></TouchableOpacity>
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

					<SpaceView mt={245}>
						<CommonBtn
							value={'프로필 추가 정보 입력하기(선택)'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
							navigation.navigate({
									name : ROUTES.SIGNUP_INTRODUCE
								});
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
								navigation.navigate('Login');
							}}
						/>
					</SpaceView>
				</ScrollView>
			</LinearGradient>
		</>
	);
};



/* ################################################################################################################
###### Style 영역
################################################################################################################ */
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