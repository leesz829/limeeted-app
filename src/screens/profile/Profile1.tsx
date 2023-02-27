import {
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import {
  commonStyle,
  layoutStyle,
  modalStyle,
  styles,
} from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import * as properties from 'utils/properties';
//import AsyncStorage from '@react-native-community/async-storage';
import { STACK } from 'constants/routes';
import * as hooksMember from 'hooks/member';
import { useUserInfo } from 'hooks/useUserInfo';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import { useInterView } from 'hooks/useInterView';
import { Modalize } from 'react-native-modalize';
import { useDispatch } from 'react-redux';
import * as mbrReducer from 'redux/reducers/mbrReducer';
import Interview from 'component/Interview';
import { update_profile_image } from 'api/models';
import { usePopup } from 'Context';
import { myProfile } from 'redux/reducers/authReducer';
import { setPartialPrincipal } from 'redux/reducers/authReducer';



/* ################################################################################################################
###################################################################################################################
###### 프로필 관리
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile1'>;
  route: RouteProp<StackParamList, 'Profile1'>;
}

export const Profile1 = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const { show } = usePopup();  // 공통 팝업
  const jwtToken = hooksMember.getJwtToken(); // 토큰

  const memberBase = useUserInfo();           // 회원 기본정보
  const mbrProfileImgList = useProfileImg();  // 회원 프로필 사진 정보
  const mbrSecondAuthList = useSecondAth();   // 회원 2차 인증 정보
  const mbrInterviewList = useInterView();    // 회원 인터뷰 정보

  // 프로필 사진
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl02: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl03: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl04: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl05: { memer_img_seq: '', url: '', delYn: '', status: '' },
    imgFile01: { uri: '', name: '', type: '' },
    imgFile02: { uri: '', name: '', type: '' },
    imgFile03: { uri: '', name: '', type: '' },
    imgFile04: { uri: '', name: '', type: '' },
    imgFile05: { uri: '', name: '', type: '' },
  });

  // 프로필 이미지 삭제 시퀀스 문자열
  const [imgDelSeqStr, setImgDelSeqStr] = React.useState('');

  // 프로필 2차 인증 여부
  const [isJob, setIsJob] = React.useState<any>(false);
  const [isEdu, setIsEdu] = React.useState<any>(false);
  const [isIncome, setIsIncome] = React.useState<any>(false);
  const [isAsset, setIsAsset] = React.useState<any>(false);
  const [isSns, setIsSns] = React.useState<any>(false);
  const [isVehicle, setIsVehicle] = React.useState<any>(false);

  // 인터뷰 목록
  const [interviewList, setInterviewList] = React.useState<any>(mbrInterviewList);

  // ################################################################ 회원 프로필 사진 파일 콜백 함수
  const fileCallBack1 = (
    uri: string,
    fileName: string,
    fileSize: number,
    type: string
  ) => {
    if (uri != null && uri != '') {
      setImgData({
        ...imgData,
        imgFile01: { uri: uri, name: fileName, type: type },
      });
    }
  };
  const fileCallBack2 = (
    uri: string,
    fileName: string,
    fileSize: number,
    type: string
  ) => {
    if (uri != null && uri != '') {
      setImgData({
        ...imgData,
        imgFile02: { uri: uri, name: fileName, type: type },
      });
    }
  };
  const fileCallBack3 = (
    uri: string,
    fileName: string,
    fileSize: number,
    type: string
  ) => {
    if (uri != null && uri != '') {
      setImgData({
        ...imgData,
        imgFile03: { uri: uri, name: fileName, type: type },
      });
    }
  };
  const fileCallBack4 = (
    uri: string,
    fileName: string,
    fileSize: number,
    type: string
  ) => {
    if (uri != null && uri != '') {
      setImgData({
        ...imgData,
        imgFile04: { uri: uri, name: fileName, type: type },
      });
    }
  };
  const fileCallBack5 = (
    uri: string,
    fileName: string,
    fileSize: number,
    type: string
  ) => {
    if (uri != null && uri != '') {
      setImgData({
        ...imgData,
        imgFile05: { uri: uri, name: fileName, type: type },
      });
    }
  };

  // ############################################################ 사진삭제 컨트롤 변수
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
  });

  /*
   * ############################################################ 최초 실행
   */
  React.useEffect(() => {
    if (mbrProfileImgList != null) {
      let imgData: any = {
        orgImgUrl01: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl02: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl03: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl04: { memer_img_seq: '', url: '', delYn: '' },
        orgImgUrl05: { memer_img_seq: '', url: '', delYn: '' },
        imgFile01: { uri: '', name: '', type: '' },
        imgFile02: { uri: '', name: '', type: '' },
        imgFile03: { uri: '', name: '', type: '' },
        imgFile04: { uri: '', name: '', type: '' },
        imgFile05: { uri: '', name: '', type: '' },
      };

      mbrProfileImgList.map(
        ({
          member_img_seq,
          img_file_path,
          order_seq,
          status,
        }: {
          member_img_seq: any;
          img_file_path: any;
          order_seq: any;
          status: any;
        }) => {
          let data = {
            member_img_seq: member_img_seq,
            url: findSourcePath(img_file_path),
            delYn: 'N',
            status: status,
          };
          if (order_seq == 1) {
            console.log('data :::!!!: ' ,data);
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
        }
      );

      setImgData({ ...imgData, imgData });
    }

    if (mbrSecondAuthList != null) {
      mbrSecondAuthList.map(
        ({
          second_auth_code,
          auth_status,
        }: {
          second_auth_code: any;
          status: any;
        }) => {
          if (second_auth_code == 'JOB' && auth_status == 'ACCEPT') {
            setIsJob(true);
          }
          if (second_auth_code == 'EDU' && auth_status == 'ACCEPT') {
            setIsEdu(true);
          }
          if (second_auth_code == 'INCOME' && auth_status == 'ACCEPT') {
            setIsIncome(true);
          }
          if (second_auth_code == 'ASSET' && auth_status == 'ACCEPT') {
            setIsAsset(true);
          }
          if (second_auth_code == 'SNS' && auth_status == 'ACCEPT') {
            setIsSns(true);
          }
          if (second_auth_code == 'VEHICLE' && auth_status == 'ACCEPT') {
            setIsVehicle(true);
          }
        }
      );
    }
  }, [isFocus]);

  // ############################################################  프로필 관리 저장
  const saveMemberProfile = async () => {

    // ##### Validation 체크
    let imgChk = 0;
    if (imgData.orgImgUrl01.delYn == 'N' || imgData.imgFile01.uri != '') { imgChk++; }
    if (imgData.orgImgUrl02.delYn == 'N' || imgData.imgFile02.uri != '') { imgChk++; }
    if (imgData.orgImgUrl03.delYn == 'N' || imgData.imgFile03.uri != '') { imgChk++; }
    if (imgData.orgImgUrl04.delYn == 'N' || imgData.imgFile04.uri != '') { imgChk++; }
    if (imgData.orgImgUrl05.delYn == 'N' || imgData.imgFile05.uri != '') { imgChk++; }

    if (imgChk <= 2) {
      Alert.alert('알림', '최소 3개의 프로필 사진을 등록해야 합니다.', [
        { text: '확인' },
      ]);
      return false;
    }

    const body = new FormData();
    if (imgData.imgFile01.uri != '') { body.append('img_file01', imgData.imgFile01); }
    if (imgData.imgFile02.uri != '') { body.append('img_file02', imgData.imgFile02); }
    if (imgData.imgFile03.uri != '') { body.append('img_file03', imgData.imgFile03); }
    if (imgData.imgFile04.uri != '') { body.append('img_file04', imgData.imgFile04); }
    if (imgData.imgFile05.uri != '') { body.append('img_file05', imgData.imgFile05); }
    body.append('img_del_seq_str', imgDelSeqStr);
    body.append('interview_list_str', JSON.stringify(interviewList));

    console.log('body :::: ' , body);

    try {
      const { success, data } = await update_profile_image(body);
      console.log('data :::: ' , data);
      if(success) {
        if(data.result_code == '0000') {

          console.log('data.mbr_img_list :::: ' , data.mbr_img_list);

          dispatch(setPartialPrincipal({
            mbr_base : data.mbr_base
            , mbr_img_list : data.mbr_img_list
            , mbr_interview_list : data.mbr_interview_list
          }));

          /* dispatch(mbrReducer.setBase(JSON.stringify(res.memberBase)));
          dispatch(mbrReducer.setProfileImg(JSON.stringify(res.memberImgList)));
          dispatch(
            mbrReducer.setInterview(JSON.stringify(res.memberInterviewList))
          ); */

          show({
            content: '저장되었습니다.' ,
            confirmCallback: function() {
              navigation.navigate(STACK.TAB, {
                screen: 'Roby',
              });
            }
          });
          
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }


    


/* 
    data.append('memberSeq', memberBase.member_seq);
    //data.append("data", new Blob([JSON.stringify(interviewList[0])], {type: "application/json"}));

    const result = await fetch(
      properties.api_domain + '/member/saveProfileImage/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'jwt-token': await AsyncStorage.getItem(storeKey.JWT_TOKEN),
        },
        body: data,
      }
    )
    .then((res) => res.json())
    .then((res) => {
      if (res.result_code == '0000') {
        dispatch(mbrReducer.setBase(JSON.stringify(res.memberBase)));
        dispatch(mbrReducer.setProfileImg(JSON.stringify(res.memberImgList)));
        dispatch(
          mbrReducer.setInterview(JSON.stringify(res.memberInterviewList))
        );
        navigation.navigate(STACK.TAB, {
          screen: 'Roby',
        });
      }
    })
    .catch((error) => {
      console.log('error', error);
    });

     */
      
  };

  // ############################################################ 사진 삭제 팝업
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

  // ############################################################ 사진 삭제
  const imgDelProc = () => {
    if (isDelImgData.order_seq == '1') {
      setImgData({
        ...imgData,
        orgImgUrl01: {
          member_img_seq: imgData.orgImgUrl01.member_img_seq,
          url: imgData.orgImgUrl01.url,
          delYn: 'Y',
        },
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

  return (
    <>
      <CommonHeader title={'프로필 관리'} />
      <ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
        <SpaceView viewStyle={styles.container}>

          {/* ####################################################################################
					####################### 프로필 이미지 영역
					#################################################################################### */}
          <SpaceView mb={48} viewStyle={styles.halfContainer}>

            <View style={styles.halfItemLeft}>
              {imgData.orgImgUrl01.url != '' && imgData.orgImgUrl01.delYn == 'N' ? (
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
								<ImagePicker isBig={true} callbackFn={fileCallBack1} uriParam={''} />
							)}

							{imgData.orgImgUrl01.url != '' && imgData.orgImgUrl01.status == 'PROGRESS' ? (
								<View style={styles.disabled}>
									<CommonText fontWeight={'700'} type={'h4'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mt10, commonStyle.mr10]}>심사중</CommonText>
								</View>
							) : null}
            </View>

            <View style={styles.halfItemRight}>
              <SpaceView mb={16} viewStyle={layoutStyle.row}>
                <SpaceView mr={8}>

                  {imgData.orgImgUrl02.url != '' && imgData.orgImgUrl02.delYn == 'N' ? (
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
										<ImagePicker isBig={false} callbackFn={fileCallBack2} uriParam={''} />
									)}

									{imgData.orgImgUrl02.url != '' && imgData.orgImgUrl02.status == 'PROGRESS' ? (
										<View style={styles.disabled}>
											<CommonText fontWeight={'700'} type={'h4'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mr10, commonStyle.fontSize10]}>심사중</CommonText>
										</View>
									) : null}
                </SpaceView>

                <SpaceView ml={8}>
                  {imgData.orgImgUrl03.url != '' && imgData.orgImgUrl03.delYn == 'N' ? (
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
										<ImagePicker isBig={false} callbackFn={fileCallBack3} uriParam={''} />
									)}

									{imgData.orgImgUrl03.url != '' && imgData.orgImgUrl03.status == 'PROGRESS' ? (
										<View style={styles.disabled}>
											<CommonText fontWeight={'700'} type={'h4'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mr10, commonStyle.fontSize10]}>심사중</CommonText>
										</View>
									) : null}
                </SpaceView>
              </SpaceView>

              <SpaceView viewStyle={layoutStyle.row}>
                <SpaceView mr={8}>
                  {imgData.orgImgUrl04.url != '' && imgData.orgImgUrl04.delYn == 'N' ? (
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
										<ImagePicker isBig={false} callbackFn={fileCallBack4} uriParam={''} />
									)}

									{imgData.orgImgUrl04.url != '' && imgData.orgImgUrl04.status == 'PROGRESS' ? (
										<View style={styles.disabled}>
											<CommonText fontWeight={'700'} type={'h4'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mr10, commonStyle.fontSize10]}>심사중</CommonText>
										</View>
									) : null}
                </SpaceView>

                <SpaceView ml={8}>
                  {imgData.orgImgUrl05.url != '' && imgData.orgImgUrl05.delYn == 'N' ? (
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
										<ImagePicker isBig={false} callbackFn={fileCallBack5} uriParam={''} />
									)}

									{imgData.orgImgUrl05.url != '' && imgData.orgImgUrl05.status == 'PROGRESS' ? (
										<View style={styles.disabled}>
											<CommonText fontWeight={'700'} type={'h4'} color={ColorType.gray8888} textStyle={[layoutStyle.textRight, commonStyle.mr10, commonStyle.fontSize10]}>심사중</CommonText>
										</View>
									) : null}
                </SpaceView>
              </SpaceView>
            </View>
          </SpaceView>

          {/* ####################################################################################
					####################### 프로필 2차 인증 영역
					#################################################################################### */}
          <SpaceView mb={54}>
            <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
              <View>
                <TouchableOpacity
                  style={[layoutStyle.row, layoutStyle.alignCenter]}
                  onPress={() => {
                    navigation.navigate('SecondAuth');
                  }}
                >
                  <CommonText type={'h3'} fontWeight={'700'}>
                    프로필 2차 인증
                  </CommonText>
                  <Image source={ICON.arrRight} style={styles.iconSize} />
                </TouchableOpacity>
              </View>

              {memberBase?.auth_acct_cnt > 0 ? (
                <>
                  <View style={[layoutStyle.rowBetween]}>
                    <View style={styles.statusBtn}>
                      <CommonText type={'h6'} color={ColorType.white}>
                        LV.{memberBase?.auth_acct_cnt}
                      </CommonText>
                    </View>
                    <Image source={ICON.medalAll} style={styles.iconSize32} />
                  </View>
                </>
              ) : null}
            </SpaceView>
            
            <SpaceView mb={48}>
              <SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
                <View style={styles.profileBox}>
                  <Image source={ICON.job} style={styles.iconSize48} />
                  <CommonText type={'h5'}>직업</CommonText>
                  {!isJob ? <View style={styles.disabled} /> : null}
                </View>

                <View style={styles.profileBox}>
                  <Image source={ICON.degree} style={styles.iconSize48} />
                  <CommonText type={'h5'}>학위</CommonText>
                  {!isEdu ? <View style={styles.disabled} /> : null}
                </View>

                <View style={styles.profileBox}>
                  <Image source={ICON.income} style={styles.iconSize48} />
                  <CommonText type={'h5'}>소득</CommonText>
                  {!isIncome ? <View style={styles.disabled} /> : null}
                </View>
              </SpaceView>

              <View style={[layoutStyle.rowBetween]}>
                <View style={styles.profileBox}>
                  <Image source={ICON.asset} style={styles.iconSize48} />
                  <CommonText type={'h5'}>자산</CommonText>
                  {!isAsset ? <View style={styles.disabled} /> : null}
                </View>

                <View style={styles.profileBox}>
                  <Image source={ICON.sns} style={styles.iconSize48} />
                  <CommonText type={'h5'}>SNS</CommonText>
                  {!isSns ? <View style={styles.disabled} /> : null}
                </View>

                <View style={styles.profileBox}>
                  <Image source={ICON.vehicle} style={styles.iconSize48} />
                  <CommonText type={'h5'}>차량</CommonText>
                  {!isVehicle ? <View style={styles.disabled} /> : null}
                </View>
              </View>
            </SpaceView>
          </SpaceView>

          {/* ####################################################################################
					####################### 인터뷰 영역
					#################################################################################### */}
          <Interview />
        </SpaceView>

        <View style={styles.bottomBtnContainer}>
          <CommonBtn
            value={'저장'}
            type={'primary'}
            onPress={() => {
              saveMemberProfile();
            }}
          />
        </View>
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
