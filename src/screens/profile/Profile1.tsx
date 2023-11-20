import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { get_member_introduce_guide, get_member_profile_info, update_profile, update_additional, save_profile_auth_comment, update_member_master_image } from 'api/models';
import { Color } from 'assets/styles/Color';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import Interview from 'component/Interview';
import ProfileAuth from 'component/match/ProfileAuth';
import { usePopup } from 'Context';
import { commonStyle, layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import React, { useEffect, useMemo, useState, useRef  } from 'react';
import { Modalize } from 'react-native-modalize';
import { ImagePicker } from 'component/ImagePicker';
import { CommonImagePicker } from 'component/CommonImagePicker';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  //Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ReactNativeModal from 'react-native-modal';
import { findSourcePath, findSourcePathLocal, ICON } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import { useDispatch } from 'react-redux';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { STACK } from 'constants/routes';
import { SUCCESS } from 'constants/reusltcode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonLoading } from 'component/CommonLoading';
import SpaceView from 'component/SpaceView';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { isEmptyData, imagePickerOpen } from 'utils/functions';
import MemberIntro from 'component/match/MemberIntro';
import InterviewRender from 'component/match/InterviewRender';
import InterestRender from 'component/match/InterestRender';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile1'>;
  route: RouteProp<StackParamList, 'Profile1'>;
}

