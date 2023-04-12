import {
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BottomParamList,
  ColorType,
  CommonCode,
  Interview,
  MemberBaseData,
  ProfileImg,
  ScreenNavigationProp,
} from '@types';
import {
  get_daily_matched_info,
  regist_match_status,
  report_matched_user,
} from 'api/models';
import { Color } from 'assets/styles/Color';

import { BarGrap } from 'component/BarGrap';
import { CommonBtn } from 'component/CommonBtn';
import { CommonCheckBox } from 'component/CommonCheckBox';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ToolTip } from 'component/Tooltip';
import TopNavigation from 'component/TopNavigation';
import { ViualSlider } from 'component/ViualSlider';
import { usePopup } from 'Context';
import * as hooksMember from 'hooks/member';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { NotificationActionResponse } from 'react-native-notifications/lib/dist/interfaces/NotificationActionResponse';
import { SimpleGrid } from 'react-native-super-grid';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { MatchSearch } from 'screens/matching/MatchSearch';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<BottomParamList, 'Roby'>;
  route: RouteProp<BottomParamList, 'Roby'>;
}

export default function Matching(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const scrollRef = useRef();

<<<<<<< HEAD
  const { show } = usePopup();  // 공통 팝업

  const jwtToken = hooksMember.getJwtToken(); // 토큰
  const memberSeq = hooksMember.getMemberSeq(); // 회원번호

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const [royalPassAmt, setRoyalPassAmt] = useState<any>();
=======
  const { show } = usePopup(); // 공통 팝업
>>>>>>> d5b224ca9fd214d51a6f8636a9455babbe30b903

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    memberBase: {},
    profileImgList: [],
    secondAuthList: [],
    interviewList: [],
    interestList: [],
  });

  // 신고목록
  const [reportTypeList, setReportTypeList] = useState([
    { text: '', value: '' },
  ]);

  // ############################################################ 팝업 관련
  const [interestSendPopup, setInterestSendPopup] = useState(false); // 관심 보내기 팝업
  const [sincereSendPopup, setSincereSendPopup] = useState(false); // 찐심 보내기 팝업
  const [cancelPopup, setCancelPopup] = useState(false); // 찐심 보내기 팝업
  const [reportPopup, setReportPopup] = useState(false); // 찐심 보내기 팝업

  useEffect(() => {
    if (isFocus) {
      // 데일리 매칭 정보 조회
      getDailyMatchInfo();
    }
  }, [isFocus]);

  const getDailyMatchInfo = async () => {
    try {
      const { success, data } = await get_daily_matched_info();
<<<<<<< HEAD
      if(success) {
        if(data.result_code == '0000') {
          
          let tmpProfileImgList = new Array();    // 프로필 이미지 목록
          let tmpSecondAuthList = new Array();    // 2차 인증 목록
          let tmpInterviewList = new Array();     // 인터뷰 목록
          let tmpInterestList = new Array();     // 관심사 목록
          let tmpReportTypeList = [{ text: '', value: '' }];    // 신고사유 유형 목록

          // 회원 프로필 이미지 정보 구성
          data.profile_img_list?.map(
            ({ img_file_path }: { img_file_path: any; }) => {
              const img_path = findSourcePath(img_file_path);
              const dataJson = { url: img_path };
              tmpProfileImgList.push(dataJson);
            }
          );

          // 회원 2차 인증 목록 정보 구성
          data.second_auth_list?.map(
            ({ second_auth_code }: { second_auth_code: any }) => {
              const dataJson = { second_auth_code: second_auth_code };
              tmpSecondAuthList.push(dataJson);
            }
          );

          // 회원 인터뷰 목록 정보 구성
          data.interview_list?.map(
            ({ code_name, answer }: { code_name: any; answer: any }) => {
              const dataJson = { code_name: code_name, answer: answer };
              tmpInterviewList.push(dataJson);
            }
          );

          // 회원 관심사 목록 정보 구성
          data.interest_list?.map(
            ({ interest_seq, common_code, code_name }: { interest_seq: any; common_code: any; code_name: any; }) => {
              const dataJson = { interest_seq: interest_seq, common_code: common_code, code_name: code_name };
              tmpInterestList.push(dataJson);
            }
          );

          setData({
            ...data,
            memberBase: data.match_member_info,
            profileImgList: tmpProfileImgList,
            secondAuthList: tmpSecondAuthList,
            interviewList: tmpInterviewList,
            interestList: tmpInterestList,
          });


          // 신고사유 코드 목록 적용
          let commonCodeList = [CommonCode];
          commonCodeList = data.report_code_list;

          // CommonCode
          commonCodeList.map((commonCode) => {
            tmpReportTypeList.push({
              text: commonCode.code_name,
              value: commonCode.common_code,
            });
          });
          setReportTypeList(tmpReportTypeList.filter((x) => x.text));

          // 잔여 로얄패스 적용
          setRoyalPassAmt(data.safe_royal_pass);

          // Load
          setIsLoad(true);
        
        } else if(data.result_code == '9998') {
          setIsLoad(false);
          setIsEmpty(true);
=======

      if (success) {
        if (data.result_code == '0000') {
          setData(data);
>>>>>>> d5b224ca9fd214d51a6f8636a9455babbe30b903
        } else {
          show({ content: '시스템 오류입니다.\n관리자에게 문의해 주세요!' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const renderAuthInfo = ({ item }: { item: auth }) => (
    <View
      style={
        item?.auth_status === 'ACCEPT'
          ? styles.certificateItemContainerOn
          : styles.certificateItemContainerOff
      }
<<<<<<< HEAD
    } catch (error) {
      console.log(error);
    } finally {
      
    }

  };


  // ############################################################ 팝업 관련
  const [interestSendPopup, setInterestSendPopup] = useState(false); // 관심 보내기 팝업
  const [sincereSendPopup, setSincereSendPopup] = useState(false); // 찐심 보내기 팝업
  const [cancelPopup, setCancelPopup] = useState(false); // 찐심 보내기 팝업
  const [reportPopup, setReportPopup] = useState(false); // 찐심 보내기 팝업

  // ################################## 렌더링시 마다 실행
  useEffect(() => {
    if (!isLoad) {
      // 데일리 매칭 정보 조회
      setIsEmpty(false);
      getDailyMatchInfo();
    }
  }, [isFocus]);

  return data.profileImgList.length > 0 && isLoad ? (
    <>
      <TopNavigation currentPath={'LIMEETED'} />

      <ScrollView ref={scrollRef}>
        {data.profileImgList.length > 0 && (
          <ViualSlider
            // isNew={data.memberBase.profile_type == 'NEW' ? true : false}
            onlyImg={false}
            imgUrls={data.profileImgList}
            profileName={data.memberBase.name}
            age={data.memberBase.age}
            comment={data.memberBase.comment}
            callBackFunction={profileCallbackFn}
          />
        )}

        <SpaceView pt={48} viewStyle={styles.container}>
          <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
            <View>
              <CommonText fontWeight={'700'} type={'h3'}>
                프로필 2차 인증
              </CommonText>
            </View>

            {data.memberBase.auth_acct_cnt > 0 ? (
              <>
                <View style={[layoutStyle.rowBetween]}>
                  <View style={styles.statusBtn}>
                    <CommonText type={'h6'} color={ColorType.white}>
                      LV.{data.memberBase.auth_acct_cnt}
                    </CommonText>
                  </View>
                  <Image source={ICON.medalAll} style={styles.iconSize32} />
                </View>
              </>
            ) : null}
          </SpaceView>

          {data.secondAuthList && createSecondAuthListBody()}


          {/* ###################################################################################################
										관심사 영역
					################################################################################################### */}
          
          <SpaceView viewStyle={layoutStyle.rowBetween} mb={10}>
            <View>
              <CommonText fontWeight={'700'} type={'h3'}>
                관심사
              </CommonText>
            </View>
          </SpaceView>

          <SpaceView mb={40} mt={15} viewStyle={[layoutStyle.row, layoutStyle.wrap]}>
            {data.interestList.map((i, index) => {
              return (
                <SpaceView mr={index % 3 !== 2 ? 8 : 0} key={index + 'reg'}>
                  <View style={[styles.interestBox, styles.boxActive]}>
                    <CommonText color={ColorType.primary}>
                      {i.code_name}
                    </CommonText>
                  </View>
                </SpaceView>
              );
            })}
          </SpaceView>

          {/* ###################################################################################################
										프로필 평점 영역
					################################################################################################### */}
          <SpaceView mb={54}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h3'}>
                프로필 평점
              </CommonText>
            </SpaceView>

            {/* <MainProfileSlider score={data.memberBase.profile_score} /> */}

            <View style={[styles_m.profileContainer]}>
              {/* <SpaceView mb={8} viewStyle={layoutStyle.alignCenter}>
                <Image source={ICON.party} style={styles_m.iconSize} />
              </SpaceView> */}

              <SpaceView viewStyle={layoutStyle.alignCenter} mb={29}>
                {/* {data.memberBase.profile_score >= 9 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      더 이상 어떤 분을 소개시켜 드려야할 지 자신이 없어요.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )} */}

                {/* <CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
									이성들에게
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										선호도가
									</CommonText>
									{'\n'}
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										매우 높은 회원
									</CommonText>
									과 매칭되셨네요!
								</CommonText>
              </SpaceView> */}

                <CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter} > 
									리미티드에서 내 대표 인상 {'\n'}
                  <CommonText fontWeight={'700'} color={ColorType.purple} type={'h3'}>
										{data.memberBase?.face_code_name !== null ? data.memberBase?.face_code_name : ''}
									</CommonText>

                  {/*
                  리미티드의 여러 회원 분들에게
                  {'\n'}
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										{data.memberBase?.face_code_name !== null ? data.memberBase?.face_code_name : ''}
									</CommonText>
									{'\n'}
									매력있다고 생각하세요.
                  */}
								</CommonText>
              </SpaceView>

              <SpaceView viewStyle={layoutStyle.rowBetween} mb={29}>
                <ToolTip
                  title={'프로필 평점'}
                  desc={
                    '다른 회원들이 바라보는\n내 프로필 사진의 인기 지수'
                  }
                />

                <View>
                  <CommonText fontWeight={'700'} type={'h2'}>
                    {data.memberBase?.profile_score}
                  </CommonText>
                </View>
              </SpaceView>
              <BarGrap score={data.memberBase?.profile_score} />
            </View>
          </SpaceView>


          {/* ###################################################################################################
										소셜평점 영역
					################################################################################################### */}
          <SpaceView mb={48}>
            <SpaceView mb={16}>
              <SpaceView mb={16}>
                <CommonText fontWeight={'700'} type={'h3'}>
                  소셜 평점
                </CommonText>
                <View
                  style={[
                    styles.profileContainer,
                    layoutStyle.alignCenter,
                    { marginTop: 16 },
                  ]}
                >
                  <SpaceView mb={4} viewStyle={_styles.colCenter}>
                    <CommonText>
                      {data.memberBase?.social_grade > 9 && '더 이상 어떤 분을 소개시켜 드려야할 지 자신이 없어요.'}
                      {data.memberBase?.social_grade > 8 && data.memberBase?.social_grade <= 9 && '꼭! 이분에게 관심을 표현하시길 바래요..!'}
                      {data.memberBase?.social_grade > 7 && data.memberBase?.social_grade <= 8 && '매칭되면 후회하지 않을 듯한 느낌이 들어요.'}
                      {data.memberBase?.social_grade > 6 && data.memberBase?.social_grade <= 7 && '좋은 분이실지도 몰라서 소개시켜드려요.'}
                      {data.memberBase?.social_grade > 5 && data.memberBase?.social_grade <= 6 && '사람의 코드는 예상치 못 하게 맞는 법이잖아요? 조심스럽게 소개시켜드려요.'}
                      {data.memberBase?.social_grade > 4 && data.memberBase?.social_grade <= 5 && '신중한 관심 표현을 권장드려요.'}
                      {data.memberBase?.social_grade <= 4 && '이 회원분에게 소셜 평점을 높이라고 당부에 당부를 드리는 중입니다.'}
                    </CommonText>
                  </SpaceView>
                  
                  <View style={_styles.socialScoreContainer}>
                    <ToolTip
                      title={'소셜 평점'}
                      desc={
                        '컨텐츠 참여와 매너 수준에 따른\n활동 지수(주1회갱신)'
                      }
                    />
                    <CommonText fontWeight={'700'} type={'h2'}>
                      {data.memberBase?.social_grade.toFixed(1)}
                    </CommonText>
                  </View>
                  <Slider
                    value={data.memberBase?.social_grade/10}
                    animateTransitions={true}
                    renderThumbComponent={() => null}
                    maximumTrackTintColor={ColorType.purple}
                    minimumTrackTintColor={ColorType.purple}
                    containerStyle={_styles.indicatorContainer}
                    trackStyle={_styles.trackStyle}
                  />
                </View>
              </SpaceView>
            </SpaceView>
          </SpaceView>
          

          {/* ###################################################################################################
										인터뷰 영역
					################################################################################################### */}

          <SpaceView mb={24}>
            <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
              <View>
                <CommonText fontWeight={'700'} type={'h3'}>
                  인터뷰
                </CommonText>
              </View>

              <View style={[layoutStyle.rowBetween]}>
                <SpaceView mr={6}>
                  <Image source={ICON.info} style={styles.iconSize} />
                </SpaceView>
                <CommonText type={'h5'}>
                  {data?.interviewList?.length > 0 ? (
                    <>
                      <CommonText fontWeight={'700'} type={'h5'}>
                        {data?.interviewList?.length}개의 질의
                      </CommonText>
                      가 등록되어있어요
                    </>
                  ) : (
                    <>
                      <CommonText fontWeight={'700'} type={'h5'}>
                        등록된 질의가 없습니다.
                      </CommonText>
                    </>
                  )}
                </CommonText>
              </View>
            </SpaceView>


            {data?.interviewList?.length > 0 && 
              <View style={styles.interviewContainer}>
                {data.interviewList.map(
                  ({
                    common_code,
                    code_name,
                    answer,
                  }: {
                    common_code: any;
                    code_name: any;
                    answer: any;
                  }) => (
                    <>
                      <SpaceView mb={32} viewStyle={layoutStyle.row}>
                        <SpaceView mr={16}>
                          <Image
                            source={ICON.manage}
                            style={styles.iconSize40}
                          />
                        </SpaceView>

                        <View style={styles.interviewLeftTextContainer}>
                          <CommonText type={'h5'}>{code_name}</CommonText>
                        </View>
                      </SpaceView>

                      <SpaceView
                        mb={32}
                        viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}
                      >
                        <SpaceView
                          viewStyle={styles.interviewRightTextContainer}
                          mr={16}
                        >
                          <CommonText type={'h5'} color={ColorType.white}>
                            {answer != null ? answer : '미등록 답변입니다.'}
                          </CommonText>
                        </SpaceView>
                        <SpaceView>
                          <Image source={ICON.boy} style={styles.iconSize40} />
                        </SpaceView>
                      </SpaceView>
                    </>
                  )
                )}
              </View>
            }

            {/* <View style={styles.interviewContainer}>
              {data?.interviewList?.length > 0 ? (
                data.interviewList.map(
                  ({
                    common_code,
                    code_name,
                    answer,
                  }: {
                    common_code: any;
                    code_name: any;
                    answer: any;
                  }) => (
                    <>
                      <SpaceView mb={32} viewStyle={layoutStyle.row}>
                        <SpaceView mr={16}>
                          <Image
                            source={ICON.manage}
                            style={styles.iconSize40}
                          />
                        </SpaceView>

                        <View style={styles.interviewLeftTextContainer}>
                          <CommonText type={'h5'}>{code_name}</CommonText>
                        </View>
                      </SpaceView>

                      <SpaceView
                        mb={32}
                        viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}
                      >
                        <SpaceView
                          viewStyle={styles.interviewRightTextContainer}
                          mr={16}
                        >
                          <CommonText type={'h5'} color={ColorType.white}>
                            {answer != null ? answer : '미등록 답변입니다.'}
                          </CommonText>
                        </SpaceView>
                        <SpaceView>
                          <Image source={ICON.boy} style={styles.iconSize40} />
                        </SpaceView>
                      </SpaceView>
                    </>
                  )
                )
              ) : null}
            </View> */}
          </SpaceView>

          <SpaceView mb={15}>
            <CommonBtn
              value={'신고 및 차단'}
              icon={ICON.siren}
              iconSize={24}
              onPress={() => report_onOpen()}
            />
          </SpaceView>
        </SpaceView>
      </ScrollView>

      {/* ###############################################
                        사용자 신고하기 팝업
            ############################################### */}
      <Modalize
        ref={report_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
      >
        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            사용자 신고하기
          </CommonText>
          <TouchableOpacity onPress={report_onClose}>
            <Image source={ICON.xBtn} style={styles.iconSize24} />
          </TouchableOpacity>
        </View>

        <View style={modalStyle.modalBody}>
          <SpaceView mb={16}>
            <CommonText textStyle={_styles.reportText}>신고사유를 알려주시면 더 좋은 리미티드를 만드는데 도움이 됩니다.</CommonText>
          </SpaceView>

          <SpaceView mb={24}>
            {reportTypeList.length &&
              reportTypeList.map((i, index) => (
                <CommonCheckBox
                  label={i.text}
                  value={i.value}
                  key={index + '_' + i.value}
                  callBackFunction={reportCheckCallbackFn}
                />
              ))}
          </SpaceView>

          <SpaceView mb={16}>
            <CommonBtn
              value={'신고하기'}
              onPress={popupReport}
              type={'black'}
              height={59} 
              fontSize={19}
            />
          </SpaceView>
        </View>
      </Modalize>

      {/* ###############################################
                        매칭 취소 팝업
            ############################################### */}
      <Modal visible={cancelPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                매칭 취소
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'}>이성을 거부하시겠습니까?</CommonText>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => setCancelPopup(false)}
              >
                <CommonText fontWeight={'500'}>취소</CommonText>
              </TouchableOpacity>
              <View style={modalStyle.modalBtnline} />
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => insertMatchInfo('pass')}
              >
                <CommonText fontWeight={'500'} color={ColorType.red}>
                  확인
                </CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ###############################################
                        관심 보내기 팝업
            ############################################### */}
      <Modal visible={interestSendPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                관심
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'}>
                패스를 소모하여 관심을 보내시겠습니까?
              </CommonText>
              <CommonText type={'h5'} color={ColorType.red}>
                패스 x5
              </CommonText>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => setInterestSendPopup(false)}
              >
                <CommonText fontWeight={'500'}>취소</CommonText>
              </TouchableOpacity>
              <View style={modalStyle.modalBtnline} />
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => insertMatchInfo('interest')}
              >
                <CommonText fontWeight={'500'} color={ColorType.red}>
                  확인
                </CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ###############################################
                        찐심 보내기 팝업
            ############################################### */}
      <Modal visible={sincereSendPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                찐심
              </CommonText>
            </SpaceView>

            {royalPassAmt <= 0 ? (
              <>
                <SpaceView viewStyle={layoutStyle.alignCenter}>
                  <CommonText type={'h5'}>보유 찐심</CommonText>
                  <CommonText type={'h5'} color={ColorType.red}>
                    {royalPassAmt}
                  </CommonText>
                </SpaceView>

                <View style={modalStyle.modalBtnContainer}>
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={() => setSincereSendPopup(false)}
                  >
                    <CommonText fontWeight={'500'}>취소</CommonText>
                  </TouchableOpacity>
                  <View style={modalStyle.modalBtnline} />
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={() => navigation.navigate('Cashshop')}
                  >
                    <CommonText fontWeight={'500'} color={ColorType.red}>
                      구매
                    </CommonText>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <SpaceView viewStyle={layoutStyle.alignCenter}>
                  <CommonText type={'h5'}>
                    로얄패스를 소모하여 찐심을 보내시겠습니까?
                  </CommonText>
                  <CommonText type={'h5'} color={ColorType.red}>
                    로얄패스 x20
                  </CommonText>
                </SpaceView>

                <View style={modalStyle.modalBtnContainer}>
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={() => setSincereSendPopup(false)}
                  >
                    <CommonText fontWeight={'500'}>취소</CommonText>
                  </TouchableOpacity>
                  <View style={modalStyle.modalBtnline} />
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={() => insertMatchInfo('sincere')}
                  >
                    <CommonText fontWeight={'500'} color={ColorType.red}>
                      확인
                    </CommonText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={reportPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                사용자 신고하기
              </CommonText>
            </SpaceView>
            <>
              <SpaceView viewStyle={layoutStyle.alignCenter}>
                <CommonText type={'h5'}>신고하시겠습니까?</CommonText>
              </SpaceView>

              <View style={modalStyle.modalBtnContainer}>
                <TouchableOpacity
                  style={modalStyle.modalBtn}
                  onPress={() => setReportPopup(false)}
                >
                  <CommonText fontWeight={'500'}>취소</CommonText>
                </TouchableOpacity>
                <View style={modalStyle.modalBtnline} />
                <TouchableOpacity
                  style={modalStyle.modalBtn}
                  onPress={() => insertReport()}
                >
                  <CommonText fontWeight={'500'} color={ColorType.red}>
                    확인
                  </CommonText>
                </TouchableOpacity>
              </View>
            </>
          </View>
        </View>
      </Modal>
    </>
  ) : (
    <MatchSearch isEmpty={isEmpty} />
=======
    >
      <View style={styles.rowCenter}>
        <Image
          source={convertTypeToImage(item)}
          style={styles.certificateItemImage}
        />
        <Text
          style={
            item?.auth_status === 'ACCEPT'
              ? styles.certificateItemTextOn
              : styles.certificateItemTextOff
          }
        >
          {item.code_name}
        </Text>
      </View>
      {item?.auth_status === 'ACCEPT' && (
        <Text style={styles.levelText}>
          LV.
          <Text style={{ fontSize: 15 }}>{item.auth_level}</Text>
        </Text>
      )}
    </View>
>>>>>>> d5b224ca9fd214d51a6f8636a9455babbe30b903
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <TopNavigation currentPath={'LIMEETED'} />
      <View>
        <FlatList
          data={data?.profile_img_list}
          renderItem={RenderItem}
          horizontal
          pagingEnabled
        />
        <AbsoluteView />
      </View>

      <View style={styles.padding}>
        {/* 부스트 */}
        <View style={styles.boostPannel}>
          <View style={styles.boostBadge}>
            <Text style={styles.boostBadgeText}>BOOST</Text>
          </View>
          <Text style={styles.boostTitle}>부스터 회원을 만났습니다.</Text>
          <Text style={styles.boostDescription}>
            관심이나 찐심을 보내면 소셜 평점 보너스가 부여됩니다.
          </Text>
        </View>
        {/* 프로필 인증 */}
        <View style={styles.profileTitleContainer}>
          <Text style={styles.title}>프로필 인증</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LV.7</Text>
          </View>
        </View>
        <SimpleGrid
          style={{ marginTop: 10 }}
          staticDimension={width}
          itemContainerStyle={{
            width: '32%',
          }}
          spacing={width * 0.01}
          data={
            data?.second_auth_list?.length > 0 ? data?.second_auth_list : dummy
          }
          renderItem={renderAuthInfo}
        />
        <Text style={styles.title}>방배동아이유님의 관심사</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
          {interest.map((item, index) => {
            const isOn = true;
            return (
              <View style={styles.interestItem(isOn)}>
                <Text style={styles.interestText(isOn)}>{item.code_name}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.title}>프로필 활동지수</Text>
        <View style={styles.profileActivePannel}>
          <Text style={styles.profileEverageText}>프로필 평점</Text>
          <Text style={styles.profileActiveText1}>
            리미티드에 퍼진{' '}
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              리미티드닉네임열글자
            </Text>
            님의 인상
          </Text>
          <Text style={styles.profileActiveText2}>중독성 있는 퇴폐미</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderText}>프로필 평점 8.0</Text>
            <Slider
              value={0.8}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={ColorType.purple}
              minimumTrackTintColor={ColorType.purple}
              containerStyle={styles.sliderContainerStyle}
              trackStyle={styles.sliderThumbStyle}
              trackClickable={false}
            />
            <View style={styles.gageContainer}>
              <Text style={styles.gageText}>0</Text>
              <Text style={styles.gageText}>5</Text>
              <Text style={styles.gageText}>10</Text>
            </View>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialEverageText}>내 소셜 평점</Text>
          <Text style={styles.socialText1}>매칭되면</Text>
          <Text style={styles.socialText1}>
            <Text style={{ fontFamily: 'AppleSDGothicNeoEB00' }}>
              후회하지 않을듯한
            </Text>{' '}
            느낌이 들어요
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderText}>소셜 평점 8.0</Text>
            <Slider
              value={0.8}
              animateTransitions={true}
              renderThumbComponent={() => null}
              maximumTrackTintColor={'#fe0456'}
              minimumTrackTintColor={'#ff9fbe'}
              containerStyle={styles.socialSliderContainerStyle}
              trackStyle={styles.socialSliderThumbStyle}
              trackClickable={false}
            />
            <View style={styles.gageContainer}>
              <Text style={styles.gageText}>0</Text>
              <Text style={styles.gageText}>5</Text>
              <Text style={styles.gageText}>10</Text>
            </View>
          </View>
        </View>

        <View style={styles.reportButton}>
          <Text style={styles.reportText}>신고하기</Text>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
/**
 * 이미지 렌더링
 */
function RenderItem({ item }) {
  const url = findSourcePath(item?.img_file_path);
  return (
    <View>
      <Image
        source={url}
        style={{
          width: width,
          height: height * 0.7,
          borderRadius: 20,
        }}
      />
    </View>
  );
}

/**
 *  이미지 위 정보들
 */
function AbsoluteView() {
  return (
    <View style={styles.absoluteView}>
      <View style={styles.badgeContainer}>
        <View style={styles.authBadge}>
          <Text style={styles.whiteText}>인증 완료</Text>
        </View>
        <View style={styles.redBadge}>
          <Image source={ICON.whiteCrown} style={styles.crownIcon} />
          <Text style={styles.whiteText}>1.0</Text>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>방배동 아이유, 29</Text>
        <Image source={ICON.checkICon} style={styles.checkIcon} />
      </View>
      <View style={styles.distanceContainer}>
        <Image source={ICON.marker} style={styles.markerIcon} />
        <Text style={styles.regionText}>경기도 수원시 12.9Km</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity>
          <Image source={ICON.closeCircle} style={styles.smallButton} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.ticketCircle} style={styles.largeButton} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.freePassContainer}>
          <Image source={ICON.heartCircle} style={styles.largeButton} />
          <View style={styles.freePassBage}>
            <Text style={styles.freePassText}>자유이용권 ON</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ICON.starCircle} style={styles.smallButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  absoluteView: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: -width * 0.15,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: '8%',
    zIndex: 1,
  },
  badgeContainer: {
    flexDirection: `row`,
    alignItems: `center`,
    // justifyContent: `center`,
  },
  authBadge: {
    width: 48,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  redBadge: {
    width: 43,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#fe0456',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-around',
    marginLeft: 4,
  },
  whiteText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  crownIcon: {
    width: 12.7,
    height: 8.4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 25,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginTop: 10,
  },
  checkIcon: {
    width: 15,
    height: 15,
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  markerIcon: {
    width: 13,
    height: 17.3,
  },
  regionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  smallButton: {
    width: width * 0.2,
    height: width * 0.2,
  },
  largeButton: {
    width: width * 0.3,
    height: width * 0.3,
  },
  freePassContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freePassBage: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ef486d',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freePassText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ed4771',
  },
  padding: {
    paddingHorizontal: 20,
    marginTop: width * 0.2,
  },
  boostPannel: {
    width: '100%',
    height: 89,
    borderRadius: 10,
    backgroundColor: '#f6f7fe',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  boostBadge: {
    width: 54,
    borderRadius: 7.5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  boostBadgeText: {
    fontFamily: 'AppleSDGothicNeoH00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  boostTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#262626',
  },
  boostDescription: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#8e8e8e',
  },
  profileTitleContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 20,
  },
  levelBadge: {
    width: 51,
    height: 21,
    borderRadius: 5,
    backgroundColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginLeft: 8,
  },
  levelText: {
    opacity: 0.83,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },

  certificateItemContainerOn: {
    width: '100%',
    height: 39,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#7986ee',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  certificateItemContainerOff: {
    width: '100%',
    height: 39,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#b7b7b9',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  certificateItemImage: {
    width: 15.6,
    height: 13.9,
  },
  certificateItemTextOn: {
    marginLeft: 5,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  certificateItemTextOff: {
    marginLeft: 5,
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#b1b1b1',
  },
  rowCenter: {
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  levelText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
  },
  interestItem: (isOn) => {
    return {
      borderRadius: 5,
      backgroundColor: isOn ? 'white' : '#f7f7f7',
      paddingHorizontal: 15,
      paddingVertical: 9,
      marginLeft: 3,
      marginTop: 3,
      borderColor: isOn ? '#7986ee' : '#f7f7f7',
      borderWidth: 1,
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'AppleSDGothicNeoR00',
      fontSize: 12,
      fontWeight: 'normal',
      fontStyle: 'normal',
      lineHeight: 22,
      letterSpacing: 0,
      textAlign: 'left',
      color: isOn ? '#7986ee' : '#b1b1b1',
    };
  },
  profileActivePannel: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ebedfc',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  profileEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#697ae6',
  },
  profileActiveText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 4,
  },
  profileActiveText2: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#5d6ae2',
    marginTop: 10,
  },
  sliderContainer: {
    marginTop: 26,
    alignItems: 'flex-start',
  },
  sliderText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 10,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#b7b7b7',
  },
  sliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.primary,
  },
  sliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
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
  socialContainer: {
    borderRadius: 20,
    backgroundColor: '#feeff2',
    width: '100%',
    borderRadius: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  socialEverageText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#fe0456',
  },
  socialText1: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 17,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#1c1c1c',
  },
  socialSliderContainerStyle: {
    width: '100%',
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fe0456',
  },
  socialSliderThumbStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  reportButton: {
    height: 43,
    borderRadius: 21.5,
    backgroundColor: '#363636',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    marginTop: 20,
  },
  reportText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});

const dummy = [
  {
    member_auth_seq: 26,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '직업',
    member_seq: 9,
    common_code: 'JOB',
  },
  {
    member_auth_seq: 25,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '학업',
    member_seq: 9,
    common_code: 'EDU',
  },
  { code_name: '소득', common_code: 'INCOME' },
  {
    member_auth_seq: 27,
    auth_level: 1,
    auth_status: 'ACCEPT',
    code_name: '자산',
    member_seq: 9,
    common_code: 'ASSET',
  },
  { code_name: 'SNS', common_code: 'SNS' },
  { code_name: '차량', common_code: 'VEHICLE' },
];
const interest = [
  {
    code_name: '공연보기',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '해외축구',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '집에서 영화보기',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '캠핑',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '동네산책',
    common_code: 'CONC_06_00',
  },

  {
    interest_seq: 454,
    code_name: '반려견과 함께',
    common_code: 'CONC_06_00',
  },
  {
    interest_seq: 454,
    code_name: '인스타그램',
    common_code: 'CONC_06_00',
  },
];
interface auth {
  member_auth_seq: number;
  auth_level: number;
  auth_status: string;
  code_name: string;
  member_seq: number;
  common_code: string;
}
function convertTypeToImage(auth: auth) {
  switch (auth.common_code) {
    case 'JOB':
      if (auth.auth_status === 'ACCEPT') return ICON.job_on;
      else return ICON.job_off;

    case 'EDU':
      if (auth.auth_status === 'ACCEPT') return ICON.degree_on;
      else return ICON.degree_off;

    case 'INCOME':
      if (auth.auth_status === 'ACCEPT') return ICON.income_on;
      else return ICON.income_off;
    case 'ASSET':
      if (auth.auth_status === 'ACCEPT') return ICON.asset_on;
      else return ICON.asset_off;

    case 'SNS':
      if (auth.auth_status === 'ACCEPT') return ICON.sns_on;
      else return ICON.sns_off;

    case 'VEHICLE':
      if (auth.auth_status === 'ACCEPT') return ICON.vehicle_on;
      else return ICON.vehicle_off;
    default:
      break;
  }
}
