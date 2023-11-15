import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePopup } from 'Context';
import { regist_member_add_info, get_member_introduce_guide } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';



/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 프로필 소개
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Introduce'>;
	route : RouteProp<StackParamList, 'SignUp_Introduce'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Introduce = (props : Props) => {
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

	const [introduceComment, setIntroduceComment] = React.useState('');	// 상세 소개
	//const [comment, setComment] = React.useState(''); // 한줄 소개

	const [interviewList, setInterviewList] = React.useState([]); // 인터뷰 목록


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
					let _interviewList:any = [];
					data?.interview_list?.map((item, index) => {
						const data = {
							common_code: item?.common_code,
							code_name: item?.code_name,
							interview_seq: item?.interview_seq,
							answer: isEmptyData(item?.answer) ? item?.answer : '',
							order_seq: item?.order_seq,
						};
						_interviewList.push(data);
					});
					setInterviewList(_interviewList);
					setIntroduceComment(data?.add_info?.introduce_comment);

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

	// ############################################################################# 저장 함수
	const saveFn = async () => {

		// 중복 클릭 방지 설정
		if(isClickable) {
			setIsClickable(false);
			setIsLoading(true);

			const body = {
				member_seq: memberSeq,
				introduce_comment: introduceComment,
				interview_list: interviewList,
				join_status: '02',
			};
			try {
				const { success, data } = await regist_member_add_info(body);
				if (success) {
					switch (data.result_code) {
						case SUCCESS:
							navigation.navigate(ROUTES.SIGNUP_AUTH, {
								memberSeq: memberSeq,
								gender: gender,
								mstImgPath: mstImgPath,
								nickname: nickname,
							});
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
				setIsClickable(true);
				setIsLoading(false);
			};
		}
	};

	/* ############################################################################# 인터뷰 답변 핸들러 */
	const answerChangeHandler = (common_code: any, text: any) => {
		setInterviewList((prev) =>
			prev.map((item: any) =>
			item.common_code === common_code
				? { ...item, answer: text }
				: item
			)
		);
		//callbackAnswerFn && callbackAnswerFn(member_interview_seq, text);
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
				<ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
					<SpaceView mt={20}>
						<Text style={_styles.title}><Text style={{color: '#F3E270'}}>{nickname}</Text>님의{'\n'}프로필 소개 작성하기(선택)</Text>
					</SpaceView>

					<SpaceView mt={35}>
						<TextInput
							value={introduceComment}
							onChangeText={(text) => setIntroduceComment(text)}
							autoCapitalize={'none'}
							multiline={true}
							style={_styles.textInputBox(110)}
							placeholder={'프로필 카드 상단에 공개되는 내 상세 소개 입력'}
							placeholderTextColor={'#FFFDEC'}
							maxLength={3000}
							caretHidden={true}
              			/>
						<SpaceView>
							<Text style={_styles.countText}>({isEmptyData(introduceComment) ? introduceComment.length : 0}/3000)</Text>
						</SpaceView>
					</SpaceView>

					<SpaceView mt={50}>
						{interviewList.length > 0 && (
							<>
								{interviewList.map((item, index) => {

									return (
										<SpaceView mb={15}>
											<Text style={_styles.introduceText}>Q. {item?.code_name}</Text>
											<TextInput
												defaultValue={item?.answer}
												onChangeText={(text) => answerChangeHandler(item?.common_code, text) }
												autoCapitalize={'none'}
												multiline={true}
												style={_styles.textInputBox(70)}
												placeholder={'인터뷰 답변 입력(가입 후 변경 가능)'}
												placeholderTextColor={'#FFFDEC'}
												maxLength={200}
												caretHidden={true}
											/>
										</SpaceView>
									)
								})}
							</>
						)}
					</SpaceView>

					<SpaceView>
						<SpaceView mt={40}>
							<CommonBtn
								value={'멤버쉽 인증하기(선택)'}
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
	textInputBox: (_hegiht: number) => {
		return {
			width: '100%',
			height: _hegiht,
			backgroundColor: '#445561',
			borderRadius: 5,
			textAlign: 'center',
			fontFamily: 'Pretendard-Light',
			color: '#FFFDEC',
		};
	  },
	introduceText: {
		fontFamily: 'Pretendard-Regular',
		color: '#FFDD00',
		marginBottom: 10,
	},
	countText: {
		marginLeft: 3,
		fontFamily: 'Pretendard-Regular',
		fontSize: 12,
		color: '#fff',
		textAlign: 'right',
	  },
});