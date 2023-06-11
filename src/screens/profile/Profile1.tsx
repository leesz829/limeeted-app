import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { get_member_profile_info, update_profile, update_additional, save_profile_auth_comment } from 'api/models';
import { Color } from 'assets/styles/Color';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import Interview from 'component/Interview';
import ProfileAuth from 'component/ProfileAuth';
import { usePopup } from 'Context';
import { commonStyle, layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import React, { useEffect, useMemo, useState, useRef  } from 'react';
import { Modalize } from 'react-native-modalize';
import { ImagePicker } from 'component/ImagePicker';
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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ReactNativeModal from 'react-native-modal';
import { findSourcePath, ICON } from 'utils/imageUtils';
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


const options = {
  title: '이미지를 선택해 주세요.',
  type: 'library',
  options: {
    selectionLimit: 0,
    mediaType: 'photo',
    includeBase64: true,
    includeExtra: true,
  },
};

const { width } = Dimensions.get('window');
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

  // 프로필 2차 인증 코멘트 팝업 변수
  const [popupAuthComment, setPopupAuthComment] = useState({
    visible: false,
    auth_seq: '',
    code: '',
    name: '',
    comment: '',
  });

  const [images, setImages] = useState([]);

  const memberBase = useUserInfo();           // 회원 기본정보

  // 프로필 사진
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl06: { memer_img_seq: '', url: '', delYn: '' },
  });

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

  // 프로필 데이터
  const [profileData, setProfileData] = React.useState({
    authList: [],
    faceRankList: [],
  })

  // 적용할 인터뷰 목록
  const [applyInterviewList, setApplyInterviewList] = React.useState<any>([]);

  // 프로필 2차 인증 여부
  const [isJob, setIsJob] = React.useState<any>(false);
  const [isEdu, setIsEdu] = React.useState<any>(false);
  const [isIncome, setIsIncome] = React.useState<any>(false);
  const [isAsset, setIsAsset] = React.useState<any>(false);
  const [isSns, setIsSns] = React.useState<any>(false);
  const [isVehicle, setIsVehicle] = React.useState<any>(false);

  // 이미지 삭제 데이터 저장
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
    status: '',
    return_reason: '',
  });

  // ################################################################ 프로필 이미지 파일 콜백 함수
  const fileCallBack1 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 1 };
    imageDataApply(data);
  };
    
  const fileCallBack2 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 2 };
    imageDataApply(data);
  };

  const fileCallBack3 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 3 };
    imageDataApply(data);
  };

  const fileCallBack4 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 4 };
    imageDataApply(data);
  };

  const fileCallBack5 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 5 };
    imageDataApply(data);
  };

  const fileCallBack6 = (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 6 };
    imageDataApply(data);
  };

  // ################################################################ 프로필 이미지 데이터 적용
  const imageDataApply = (data: any) => {
    insertProfileImage(data);

    /* let dupChk = false;
    profileImageList.map(({ order_seq }: { order_seq: any }) => {
      if (order_seq == data.order_seq) {
        dupChk = true;
      }
    });

    if (!dupChk) {
      setProfileImageList([...profileImageList, data]);
    } else {
      setProfileImageList((prev) =>
        prev.map((item: any) =>
          item.order_seq === data.order_seq
            ? { ...item, uri: data.file_uri, file_base64: data.file_base64 }
            : item
        )
      );
    } */
  };

  // ############################################################################# 사진 보기
  const goImgDetail = () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'ImagePreview',
      params: {
        imgList: myImages,
        orderSeq: isDelImgData.order_seq,
      }
    });
  };

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
      console.log('imgData[key] ::::: ' , imgData[key]);

      if(isDelImgData.status != 'ACCEPT') {
        if (imgData[key].delYn == 'N' && (imgData[key].url || imgData[key].uri)) {
          tmpCnt++;
        }
      } else {
        if (imgData[key].delYn == 'N' && imgData[key].status == 'ACCEPT' && (imgData[key].url || imgData[key].uri)) {
          tmpCnt++;
        }
      }
    }

    console.log('tmpCnt ::::: ' ,tmpCnt);

    if (tmpCnt <= 3) {
      show({ content: '승인된 프로필 사진은 최소 3장 등록되어야 합니다.' });
      return;
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
    if (!delArr) {
      delArr = isDelImgData.img_seq;
    } else {
      delArr += ',' + isDelImgData.img_seq;
    }

    deleteProfileImage(isDelImgData.img_seq);
  };

  // ############################################################  프로필 이미지 삭제
  const deleteProfileImage = async (imgSeq:string) => {

    const body = {
      file_list: null
      , img_del_seq_str: imgSeq
      , interview_list: null
    };

    imgDel_onClose();
    setIsLoading(true);
    
    try {
      const { success, data } = await update_profile(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            dispatch(setPartialPrincipal({
              mbr_base : data.mbr_base
              , mbr_img_list : data.mbr_img_list
              , mbr_interview_list : data.mbr_interview_list
            }));
  
            show({
              content: '삭제되었습니다.' ,
              confirmCallback: function() {
                profileDataSet(data.mbr_img_list);
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

  // ############################################################  인터뷰 답변 작성 Callback 함수
  const callbackInterviewAnswer = async (seq: any, answer: any) => {
    let dupChk = false;
    let data = {member_interview_seq: seq, answer: answer};
    applyInterviewList.map(({member_interview_seq} : {member_interview_seq: any;}) => {
      if(member_interview_seq == seq) { dupChk = true };
    })
    if(!dupChk) {
      setApplyInterviewList([...applyInterviewList, data]);
    } else {
      setApplyInterviewList((prev) =>
        prev.map((item: any) =>
          item.member_interview_seq === seq ? { ...item, answer: answer } : item
        )
      );
    }
  }

  // ############################################################  인터뷰 답변 작성 Callback 함수
  const callbackScrollBottom = async () => {
    scrollViewRef.current.scrollToEnd({animated: true})
  }

  const deleteImage = (item) => {
    const deleted = images.filter((e) => e !== item);
    deleted.push({});
    setImages(deleted);
    // setImages((prev) => prev.filter((e) => e !== item).push({}));
  };
  const addImage = async () => {
    const validCount = images.filter((e) => e.img_file_path).length;
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      return;
    }
    let temp = images.concat();

    temp[validCount] = {
      ...result.assets[0],
      img_file_path: result.assets[0].uri,
    };

    setImages(temp);
  };

  // ############################################################  프로필 데이터 조회
  const getMemberProfileData = async () => {
    setIsLoading(true);

    try {
      const { success, data } = await get_member_profile_info();
      if (success) {
        const auth_list = data?.mbr_second_auth_list.filter(item => item.auth_status == 'ACCEPT');
        setProfileData({
          authList: auth_list,
          faceRankList: data.mbr_face_rank_list,
        });

        profileDataSet(data.mbr_img_list);

        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
          , mbr_img_list : data.mbr_img_list
          , mbr_second_auth_list : data.mbr_second_auth_list
        }));
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

      if(typeof props.route.params?.isInterViewMove != 'undefined') {
        if(props.route.params.isInterViewMove) {
          setTimeout(() => {
            scrollViewRef.current.scrollToEnd({animated: false});
          }, 500);
          props.route.params.isInterViewMove = false;
        }
      }
    }
  }

  // ############################################################  프로필 이미지 등록
  const insertProfileImage = async (imageData:any) => {
   
    let imageList = [];
    imageList.push(imageData);

    const body = {
      file_list: imageList
      , img_del_seq_str: null
      , interview_list: null
    };

    setIsLoading(true);
    
    try {
      const { success, data } = await update_profile(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            dispatch(setPartialPrincipal({
              mbr_base : data.mbr_base
              , mbr_img_list : data.mbr_img_list
              , mbr_interview_list : data.mbr_interview_list
            }));
  
            show({
              content: '등록되었습니다.' ,
              confirmCallback: function() {
                profileDataSet(data.mbr_img_list);
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

  // ################################################################ 프로필 이미지 구성
  const profileDataSet = async (imgList:any) => {
    
    // ##### 프로필 이미지 구성
    if (imgList != null && imgList.length > 0) {
      let imgData: any = {
        orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl06: { memer_img_seq: '', url: '', delYn: '' },
        imgFile01: { uri: '', name: '', type: '' },
        imgFile02: { uri: '', name: '', type: '' },
        imgFile03: { uri: '', name: '', type: '' },
        imgFile04: { uri: '', name: '', type: '' },
        imgFile05: { uri: '', name: '', type: '' },
        imgFile06: { uri: '', name: '', type: '' },
      };

      imgList.map(
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
  };

  // ################################################################ 초기 실행 함수
  /* useEffect(() => {
    //init();
  }, [myImages]);

  const init = () => {
    getMemberFaceRank();
    let result = [];
    let freeCount = 6;
    freeCount = freeCount - myImages.length;

    for (let i = 0; i < freeCount; i++) {
      result.push({});
    }
    setImages(myImages.concat(result));
  }; */

  // ############################################################################# 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_profile_yn: 'N'
    };
    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      }
    }
  };

  // ############################################################################# 프로필 인증 코멘트 입력 팝업 함수
  const callbackAuthCommentPopup = async (auth_seq: any, code: any, name: any, comment: any) => {
    setPopupAuthComment({
      visible: true,
      auth_seq: auth_seq,
      code: code,
      name: name,
      comment: comment
    })
  }

  // ############################################################################# 프로필 인증 코멘트 저장 함수
  const saveAuthComment = async () => {
    Keyboard.dismiss();
    //setIsLoading(true);

    setPopupAuthComment({
      ...popupAuthComment,
      visible: false,
    });

    const body = {
      member_auth_seq: popupAuthComment.auth_seq,
      auth_comment: popupAuthComment.comment,
    };

    try {
      const { success, data } = await save_profile_auth_comment(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            getMemberProfileData();
            /* 
            show({
              title: '알림',
              content: '코멘트가 저장되었습니다.' ,
              confirmCallback: function() {}
            });   */

            break;
          default:
            show({
              title: '알림',
              content: '오류입니다. 관리자에게 문의해주세요.' ,
              confirmCallback: function() {}
            });
            break;
        }
       
      } else {
        show({
          title: '알림',
          content: '오류입니다. 관리자에게 문의해주세요.' ,
          confirmCallback: function() {}
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }



  // ############################################################################# 초기 실행 실행
  useFocusEffect(
    React.useCallback(() => {
      getMemberProfileData();

      return () => {
        imgDel_onClose();
      };
    }, []),
  );

  useEffect(() => {
    if(isFocus) {

      // 튜토리얼 팝업 노출
      if(memberBase?.tutorial_profile_yn == 'Y') {
        show({
          type: 'GUIDE',
          guideType: 'PROFILE',
          guideSlideYn: 'Y',
          guideNexBtnExpoYn: 'Y',
          confirmCallback: function(isNextChk) {
            if(isNextChk) {
              saveMemberTutorialInfo();
            }
          }
        });
      };
    };
  }, [isFocus]);




  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader
        title="프로필 관리"
        /* right={
          <TouchableOpacity onPress={() => { saveMemberProfile(); }}>
            <Text style={_styles.saveText}>저장</Text>
          </TouchableOpacity>
        } */
      />

      {/* <KeyboardAwareScrollView behavior={"padding"} style={{flex:1, backgroundColor: 'white'}} extraScrollHeight={70}> */}
        <ScrollView ref={scrollViewRef} contentContainerStyle ={{ backgroundColor: 'white', flexGrow: 1 }}>

        {/* ####################################################################################
					####################### 프로필 이미지 영역
					#################################################################################### */}
        {/* <View style={styles.wrapper}>
          {images?.map((e) => (
            <ProfileImage item={e} onDelete={deleteImage} onAdd={addImage} />
          ))}
        </View> */}

        <View style={[_styles.wrapper]}>
          <View style={_styles.container}>
            {imgData.orgImgUrl01.url != '' &&
            imgData.orgImgUrl01.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl01, 1);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl01.url}
                  source={imgData.orgImgUrl01.url}
                />
                {imgData.orgImgUrl01.url != '' && (imgData.orgImgUrl01.status == 'PROGRESS' || imgData.orgImgUrl01.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {/* <View style={_styles.disableArea}></View> */}
                    {imgData.orgImgUrl01.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl01.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isAuth={false}
                callbackFn={fileCallBack1}
                uriParam={''}
              />
            )}
          </View>
          <View style={_styles.container}>
            {imgData.orgImgUrl02.url != '' &&
            imgData.orgImgUrl02.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl02, 2);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl02.url}
                  source={imgData.orgImgUrl02.url}
                />
                {imgData.orgImgUrl02.url != '' && (imgData.orgImgUrl02.status == 'PROGRESS' || imgData.orgImgUrl02.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {imgData.orgImgUrl02.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl02.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isAuth={false}
                callbackFn={fileCallBack2}
                uriParam={''}
              />
            )}
          </View>
          <View style={_styles.container}>
            {imgData.orgImgUrl03.url != '' &&
            imgData.orgImgUrl03.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl03, 3);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl03.url}
                  source={imgData.orgImgUrl03.url}
                />
                {imgData.orgImgUrl03.url != '' && (imgData.orgImgUrl03.status == 'PROGRESS' || imgData.orgImgUrl03.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {imgData.orgImgUrl03.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl03.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isAuth={false}
                callbackFn={fileCallBack3}
                uriParam={''}
              />
            )}
          </View>
          <View style={_styles.container}>
            {imgData.orgImgUrl04.url != '' &&
            imgData.orgImgUrl04.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl04, 4);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl04.url}
                  source={imgData.orgImgUrl04.url}
                />
                {imgData.orgImgUrl04.url != '' && (imgData.orgImgUrl04.status == 'PROGRESS' || imgData.orgImgUrl04.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {imgData.orgImgUrl04.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl04.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isAuth={false}
                callbackFn={fileCallBack4}
                uriParam={''}
              />
            )}
          </View>
          <View style={_styles.container}>
            {imgData.orgImgUrl05.url != '' &&
            imgData.orgImgUrl05.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl05, 5);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl05.url}
                  source={imgData.orgImgUrl05.url}
                />
                {imgData.orgImgUrl05.url != '' && (imgData.orgImgUrl05.status == 'PROGRESS' || imgData.orgImgUrl05.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {imgData.orgImgUrl05.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl05.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isAuth={false}
                callbackFn={fileCallBack5}
                uriParam={''}
              />
            )}
          </View>
          <View style={_styles.container}>
            {imgData.orgImgUrl06.url != '' &&
            imgData.orgImgUrl06.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl06, 6);
                }}>
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={_styles.imageStyle}
                  key={imgData.orgImgUrl06.url}
                  source={imgData.orgImgUrl06.url}
                />
                {imgData.orgImgUrl06.url != '' && (imgData.orgImgUrl06.status == 'PROGRESS' || imgData.orgImgUrl06.status == 'REFUSE') && (
                  <View style={_styles.disabled}>
                    {imgData.orgImgUrl06.status == 'PROGRESS' ? (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.white} textStyle={[styles.imageDimText]}>심사중</CommonText>
                    ) : imgData.orgImgUrl06.status == 'REFUSE' && (
                      <CommonText fontWeight={'700'} type={'h5'} color={ColorType.redF20456} textStyle={[styles.imageDimText]}>반려</CommonText>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <>
                <ImagePicker
                  isAuth={false}
                  callbackFn={fileCallBack6}
                  uriParam={''}/>

                {/* {imageDataApplyChk.img06Yn == 'Y' && (
                  <View style={styles.disabled}>
                    <CommonText fontWeight={'700'} type={'h5'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mt10, commonStyle.mr10]}>심사중</CommonText>
                  </View>
                )} */}
                
              </>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'column', paddingHorizontal: 20, marginTop: 20 }}>

          {/* ####################################################################################
					####################### 프로필 인증 영역
					#################################################################################### */}

          {profileData.authList.length > 0 ? (
            <ProfileAuth level={memberBase?.auth_acct_cnt} data={profileData.authList} isButton={true} callbackAuthCommentFn={callbackAuthCommentPopup} />
          ) : (
            <View style={{width: '100%', flexDirection: 'column', alignItems: 'flex-start'}}>
              <Text style={_styles.title}>프로필 인증</Text>

              <View style={_styles.authShadowArea}>
                <LinearGradient
                  colors={['#FFFFFF', '#E8FFFE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={_styles.authArea}>

                  <SpaceView viewStyle={{flexDirection: 'row'}}>
                    <SpaceView mr={7}><Image source={ICON.jobNew} style={{width: 40, height: 29}} /></SpaceView>
                    <SpaceView mr={7}><Image source={ICON.degreeNew} style={{width: 40, height: 29}} /></SpaceView>
                    <SpaceView mr={7}><Image source={ICON.incomeNew} style={{width: 40, height: 29}} /></SpaceView>
                    <SpaceView mr={7}><Image source={ICON.assetNew} style={{width: 40, height: 29}} /></SpaceView>
                    <SpaceView mr={7}><Image source={ICON.snsNew} style={{width: 40, height: 29}} /></SpaceView>
                    <SpaceView><Image source={ICON.vehicleNew} style={{width: 40, height: 29}} /></SpaceView>
                  </SpaceView>

                  <SpaceView mt={20} viewStyle={_styles.authEmptyArea}>
                    <SpaceView mb={13}><Text style={_styles.authEmptyTit}>프로필 인증 변경 심사 후 인증 레벨을 부여 받을 수 있어요.</Text></SpaceView>
                    <SpaceView mt={5} viewStyle={{paddingHorizontal: 20}}>
                      <TouchableOpacity 
                        onPress={() => { navigation.navigate(STACK.COMMON, { screen: 'SecondAuth', }); }}
                        hitSlop={commonStyle.hipSlop15}>
                        
                        <Text style={_styles.authEmptyBtn}>프로필 인증 변경</Text>
                      </TouchableOpacity>
                    </SpaceView>
                  </SpaceView>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* ####################################################################################
					####################### 인상 투표 결과 영역
					#################################################################################### */}

          {profileData.faceRankList.length > 0 && (
            <>
              <SpaceView mt={30}>
                <Text style={_styles.title}>내 인상 투표 결과</Text>
                <View style={_styles.impressionContainer}>

                  {profileData.faceRankList.map((item : any, index) => (
                    <View key={index} style={_styles.itemRow(index === profileData.faceRankList.length - 1 ? true : false)}>
                      <View style={_styles.subRow}>
                        {/* <Image source={ICON.fashion} style={_styles.icon} /> */}
                        <Text style={_styles.rankText(index)}>
                          {index+1}위
                        </Text>
                        <Text style={_styles.contentsText}>{item.face_code_name}</Text>
                      </View>
                      <View style={_styles.fashionPercent(index)}>
                        <Text style={_styles.percentText}>{item.percent}%</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </SpaceView>
            </>
          )}

          <SpaceView mt={30} mb={30} viewStyle={_styles.myImpressionContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25}}>
              <Text style={_styles.title}>내 평점은?</Text>
            </View>

            <View style={_styles.profileScoreContainer}>
              <View style={[_styles.scoreContainer, { left: memberBase?.profile_score == 0 ? 0 : memberBase?.profile_score * 10 - 5 + '%' }]}>
                <Text style={_styles.scoreText}>{memberBase?.profile_score}</Text>
                <View style={_styles.triangle}></View>
              </View>

              <View>
                <LinearGradient
                  colors={['#7986EE', '#8854D2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={_styles.gradient(memberBase?.profile_score / 10)}>
                </LinearGradient>

                <Slider
                  //value={memberBase?.profile_score / 10}
                  animateTransitions={true}
                  renderThumbComponent={() => null}
                  /* maximumTrackTintColor={'#e3e3e3'}
                  minimumTrackTintColor={'#8854d2'} */
                  maximumTrackTintColor={'transparent'}
                  minimumTrackTintColor={'transparent'}
                  containerStyle={_styles.sliderContainerStyle}
                  trackStyle={_styles.trackStyle}
                  trackClickable={false}
                  disabled
                />
              </View>
            </View>
            
            <View style={_styles.gageContainer}>
              <Text style={_styles.gageText}>0</Text>
              <Text style={_styles.gageText}>5</Text>
              <Text style={_styles.gageText}>10</Text>
            </View>
          </SpaceView>

          {/* ####################################################################################
					####################### 인터뷰 영역
					#################################################################################### */}
          <Interview title={memberBase?.nickname + '님을\n알려주세요!'} 
                      callbackAnswerFn={callbackInterviewAnswer}
                      callbackScrollBottomFn={callbackScrollBottom} />
        </View>
        <View style={{ height: 10 }} />
      </ScrollView>
      {/* </KeyboardAwareScrollView> */}

      {/* ###############################################
							사진 삭제 팝업
			############################################### */}
      <Modalize
        ref={imgDel_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={[modalStyle.modalContainer]} >

        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            프로필 사진 관리
          </CommonText>
          <TouchableOpacity onPress={imgDel_onClose}>
            <Image source={ICON.xBtn2} style={styles.iconSize20} />
          </TouchableOpacity>
        </View>

        <View style={[modalStyle.modalBody, layoutStyle.flex1, layoutStyle.mb20]}>
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

          <SpaceView mb={10}>
            <CommonBtn value={'사진 보기'} type={'primary'} borderRadius={12} onPress={goImgDetail} />
          </SpaceView>
          <SpaceView mb={10}>
            <CommonBtn value={'사진 삭제'} type={'primary'} borderRadius={12} onPress={imgDelProc} />
          </SpaceView>
          <SpaceView>
            <CommonBtn value={'취소'} type={'primary2'} borderRadius={12} onPress={imgDel_onClose} />
          </SpaceView>          
        </View>
      </Modalize>

      {/* ###############################################
							인증 코멘트 등록 팝업
			############################################### */}
      <Modal 
        isVisible={popupAuthComment.visible} 
        onBackdropPress={() => { Keyboard.dismiss(); }}>

        <View style={{backgroundColor: '#fff', borderRadius: 20,}}>
          <SpaceView viewStyle={[modalStyle.modalBody]}>
            
            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
              <SpaceView>
                  {popupAuthComment.code == 'JOB' && <Image source={ICON.jobNew} style={{width: 75, height: 56}} />}
                  {popupAuthComment.code == 'EDU' && <Image source={ICON.degreeNew} style={{width: 75, height: 56}} />}
                  {popupAuthComment.code == 'INCOME' && <Image source={ICON.incomeNew} style={{width: 75, height: 56}} />}
                  {popupAuthComment.code == 'ASSET' && <Image source={ICON.assetNew} style={{width: 75, height: 56}} />}
                  {popupAuthComment.code == 'SNS' && <Image source={ICON.snsNew} style={{width: 75, height: 56}} />}
                  {popupAuthComment.code == 'VEHICLE' && <Image source={ICON.vehicleNew} style={{width: 75, height: 56}} />}
              </SpaceView>
              <SpaceView ml={15}>
                <Text style={_styles.authCommentText}>{popupAuthComment.name} 인증{'\n'}코멘트를 남겨 주세요.</Text>
              </SpaceView>
            </SpaceView>

            <SpaceView mt={15}>
              <TextInput
                defaultValue={popupAuthComment.comment}
                onChangeText={(text) => setPopupAuthComment({...popupAuthComment, comment: text})}
                style={[_styles.authCommentInput]}
                multiline={true}
                placeholder={'소개글을 자유롭게 입력해 주세요.'}
                placeholderTextColor={'#C7C7C7'}
                numberOfLines={4}
                maxLength={200}
                textAlignVertical={'top'}
              />
            </SpaceView>
          </SpaceView>

          <View style={{width: width - 39, flexDirection: 'row', justifyContent: 'space-between',}}>
            <SpaceView viewStyle={{flexDirection: 'row', width: '100%', paddingHorizontal: 20, paddingBottom: 8}}>
              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: Color.grayD6D3D3, borderBottomLeftRadius: 10, borderTopLeftRadius: 10}]}
                onPress={() => { setPopupAuthComment({...popupAuthComment, visible: false}) }}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>취소하기</CommonText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomRightRadius: 10, borderTopRightRadius: 10}]}
                onPress={() => { saveAuthComment(); }}>
                <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>저장하기</CommonText>
              </TouchableOpacity>
            </SpaceView>
          </View>
        </View>
      </Modal>

    </>
  );
};







{/* #######################################################################################################
###################### 프로필 이미지 렌더링
####################################################################################################### */}

function ProfileImage({ item, onDelete, onAdd }) {
  const [modalVisible, setModalVisible] = useState(false);

  const close = () => {
    setModalVisible(false);
  };
  const open = () => {
    setModalVisible(true);
  };
  const onPressDelete = () => {
    onDelete && onDelete(item);
    close();
  };
  const onPressAdd = () => {
    onAdd && onAdd();
  };

  const isPending = item.status === 'PROGRESS';
  const filePath = useMemo(() => item.img_file_path, [item.img_file_path]);

  return item.img_file_path === undefined ? (
    <>
      <TouchableOpacity style={profileImage.container} onPress={onPressAdd}>
        <Image style={profileImage.plusStyle} source={ICON.plus_primary} />
      </TouchableOpacity>
    </>
  ) : (
    <>
      <TouchableOpacity disabled={isPending} onPress={open}>
        <Image
          source={findSourcePath(filePath)}
          style={profileImage.imageStyle}
        />
        {isPending && (
          <View style={profileImage.dim}>
            <Text style={profileImage.text}>심사중</Text>
          </View>
        )}
      </TouchableOpacity>
      <ReactNativeModal
        isVisible={modalVisible}
        style={profileImage.modalContainer}
      >
        <View style={profileImage.modalInnerView}>
          <View style={profileImage.title}>
            <Text style={profileImage.titleText}>프로필 사진 삭제</Text>
            <TouchableOpacity onPress={close}>
              <Image source={ICON.xBtn} style={profileImage.close} />
            </TouchableOpacity>
          </View>

          <SpaceView mt={30}>
            <View>
              <CommonBtn
                value={'사진 삭제'}
                type={'danger'}
                onPress={onPressDelete}
              />
              <View style={{ height: 2 }} />
              <CommonBtn value={'취소'} type={'primary'} onPress={close} />
            </View>
          </SpaceView>
        </View>
      </ReactNativeModal>
    </>
  );
}




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  saveText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  wrapper: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    width: (width - 46) / 3,
    height: (width - 46) / 3,
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  imageStyle: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    margin: 0,
    borderRadius: 20,
  },
  disabled: {
    position: 'absolute',
    width: (width - 60) / 3,
    height: (width - 57) / 3,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  disableArea: {
    opacity: 0.7,
  },
  profileContainer: {
    backgroundColor: Color.grayF8F8,
    borderRadius: 16,
    padding: 24,
    marginRight: 0,
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  impressionContainer: {
    width: '100%',
    opacity: 0.78,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d8d8d8',
    marginTop: 10,
    borderTopEndRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemRow: (isLast: boolean) => {
    return {
      width: '100%',
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: isLast ? 0 : 1,
      borderColor: '#D8D8D8',
      borderStyle: 'dotted',
    };
  },
  subRow: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  contentsText: {
    marginLeft: 10,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
  },
  fashionPercent: (idx: number) => {
    return {
      width: 45,
      height: 27,
      borderRadius: 13.5,
      backgroundColor: idx == 0 ? '#FE0456' : '#7986ee',
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `center`,
    };
  },
  fontPercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#fe0456',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  smilePercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#eda02b',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  percentText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#fff',
  },
  rankText: (idx: number) => {
    return {
      backgroundColor: idx == 0 ? '#FE0456' : '#4472C4',
      color: Color.white,
      fontFamily: 'AppleSDGothicNeoEB00',
      width: 27,
      textAlign: 'center',
      fontSize: 12,
      borderRadius: 8,
      paddingVertical: 3,
    };
  },
  myImpressionContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
  },
  sliderContainerStyle: {
    width: '100%',
    height: 27,
    //marginTop: 7,
    borderRadius: 13,
    backgroundColor: '#E3E3E3',
  },
  trackStyle: {
    height: 27,
    borderRadius: 13,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  gageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gageText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#D0D0D0',
  },
  imageDimText: {
    textAlign: 'right',
    marginTop: 7,
    marginRight: 10,
  },
  sliderText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 32,
  },
  profileScoreContainer: {
    flex: 1,
    //alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    transform: [{ translateY: -25 }], // 수직 중앙 정렬을 위한 translateY
    alignItems: 'center',
  },
  scoreText: {
    backgroundColor: '#151515',
    color: ColorType.white,
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderBottomColor: '#151515',
  },
  triangle: {
    marginTop: -1,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#151515',
    transform: [{ rotate: '180deg' }],
  },
  refuseArea: {
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minHeight: 100,
  },
  gradient: (value:any) => {
    let percent = 0;

    if(value != null && typeof value != 'undefined') {
      percent = value * 100;
    };

    return {
      position: 'absolute',
      width: percent + '%',
      height: 27,
      zIndex: 1,
      borderRadius: 13,
    };
  },
  authCommentText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    color: '#333333',
    lineHeight: 22,
  },
  authCommentInput: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 12,
    color: '#7986EE',
    borderWidth: 1,
    borderColor: '#EBE9EF',
    borderRadius: 10,
    paddingHorizontal: 10,
    maxHeight: 80,
    height: 80,
  },
  authShadowArea: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.23,
    shadowRadius: 5.0,
    elevation: 5,
    overflow: 'visible',
    width: '100%',
  },
  authArea: {
    position: 'relative',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 17,
    paddingTop: 30,
    paddingBottom: 10,
    marginVertical: 10,
  },
  authEmptyArea: {
    width: '95%',
    backgroundColor: '#ffffff', 
    paddingVertical: 20,
    paddingHorizontal: 10, 
    marginHorizontal: 10, 
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#8E9AEB', 
    borderStyle: 'dotted',
  },
  authEmptyTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    color: '#7986EE',
    textAlign: 'center',
  },
  authEmptyBtn: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#697AE6',
    borderRadius: 7,
    textAlign: 'center',
    paddingVertical: 8,
  }
});


const profileImage = StyleSheet.create({
  container: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    margin: 10,
    borderRadius: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  plusStyle: {
    width: (width - 80) / 10,
    height: (width - 80) / 10,
  },
  imageStyle: {
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    margin: 10,
    borderRadius: 20,
  },
  dim: {
    position: 'absolute',
    width: (width - 80) / 3,
    height: (width - 80) / 3,
    margin: 10,
    borderRadius: 10,
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
});

function DashSpacer() {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        borderWidth: 1,
        borderColor: '#d8d8d8',
        borderStyle: 'dashed',
      }}
    />
  );
}