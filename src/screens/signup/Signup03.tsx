import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RadioCheckBox_2 } from 'component/RadioCheckBox_2';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { regist_introduce, get_member_introduce_guide } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';



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

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();

	const [nickname, setNickname] = React.useState('');
	const [comment, setComment] = React.useState('');

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
		if(nickname == '' || typeof nickname == 'undefined') {
			show({ content: '닉네임을 입력해 주세요.' });
			return;
		}
		if(comment == '' || typeof comment == 'undefined') {
			show({ content: '한줄 소개를 입력해 주세요.' });
			return;
		}
		if(checkIntList.length < 2){
			show({ content: '관심사를 입력해 주세요.' });
			return;
		}

		const body = {
			member_seq : props.route.params.memberSeq,
			nickname : nickname,
			comment: comment,
			interest_list : checkIntList
		};
		try {
			const { success, data } = await regist_introduce(body);
			if(success) {
				switch (data.result_code) {
				case SUCCESS:
					navigation.reset({
						routes: [
							{
								name : ROUTES.LOGIN
							}
							, {
								name: ROUTES.APPROVAL
								, params: {
									memberSeq: props.route.params.memberSeq,
									accessType: 'JOIN'
								}
							}
						]
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
	}

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
									maxLength={10}
									onChangeText={nickname => setNickname(nickname)}  />
				</SpaceView>

				<SpaceView mb={48}>
					<CommonInput label="한줄 소개" 
									placeholder={'한줄 소개를 입력해 주세요.'}
									placeholderTextColor={'#c6ccd3'}
									value={comment}
									maxLength={20}
									onChangeText={comment => setComment(comment)}
									 />
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
					{checkIntList.map((i, index) => {
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
									saveInterest();
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
							<CommonBtn value={'저장'} 
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
					</>
				} >	

				<View style={modalStyle.modalBody}>

					{/* <FlatList
						onScroll={handleScroll}
						showsHorizontalScrollIndicator={false}
						pagingEnabled={true}
						horizontal={false}
						data={intList}
						renderItem={(data) => <RenderItem obj={data} callbackFn={okFn} checkIntList={checkIntList} />}
					/> */}
					
					{intList.map((item, index) => (
						<SpaceView mb={24} key={item.group_code + '_' + index}>
							<SpaceView mb={16}>
								<CommonText fontWeight={'500'}>{item.group_code_name}</CommonText>
							</SpaceView>

							<View style={[_styles.rowStyle, layoutStyle.justifyBetween]}>
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
										<SpaceView key={i.common_code}>
											<TouchableOpacity style={[styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
																onPress={() => {
																	if(i.common_code === tmpCommonCode){
																		setCheckIntList(checkIntList.filter(value => value.common_code != tmpCommonCode))
																	} else {
																		setCheckIntList(intValue => [...intValue, i])
																	}
																}}>
												<CommonText
													fontWeight={'500'}
													color={i.common_code === tmpCommonCode ? ColorType.primary : ColorType.gray8888} >
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
	}
  });