import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { usePopup } from 'Context';
import { get_profile_imgage_guide, regist_profile_image, delete_profile_image, update_join_master_image } from 'api/models';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonImagePicker } from 'component/CommonImagePicker';
import { isEmptyData } from 'utils/functions';



/* ################################################################################################################
###################################################################################################################
###### 근사한 프로필 만들기
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Signup02'>;
  route: RouteProp<StackParamList, 'Signup02'>;
}

const { width } = Dimensions.get('window');

export const Signup02 = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const isFocus = useIsFocused();
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = React.useState(false);

  const [profileImageList, setProfileImageList] = React.useState([]); // 프로필 이미지 목록

  // 프로필 사진
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { memer_img_seq: '', url: '', delYn: '', status: '', },
    orgImgUrl02: { memer_img_seq: '', url: '', delYn: '', status: '', },
    orgImgUrl03: { memer_img_seq: '', url: '', delYn: '', status: '', },
    orgImgUrl04: { memer_img_seq: '', url: '', delYn: '', status: '', },
    orgImgUrl05: { memer_img_seq: '', url: '', delYn: '', status: '', },
    orgImgUrl06: { memer_img_seq: '', url: '', delYn: '', status: '', },
  });

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

  // ################################################################ 프로필 이미지 파일 콜백 함수
  const fileCallBack1 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 1 };
    imageDataApply(data);
  };

  const fileCallBack2 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 2 };
    imageDataApply(data);
  };

  const fileCallBack3 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 3 };
    imageDataApply(data);
  };

  const fileCallBack4 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 4 };
    imageDataApply(data);
  };

  const fileCallBack5 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 5 };
    imageDataApply(data);
  };

  const fileCallBack6 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 6 };
    imageDataApply(data);
  };

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

  // ############################################################################# 사진삭제 컨트롤 변수
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
    status: '',
    return_reason: '',
  });

  // ############################################################################# 사진 삭제 팝업
  const imgDel_modalizeRef = useRef<Modalize>(null);
  const imgDel_onOpen = (imgData: any, order_seq: any) => {
    setIsDelImgData({
      img_seq: imgData.member_img_seq,
      order_seq: order_seq,
      status: imgData.status,
      return_reason: imgData.return_reason,
    });
    imgDel_modalizeRef.current?.open();
  };
  const imgDel_onClose = () => {
    imgDel_modalizeRef.current?.close();
  };

  // ############################################################################# 사진 삭제
  const imgDelProc = () => {

    let tmpCnt = 0;
    for (var key in imgData) {
      if (imgData[key].delYn == 'N' && imgData[key].status == 'ACCEPT' && (imgData[key].url || imgData[key].uri)) {
        tmpCnt++;
      }
    }

    if(isDelImgData.status == 'ACCEPT') {
      if (tmpCnt <= 3) {
        show({ content: '프로필 승인된 사진은 최소3장이 등록되어야 합니다.' });
        return;
      }
    }

    if (isDelImgData.order_seq == '1') {
      setImgData({
        ...imgData,
        orgImgUrl01: { ...imgData.orgImgUrl01, delYn: 'Y' },
      });
    }
    if (isDelImgData.order_seq == '2') {
      setImgData({
        ...imgData,
        orgImgUrl02: { ...imgData.orgImgUrl02, delYn: 'Y' },
      });
    }
    if (isDelImgData.order_seq == '3') {
      setImgData({
        ...imgData,
        orgImgUrl03: { ...imgData.orgImgUrl03, delYn: 'Y' },
      });
    }
    if (isDelImgData.order_seq == '4') {
      setImgData({
        ...imgData,
        orgImgUrl04: { ...imgData.orgImgUrl04, delYn: 'Y' },
      });
    }
    if (isDelImgData.order_seq == '5') {
      setImgData({
        ...imgData,
        orgImgUrl05: { ...imgData.orgImgUrl05, delYn: 'Y' },
      });
    }
    if (isDelImgData.order_seq == '6') {
      setImgData({
        ...imgData,
        orgImgUrl06: { ...imgData.orgImgUrl06, delYn: 'Y' },
      });
    }

    let delArr = imgDelSeqStr;
    if (delArr == '') {
      delArr = isDelImgData.img_seq;
    } else {
      delArr = ',' + isDelImgData.img_seq;
    }

    deleteProfileImage(isDelImgData.img_seq);
  };

  // ############################################################  프로필 이미지 삭제
  const deleteProfileImage = async (imgSeq:string) => {

    const body = {
      member_seq: props.route.params.memberSeq,
      img_del_seq_str: imgSeq
    };

    imgDel_onClose();
    setIsLoading(true);
    
    try {
      const { success, data } = await delete_profile_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            show({
              content: '삭제되었습니다.' ,
              confirmCallback: function() {
                getProfileImage();
              }
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
      setIsLoading(false);
    }
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
            if (null != data.imgList) {
              let imgData: any = {
                orgImgUrl01: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
                orgImgUrl02: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
                orgImgUrl03: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
                orgImgUrl04: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
                orgImgUrl05: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
                orgImgUrl06: { memer_img_seq: '', url: '', delYn: '', status: '', return_reason: '', },
              };

              data?.imgList?.map(
                ({
                  member_img_seq,
                  img_file_path,
                  order_seq,
                  status,
                  return_reason,
                }: {
                  member_img_seq: any;
                  img_file_path: any;
                  order_seq: any;
                  status: any;
                  return_reason: any;
                }) => {
                  let data = {
                    member_img_seq: member_img_seq,
                    url: findSourcePath(img_file_path),
                    delYn: 'N',
                    status: status,
                    return_reason: return_reason,
                  };
                  if (order_seq == 1) {
                    imgData.orgImgUrl01 = data;
                  }
                  if (order_seq == 2) {
                    imgData.orgImgUrl02 = data;
                  }
                  if (order_seq == 3) {
                    imgData.orgImgUrl03 = data;
                  }
                  if (order_seq == 4) {
                    imgData.orgImgUrl04 = data;
                  }
                  if (order_seq == 5) {
                    imgData.orgImgUrl05 = data;
                  }
                  if (order_seq == 6) {
                    imgData.orgImgUrl06 = data;
                  }
                }
              );

              setImgData({ ...imgData, imgData });
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
    for (var key in imgData) {
      if (imgData[key].status != 'REFUSE') {
        if (imgData[key].delYn == 'N' && (imgData[key].url || imgData[key].uri)) {
          tmpCnt++;
        }
      }
    }
    for (var key in profileImageList) {
      tmpCnt++;
    }

    if (tmpCnt < 3) {
      show({ content: '프로필 사진은 얼굴이 선명하게 나온 사진을\n포함하여 최소3장이 등록 되어야 합니다.' });
      return;
    };

    setIsLoading(true);

    const body = {
      member_seq: props.route.params.memberSeq,
      file_list: profileImageList,
      img_del_seq_str: imgDelSeqStr,
    };
    try {
      const { success, data } = await regist_profile_image(body);
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
      setIsLoading(false);
    }
  };

  // ############################################################  대표 사진 설정
  const updateMasterImage = async () => {
    const body = {
      member_seq: props.route.params.memberSeq,
      member_img_seq: isDelImgData.img_seq
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

  // ############################################################################# 최초 실행
  React.useEffect(() => {
    setProfileImageList([]);
    setImgDelSeqStr('');
    getProfileImage();
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title={'프로필 만들기'} />
      <ScrollView contentContainerStyle={[styles.scrollContainerAll]}>
        <SpaceView mb={10} viewStyle={[commonStyle.paddingHorizontal20, layoutStyle.row]}>
          <CommonText fontWeight={'700'} type={'h3'}>
            다양한 분위기의 내 모습이 담긴{'\n'}사진을 등록해보세요
            <Image source={ICON.icon_smile} style={styles.smailIon} />
          </CommonText>
        </SpaceView>

        <SpaceView viewStyle={[_styles.wrapper, commonStyle.paddingHorizontal15]}>
          {[0,1,2,3,4,5].map((i, index) => {
            return (
              <>
                {index == 0 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl01} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack1}  /> }
                {index == 1 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl02} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack2}  /> }
                {index == 2 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl03} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack3}  /> }
                {index == 3 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl04} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack4}  /> }
                {index == 4 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl05} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack5}  /> }
                {index == 5 && <ProfileImageItem index={index} imgData={imgData.orgImgUrl06} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack6}  /> }
              </>
            )
          })}
        </SpaceView>

        <SpaceView mt={20} mb={10} viewStyle={commonStyle.paddingHorizontal20}>
          <SpaceView mb={8}>
            <CommonText fontWeight={'500'} color={'#6E6E6E'}>
              어떤 사진을 올려야 할까요?
            </CommonText>
          </SpaceView>
          <CommonText textStyle={_styles.textDesc} color={'#989898'} type={'h6'}>
            • 프로필 사진은 최소 3장 이상 올려야 합니다.{'\n'}
            • 얼굴이 선명히 나오는 사진은 최소 1장 필수 입니다.{'\n'}
            • 얼굴이 식별되지 않는 사진은 가입이 반려될 수 있습니다.{'\n'}
            • 멋진 무드 속에 담긴 모습을 올려보세요!{'\n'}
            • 전신이 나오는 사진은 본인을 어필하는데 도움이 됩니다.
          </CommonText>
        </SpaceView>

        <View style={[_styles.wrapper, commonStyle.paddingHorizontal15, commonStyle.mb30]}>

          {props.route.params.gender == 'M' ? (
            <>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp1} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp2} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp3} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp4} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp5} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.manTmp6} style={_styles.tmpImageStyle} />
              </SpaceView>
            </>
          ) : (
            <>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp1} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp2} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp3} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp4} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp5} style={_styles.tmpImageStyle} />
              </SpaceView>
              <SpaceView viewStyle={_styles.tmpContainer}>
                <Image source={PROFILE_IMAGE.womanTmp6} style={_styles.tmpImageStyle} />
              </SpaceView>
            </>
          )}
        </View>
      </ScrollView>

      <SpaceView>
        <CommonBtn
          value={'다음 (3/4)'}
          type={'primary'}
          height={60}
          borderRadius={1}
          onPress={() => {
            saveProfileImage();
          }}
        />
      </SpaceView>
      

      {/* ###############################################
			##### 사진 삭제 팝업
			############################################### */}
      <Modalize
        ref={imgDel_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            프로필 사진 관리
          </CommonText>
          <TouchableOpacity onPress={imgDel_onClose}>
            <Image source={ICON.xBtn} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>

        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {isDelImgData.status == 'REFUSE' && isDelImgData.return_reason != null && 
            <SpaceView mb={15}>
              <SpaceView mb={16} viewStyle={layoutStyle.row}>
                <Image source={ICON.confirmation} style={[styles.iconSize20, {marginTop: 3}]} />
                <CommonText 
                  color={ColorType.blue697A}
                  fontWeight={'700'}
                  textStyle={{marginLeft: 5, textAlignVertical: 'center'}}>반려 사유 안내</CommonText>
              </SpaceView>

              <SpaceView mb={12} viewStyle={_styles.refuseArea}>
                <CommonText
                  color={'848484'} 
                  fontWeight={'500'}
                  lineHeight={17}
                  type={'h6'}
                  textStyle={{marginTop: 4}}>{isDelImgData.return_reason}</CommonText>
              </SpaceView>
            </SpaceView>
          }

          {(isDelImgData.status == 'ACCEPT' && isDelImgData.order_seq > 1) &&
            <SpaceView mb={10}>
              <CommonBtn value={'대표사진 설정'} type={'primary'} borderRadius={12} onPress={updateMasterImage} />
            </SpaceView>
          }

          <SpaceView mb={10}>
            <CommonBtn value={'삭제'} type={'primary2'} borderRadius={12} onPress={imgDelProc} />
          </SpaceView>

          {/* <SpaceView>
            <CommonBtn
              value={'취소'}
              type={'primary2'}
              onPress={imgDel_onClose}
            />
          </SpaceView> */}
        </View>
      </Modalize>
    </>
  );
};


