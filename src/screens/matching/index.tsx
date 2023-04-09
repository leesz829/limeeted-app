import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { ICON, findSourcePath } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { Color } from 'assets/styles/Color';
import { ViualSlider } from 'component/ViualSlider';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import * as properties from 'utils/properties';
import {
  ColorType,
  ScreenNavigationProp,
  BottomParamList,
  Interview,
  ProfileImg,
  FileInfo,
  MemberBaseData,
  CommonCode,
  LabelObj,
} from '@types';
import { Modalize } from 'react-native-modalize';
import { CommonCheckBox } from 'component/CommonCheckBox';
import axios from 'axios';
import { MatchSearch } from 'screens/matching/MatchSearch';
import * as hooksMember from 'hooks/member';
import { ToolTip } from 'component/Tooltip';
import { BarGrap } from 'component/BarGrap';
import { get_daily_matched_info, report_matched_user, regist_match_status } from 'api/models';
import { usePopup } from 'Context';
import { Slider } from '@miblanchard/react-native-slider';
import { myProfile } from 'redux/reducers/authReducer';
import { useDispatch } from 'react-redux';


/* ################################################################################################################
###### 매칭 화면
################################################################################################################### */
interface Props {
  navigation: StackNavigationProp<BottomParamList, 'Roby'>;
  route: RouteProp<BottomParamList, 'Roby'>;
}

