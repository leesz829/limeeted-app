import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { get_member_introduce_guide, get_member_profile_info, insert_member_image, update_member_image, delete_member_image, update_additional, save_profile_auth_comment, update_member_master_image } from 'api/models';
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
import IntroduceRender from 'component/match/IntroduceRender';


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
    member_add: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
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
            member_add: data?.mbr_add,
            profile_img_list: data?.mbr_img_list,
            second_auth_list: auth_list,
            interview_list: data?.mbr_interview_list,
            interest_list: data?.mbr_interest_list,
        });

      } else {
        show({ content: '오류입니다. 관리자에게 문의해주세요.' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ############################################################################# 사진 선택
  const imgSelected = (idx:number, isNew:boolean) => {
    if(isNew) {
      imagePickerOpen(function(path:any, data:any) {
        insertMemberImage(data, idx);
      });
    }

    setCurrentImgIdx(idx);
  };

  // ############################################################################# 사진 변경
  const imgModfyProc = () => {
    imagePickerOpen(function(path:any, data:any) {
      updateMemberImage(data);

      // 모달 닫기
      imgMng_onClose();
    });
  };

  // ################################################################################## 회원 이미지 추가
  const insertMemberImage = async (fileBase64:string, orderSeq:number) => {
    const body = {
      file_base64 : fileBase64,
      order_seq: orderSeq+1,
    };

    //return;

    imgMng_onClose();
    setIsLoading(true);
    
    try {
      const { success, data } = await insert_member_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            getMemberProfileData();
            show({ type: 'RESPONSIVE', content: '프로필 사진이 추가되었습니다.' });

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
      setIsLoading(false);
    }
  };

  // ################################################################################## 회원 이미지 변경
  const updateMemberImage = async (fileBase64:string) => {

    const body = {
      member_img_seq: imgMngData.member_img_seq,
      file_base64 : fileBase64,
      order_seq: imgMngData.order_seq,
    };

    //return;

    imgMng_onClose();
    setIsLoading(true);
    
    try {
      const { success, data } = await update_member_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            /* dispatch(setPartialPrincipal({
              mbr_base : data.mbr_base
              , mbr_img_list : data.mbr_img_list
              , mbr_interview_list : data.mbr_interview_list
            }));

            profileDataSet(data.mbr_img_list); */

            getMemberProfileData();

            show({ type: 'RESPONSIVE', content: '프로필 사진이 삭제되었습니다.' });

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
      setIsLoading(false);
    }
  };

  // ################################################################################## 회원 이미지 삭제
  const deleteMemberImage = async () => {

    const body = {
      member_img_seq: imgMngData.member_img_seq,
    };

    imgMng_onClose();
    setIsLoading(true);
    
    try {
      const { success, data } = await delete_member_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            /* dispatch(setPartialPrincipal({
              mbr_base : data.mbr_base
              , mbr_img_list : data.mbr_img_list
              , mbr_interview_list : data.mbr_interview_list
            }));

            profileDataSet(data.mbr_img_list); */

            getMemberProfileData();

            show({ type: 'RESPONSIVE', content: '프로필 사진이 삭제되었습니다.' });

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
      setIsLoading(false);
    }
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

              {/* 이미지 */}
              <Image source={imgUrl} style={_styles.mstImgStyle} resizeMode="cover" />

              {/* 대표사진 표시 */}
              {index == 0 && (
                <SpaceView viewStyle={_styles.mstMarkWrap}>
                  <Text style={_styles.mstMarkText}>대표사진</Text>
                </SpaceView>
              )}

              {/* 상태 표시 */}
              {imgStatus != 'ACCEPT' && (
                <SpaceView viewStyle={_styles.imgStatusArea}>
                  <Text style={_styles.imgStatusText(imgStatus)}>{imgStatus == 'PROGRESS' ? '심사중' : imgStatus == 'ACCEPT' ? '승인' : '반려'}</Text>
                </SpaceView>
              )}

              {/* 수정 버튼 */}
              <TouchableOpacity onPress={() => { mngModalFn(imgData, index+1, imgUrl);}} style={_styles.modBtn}>
                <Image source={ICON.userPen} style={styles.iconSquareSize(17)} />
                <Text style={_styles.modBtnText}>수정</Text>
              </TouchableOpacity>

              {/* 딤 처리 */}
              <LinearGradient
                colors={['#ffffff', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={_styles.imgDimArea} />
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
  function ProfileImageItem({ index, imgData, imgSelectedFn }) {
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
              {/* <View style={_styles.imageDisabled(false)}>
                <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : imgStatus == 'ACCEPT' ? '승인' : '반려'}</Text>
              </View> */}
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
      //getMemberInterestData();
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
          <SpaceView mb={40} ml={20} mr={15} viewStyle={_styles.contentWrap}>
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
                <SpaceView><ProfileImageItem index={0} imgData={profileData.profile_img_list.length > 0 ? profileData.profile_img_list[0] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItem index={1} imgData={profileData.profile_img_list.length > 1 ? profileData.profile_img_list[1] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItem index={2} imgData={profileData.profile_img_list.length > 2 ? profileData.profile_img_list[2] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
              <SpaceView>
                <SpaceView ml={3}><Text style={_styles.subImgTitle}>선택</Text></SpaceView>
                <SpaceView><ProfileImageItem index={3} imgData={profileData.profile_img_list.length > 3 ? profileData.profile_img_list[3] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItem index={4} imgData={profileData.profile_img_list.length > 4 ? profileData.profile_img_list[4] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItem index={5} imgData={profileData.profile_img_list.length > 5 ? profileData.profile_img_list[5] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
            </SpaceView>
          </SpaceView>

          {/* ############################################################################################################# 간단 소개 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            <MemberIntro 
              memberData={profileData?.member_info} 
              isEditBtn={true}
              faceList={memberBase?.best_face} />
          </SpaceView>

          {/* ############################################################################################################# 자기 소개 영역 */}
          <SpaceView pl={15} pr={15} mb={45} viewStyle={_styles.commentWrap}>
            <IntroduceRender 
              memberData={profileData?.member_info} 
              isEditBtn={true}
              comment={profileData?.member_add.introduce_comment} />
          </SpaceView>

          {/* ############################################################################################################# 프로필 인증 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            {profileData.second_auth_list.length > 0 ? (
              <ProfileAuth 
                data={profileData.second_auth_list} 
                isEditBtn={true} 
                memberData={profileData?.member_info} />
            ) : (
              <SpaceView mt={10} viewStyle={_styles.authNoDataArea}>
                <SpaceView mb={8}><Text style={_styles.authNoDataTit}>프로필 인증없이 가입한 회원입니다.</Text></SpaceView>
                <SpaceView><Text style={_styles.authNoDataSubTit}>프로필 인증은 직업, 학업, 소득, 자산, SNS, 차량 등의 인증 항목을 의미합니다.</Text></SpaceView>
              </SpaceView>
            )}
          </SpaceView>

          {/* ############################################################################################################# 인터뷰 영역 */}
          <SpaceView pl={15} pr={15} mb={35}>
            <InterviewRender 
              title={memberBase?.nickname + '에 대한 필독서'} 
              isEditBtn={false}
              dataList={profileData.interview_list} />
          </SpaceView>

          {/* ############################################################################################################# 관심사 영역 */}
          <SpaceView pl={15} pr={15} mb={40}>
            <InterestRender 
              memberData={profileData?.member_info} 
              isEditBtn={true}
              interestList={profileData.interest_list} />
          </SpaceView>
        </LinearGradient>
      </ScrollView>

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
              <Text style={_styles.imgMngModalTit}>사진 수정</Text>
              <Text style={_styles.imgMngModalDesc}>사진을 변경 또는 삭제할 수 있어요.</Text>
            </SpaceView>
          </SpaceView>

          <SpaceView>
            <TouchableOpacity onPress={() => { imgModfyProc(); }} style={{marginBottom: 8}}>
              <Text style={_styles.imgMngModalBtn('#FFDD00', 16, '#3D4348')}>변경</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { deleteMemberImage(); }} style={{marginBottom: 8}}>
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
  imgDimArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.9,
    borderRadius: 20,
  },
  imgStatusArea: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  imgStatusText: (status: string) => {
    return {
      fontFamily: 'Pretendard-Regular',
      fontSize: 14,
      color: '#D5CD9E',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      paddingVertical: 2,
      paddingHorizontal: 10,
    };
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



});