export const Profile1 = (props: Props) => {
  const { show } = usePopup(); // 공통 팝업
  const isFocus = useIsFocused();
  const secondAuth = useSecondAth();
  const myImages = useProfileImg();
  const dispatch = useDispatch();
  const navigation = useNavigation<ScreenNavigationProp>();
  const scrollViewRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const memberBase = useUserInfo();

  const [currentImgIdx, setCurrentImgIdx] = React.useState(0); // 현재 이미지 인덱스
  const [profileImageList, setProfileImageList] = React.useState([]); // 프로필 이미지 목록

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

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

    imgMng_modalizeRef.current?.open();
  };
  const imgMng_onClose = () => {
    imgMng_modalizeRef.current?.close();
  };

  // 회원 관련 데이터
  const [profileData, setProfileData] = useState<any>({
    member_info: {},
    profile_img_list: [],
    second_auth_list: [],
  });

  // 인터뷰 데이터
  const [interviewData, setInterviewData] = useState([]);

  // 관심사 목록
	const [intList, setIntList] = React.useState([]);
  // 관심사 체크 목록
	const [checkIntList, setCheckIntList] = React.useState([{code_name: "", common_code: "", interest_seq: ""}]);

  // ############################################################  프로필 데이터 조회
  const getMemberProfileData = async () => {
    setIsLoading(true);

    try {
      const { success, data } = await get_member_profile_info();
      if (success) {
        const auth_list = data?.mbr_second_auth_list.filter(item => item.auth_status == 'ACCEPT');
        setProfileData({
            member_info: data?.mbr_base,
            profile_img_list: data?.mbr_img_list,
            second_auth_list: auth_list,
        });

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
  }

  // ############################################################ 관심사, 인터뷰 정보 조회
	const getMemberInterestData = async() => {
		const body = {
			member_seq : memberBase?.member_seq
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

          setInterviewData(_interviewList,);

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

  // ############################################################################# 사진 선택
  const imgSelected = (idx:number, isNew:boolean) => {
    if(isNew) {
      imagePickerOpen(function(path:any, data:any) {
        let _data = {
          member_img_seq: 0,
          img_file_path: path,
          order_seq: profileImageList.length+1,
          org_order_seq: profileImageList.length+1,
          del_yn: 'N',
          status: 'PROGRESS',
          return_reason: '',
          file_base64: data,
        };
  
        setProfileImageList((prev) => {
          return [...prev, _data];
        });

        setCurrentImgIdx(profileImageList.length);
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
        setProfileImageList((prev) => {
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
      // 프로필 이미지 목록 재구성
      let _profileImgList:any = [];
      profileImageList.map((item, index) => {
        if(index+1 != imgMngData.order_seq) {
          _profileImgList.push(item);
        }
      });
      _profileImgList.map((item, index) => {
        item.order_seq = index+1;
      });
      setProfileImageList(_profileImgList);
  
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

  /* ########################################################################################## 대표사진 영역 렌더링 */
  function MasterImageArea({ index, imgData, mngModalFn }) {
    const imgUrl = findSourcePathLocal(imgData?.img_file_path); // 이미지 경로
    const imgDelYn = imgData?.del_yn; // 이미지 삭제 여부
    const imgStatus = imgData?.status; // 이미지 상태

    return (
      <>
        {isEmptyData(imgUrl) && imgDelYn == 'N' ? (
          <>
            <SpaceView>
              <Image 
                source={imgUrl} 
                style={_styles.mstImgStyle} 
                resizeMode="cover" />

              {index == 0 && (
                <SpaceView viewStyle={_styles.mstMarkWrap}>
                  <Text style={_styles.mstMarkText}>대표사진</Text>
                </SpaceView>
              )}

              <TouchableOpacity 
                onPress={() => { mngModalFn(imgData, index+1, imgUrl);}} 
                style={_styles.modBtn}
              >
                <Image source={ICON.userPen} style={styles.iconSquareSize(17)} />
                <Text style={_styles.modBtnText}>수정</Text>
              </TouchableOpacity>
            </SpaceView>
          </>
        ) : (
          <SpaceView viewStyle={_styles.imgEmptyArea}>
            <TouchableOpacity
              onPress={() => {
                imagePickerOpen(function(path:any, data:any) {
                  let _data = {
                    member_img_seq: 0,
                    img_file_path: path,
                    order_seq: profileImageList.length+1,
                    org_order_seq: profileImageList.length+1,
                    del_yn: 'N',
                    status: 'PROGRESS',
                    return_reason: '',
                    file_base64: data,
                  };
            
                  setProfileImageList((prev) => {
                    return [...prev, _data];
                  });
          
                  setCurrentImgIdx(0);
                });
              }}
            >
              <SpaceView mb={10} viewStyle={{alignItems: 'center'}}><Image source={ICON.userAdd} style={styles.iconSquareSize(64)} /></SpaceView>
              <SpaceView mb={60}><Text style={_styles.imgEmptyText}>대표사진은 얼굴이 뚜렷하게{'\n'}나온 셀카를 권장드려요.</Text></SpaceView>
              <SpaceView mb={20}><Text style={_styles.imgEmptyText}>다양한 분위기의 내 모습이 담긴{'\n'}사진을 추천드려요.</Text></SpaceView>
              <SpaceView mb={50}><Text style={_styles.imgEmptyText}>선택 사진을 올리고 더 근사한{'\n'}프로필을 꾸며 보세요.</Text></SpaceView>
            </TouchableOpacity>
          </SpaceView>
        )}
      </>
    );
  };

  /* ########################################################################################## 프로필 사진 아이템 렌더링 */
  function ProfileImageItemNew({ index, imgData, imgSelectedFn }) {
    const imgUrl = findSourcePathLocal(imgData?.img_file_path); // 이미지 경로
    const imgDelYn = imgData?.del_yn; // 이미지 삭제 여부
    const imgStatus = imgData?.status; // 이미지 상태

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
                <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : imgStatus == 'ACCEPT' ? '승인' : '반려'}</Text>
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

  useEffect(() => {
    if(isFocus) {
      getMemberProfileData();
      getMemberInterestData();
    };
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title="프로필 관리" />
  
      <ScrollView 
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{flexGrow: 1}}>
        <LinearGradient
          colors={['#3D4348', '#1A1E1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >

          {/* ############################################################################################################# 프로필 이미지 영역 */}
          <SpaceView mb={30} ml={20} mr={15} viewStyle={_styles.contentWrap}>
            <SpaceView>
              {[0,1,2,3,4,5].map((i, index) => {
                return index == currentImgIdx && (
                  <>
                    <MasterImageArea index={currentImgIdx} imgData={profileData.profile_img_list[currentImgIdx]} mngModalFn={imgMng_onOpen} />
                  </>
                )
              })}
            </SpaceView>

            <SpaceView viewStyle={{flexDirection: 'column', justifyContent: 'space-between'}}>
              <SpaceView>
                <SpaceView ml={3}><Text style={_styles.subImgTitle}>필수</Text></SpaceView>
                <SpaceView><ProfileImageItemNew index={0} imgData={profileData.profile_img_list.length > 0 ? profileData.profile_img_list[0] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={1} imgData={profileData.profile_img_list.length > 1 ? profileData.profile_img_list[1] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={2} imgData={profileData.profile_img_list.length > 2 ? profileData.profile_img_list[2] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
              <SpaceView>
                <SpaceView ml={3}><Text style={_styles.subImgTitle}>선택</Text></SpaceView>
                <SpaceView><ProfileImageItemNew index={3} imgData={profileData.profile_img_list.length > 3 ? profileData.profile_img_list[3] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={4} imgData={profileData.profile_img_list.length > 4 ? profileData.profile_img_list[4] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={5} imgData={profileData.profile_img_list.length > 5 ? profileData.profile_img_list[5] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
            </SpaceView>
          </SpaceView>

          {/* ############################################################################################################# 간단 소개 및 관심사 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            <MemberIntro memberData={profileData?.member_info} imgList={profileData?.profile_img_list} interestList={checkIntList} faceList={memberBase?.best_face} type={'profile'} />
          </SpaceView>

          {/* ############################################################################################################# 자기 소개 영역 */}
          <SpaceView pl={15} pr={15} mb={40} viewStyle={_styles.commentWrap}>
            <SpaceView mb={15} viewStyle={{flexDirection: 'row'}}>
              <View style={{zIndex:1}}>
                <Text style={_styles.commentTitText}>{memberBase?.nickname}님 소개</Text>
              </View>
              <View style={_styles.commentUnderline} />
            </SpaceView>
            <SpaceView>
              {/* <Text style={_styles.commentText}>{data?.match_member_info.introduce_comment}</Text> */}
              <Text style={_styles.commentText}>{profileData?.member_info.comment}</Text>
            </SpaceView>
          </SpaceView>

          {/* ############################################################################################################# 프로필 인증 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            {profileData.second_auth_list.length > 0 ? (
              <ProfileAuth data={profileData.second_auth_list} isButton={false} memberData={profileData?.member_info} type={'profile'} />
            ) : (
              <SpaceView mt={10} viewStyle={_styles.authNoDataArea}>
                <SpaceView mb={8}><Text style={_styles.authNoDataTit}>프로필 인증없이 가입한 회원입니다.</Text></SpaceView>
                <SpaceView><Text style={_styles.authNoDataSubTit}>프로필 인증은 직업, 학업, 소득, 자산, SNS, 차량 등의 인증 항목을 의미합니다.</Text></SpaceView>
              </SpaceView>
            )}
          </SpaceView>

          {/* ############################################################################################################# 인터뷰 영역 */}
          <SpaceView pl={15} pr={15} mb={35}>
            <InterviewRender title={memberBase?.nickname + '에 대한 필독서'} dataList={interviewData} type={'profile'} />
          </SpaceView>

          {/* ############################################################################################################# 간단 소개 및 관심사 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            <InterestRender memberData={profileData?.member_info} interestList={checkIntList} type={'profile'} />
          </SpaceView>
        </LinearGradient>
      </ScrollView>
    </>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  mstImgStyle: {
    width: width - 120,
    height: 500,
    borderRadius: 20,
  },
  contentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mstMarkWrap: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  mstMarkText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D5CD9E',
  },
  modBtn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  modBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D5CD9E',
    marginLeft: 3,
  },
  subImgTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#F3E270',
  },
  subImgWrap: (isOn: boolean) => {
    return {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(155, 165, 242, 0.12)',
      margin: 5,
      borderRadius: 5,
      borderWidth: isOn ? 2 : 0,
      borderColor: '#FFDD00',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  subImgNoData: {
    width: 64,
    height: 64,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#E1DFD1',
    borderRadius: 5,
  },
  subImgStyle: {
    width: 62,
    height: 62,
    borderRadius: 5,
  },
  regiBtn: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#3D4348',
    textAlign: 'center',
    backgroundColor: '#FFDD00',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15
  },
  initBtn: {
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: '#D5CD9E',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BBB18B',
    borderRadius: 5,
    paddingVertical: 12,
  },
  imgEmptyArea: {
    width: width - 120,
    height: 500,
    borderWidth: 1,
    borderColor: '#E1DFD1',
    borderStyle: 'dotted',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imgEmptyText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#D5CD9E',
    textAlign: 'center',
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
  profileImageDimText: (status: string) => {
    return {
      width: '100%',
      backgroundColor: '#000',
      textAlign: 'center',
      paddingVertical: 3,
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 12,
      color: status == 'REFUSE' ? ColorType.redF20456 : '#fff',
    };
  },
  commentWrap: {
    alignItems: 'center',
  },
  commentTitText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  commentText: {
    fontFamily: 'Pretendard-Light',
    fontSize: 14,
    color: '#F3DEA6',
    textAlign: 'center',
  },
  commentUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: '#FE8C12',
  },
  authNoDataArea: {
    width: '100%',
    backgroundColor: '#ffffff', 
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#8E9AEB', 
    borderStyle: 'dotted',
  },
  authNoDataTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#7986EE',
    textAlign: 'center',
  },
  authNoDataSubTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    color: '#C3C3C8',
    textAlign: 'center',
  },
});