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
import { ToolTip } from 'component/Tooltip';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonText } from 'component/CommonText';
import { ImagePicker } from 'component/ImagePicker';
import SpaceView from 'component/SpaceView';
import React, { useRef } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { STACK } from 'constants/routes';
import * as hooksMember from 'hooks/member';
import { useUserInfo } from 'hooks/useUserInfo';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import { useInterView } from 'hooks/useInterView';
import { Modalize } from 'react-native-modalize';
import { useDispatch } from 'react-redux';
import Interview from 'component/Interview';
import { update_profile, get_member_face_rank } from 'api/models';
import { usePopup } from 'Context';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { BarGrap } from 'component/BarGrap';
import { Color } from 'assets/styles/Color';


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

  // 프로필 사진
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl02: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl03: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl04: { memer_img_seq: '', url: '', delYn: '', status: '' },
    orgImgUrl05: { memer_img_seq: '', url: '', delYn: '', status: '' },
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

  // 적용할 인터뷰 목록
  const [applyInterviewList, setApplyInterviewList] = React.useState<any>([]);

  // 프로필 이미지 목록
  const [profileImageList, setProfileImageList] = React.useState([]);

  // 프로필 인상 순위 목록
  const [profileFaceRankList, setProfileFaceRankList] = React.useState([]);

  // 저장, 선택삭제 버튼 노출 구분
  const [isSaveBtn, setIsSaveBtn] = React.useState(true);


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

  // ############################################################ 사진삭제 컨트롤 변수
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
  });

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

  // ############################################################  인터뷰 삭제, 종료 버튼 클릭 Callback 함수
  const callbackInterviewDel = async (isDel: boolean) => {
    if(isDel) {
      setIsSaveBtn(false);
    } else {
      setIsSaveBtn(true);
    }
  }


  // ############################################################  프로필 관리 저장
  const saveMemberProfile = async () => {
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
      file_list: profileImageList
      , img_del_seq_str: imgDelSeqStr
      , interview_list: applyInterviewList
    };
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
              content: '저장되었습니다.' ,
              confirmCallback: function() {
                navigation.navigate(STACK.TAB, {
                  screen: 'Roby',
                });
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
      
    }
      
  };

  // ############################################################  프로필 랭크 순위 조회
  const getMemberFaceRank = async () => {
    try {
      const { success, data } = await get_member_face_rank();
      if(success) {
        console.log('data.face_rank_list :: ' , data.face_rank_list);

        switch (data.result_code) {
          case SUCCESS:
            setProfileFaceRankList(data.face_rank_list);
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

  // ############################################################################# 최초 실행
  React.useEffect(() => {
    getMemberFaceRank();
    setProfileImageList([]);
    
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
  }, [isFocus]);

  

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
					####################### 내 프로필 평점 영역
					#################################################################################### */}
          <SpaceView mb={54}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h3'}>
                내 프로필 평점
              </CommonText>
            </SpaceView>

            <View style={[_styles.profileContainer]}>

              {profileFaceRankList.length > 0 ? (
                <>
                  <SpaceView viewStyle={layoutStyle.alignStart} mb={10}>
                    <CommonText color={ColorType.black2222} textStyle={[layoutStyle.textCenter]}>
                      내 인상 투표 결과
                    </CommonText>
                  </SpaceView>

                  <SpaceView viewStyle={styles.container}>

                    {profileFaceRankList.map((item : any, index) => (
                      <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
                        <View style={[layoutStyle.rowBetween]}>
                          <View style={[styles.statusBtn, commonStyle.mr8]}>
                            <CommonText type={'h6'} color={ColorType.white}>{index+1}위</CommonText>
                          </View>
                          <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>{item.face_code_name}</CommonText>
                        </View>
                        <View style={[layoutStyle.rowBetween]}>
                          <CommonText type={'h6'} textStyle={commonStyle.fontSize13} color={ColorType.gray6666}>{item.percent}%</CommonText>
                        </View>
                      </SpaceView>
                    ))}
                  </SpaceView> 
                </>
              ) : null}

              <SpaceView viewStyle={layoutStyle.rowBetween} mb={29} mt={20}>
                <ToolTip
                  title={'프로필 평점'}
                  desc={
                    '다른 회원들이 바라보는\n내 프로필 사진의 인기 지수'
                  }
                />

                <View>
                  <CommonText fontWeight={'700'} type={'h2'}>
                    {memberBase?.profile_score}
                  </CommonText>
                </View>
              </SpaceView>
              <BarGrap score={memberBase?.profile_score} />
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
          <Interview callbackAnswerFn={callbackInterviewAnswer} callbackOnDelFn={callbackInterviewDel} />

        </SpaceView>

        <View style={styles.bottomBtnContainer}>
          {isSaveBtn ? (
            <CommonBtn
              value={'저장'}
              type={'primary'}
              onPress={() => {
                saveMemberProfile();
              }}
            />
          ) : null}          
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





const _styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: Color.grayF8F8,
    borderRadius: 16,
    padding: 24,
    marginRight: 0,
    paddingBottom: 30,
  },

});