import { Slider } from '@miblanchard/react-native-slider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
<<<<<<< HEAD
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import {
  commonStyle,
  layoutStyle,
  modalStyle,
  styles,
} from 'assets/styles/Styles';
import { ToolTip } from 'component/Tooltip';
=======
import { StackParamList } from '@types';
import { get_member_face_rank } from 'api/models';
import { Color } from 'assets/styles/Color';
>>>>>>> origin/dev
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import Interview from 'component/Interview';
import ProfileAuth from 'component/ProfileAuth';
import { usePopup } from 'Context';
import { useProfileImg } from 'hooks/useProfileImg';
import { useSecondAth } from 'hooks/useSecondAth';
import React, { useEffect, useMemo, useState } from 'react';
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
  const secondAuth = useSecondAth();
  console.log(secondAuth);
  const myImages = useProfileImg();
  const [images, setImages] = useState([]);

  useEffect(() => {
    init();
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
  };
  // ############################################################  프로필 랭크 순위 조회
  const getMemberFaceRank = async () => {
    try {
      const { success, data } = await get_member_face_rank();
<<<<<<< HEAD
      if(success) {
        console.log('data.face_rank_list :: ' , data.face_rank_list);

=======
      if (success) {
<<<<<<< HEAD
>>>>>>> 05537fd245d9b56cd16bb5d5d2d98dcf017a029b
        switch (data.result_code) {
          case SUCCESS:
            setProfileFaceRankList(data.face_rank_list);
            break;
          default:
            show({
              content: '오류입니다. 관리자에게 문의해주세요.',
              confirmCallback: function () {},
            });
            break;
        }
=======
>>>>>>> origin/dev
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

  return (
    <>
<<<<<<< HEAD
      <CommonHeader title={'프로필 관리'} />

      <ScrollView contentContainerStyle={styles.hasFloatingBtnContainer}>
        <SpaceView viewStyle={styles.container}>
          {/* ####################################################################################
					####################### 프로필 이미지 영역
					#################################################################################### */}
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

              {imgData.orgImgUrl01.url != '' &&
              imgData.orgImgUrl01.status == 'PROGRESS' ? (
                <View style={styles.disabled}>
                  <CommonText
                    fontWeight={'700'}
                    type={'h4'}
                    color={ColorType.gray8888}
                    textStyle={[
                      layoutStyle.textRight,
                      commonStyle.mt10,
                      commonStyle.mr10,
                    ]}
                  >
                    심사중
                  </CommonText>
                </View>
              ) : null}
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

                  {imgData.orgImgUrl02.url != '' &&
                  imgData.orgImgUrl02.status == 'PROGRESS' ? (
                    <View style={styles.disabled}>
                      <CommonText
                        fontWeight={'700'}
                        type={'h4'}
                        color={ColorType.gray8888}
                        textStyle={[
                          layoutStyle.textRight,
                          commonStyle.mr10,
                          commonStyle.fontSize10,
                        ]}
                      >
                        심사중
                      </CommonText>
                    </View>
                  ) : null}
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

                  {imgData.orgImgUrl03.url != '' &&
                  imgData.orgImgUrl03.status == 'PROGRESS' ? (
                    <View style={styles.disabled}>
                      <CommonText
                        fontWeight={'700'}
                        type={'h4'}
                        color={ColorType.gray8888}
                        textStyle={[
                          layoutStyle.textRight,
                          commonStyle.mr10,
                          commonStyle.fontSize10,
                        ]}
                      >
                        심사중
                      </CommonText>
                    </View>
                  ) : null}
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

                  {imgData.orgImgUrl04.url != '' &&
                  imgData.orgImgUrl04.status == 'PROGRESS' ? (
                    <View style={styles.disabled}>
                      <CommonText
                        fontWeight={'700'}
                        type={'h4'}
                        color={ColorType.gray8888}
                        textStyle={[
                          layoutStyle.textRight,
                          commonStyle.mr10,
                          commonStyle.fontSize10,
                        ]}
                      >
                        심사중
                      </CommonText>
                    </View>
                  ) : null}
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

                  {imgData.orgImgUrl05.url != '' &&
                  imgData.orgImgUrl05.status == 'PROGRESS' ? (
                    <View style={styles.disabled}>
                      <CommonText
                        fontWeight={'700'}
                        type={'h4'}
                        color={ColorType.gray8888}
                        textStyle={[
                          layoutStyle.textRight,
                          commonStyle.mr10,
                          commonStyle.fontSize10,
                        ]}
                      >
                        심사중
                      </CommonText>
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
                    <CommonText
                      color={ColorType.black2222}
                      textStyle={[layoutStyle.textCenter]}
                    >
                      내 인상 투표 결과
                    </CommonText>
                  </SpaceView>

                  <SpaceView viewStyle={styles.container}>
<<<<<<< HEAD

                    {profileFaceRankList.map((item : any, index) => (
                      <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
                        <View style={[layoutStyle.rowBetween]}>
                          <View style={[styles.statusBtn, commonStyle.mr8]}>
                            <CommonText type={'h6'} color={ColorType.white}>{index+1}위</CommonText>
=======
                    {profileFaceRankList.map((item: any) => (
                      <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
                        <View style={[layoutStyle.rowBetween]}>
                          <View style={[styles.statusBtn, commonStyle.mr8]}>
                            <CommonText type={'h6'} color={ColorType.white}>
                              ICON
                            </CommonText>
>>>>>>> 05537fd245d9b56cd16bb5d5d2d98dcf017a029b
                          </View>
                          <CommonText
                            type={'h6'}
                            textStyle={commonStyle.fontSize13}
                          >
                            {item.face_code_name}
                          </CommonText>
                        </View>
                        <View style={[layoutStyle.rowBetween]}>
                          <CommonText
                            type={'h6'}
                            textStyle={commonStyle.fontSize13}
                            color={ColorType.gray6666}
                          >
                            {item.percent}%
                          </CommonText>
                        </View>
                      </SpaceView>
                    ))}
<<<<<<< HEAD
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
=======
                  </SpaceView>
                </>
              ) : null}

              <SpaceView viewStyle={layoutStyle.rowBetween} mt={30} mb={29}>
                <BarGrap score={memberBase?.profile_score} />
              </SpaceView>
>>>>>>> 05537fd245d9b56cd16bb5d5d2d98dcf017a029b
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
          <Interview
            callbackAnswerFn={callbackInterviewAnswer}
            callbackOnDelFn={callbackInterviewDel}
          />
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
=======
      <CommonHeader
        title="프로필 관리"
        right={
          <TouchableOpacity>
            <Text style={styles.saveText}>저장</Text>
>>>>>>> origin/dev
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ backgroundColor: 'white', flexGrow: 1 }}>
        <View style={styles.wrapper}>
          {images?.map((e) => (
            <ProfileImage item={e} onDelete={deleteImage} onAdd={addImage} />
          ))}
        </View>
        <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
          <ProfileAuth data={secondAuth} />
          <Text style={styles.title}>내 인상 투표 결과</Text>
          <View style={styles.impressionContainer}>
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.fashion} style={styles.icon} />
                <Text style={styles.contentsText}>패션감각이 좋아 보여요</Text>
              </View>
              <View style={styles.fashionPercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.fond} style={styles.icon} />
                <Text style={styles.contentsText}>다정해 보여요</Text>
              </View>
              <View style={styles.fontPercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.itemRow}>
              <View style={styles.subRow}>
                <Image source={ICON.smile} style={styles.icon} />
                <Text style={styles.contentsText}>웃는 모습이 이뻐요</Text>
              </View>
              <View style={styles.smilePercent}>
                <Text style={styles.percentText}>59%</Text>
              </View>
            </View>
            <DashSpacer />
            <View style={styles.myImpressionContainer}>
              <Text style={styles.title}>내 평점은?</Text>
              <Slider
                value={7.5 / 10}
                animateTransitions={true}
                renderThumbComponent={() => null}
                maximumTrackTintColor={'#e3e3e3'}
                minimumTrackTintColor={'#8854d2'}
                containerStyle={styles.sliderContainerStyle}
                trackStyle={styles.trackStyle}
                trackClickable={false}
              />
            </View>
          </View>
          <View style={{ height: 30 }} />

          <Interview
            title={`방배동 아이유님을
알려주세요!`}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
  itemRow: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  fashionPercent: {
    height: 27,
    borderRadius: 13.5,
    backgroundColor: '#7986ee',
    paddingHorizontal: 10,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
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
    color: '#ffffff',
  },
  myImpressionContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  sliderContainerStyle: {
    width: '100%',
    height: 27,
    marginTop: 10,
    borderRadius: 13,
  },
  trackStyle: {
    width: '100%',
    height: 27,
    borderRadius: 13,
  },
});

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
    borderRadius: 10,
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