export const Matching = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const scrollRef = useRef();

  const { show } = usePopup();  // 공통 팝업

  const jwtToken = hooksMember.getJwtToken(); // 토큰
  const memberSeq = hooksMember.getMemberSeq(); // 회원번호

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);

  const [royalPassAmt, setRoyalPassAmt] = useState<any>();

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    memberBase: {},
    profileImgList: [],
    secondAuthList: [],
    interviewList: [],
    interestList: [],
  });

  // 매치 회원 정보
  const [matchMemberData, setMatchMemberData] = useState(MemberBaseData);

  // 인터뷰 정보
  const [interviewList, setInterviewList] = useState([Interview]);

  // 2차인증 정보
  const [secondAuthList, setSecondAuthList] = useState([
    { second_auth_code: '' },
  ]);

  // 회원 인상 정보
  const [profileImgList, setProfileImgList] = useState([ProfileImg]);

  // 신고목록
  const [reportTypeList, setReportTypeList] = useState([
    { text: '', value: '' },
  ]);

  // 선택된 신고하기 타입
  const [checkReportType, setCheckReportType] = useState(['']);

  // 신고 Pop
  const report_modalizeRef = useRef<Modalize>(null);
  const report_onOpen = () => {
    report_modalizeRef.current?.open();
  };
  const report_onClose = () => {
    report_modalizeRef.current?.close();
  };

  //
  /* #############################################
	##### 거부/찐심/관심 팝업 Callback 함수
	##### - activeType : pass(거부), sincere(찐심), interest(관심)
	############################################# */
  const profileCallbackFn = (activeType: string) => {
    if (activeType == 'interest') {
      setInterestSendPopup(true);
    } else if (activeType == 'sincere') {
      setSincereSendPopup(true);
    } else if (activeType == 'pass') {
      setCancelPopup(true);
    }
  };

  // ############################################################ 찐심/관심/거부 저장
  const insertMatchInfo = async (activeType: string) => {

    const body = {
      active_type: activeType,
      res_member_seq: data.memberBase.member_seq,
    };
    try {
      const { success, data } = await regist_match_status(body);

      if(success) {
        if(data.result_code == '0000') {
          dispatch(myProfile());
          getDailyMatchInfo();
          setInterestSendPopup(false);
          setSincereSendPopup(false);
          setCancelPopup(false);
          setIsLoad(false);
        } else if (data.result_code == '6010') {
          show({ content: '보유 패스가 부족합니다.' });
          return false;
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################ 프로필 2차 인증 목록 UI 생성
  const createSecondAuthListBody = () => {
    // 자산
    let asset = false;

    // 학업
    let edu = false;

    // 소득
    let income = false;

    // 직업
    let job = false;

    // sns
    let sns = false;

    // 차량
    let vehice = false;

    data.secondAuthList.forEach((e, i) => {
      switch (e.second_auth_code) {
        case 'ASSET':
          asset = true;
          break;
        case 'EDU':
          edu = true;
          break;
        case 'INCOME':
          income = true;
          break;
        case 'JOB':
          job = true;
          break;
        case 'SNS':
          sns = true;
          break;
        case 'VEHICE':
          vehice = true;
          break;
      }
    });

    return (
      <SpaceView mb={48}>
        <SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
          <View style={styles.profileBox}>
            <Image source={ICON.job} style={styles.iconSize48} />
            <CommonText type={'h5'}>직업</CommonText>
            {!job && <View style={styles.disabled} />}
          </View>
          <View style={styles.profileBox}>
            <Image source={ICON.degree} style={styles.iconSize48} />
            <CommonText type={'h5'}>학위</CommonText>
            {!edu && <View style={styles.disabled} />}
          </View>
          <View style={styles.profileBox}>
            <Image source={ICON.income} style={styles.iconSize48} />
            <CommonText type={'h5'}>소득</CommonText>
            {!income && <View style={styles.disabled} />}
          </View>
        </SpaceView>

        <View style={[layoutStyle.rowBetween]}>
          <View style={styles.profileBox}>
            <Image source={ICON.asset} style={styles.iconSize48} />
            <CommonText type={'h5'}>자산</CommonText>
            {!asset && <View style={styles.disabled} />}
          </View>
          <View style={styles.profileBox}>
            <Image source={ICON.sns} style={styles.iconSize48} />
            <CommonText type={'h5'}>SNS</CommonText>
            {!sns && <View style={styles.disabled} />}
          </View>
          <View style={styles.profileBox}>
            <Image source={ICON.vehicle} style={styles.iconSize48} />
            <CommonText type={'h5'}>차량</CommonText>
            {!vehice && <View style={styles.disabled} />}
          </View>
        </View>
      </SpaceView>
    );
  };

  // ############################################################ 데일리 매칭 정보 조회
  const getDailyMatchInfo = async () => {

    try {
      const { success, data } = await get_daily_matched_info();

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

  // ############################################################ 사용자 신고하기 - 신고사유 체크 Callback 함수
  const reportCheckCallbackFn = (reportType: string, check: boolean) => {
    if (check) {
      checkReportType.push(reportType);
      setCheckReportType(
        checkReportType.filter((e, index) => checkReportType.indexOf(e) === index && e)
      );
    } else {
      setCheckReportType(
        checkReportType.filter((e) => e != reportType && e)
      );
    }
  };

  // ############################################################ 사용자 신고하기 - 팝업 활성화
  const popupReport = () => {
    if (!checkReportType.length) {
      show({ content: '신고항목을 선택해주세요.' });
      return false;
    } else {
      setReportPopup(true);
    }
  };

  // ############################################################ 사용자 신고하기 등록
  const insertReport = async () => {

    const body = {
      report_type_code_list: checkReportType.join(),
      report_member_seq: data.memberBase.member_seq
    };
    try {
      const { success, data } = await report_matched_user(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        }

        show({ content: '신고 처리 되었습니다.' });

        setCheckReportType([]);
        setReportPopup(false);
        getDailyMatchInfo();
        setIsLoad(false);

        // 스크롤 최상단 이동
        /* scrollRef.current?.scrollTo({
          y: 0,
          animated: false,
        }); */
      }
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

                <CommonText color={ColorType.gray8888} textStyle={styles_m.textCenter}>
									리미티드의 여러 회원 분들에게
                  {'\n'}
									<CommonText fontWeight={'700'} color={ColorType.purple}>
										{data.memberBase?.face_code_name !== null ? data.memberBase?.face_code_name : ''}
									</CommonText>
									{'\n'}
									매력있다고 생각하세요.
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
                      {data.memberBase?.social_grade}
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

            <View style={styles.interviewContainer}>
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
              ) : (
                <>
                  <SpaceView mb={32} viewStyle={layoutStyle.row}>
                    <SpaceView mr={16}>
                      <Image source={ICON.manage} style={styles.iconSize40} />
                    </SpaceView>

                    <View style={styles.interviewLeftTextContainer}>
                      <CommonText type={'h5'}>질문을 등록해주세요</CommonText>
                    </View>
                  </SpaceView>
                </>
              )}
            </View>
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
    <MatchSearch />
  );
};

const styles_m = StyleSheet.create({
  profileContainer: {
    backgroundColor: Color.grayF8F8,
    borderRadius: 16,
    padding: 24,
    marginRight: 0,
    paddingBottom: 30,
  },
  iconSize: {
    width: 48,
    height: 48,
  },
  textCenter: { textAlign: 'center' },
});

const _styles = StyleSheet.create({
  colCenter: {
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: `center`,
  },
  socialScoreContainer: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  indicatorContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginTop: 20,
    backgroundColor: ColorType.primary,
  },
  trackStyle: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ColorType.grayDDDD,
  },
  reportText: {
    width: 265,
    height: 46,
    fontFamily: "AppleSDGothicNeoB00",
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.85,
    textAlign: "left",
    color: "#262626"
  },
});