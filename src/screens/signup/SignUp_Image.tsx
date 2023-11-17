import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON, PROFILE_IMAGE, findSourcePath, findSourcePathLocal } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { usePopup } from 'Context';
import { get_profile_imgage_guide, join_save_profile_image, update_join_master_image } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonImagePicker } from 'component/CommonImagePicker';
import { isEmptyData, imagePickerOpen } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';


/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 프로필 사진
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'SignUp_Image'>;
  route: RouteProp<StackParamList, 'SignUp_Image'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Image = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const isFocus = useIsFocused();
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = React.useState(false); // 로딩 여부
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  const memberSeq = props.route.params?.memberSeq; // 회원 번호
  const gender = props.route.params?.gender; // 성별

  const [currentImgIdx, setCurrentImgIdx] = React.useState(0); // 현재 이미지 인덱스
  const [profileImageList, setProfileImageList] = React.useState([]); // 프로필 이미지 목록

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

  // ################################################################ 프로필 이미지 데이터 적용
  const imageDataApply = async (data:any) => {
    setProfileImageList((prev) => {
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
    /* let tmpCnt = 0;
    for (var key in imgData) {
      if (imgData[key].delYn == 'N' && imgData[key].status == 'ACCEPT' && (imgData[key].url || imgData[key].uri)) {
        tmpCnt++;
      }
    }

    if(imgMngData.status == 'ACCEPT') {
      if (tmpCnt <= 3) {
        show({ content: '프로필 승인된 사진은 최소3장이 등록되어야 합니다.' });
        return;
      }
    } */

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

  // ############################################################################# 프로필 이미지 정보 조회
  const getProfileImage = async () => {
    const body = {
      member_seq: props.route.params.memberSeq,
    };
    try {
      const { success, data } = await get_profile_imgage_guide(body);
      if (success) {
        switch (data.result_code) {
          case SUCCESS:
            if(isEmptyData(data.imgList)) {
              let _profileImgList:any = [];
              data?.imgList?.map((item, index) => {
                let data = {
                  member_img_seq: item.member_img_seq,
                  img_file_path: item.img_file_path,
                  order_seq: index+1,
                  org_order_seq: item.org_order_seq,
                  del_yn: 'N',
                  status: item.status,
                  return_reason: item.return_reason,
                  file_base64: null,
                };                
                _profileImgList.push(data);
              });

              setProfileImageList(_profileImgList);
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

  // ############################################################################# 프로필 이미지 저장
  const saveProfileImage = async () => {

    let tmpCnt = 0;
    profileImageList.map((item, index) => {
      if(item.status != 'REFUSE') {
        tmpCnt++;
      }
    });

    if (tmpCnt < 3) {
      show({ content: '프로필 사진은 얼굴이 선명하게 나온 사진을\n포함하여 최소3장이 등록 되어야 합니다.' });
      return;
    };

    //return;

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      const body = {
        member_seq: memberSeq,
        file_list: profileImageList,
        img_del_seq_str: imgDelSeqStr,
      };
      try {
        const { success, data } = await join_save_profile_image(body);
        if (success) {
          switch (data.result_code) {
            case SUCCESS:
              navigation.navigate(ROUTES.SIGNUP_NICKNAME, {
                memberSeq: memberSeq,
                gender: gender,
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

  // ############################################################  대표 사진 설정
  const updateMasterImage = async () => {
    const body = {
      member_seq: props.route.params.memberSeq,
      member_img_seq: imgMngData.member_img_seq
    };

    setIsLoading(true);

    try {
      const { success, data } = await update_join_master_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            imgDel_onClose();
            getProfileImage();

            show({
              type: 'RESPONSIVE',
              content: '대표사진이 변경되었어요.',
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
      setIsLoading(false);
    }
  };

  /* ########################################################################################## 프로필 사진 아이템 렌더링 */
  function ProfileImageItemNew({ index, imgData, imgSelectedFn }) {
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
                <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : '반려'}</Text>
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
            {/* {(imgStatus == 'PROGRESS' || imgStatus == 'REFUSE') ? (
              <View style={_styles.imageDisabled(false)}>
                <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : '반려'}</Text>
              </View>
            ) : (imgStatus == 'ACCEPT' && index == 0) && (
              <View style={_styles.imageDisabled(true)}>
                <Text style={[_styles.masterImageDimText]}>대표 사진</Text>
              </View>
            )} */}

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

  // ############################################################################# 최초 실행
  React.useEffect(() => {
    setProfileImageList([]);
    setCurrentImgIdx(0);
    setImgDelSeqStr('');
    getProfileImage();
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
        <ScrollView>

          <SpaceView mt={40} mb={20} ml={20}>
            <Text style={_styles.titleText}>프로필 사진을{'\n'}올려주세요.</Text>
          </SpaceView>

          <SpaceView mb={30} ml={20} mr={15} viewStyle={_styles.contentWrap}>
            <SpaceView>
              {[0,1,2,3,4,5].map((i, index) => {
                return index == currentImgIdx && (
                  <>
                    {/* {index == 0 && <MasterImageArea index={0} imgData={imgData.orgImgUrl01} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack1} /> }
                    {index == 1 && <MasterImageArea index={1} imgData={imgData.orgImgUrl02} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack2} /> }
                    {index == 2 && <MasterImageArea index={2} imgData={imgData.orgImgUrl03} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack3} /> }
                    {index == 3 && <MasterImageArea index={3} imgData={imgData.orgImgUrl04} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack4} /> }
                    {index == 4 && <MasterImageArea index={4} imgData={imgData.orgImgUrl05} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack5} /> }
                    {index == 5 && <MasterImageArea index={5} imgData={imgData.orgImgUrl06} mngModalFn={imgMng_onOpen} fileCallBackFn={fileCallBack6} /> } */}

                    <MasterImageArea index={currentImgIdx} imgData={profileImageList[currentImgIdx]} mngModalFn={imgMng_onOpen} />
                  </>
                )
              })}
            </SpaceView>

            <SpaceView viewStyle={{flexDirection: 'column', justifyContent: 'space-between'}}>
              <SpaceView>
                <SpaceView ml={3}><Text style={_styles.subImgTitle}>필수</Text></SpaceView>
                <SpaceView><ProfileImageItemNew index={0} imgData={profileImageList.length > 0 ? profileImageList[0] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={1} imgData={profileImageList.length > 1 ? profileImageList[1] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={2} imgData={profileImageList.length > 2 ? profileImageList[2] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
              <SpaceView>
                <SpaceView ml={3}><Text style={_styles.subImgTitle}>선택</Text></SpaceView>
                <SpaceView><ProfileImageItemNew index={3} imgData={profileImageList.length > 3 ? profileImageList[3] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={4} imgData={profileImageList.length > 4 ? profileImageList[4] : null} imgSelectedFn={imgSelected} /></SpaceView>
                <SpaceView><ProfileImageItemNew index={5} imgData={profileImageList.length > 5 ? profileImageList[5] : null} imgSelectedFn={imgSelected} /></SpaceView>
              </SpaceView>
            </SpaceView>
          </SpaceView>

          <SpaceView ml={20} mr={20} mb={70}>
            <TouchableOpacity onPress={() => { saveProfileImage(); }}>
              <Text style={_styles.regiBtn}>닉네임과 한줄소개 작성하기</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.goBack(); }}>
              <Text style={_styles.initBtn}>이전으로</Text>
            </TouchableOpacity>
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
              <Text style={_styles.imgMngModalTit}>사진 수정</Text>
              <Text style={_styles.imgMngModalDesc}>사진을 변경 또는 삭제할 수 있어요.</Text>
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
  },
  titleText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 30,
    color: '#D5CD9E',
  },
  mstImgStyle: {
    width: width - 120,
    height: 500,
    borderRadius: 20,
  },
  contentWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  modBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
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

});