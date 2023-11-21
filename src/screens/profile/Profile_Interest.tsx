import { styles, layoutStyle, modalStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, Text } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect, useRef } from 'react';
import { CommonSelect } from 'component/CommonSelect';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import { CommonTextarea } from 'component/CommonTextarea';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { ColorType, StackParamList, BottomParamList, ScreenNavigationProp } from '@types';
import { useDispatch } from 'react-redux';
import { STACK } from 'constants/routes';
import { useUserInfo } from 'hooks/useUserInfo';
import { get_member_interest, save_member_interest } from 'api/models';
import { usePopup } from 'Context';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { SUCCESS } from 'constants/reusltcode';
import { isEmptyData } from 'utils/functions';
import { CommonLoading } from 'component/CommonLoading';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import LinearGradient from 'react-native-linear-gradient';


/* ################################################################################################################
###################################################################################################################
###### 관심사 상세
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile_Interest'>;
  route: RouteProp<StackParamList, 'Profile_Interest'>;
}

const { width, height } = Dimensions.get('window');

export const Profile_Interest = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();

  const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false); // 로딩 여부
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  const memberBase = useUserInfo(); // 회원 기본정보


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

  // ############################################################ 관심사 정보 조회
	const getInterest = async() => {
		const body = {};
		try {
			const { success, data } = await get_member_interest(body);
			if(success) {
				switch (data.result_code) {
          case SUCCESS:
            setIntList(data?.interest_list);
      
            let setList = new Array();
            data?.interest_list.map((item, index) => {
              item.list.map((obj, idx) => {
                if(obj.interest_seq != null) {
                  setList.push(obj);
                };
              });
            });
      
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
		};

		// 중복 클릭 방지 설정
		if(isClickable) {
			setIsClickable(false);
			setIsLoading(true);

			const body = {
				interest_list: checkIntList,
			};
			try {
        const { success, data } = await save_member_interest(body);
        if (success) {
          switch (data.result_code) {
            case SUCCESS:
              navigation.goBack();
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

  // 첫 렌더링 때 실행
  React.useEffect(() => {
    if(isFocus) {
      getInterest();
    }

  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView showsVerticalScrollIndicator={false} style={{height: height-180}}>
					<SpaceView mt={20}>
						<Text style={_styles.title}>관심사 등록하기</Text>
						<Text style={_styles.subTitle}>나와 관심사를 공유할 수 있는 사람을 찾을 수 있어요.</Text>
					</SpaceView>

					<SpaceView mb={10}>
						<TouchableOpacity style={_styles.regiBtn} onPress={int_onOpen}>
							<Text style={_styles.regiBtnText}>관심사 등록</Text>
						</TouchableOpacity>
					</SpaceView>

					<SpaceView mb={20} viewStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
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
					</SpaceView>
				</ScrollView>

        <SpaceView mb={20}>
          <SpaceView>
						<CommonBtn
							value={'저장하기'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
								saveFn();
							}}
						/>
					</SpaceView>

					<SpaceView mt={10}>
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

			</LinearGradient>

			{/* #############################################################################
											관심사 설정 팝업
			############################################################################# */}

			<Modalize
				ref={int_modalizeRef}
				adjustToContentHeight = {false}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={[modalStyle.modalContainer, {backgroundColor: '#333B41'}]}
				modalHeight={height - 150}
				FooterComponent={
					<>
						<SpaceView mb={20} pl={20} pr={20}>
							<SpaceView>
								<CommonBtn
                  value={'저장(' + checkIntList.length + '/20)'} 
									type={'reNewId'}
									borderRadius={5}
									onPress={int_confirm}/>
							</SpaceView>
							<SpaceView mt={10}>
								<CommonBtn	value={'취소'} 
								type={'reNewGoBack'}
								borderRadius={5}
								onPress={int_onClose}/>
							</SpaceView>
						</SpaceView>
					</>
				}
				HeaderComponent={
					<>
						<View style={[modalStyle.modalHeaderContainer, {paddingHorizontal: 20}]}>
							<CommonText textStyle={_styles.modalTitle} fontWeight={'700'} type={'h4'}>
								관심사 선택(최대 20개)
							</CommonText>
							{/* <TouchableOpacity onPress={int_onClose}>
								<Image source={ICON.xBtn2} style={styles.iconSize18} />
							</TouchableOpacity> */}
						</View>
					</>
				} >	

				<View style={[modalStyle.modalBody]}>
					{intList.map((item, index) => (
						<SpaceView mt={20} mb={10} key={item.group_code + '_' + index}>
							<SpaceView mb={16}>
								<CommonText textStyle={_styles.groupCodeName} fontWeight={'700'}>{item.group_code_name}</CommonText>
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
												style={[_styles.interestBox, i.common_code === tmpCommonCode && styles.boxActive]}
												onPress={() => {
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
													color={ColorType.goldD5CD} >
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
		fontFamily: 'Pretendard-Bold',
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
		fontFamily: 'Pretendard-SemiBold',
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
		borderWidth: 1,
		borderColor: '#D5CD9E',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 5,
		paddingHorizontal: 15,
	},
	modalTitle: {
		color: '#F3E270',
		fontFamily: 'Pretendard-SemiBold',
		fontSize: 20,
	},
	groupCodeName: {
		fontFamily: 'Pretendard-Bold',
		fontSize: 19,
		color: '#F3E270',
	},
	rowStyle : {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	boxActive: {
		backgroundColor: '#FFF',
	},

});