{/* #######################################################################################################
###################### 프로필 이미지 렌더링
####################################################################################################### */}

function ProfileImageItem({ index, imgData, delFn, fileCallBackFn }) {
  const imgUrl = imgData.url;
  const imgDelYn = imgData.delYn;
  const imgStatus = imgData.status;

  return (
    <View style={_styles.container}>
      {isEmptyData(imgUrl) && imgDelYn == 'N' ? (
        <TouchableOpacity onPress={() => { delFn(imgData, index+1); }}>
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={_styles.imageStyle}
            key={imgUrl}
            source={imgUrl}
          />
          {(imgStatus == 'PROGRESS' || imgStatus == 'REFUSE') ? (
            <View style={_styles.imageDisabled(false)}>
              <Text style={[_styles.profileImageDimText(imgStatus)]}>{imgStatus == 'PROGRESS' ? '심사중' : '반려'}</Text>
            </View>
          ) : (imgStatus == 'ACCEPT' && index == 0) && (
            <View style={_styles.imageDisabled(true)}>
              <Text style={[_styles.masterImageDimText]}>대표 사진</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <CommonImagePicker isAuth={false} callbackFn={fileCallBackFn} uriParam={''} />
      )}
    </View>
  );
};



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  titArea: {
    flexDirection: 'row',
  },
  wrapper: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    margin: 5,
    borderRadius: 20,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  plusStyle: {
    width: (width - 80) / 10,
    height: (width - 80) / 10,
  },
  imageStyle: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    margin: 0,
    borderRadius: 20,
  },
  dim: {
    position: 'absolute',
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  close: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    margin: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  modalInnerView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    paddingBottom: 50,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 20,
  },
  margin: {
    marginTop: 30,
  },
  textDesc : {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 5
  },
  tmpContainer: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    margin: 5,
    borderRadius: 20,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  tmpImageStyle: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    margin: 0,
    borderRadius: 15,
  },
  imageDimText: {
    textAlign: 'right',
    marginTop: 10,
    marginRight: 10,
  },
  refuseArea: {
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minHeight: 100,
  },
  imageDisabled: (isMaster: boolean) => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      backgroundColor: !isMaster ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    };
  },
  masterImageDimText: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    paddingVertical: 3,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#fff',
  },
  profileImageDimText: (status: string) => {
    return {
      width: '100%',
      backgroundColor: '#000',
      textAlign: 'center',
      paddingVertical: 3,
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 12,
      color: status == 'REFUSE' ? ColorType.redF20456 : '#fff',
    };
  },

});