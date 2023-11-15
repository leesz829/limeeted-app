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
import { TextInput } from 'react-native-gesture-handler';



/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 프로필 인증
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Auth'>;
	route : RouteProp<StackParamList, 'SignUp_Auth'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Auth = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const isFocus = useIsFocused();
	const { show } = usePopup(); // 공통 팝업
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부
	const [currentImgIdx, setCurrentImgIdx] = React.useState(0); // 현재 이미지 인덱스
  
	const [authImageList, setAuthImageList] = React.useState([]); // 인증 이미지 목록

	const authInfoArr = ['직업', '학력', '소득', '자산', 'SNS', '차량'];
	const data = [0];
  
	// 인증 이미지 삭제 시퀀스 문자열
	const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');
  
	// ################################################################ 인증 이미지 데이터 적용
	const imageDataApply = async (data:any) => {
	  setAuthImageList((prev) => {
		const dupChk = prev.some(item => item.order_seq === data.order_seq);
		if (!dupChk) {
			return [...prev, data];
		} else {
			return prev.map((item) => item.order_seq === data.order_seq 
				? { ...item, uri: data.file_uri, file_base64: data.file_base64 }
				: item
			);
		}
	  });
	};
  
	// ############################################################################# 사진 관리 컨트롤 변수
	const [imgMngData, setImgMngData] = React.useState<any>({
	  member_img_seq: 0,
	  img_file_path: '',
	  order_seq: '',
	  status: '',
	  return_reason: '',
	});
  
	// ############################################################################# 사진 관리 팝업 관련 함수
	const imgMng_modalizeRef = useRef<Modalize>(null);
	const imgMng_onOpen = (imgData: any, order_seq: any) => {
	  setImgMngData({
		member_img_seq: imgData.member_img_seq,
		img_file_path: imgData.img_file_path,
		order_seq: order_seq,
		status: imgData.status,
		return_reason: imgData.return_reason,
	  });
  
	  console.log('imgData ::::: ' , imgData);
	  imgMng_modalizeRef.current?.open();
	};
	const imgMng_onClose = () => {
	  imgMng_modalizeRef.current?.close();
	};
  
	// ############################################################################# 사진 선택
	const imgSelected = (idx:number, isNew:boolean) => {
	  if(isNew) {
		imagePickerOpen(function(path:any, data:any) {
		  let _data = {
			member_img_seq: 0,
			img_file_path: path,
			order_seq: authImageList.length+1,
			org_order_seq: authImageList.length+1,
			del_yn: 'N',
			status: 'PROGRESS',
			return_reason: '',
			file_base64: data,
		  };
	
		  setAuthImageList((prev) => {
			return [...prev, _data];
		  });
  
		  setCurrentImgIdx(authImageList.length);
		});
	  } else {
		setCurrentImgIdx(idx);
	  }
	}
  
	// ############################################################################# 사진 변경
	const imgModfyProc = () => {
	  imagePickerOpen(function(path:any, data:any) {
  
		// 삭제 데이터 저장
		if(isEmptyData(imgMngData.member_img_seq) && 0 != imgMngData.member_img_seq) {
		  let delArr = imgDelSeqStr;
		  if (delArr == '') {
			delArr = imgMngData.member_img_seq;
		  } else {
			delArr = delArr + ',' + imgMngData.member_img_seq;
		  }
		  setImgDelSeqStr(delArr);
		}
  
		// 목록 재구성
		setAuthImageList((prev) => {
		  const dupChk = prev.some(item => item.order_seq === imgMngData.order_seq);
		  if(dupChk) {
			return prev.map((item) => item.order_seq === imgMngData.order_seq 
				? { ...item, img_file_path: path, file_base64: data, status: 'PROGRESS' }
				: item
			);
		  }
		});
  
		// 모달 닫기
		imgMng_onClose();
	  });
	};
  
	// ############################################################################# 사진 삭제
	const imgDelProc = () => {
	  // 인증 이미지 목록 재구성
	  let _authImgList:any = [];
	  authImageList.map((item, index) => {
		if(index+1 != imgMngData.order_seq) {
		  _authImgList.push(item);
		}
	  });
	  _authImgList.map((item, index) => {
		item.order_seq = index+1;
	  });
	  setAuthImageList(_authImgList);
  
	  // 삭제 데이터 저장
	  if(isEmptyData(imgMngData.member_img_seq) && 0 != imgMngData.member_img_seq) {
		let delArr = imgDelSeqStr;
		if (delArr == '') {
		  delArr = imgMngData.member_img_seq;
		} else {
		  delArr = delArr + ',' + imgMngData.member_img_seq;
		}
  
		setImgDelSeqStr(delArr);
	  }
  
	  setCurrentImgIdx(0);
  
	  // 모달 닫기
	  imgMng_onClose();
	};
  
	// ############################################################################# 인증 이미지 정보 조회
	const getAuthImage = async () => {
	  const body = {
		member_seq: props.route.params.memberSeq,
	  };
	  try {
		const { success, data } = await get_second_auth(body);
		if (success) {
		  switch (data.result_code) {
			case SUCCESS:
			  if(isEmptyData(data.imgList)) {
				let _authImgList:any = [];
				data?.imgList?.map((item, index) => {
				  let data = {
					// member_img_seq: item.member_img_seq,
					// img_file_path: item.img_file_path,
					// order_seq: index+1,
					// org_order_seq: item.org_order_seq,
					// del_yn: 'N',
					// status: item.status,
					// return_reason: item.return_reason,
					// file_base64: null,
				  };                
				  _authImgList.push(data);
				});
  
				setAuthImageList(_authImgList);
			  }
  
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
		setIsLoading(false);
	  }
	};
  
	// ############################################################################# 인증 이미지 저장
	const saveAuthImage = async () => {
  
	  let tmpCnt = 0;
	  authImageList.map((item, index) => {
		if(item.status != 'REFUSE') {
		  tmpCnt++;
		}
	  });

	  //return;
  
	  // 중복 클릭 방지 설정
	  if(isClickable) {
		setIsClickable(false);
		setIsLoading(true);
  
		const body = {
		  member_seq: props.route.params.memberSeq,
		  file_list: authImageList,
		  img_del_seq_str: imgDelSeqStr,
		};
		try {
		  const { success, data } = await regist_second_auth(body);
		  if (success) {
			switch (data.result_code) {
			  case SUCCESS:
				navigation.navigate(ROUTES.SIGNUP03, {
				  memberSeq: props.route.params.memberSeq,
				  gender: props.route.params.gender,
				  mstImgPath: data.mst_img_path,
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
  
	/* ########################################################################################## 프로필 사진 아이템 렌더링 */
	function authImageItemNew({ index, imgData, imgSelectedFn }) {
	  const imgUrl = findSourcePathLocal(imgData?.img_file_path); // 이미지 경로
	  const imgDelYn = imgData?.del_yn; // 이미지 삭제 여부
	  const imgStatus = imgData?.status; // 이미지 상태
	  
	  //console.log('imgData111111 ::::: ' , imgData);
	
	  return (
		<TouchableOpacity 
		  onPress={() => { imgSelectedFn(index, !isEmptyData(imgData)); }}
		  activeOpacity={0.9}
		>
		  {isEmptyData(imgUrl) && imgDelYn == 'N' ? (
			<>
			  <SpaceView viewStyle={_styles.subImgWrap(index == currentImgIdx)} >
				<Image
				  resizeMode="cover"
				  resizeMethod="scale"
				  style={_styles.subImgStyle}
				  key={imgUrl}
				  source={imgUrl}
				/>
				<View style={_styles.imageDisabled(false)}>
				  <Text style={[_styles.authImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : '반려'}</Text>
				</View>
			  </SpaceView>
			</>
		  ) : (
			<>
			  <SpaceView viewStyle={_styles.subImgNoData}>
				<Image source={ICON.userAdd} style={styles.iconSquareSize(22)} />
			  </SpaceView>
			</>
		  )}
		</TouchableOpacity>
	  );
	};

	return (
		<>
			<SpaceView mt={20} viewStyle={{backgroundColor: '#445561', padding: 30}}>
				<Text style={_styles.title}>멤버쉽 인증하고{'\n'}내 강점을 드러내기(선택)</Text>
				<Text style={_styles.subTitle}>
					아래 가이드를 참고하시고 멤버쉽 인증 자료를 올려 주세요.{'\n'}
					심사 기준에 따라 프로필에 인증 뱃지가 부여되며{'\n'}
					이성과의 매칭에 유리할 수 있습니다.
				</Text>
				<ScrollView horizontal={true} contentContainerStyle={{justifyContent: 'space-between', width: width * 1.2}}>
					{authInfoArr.map((item, index) => (
						<TouchableOpacity style={_styles.authBox} key={index}>
							<Text style={_styles.authBoxTitle}>{item}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</SpaceView>

			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView contentContainerStyle={{height: height * 1.2}}>
					<View>
						<View style={_styles.authBoxStatus}><Text style={_styles.statusText}>승인</Text></View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>			
							<Text style={_styles.contentsSubtitle}>• 소득 금액 증명원, 근로 소득 원천 징수증, 부가 가치세 증명원, 기타소득 입증자료, 근로계약서</Text>
							<View style={_styles.uploadBoxContainer}>
								{[0, 1, 2].map(() => (
									<TouchableOpacity style={_styles.uploadBox}>
										<Image source={ICON.cloudUpload} style={styles.iconSize32} />
									</TouchableOpacity>
								))}
							</View>
						</View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>인증 소개글(선택)</Text>
							</View>
							<TextInput 
								placeholder='인증 소개글 입력(가입 후 변경 가능)'
								placeholderTextColor={'#FFFDEC'}
								style={_styles.inputContainer}
							/>
						</View>

						<View>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>
							<FlatList
								data={data}
								renderItem={renderItem}
							/>
						</View>
					</View>

					<SpaceView mt={50}>
						<CommonBtn
							value={'가입 신청하기'}
							type={'reNewId'}
							fontSize={16}
							fontFamily={'Pretendard-Bold'}
							borderRadius={5}
							onPress={() => {
							navigation.navigate({
								name : ROUTES.SIGNUP_AUTH
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

	function renderItem(item) {
		
		return (
			<>
				<View style={_styles.authInfoContainer}>
					<View style={[_styles.authInfoBox, {backgroundColor: '#3D4348'}]}>
						<Text style={_styles.authInfoTitle}>레벨</Text>
						<Text style={_styles.authInfoTitle}>연봉</Text>
						<Text style={_styles.authInfoTitle}>연소득</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>1</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>3,000</Text>
						<Text style={_styles.authInfoSubTitle}>4,000</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>2</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>5,000</Text>
						<Text style={_styles.authInfoSubTitle}>6,000</Text>
					</View>
					<View style={_styles.authInfoBox}>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 10}]}>3</Text>
						<Text style={[_styles.authInfoSubTitle, {marginLeft: 15}]}>6,000</Text>
						<Text style={_styles.authInfoSubTitle}>7,000</Text>
					</View>
				</View>
			</>
		)
	};
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
		fontFamily: 'Pretendard-Light',
		color: '#F3E270',
		marginTop: 5,
	},
	authBox: {
		marginTop: 20,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#D5CD9E',
	},
	authBoxTitle: {
		fontFamily: 'AppleSDGothicNeoB00',
		fontSize: 16,
		color: '#D5CD9E',
		textAlign: 'center',
		paddingHorizontal: 20,
		paddingVertical: 3,
	},
	authBoxStatus: {
		position: 'absolute',
		top: 0,
		right: 10,
		width: 40,
		height: 20,
		borderRadius: 5,
		backgroundColor: '#FFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusText: {
		fontFamily: 'AppleSDGothicNeoEB00',
		fontSize: 10,
		color: '#15F3DC',
	},
	contentsTitle: {
		fontFamily: 'Pretendard-Regular',
		fontSize: 15,
		color: '#FFDD00',
		marginLeft: 5,
	},
	contentsSubtitle: {
		fontFamily: 'Pretendard-Regular',
		color: '#D5CD9E',
		fontSize: 14,
		marginTop: 10,
	},
	uploadBoxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
	uploadBox: {
		width: 100,
		height: 100,
		borderWidth: 1,
		borderColor: '#E1DFD1',
		borderRadius: 10,
		borderStyle: 'dashed',
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		backgroundColor: '#445561',
		height: 80,
		borderRadius: 10,
		textAlign: 'center',
		marginTop: 10,
		color: '#FFFDEC',
	},
	authInfoContainer: {
		width: '100%',
		borderRadius: 15,
		overflow: 'hidden',
		marginTop: 20,
	},
	authInfoBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	authInfoTitle: {
		fontFamily: 'Pretendard-SemiBold',
		fontSize: 15,
		color: '#FFDD00',
	},
	authInfoSubTitle: {
		fontFamily: 'Pretendard-Regular',
		fontSize: 15,
		color: '#D5CD9E',
	},
});