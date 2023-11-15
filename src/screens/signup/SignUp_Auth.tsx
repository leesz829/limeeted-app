import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { ICON, PROFILE_IMAGE, findSourcePath, findSourcePathLocal } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { usePopup } from 'Context';
import { regist_second_auth, get_profile_secondary_authentication } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { isEmptyData, imagePickerOpen } from 'utils/functions';
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

	const memberSeq = props.route.params?.memberSeq; // 회원 번호
	const gender = props.route.params?.gender; // 성별
	const mstImgPath = props.route.params?.mstImgPath; // 대표 사진 경로

	const [currentAuthCode, setCurrentAuthCode] = React.useState('JOB'); // 현재 인증 코드
	//const [currentImgIdx, setCurrentImgIdx] = React.useState(0); // 현재 이미지 인덱스
	const [authImageList, setAuthImageList] = React.useState([]); // 인증 이미지 목록
	const [authComment, setAuthComment] = React.useState([]); // 인증 코멘트

	const authInfoArr = [
		{ name: '직업', code: 'JOB' },
		{ name: '학력', code: 'EDU' },
		{ name: '소득', code: 'INCOME' },
		{ name: '자산', code: 'ASSET' },
		{ name: 'SNS', code: 'SNS' },
		{ name: '차량', code: 'VEHICLE' },
	];

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
		member_auth_detail_seq: 0,
	  	img_file_path: '',
	  	order_seq: '',
	});
  
	// ############################################################################# 사진 관리 팝업 관련 함수
	const imgMng_modalizeRef = useRef<Modalize>(null);
	const imgMng_onOpen = (imgData: any, order_seq: any) => {
	  setImgMngData({
		member_auth_detail_seq: imgData.member_auth_detail_seq,
		img_file_path: imgData.img_file_path,
		order_seq: order_seq,
	  });
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
			member_auth_detail_seq: 0,
			img_file_path: path,
			order_seq: authImageList.length+1,
			org_order_seq: authImageList.length+1,
			del_yn: 'N',
			file_base64: data,
		  };
	
		  setAuthImageList((prev) => {
			return [...prev, _data];
		  });
  
		});
	  } else {

	  }
	}
  
	// ############################################################################# 사진 변경
	const imgModfyProc = () => {
	  imagePickerOpen(function(path:any, data:any) {
  
		// 삭제 데이터 저장
		if(isEmptyData(imgMngData.member_auth_detail_seq) && 0 != imgMngData.member_auth_detail_seq) {
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
				? { ...item, img_file_path: path, file_base64: data }
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
	  if(isEmptyData(imgMngData.member_auth_detail_seq) && 0 != imgMngData.member_auth_detail_seq) {
		let delArr = imgDelSeqStr;
		if (delArr == '') {
		  delArr = imgMngData.member_auth_detail_seq;
		} else {
		  delArr = delArr + ',' + imgMngData.member_auth_detail_seq;
		}
  
		setImgDelSeqStr(delArr);
	  }
  
	  // 모달 닫기
	  imgMng_onClose();
	};
  
	// ############################################################################# 인증 이미지 정보 조회
	const getAuthImage = async () => {
	  const body = {
		member_seq: memberSeq,
		second_auth_code: currentAuthCode,
	  };
	  try {
		const { success, data } = await get_profile_secondary_authentication(body);
		if (success) {
		  switch (data.result_code) {
			case SUCCESS:
			  if(isEmptyData(data.auth_detail_list)) {
				setAuthImageList(data?.auth_detail_list);

				/* let _authImgList:any = [];
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
  
				setAuthImageList(_authImgList); */
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
  
	  /* let tmpCnt = 0;
	  authImageList.map((item, index) => {
		if(item.status != 'REFUSE') {
		  tmpCnt++;
		}
	  }); */

	  //return;
  
	  // 중복 클릭 방지 설정
	  if(isClickable) {
		setIsClickable(false);
		setIsLoading(true);
  
		const body = {
			member_seq: memberSeq,
			file_list: authImageList,
			auth_code: currentAuthCode,
			auth_comment: authComment,
		};
		try {
		  const { success, data } = await regist_second_auth(body);
		  if (success) {
			switch (data.result_code) {
			  case SUCCESS:
				/* navigation.navigate(ROUTES.SIGNUP03, {
				  memberSeq: props.route.params.memberSeq,
				  gender: props.route.params.gender,
				  mstImgPath: data.mst_img_path,
				}); */
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
  
	/* ########################################################################################## 인증 사진 렌더링 */
	function AuthImageRender({ index, imgData, imgSelectedFn, mngModalFn }) {
		const imgUrl = findSourcePathLocal(imgData?.img_file_path); // 이미지 경로
	  	const imgDelYn = imgData?.del_yn; // 이미지 삭제 여부
	  	const imgStatus = imgData?.status; // 이미지 상태
	  
	  	//console.log('imgData111111 ::::: ' , imgData);
	
	  	return (
			<>
				{isEmptyData(imgUrl) ? (
					<>
						<TouchableOpacity 
							style={_styles.uploadBox}
							onPress={() => { mngModalFn(imgData, index+1, imgUrl); }}
							activeOpacity={0.9}
						>
							<Image
								resizeMode="cover"
								resizeMethod="scale"
								style={_styles.authImgStyle}
								key={imgUrl}
								source={imgUrl}
							/>
						
						</TouchableOpacity>
					</>
				) : (
					<>
						<TouchableOpacity 
							style={_styles.uploadBox}
							onPress={() => { imgSelectedFn(index, !isEmptyData(imgData)); }}
							activeOpacity={0.9}
						>
							<Image source={ICON.cloudUpload} style={styles.iconSquareSize(32)} />
						</TouchableOpacity>
					</>
				)}
			</>
		);
	};

	/* ########################################################################################## 인증 사진 렌더링 */
	function MaterialRender({ authCode }) {
		
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

	// ############################################################ 최초 실행
	React.useEffect(() => {
		getAuthImage();
	}, [isFocus]);

	return (
		<>
			{/* #############################################################################################################
			######### 상단 영역
			############################################################################################################# */}
			<SpaceView mt={20} viewStyle={{backgroundColor: '#445561', padding: 30}}>
				<Text style={_styles.title}>멤버쉽 인증하고{'\n'}내 강점을 드러내기(선택)</Text>
				<Text style={_styles.subTitle}>
					아래 가이드를 참고하시고 멤버쉽 인증 자료를 올려 주세요.{'\n'}
					심사 기준에 따라 프로필에 인증 뱃지가 부여되며{'\n'}
					이성과의 매칭에 유리할 수 있습니다.
				</Text>
				<ScrollView horizontal={true} contentContainerStyle={{justifyContent: 'space-between', width: width * 1.2}} showsHorizontalScrollIndicator={false}>
					{authInfoArr.map((item, index) => (
						<TouchableOpacity style={_styles.authBox} key={index}>
							<Text style={_styles.authBoxTitle(item?.code == currentAuthCode)}>{item.name}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</SpaceView>

			{/* #############################################################################################################
			######### 컨텐츠 영역
			############################################################################################################# */}
			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView contentContainerStyle={{height: height * 1.2}} showsVerticalScrollIndicator={false}>
					<View>
						<View style={_styles.authBoxStatus}><Text style={_styles.statusText}>승인</Text></View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Image source={ICON.commentYellow} style={styles.iconSize16} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>			
							<Text style={_styles.contentsSubtitle}>• 소득 금액 증명원, 근로 소득 원천 징수증, 부가 가치세 증명원, 기타소득 입증자료, 근로계약서</Text>
							<View style={_styles.uploadBoxContainer}>
								<AuthImageRender index={0} imgData={authImageList.length > 0 ? authImageList[0] : null} imgSelectedFn={imgSelected} mngModalFn={imgMng_onOpen} />
								<AuthImageRender index={1} imgData={authImageList.length > 1 ? authImageList[1] : null} imgSelectedFn={imgSelected} mngModalFn={imgMng_onOpen} />
								<AuthImageRender index={2} imgData={authImageList.length > 2 ? authImageList[2] : null} imgSelectedFn={imgSelected} mngModalFn={imgMng_onOpen} />
							</View>
						</View>
						<View>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
								<Image source={ICON.commentYellow} style={styles.iconSquareSize(16)} />
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
								<Image source={ICON.commentYellow} style={styles.iconSquareSize(16)} />
								<Text style={_styles.contentsTitle}>심사에 요구되는 증명자료를 올려주세요.</Text>
							</View>
							{/* <FlatList
								data={data}
								renderItem={renderItem}
							/> */}

							<MaterialRender authCode={currentAuthCode} />
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
								navigation.goBack();
							}}
						/>
					</SpaceView>
				</ScrollView>
			</LinearGradient>

			{/* ###############################################
			##### 사진 관리 팝업
			############################################### */}
			<Modalize
				ref={imgMng_modalizeRef}
				adjustToContentHeight={true}
				handleStyle={modalStyle.modalHandleStyle}
				modalStyle={[modalStyle.modalContainer, {backgroundColor: '#333B41'}]}
			>
				<SpaceView pl={30} pr={30} mb={30} viewStyle={_styles.imgMngModalWrap}>
					<SpaceView mb={15} viewStyle={{flexDirection: 'row'}}>
						{isEmptyData(imgMngData.img_file_path) && (
						<SpaceView mr={10}>
							<Image source={findSourcePathLocal(imgMngData.img_file_path)} style={[styles.iconSquareSize(64), {borderRadius:5}]} />
						</SpaceView>
						)}
						<SpaceView>
							<Text style={_styles.imgMngModalTit}>인증 자료 수정</Text>
							<Text style={_styles.imgMngModalDesc}>인증 자료를 변경하거나 삭제할 수 있어요.</Text>
						</SpaceView>
					</SpaceView>

					<SpaceView>
						<TouchableOpacity onPress={() => { imgModfyProc(); }} style={{marginBottom: 8}}>
							<Text style={_styles.imgMngModalBtn('#FFDD00', 16, '#3D4348')}>변경</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => { imgDelProc(); }} style={{marginBottom: 8}}>
							<Text style={_styles.imgMngModalBtn('#FFFFFF', 16, '#FF4D29')}>삭제</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => { imgMng_onClose(); }}>
							<Text style={_styles.imgMngModalBtn('transparent', 16, '#D5CD9E', '#BBB18B')}>취소</Text>
						</TouchableOpacity>
					</SpaceView>
				</SpaceView>
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
		fontFamily: 'Pretendard-Light',
		color: '#F3E270',
		marginTop: 5,
	},
	authBox: {
		marginTop: 20,
	},
	authBoxTitle: (isOn: boolean) => {
		return {
			fontFamily: 'AppleSDGothicNeoB00',
			fontSize: 16,
			color: '#D5CD9E',
			textAlign: 'center',
			paddingHorizontal: 20,
			paddingVertical: 3,
			borderRadius: 50,
			borderWidth: 1,
			borderColor: isOn ? '#FFFFFF' : '#D5CD9E',
			backgroundColor: isOn ? '#FFFFFF' : 'transparent',
		};
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
	authImgStyle: {
		width: 100,
		height: 100,
		borderRadius: 5,
	},
	imgMngModalWrap: {
		backgroundColor: '#333B41',
	  },
	imgMngModalTit: {
		fontFamily: 'Pretendard-SemiBold',
		fontSize: 20,
		color: '#F3E270',
	},
	imgMngModalDesc: {
		fontFamily: 'Pretendard-Light',
		fontSize: 12,
		color: '#D5CD9E',
	},
	imgMngModalBtn: (_bg:string, _fs:number, _cr:string, _bdcr) => {
		return {
			backgroundColor: _bg,
			fontFamily: 'Pretendard-Bold',
			fontSize: _fs,
			color: _cr,
			textAlign: 'center',
			paddingVertical: 10,
			borderRadius: 5,
			borderWidth: isEmptyData(_bdcr) ? 1 : 0,
			borderColor: isEmptyData(_bdcr) ? _bdcr : _bg,
		};
	},
	imageDisabled: (isMaster: boolean) => {
		return {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: -1,
			borderBottomLeftRadius: 5,
			borderBottomRightRadius: 5,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'flex-end',
			overflow: 'hidden',
			backgroundColor: !isMaster ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
		};
	},
});