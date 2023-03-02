import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICON, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { usePopup } from 'Context';
import { get_profile_imgage_guide, regist_profile_image } from 'api/models';
import { REFUSE, SUCCESS, SUCESSION } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';


/* ################################################################################################################
###################################################################################################################
###### 근사한 프로필 만들기
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Signup02'>;
  route: RouteProp<StackParamList, 'Signup02'>;
}

export const Signup02 = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const isFocus = useIsFocused();
  const { show } = usePopup();  // 공통 팝업

  const [profileImageList, setProfileImageList] = React.useState([]); // 프로필 이미지 목록

  // 프로필 사진
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
    orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
  });

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');


  // ################################################################ 프로필 이미지 파일 콜백 함수
  const fileCallBack1 = (
    uri: any,
    base64: string
  ) => {
    let data = {file_uri: uri, file_base64: base64, order_seq: 1};
    imageDataApply(data);
  };

  const fileCallBack2 = (
    uri: any,
    base64: string
  ) => {
    let data = {file_uri: uri, file_base64: base64, order_seq: 2};
    imageDataApply(data);
  };

  const fileCallBack3 = (
    uri: any,
    base64: string
  ) => {
    let data = {file_uri: uri, file_base64: base64, order_seq: 3};
    imageDataApply(data);
  };

  const fileCallBack4 = (
    uri: any,
    base64: string
  ) => {
    let data = {file_uri: uri, file_base64: base64, order_seq: 4};
    imageDataApply(data);
  };

  const fileCallBack5 = (
    uri: any,
    base64: string
  ) => {
    let data = {file_uri: uri, file_base64: base64, order_seq: 5};
    imageDataApply(data);
  };

  // ################################################################ 프로필 이미지 데이터 적용
  const imageDataApply  = (data: any) => {
    let dupChk = false;
    profileImageList.map(({order_seq} : {order_seq: any;}) => {
      if(order_seq == data.order_seq) { dupChk = true };
    })

    if(!dupChk) {
      setProfileImageList([...profileImageList, data]);
    } else {
      setProfileImageList((prev) =>
        prev.map((item: any) =>
          item.order_seq === data.order_seq ? { ...item, uri: data.file_uri, file_base64: data.file_base64 } : item
        )
      );
    }
  }

  // ############################################################################# 사진삭제 컨트롤 변수
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
  });

  // ############################################################################# 사진 삭제 팝업
  const imgDel_modalizeRef = useRef<Modalize>(null);
  const imgDel_onOpen = (img_seq: any, order_seq: any) => {
    setIsDelImgData({
      img_seq: img_seq,
      order_seq: order_seq,
    });
    imgDel_modalizeRef.current?.open();
  };
  const imgDel_onClose = () => {
    imgDel_modalizeRef.current?.close();
  };

  // ############################################################################# 사진 삭제
  const imgDelProc = () => {
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

    let delArr = imgDelSeqStr;
    if (delArr == '') {
      delArr = isDelImgData.img_seq;
    } else {
      delArr = ',' + isDelImgData.img_seq;
    }
    setImgDelSeqStr(delArr);
    imgDel_onClose();
  };

  // ############################################################################# 프로필 이미지 정보 조회
  const getProfileImage = async() => {
    const body = {
      member_seq: props.route.params.memberSeq
    };
    try {
      const { success, data } = await get_profile_imgage_guide(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            if (null != data.imgList) {
              let imgData: any = {
                orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
                orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
                orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
                orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
                orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
              };
    
              data?.imgList?.map(
                ({
                  member_img_seq,
                  img_file_path,
                  order_seq,
                }: {
                  member_img_seq: any;
                  img_file_path: any;
                  order_seq: any;
                }) => {
                  let data = {
                    member_img_seq: member_img_seq,
                    url: findSourcePath(img_file_path),
                    delYn: 'N',
                  };
                  if (order_seq == 1) { imgData.orgImgUrl01 = data; }
                  if (order_seq == 2) { imgData.orgImgUrl02 = data; }
                  if (order_seq == 3) { imgData.orgImgUrl03 = data; }
                  if (order_seq == 4) { imgData.orgImgUrl04 = data; }
                  if (order_seq == 5) { imgData.orgImgUrl05 = data; }
                }
              );
    
              setImgData({ ...imgData, imgData });
            }

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

  // ############################################################################# 프로필 이미지 저장
  const saveProfileImage = async() => {
    let tmpCnt = 0;
    for (var key in imgData) {
      if (imgData[key].delYn == 'N' && (imgData[key].url || imgData[key].uri)) {
        tmpCnt++;
      }
    }
    for(var key in profileImageList) {
      tmpCnt++;
    }

    if (tmpCnt < 3) {
      show({ content: '프로필 사진은 최소 3장 등록해주세요.' });
      return;
    }

    const body = {
      member_seq: props.route.params.memberSeq
      , file_list: profileImageList
      , img_del_seq_str: imgDelSeqStr
    };
    try {
      const { success, data } = await regist_profile_image(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            navigation.navigate(ROUTES.SIGNUP03, {
              memberSeq: props.route.params.memberSeq,
              gender: props.route.params.gender,
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

   // ############################################################################# 최초 실행
   React.useEffect(() => {
    setProfileImageList([]);
    setImgDelSeqStr('');
    getProfileImage();
  }, [isFocus]);

  return (
    <>
      <CommonHeader title={'근사한 프로필 만들기'} />
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
        <SpaceView mb={24}>
          <CommonText fontWeight={'500'}>
            다양한 분위기의 내 모습이 담긴 사진을{'\n'}
            등록해보세요.
          </CommonText>
        </SpaceView>

        <SpaceView mb={48} viewStyle={styles.halfContainer}>
          <View style={styles.halfItemLeft}>
            {imgData.orgImgUrl01.url != '' &&
            imgData.orgImgUrl01.delYn == 'N' ? (
              <TouchableOpacity
                onPress={() => {
                  imgDel_onOpen(imgData.orgImgUrl01.member_img_seq, 1);
                }}
              >
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  style={styles.tempBoxBig}
                  key={imgData.orgImgUrl01.url}
                  source={imgData.orgImgUrl01.url}
                />
              </TouchableOpacity>
            ) : (
              <ImagePicker
                isBig={true}
                callbackFn={fileCallBack1}
                uriParam={''}
              />
            )}

            {/* <ImagePicker isBig={true} callbackFn={fileCallBack1} uriParam={orgImgUrl01} /> */}
          </View>

          <View style={styles.halfItemRight}>
            <SpaceView mb={16} viewStyle={layoutStyle.row}>
              <SpaceView mr={8}>
                {imgData.orgImgUrl02.url != '' &&
                imgData.orgImgUrl02.delYn == 'N' ? (
                  <TouchableOpacity
                    onPress={() => {
                      imgDel_onOpen(imgData.orgImgUrl02.member_img_seq, 2);
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={styles.tempBoxSmall}
                      key={imgData.orgImgUrl02.url}
                      source={imgData.orgImgUrl02.url}
                    />
                  </TouchableOpacity>
                ) : (
                  <ImagePicker
                    isBig={false}
                    callbackFn={fileCallBack2}
                    uriParam={''}
                  />
                )}
              </SpaceView>
              <SpaceView ml={8}>
                {imgData.orgImgUrl03.url != '' &&
                imgData.orgImgUrl03.delYn == 'N' ? (
                  <TouchableOpacity
                    onPress={() => {
                      imgDel_onOpen(imgData.orgImgUrl03.member_img_seq, 3);
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={styles.tempBoxSmall}
                      key={imgData.orgImgUrl03.url}
                      source={imgData.orgImgUrl03.url}
                    />
                  </TouchableOpacity>
                ) : (
                  <ImagePicker
                    isBig={false}
                    callbackFn={fileCallBack3}
                    uriParam={''}
                  />
                )}
              </SpaceView>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.row}>
              <SpaceView mr={8}>
                {imgData.orgImgUrl04.url != '' &&
                imgData.orgImgUrl04.delYn == 'N' ? (
                  <TouchableOpacity
                    onPress={() => {
                      imgDel_onOpen(imgData.orgImgUrl04.member_img_seq, 4);
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={styles.tempBoxSmall}
                      key={imgData.orgImgUrl04.url}
                      source={imgData.orgImgUrl04.url}
                    />
                  </TouchableOpacity>
                ) : (
                  <ImagePicker
                    isBig={false}
                    callbackFn={fileCallBack4}
                    uriParam={''}
                  />
                )}
              </SpaceView>
              <SpaceView ml={8}>
                {imgData.orgImgUrl05.url != '' &&
                imgData.orgImgUrl05.delYn == 'N' ? (
                  <TouchableOpacity
                    onPress={() => {
                      imgDel_onOpen(imgData.orgImgUrl05.member_img_seq, 5);
                    }}
                  >
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      style={styles.tempBoxSmall}
                      key={imgData.orgImgUrl05.url}
                      source={imgData.orgImgUrl05.url}
                    />
                  </TouchableOpacity>
                ) : (
                  <ImagePicker
                    isBig={false}
                    callbackFn={fileCallBack5}
                    uriParam={''}
                  />
                )}
              </SpaceView>
            </SpaceView>
          </View>
        </SpaceView>

        <SpaceView mb={24}>
          <SpaceView mb={8}>
            <CommonText fontWeight={'500'}>
              어떤 사진을 올려야 할까요?
            </CommonText>
          </SpaceView>
          <CommonText color={ColorType.gray6666}>
            얼굴이 선명히 나오는 사진은 최소 1장 필수에요.{'\n'}
            멋진 무드 속에 담긴 모습이 좋아요.
          </CommonText>
        </SpaceView>

        <SpaceView mb={40}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {props.route.params.gender == 'M' ? (
              <>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp1}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp2}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp3}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp4}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp5}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.manTmp6}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
              </>
            ) : (
              <>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp1}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp2}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp3}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp4}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp5}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp6}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
                <SpaceView mr={16}>
                  <View style={styles.tempBoxMiddle}>
                    <Image
                      source={PROFILE_IMAGE.womanTmp7}
                      style={styles.profileTmpImg}
                    />
                  </View>
                </SpaceView>
              </>
            )}
          </ScrollView>
        </SpaceView>

        <SpaceView mb={24}>
          <CommonBtn
            value={'다음 (3/4)'}
            type={'primary'}
            onPress={() => {
              saveProfileImage();
            }}
          />
        </SpaceView>
      </ScrollView>

      {/* ###############################################
			사진 삭제 팝업
			############################################### */}
      <Modalize
        ref={imgDel_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            프로필 사진 삭제
          </CommonText>
          <TouchableOpacity onPress={imgDel_onClose}>
            <Image source={ICON.xBtn} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>

        <View
          style={[modalStyle.modalBody, layoutStyle.flex1, layoutStyle.mb20]}
        >
          <View>
            <CommonBtn
              value={'사진 삭제'}
              type={'primary'}
              onPress={imgDelProc}
            />
            <CommonBtn
              value={'취소'}
              type={'primary'}
              onPress={imgDel_onClose}
            />
          </View>
        </View>
      </Modalize>
    </>
  );
};
