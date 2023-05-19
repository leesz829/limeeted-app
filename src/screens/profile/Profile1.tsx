import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { get_member_profile_info, get_member_face_rank, update_profile } from 'api/models';
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


  const [images, setImages] = useState([]);

  const memberBase = useUserInfo();           // 회원 기본정보
  const mbrSecondAuthList = useSecondAth();   // 회원 2차 인증 정보

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

  // 프로필 이미지 목록
  const [profileImageList, setProfileImageList] = React.useState([]);

  // 프로필 인상 순위 목록
  const [profileFaceRankList, setProfileFaceRankList] = React.useState([]);

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
        imgList: myImages
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



  // ############################################################  프로필 랭크 순위 조회
  const getMemberFaceRank = async () => {
    try {
      const { success, data } = await get_member_face_rank();
      if (success) {
        setProfileFaceRankList(data.face_rank_list);
      } else {
        show({
          content: '오류입니다. 관리자에게 문의해주세요.',
          confirmCallback: function () {},
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

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
        setProfileFaceRankList(data.mbr_face_rank_list);
        profileDataSet(data.mbr_img_list);
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

    // ##### 2차 인증 구성
    if (mbrSecondAuthList != null) {
      mbrSecondAuthList.map(
        ({
          common_code,
          auth_status,
        }: {
          common_code: any;
          auth_status: any;
        }) => {
          if (common_code == 'JOB' && auth_status == 'ACCEPT') {
            setIsJob(true);
          }
          if (common_code == 'EDU' && auth_status == 'ACCEPT') {
            setIsEdu(true);
          }
          if (common_code == 'INCOME' && auth_status == 'ACCEPT') {
            setIsIncome(true);
          }
          if (common_code == 'ASSET' && auth_status == 'ACCEPT') {
            setIsAsset(true);
          }
          if (common_code == 'SNS' && auth_status == 'ACCEPT') {
            setIsSns(true);
          }
          if (common_code == 'VEHICLE' && auth_status == 'ACCEPT') {
            setIsVehicle(true);
          }
        }
      );
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

  // ############################################################################# 최초 실행
  useFocusEffect(
    React.useCallback(() => {
      getMemberProfileData();

      return () => {
        imgDel_onClose();
      };
    }, [isFocus]),
  );


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

      <KeyboardAwareScrollView behavior={"padding"} style={{flex:1, backgroundColor: 'white'}} extraScrollHeight={70}>
        <ScrollView ref={scrollViewRef} style={{ backgroundColor: 'white', flexGrow: 1 }}>

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
          <ProfileAuth level={memberBase?.auth_acct_cnt} data={mbrSecondAuthList} isButton={true} />

          {/* ####################################################################################
					####################### 인상 투표 결과 영역
					#################################################################################### */}

          {profileFaceRankList.length > 0 && (
            <>
              <Text style={_styles.title}>내 인상 투표 결과</Text>
              <View style={_styles.impressionContainer}>

                {profileFaceRankList.map((item : any, index) => (
                  <View style={_styles.itemRow(index === profileFaceRankList.length - 1 ? true : false)}>
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
            </>
          )}

          <View style={_styles.myImpressionContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25}}>
              <Text style={_styles.title}>내 평점은?</Text>
            </View>

            <View style={_styles.profileScoreContainer}>
              <View style={[_styles.scoreContainer, { left: memberBase?.profile_score == 0 ? 0 : memberBase?.profile_score * 10 - 5 + '%' }]}>
                <Text style={_styles.scoreText}>{memberBase?.profile_score}</Text>
                <View style={_styles.triangle}></View>
              </View>
              <Slider
                value={memberBase?.profile_score / 10}
                animateTransitions={true}
                renderThumbComponent={() => null}
                maximumTrackTintColor={'#e3e3e3'}
                minimumTrackTintColor={'#8854d2'}
                containerStyle={_styles.sliderContainerStyle}
                trackStyle={_styles.trackStyle}
                trackClickable={false}
                disabled
              />
            </View>
            
            <View style={_styles.gageContainer}>
              <Text style={_styles.gageText}>0</Text>
              <Text style={_styles.gageText}>5</Text>
              <Text style={_styles.gageText}>10</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />

          {/* ####################################################################################
					####################### 인터뷰 영역
					#################################################################################### */}
          <Interview title={memberBase?.nickname + '님을\n알려주세요!'} 
                      callbackAnswerFn={callbackInterviewAnswer}
                      callbackScrollBottomFn={callbackScrollBottom} />
        </View>
        <View style={{ height: 10 }} />
      </ScrollView>
      </KeyboardAwareScrollView>

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
            <CommonBtn
              value={'사진 보기'}
              type={'primary'}
              borderRadius={12}
              onPress={goImgDetail}
            />
          </SpaceView>
          <SpaceView mb={10}>
            <CommonBtn
              value={'사진 삭제'}
              type={'primary'}
              borderRadius={12}
              onPress={imgDelProc}
            />
          </SpaceView>
          <SpaceView>
            <CommonBtn
                value={'취소'}
                type={'primary2'}
                borderRadius={12}
                onPress={imgDel_onClose}
              />
          </SpaceView>          
        </View>
      </Modalize>

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

          <View style={profileImage.margin}>
            <View>
              <CommonBtn
                value={'사진 삭제'}
                type={'danger'}
                onPress={onPressDelete}
              />
              <View style={{ height: 2 }} />
              <CommonBtn value={'취소'} type={'primary'} onPress={close} />
            </View>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
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
    marginTop: 30,
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
    marginTop: 7,
    borderRadius: 13,
  },
  trackStyle: {
    width: '100%',
    height: 27,
    borderRadius: 13,
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
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#d0d0d0',
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
    alignItems: 'center',
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
    borderWidthBottom: 1,
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
  margin: {
    marginTop: 30,
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