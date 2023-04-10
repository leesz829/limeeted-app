import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Image,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import TopNavigation from 'component/TopNavigation';
import { findSourcePath, ICON } from 'utils/imageUtils';
import { layoutStyle, styles, modalStyle } from 'assets/styles/Styles';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import CommonHeader from 'component/CommonHeader';
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
  StackParamList,
} from '@types';
import { Color } from 'assets/styles/Color';
import { ViualSlider } from 'component/ViualSlider';
import { CommonBtn } from 'component/CommonBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import * as hooksMember from 'hooks/member';
import axios from 'axios';
import * as properties from 'utils/properties';
import { MainProfileSlider } from 'component/MainProfileSlider';
import { MatchSearch } from 'screens/matching/MatchSearch';
import { Modalize } from 'react-native-modalize';
import { CommonCheckBox } from 'component/CommonCheckBox';
import { ToolTip } from 'component/Tooltip';
import { BarGrap } from 'component/BarGrap';
import { setBase } from 'redux/reducers/mbrReducer';
import { get_matched_member_info, resolve_match, report_matched_user, update_match_status } from 'api/models';
import { usePopup } from 'Context';
import { ROUTES, STACK } from 'constants/routes';



/* ################################################################################################################
###################################################################################################################
###### 매칭 상대 프로필 상세
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StorageProfile'>;
  route: RouteProp<StackParamList, 'StorageProfile'>;
}

export const StorageProfile = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();

  const { show } = usePopup();  // 공통 팝업

  const jwtToken = hooksMember.getJwtToken(); // 토큰
  const memberSeq = hooksMember.getMemberSeq(); // 회원번호

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(
    props.route.params.matchSeq != null ? false : true
  );

  // 매칭 번호
  const matchSeq = props.route.params.matchSeq;

  // 대상 회원 번호
  const tgtMemberSeq = props.route.params.tgtMemberSeq;

  const [data, setData] = useState<any>({
    matchBase: {},
    memberBase: {},
    profileImgList: [],
    secondAuthList: [],
    interviewList: [],
    interestList: [],
  });

  /// 매칭 기본 정보
  const [matchBase, setMatchBase] = useState<any>({});

  // 회원 기본 정보
  const [memberBase, setMemberBase] = useState<any>({ MemberBaseData });

  // 회원 프로필 사진 정보
  const [profileImgList, setProfileImgList] = useState<any>([{}]);

  // 2차인증 정보
  const [secondAuthList, setSecondAuthList] = useState<any>([{}]);

  // 인터뷰 정보
  const [interviewList, setInterviewList] = useState<any>([{}]);

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

  // ############################################################ 매칭 회원 정보 조회
  const selectMatchMemberInfo = async () => {

    const body = {
      match_seq: matchSeq
    };
    try {
      const { success, data } = await get_matched_member_info(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        } else {
          let tmpProfileImgList = new Array(); // 프로필 이미지 목록
          let tmpSecondAuthList = new Array(); // 2차 인증 목록
          let tmpInterviewList = new Array(); // 인터뷰 목록
          let tmpInterestList = new Array();     // 관심사 목록

          // 회원 프로필 이미지 정보 구성
          data?.mbr_img_list?.map(
            ({ img_file_path }: { img_file_path: any; }) => {
              const img_path = findSourcePath(img_file_path);
              const dataJson = { url: img_path };
              tmpProfileImgList.push(dataJson);
            }
          );

          // 회원 2차 인증 목록 정보 구성
          data?.mbr_second_auth_list?.map(
            ({ second_auth_code }: { second_auth_code: any }) => {
              const dataJson = { second_auth_code: second_auth_code };
              tmpSecondAuthList.push(dataJson);
            }
          );

          // 회원 인터뷰 목록 정보 구성
          data?.mbr_interview_list?.map(
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
            matchBase: data.match_base,
            memberBase: data.mbr_base,
            profileImgList: tmpProfileImgList,
            secondAuthList: tmpSecondAuthList,
            interviewList: tmpInterviewList,
            interestList: tmpInterestList,
          });

          // 신고사유 코드 목록 적용
          let tmpReportTypeList = [{ text: '', value: '' }];
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
          setIsLoad(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  // ############################################################ 매칭 상태 변경(수락, 거절)
  const updateMatchStatus = async (status: any) => {
    const body = {
      match_seq: matchSeq,
      match_status: status
    };
    try {
      const { success, data } = await update_match_status(body);
      if(success) {
        if(data.result_code == '0000') {
          navigation.navigate(STACK.TAB, {
            screen: 'Storage',
          });
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ############################################################ 관심 여부 체크
  const profileCallbackFn = (activeType: string) => {};

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

  // ############################################################ 사용자 신고하기 - 신고사유 체크 Callback 함수
  const reportCheckCallbackFn = (reportType: string, check: boolean) => {
    if (check) {
      checkReportType.push(reportType);
      setCheckReportType(
        checkReportType.filter(
          (e, index) => checkReportType.indexOf(e) === index && e
        )
      );
    } else {
      setCheckReportType(checkReportType.filter((e) => e != reportType && e));
    }
  };

  // ############################################################ 사용자 신고하기 - 팝업 활성화
  const popupReport = () => {
    if (!checkReportType.length) {
      show({ content: '신고항목을 선택해주세요.' });

      return false;
    } else {
      show({ 
        content: '신고하시겠습니까?' ,
        cancelCallback: function() {
          
        },
        confirmCallback: async function() {
          insertReport();
        }
      });
    }
  };

  // ############################################################ 사용자 신고하기 등록
  const insertReport = async () => {
    const body = {
      report_type_code_list: checkReportType.join(),
      report_member_seq: tgtMemberSeq
    };
    try {
      const { success, data } = await report_matched_user(body);

      if(success) {
        if (data.result_code != '0000') {
          console.log(data.result_msg);
          return false;
        }

        show({ content: '차단 및 신고 처리가 완료 되었습니다.' });
        report_onClose();

        navigation.navigate(STACK.TAB, {
          screen: 'Storage',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {

    }
  };

  // ############################################################ 연락처 열기
  const goHpOpen = async () => {
    const body = {
      match_seq: data.matchBase.match_seq
    };
    try {
      const { success, data } = await resolve_match(body);

      if(success) {
        if (data.result_code == '0000') {
          selectMatchMemberInfo();
        } else {
          show({ content: '보유 패스가 부족합니다.' });
        }

        setHpOpenPopup(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setHpOpenPopup(false);
    }
  };


  // ############################################################ 팝업 관련
  const [hpOpenPopup, setHpOpenPopup] = useState(false); // 연락처 열기 팝업

  // ##### 첫 렌더링
  useEffect(() => {
    selectMatchMemberInfo();
    //setCheckReportType('');
  }, [isFocus]);

  return isLoad ? (
    <>
      <CommonHeader title={
        (() => {
          if(props.route.params.type == 'REQ') return '내가 받은 관심';
          else if(props.route.params.type == 'RES') return '내가 보낸 관심';
          else if(props.route.params.type == 'MATCH') return '성공 매칭';
        })()
      } />

      <ScrollView>
        {profileImgList.length > 0 && (
          <ViualSlider
            onlyImg={true}
            isNew={data.memberBase.profile_type == 'NEW' ? true : false}
            imgUrls={data.profileImgList}
            profileName={data.memberBase.name}
            age={data.memberBase.age}
            comment={data.memberBase.comment}
            callBackFunction={profileCallbackFn}
          />
        )}

        <SpaceView viewStyle={styles.container}>
          {props.route.params.type == 'REQ' ? (
            <>
              <SpaceView viewStyle={styles.halfContainer} mb={48}>
                <View style={styles.halfItemLeft4}>
                  <CommonBtn
                    value={'거절'}
                    height={48}
                    onPress={() => {
                      updateMatchStatus('REFUSE');
                    }}
                  />
                </View>
                <View style={styles.halfItemRight4}>
                  <CommonBtn
                    value={'수락'}
                    type={'primary'}
                    height={48}
                    onPress={() => {
                      updateMatchStatus('ACCEPT');
                    }}
                  />
                </View>
              </SpaceView>
            </>
          ) : null}

          {props.route.params.type == 'RES' ? (
            <>
              <SpaceView viewStyle={styles.textContainer} mb={48}>
                <SpaceView mb={8}>
                  <Image source={ICON.wait} style={styles.iconSize48} />
                </SpaceView>
                <CommonText fontWeight={'700'}>매칭 대기중</CommonText>
                <CommonText
                  fontWeight={'500'}
                  color={ColorType.gray6666}
                  textStyle={layoutStyle.textCenter}
                >
                  상대방이 회원님의 관심을 두고 고민 중인가봐요.
                </CommonText>
              </SpaceView>
            </>
          ) : null}

          {props.route.params.type == 'MATCH' ? (
            <>
              <SpaceView mb={48}>
                <SpaceView mb={8}>
                  <CommonText fontWeight={'700'} type={'h3'}>
                    인사말 건네기
                  </CommonText>
                </SpaceView>

                <SpaceView mb={16}>
                  <CommonText>
                    상대 이성에게 반가운 인사말을 건내보세요.
                  </CommonText>
                </SpaceView>

                {data.matchBase.res_member_seq == memberSeq ||
                data.matchBase.phone_open_yn == 'Y' ? (
                  <>
                    <SpaceView mb={8} viewStyle={styles.textContainer}>
                      <CommonText fontWeight={'500'}>연락처 정보</CommonText>
                      <CommonText
                        type={'h5'}
                        textStyle={layoutStyle.textCenter}
                      >
                        {data.memberBase.phone_number}
                      </CommonText>
                    </SpaceView>
                  </>
                ) : (
                  <>
                    <CommonBtn
                      value={'연락처 열기'}
                      type={'purple'}
                      onPress={() => {
                        setHpOpenPopup(true);
                      }}
                    />
                  </>
                )}
              </SpaceView>
            </>
          ) : null}

          {/* ###################################################################################
               ####### 프로필 2차 인증 영역
               ################################################################################### */}
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
          {data?.interestList?.length > 0 && 
            <>
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
            </>
          }

          {/* ###################################################################################
               ####### 프로필 평점 영역
               ################################################################################### */}
          <SpaceView mb={54}>
            <SpaceView mb={16}>
              <CommonText fontWeight={'700'} type={'h3'}>
                프로필 평점
              </CommonText>
            </SpaceView>

            <View style={[styles_m.profileContainer]}>
              <SpaceView mb={8} viewStyle={layoutStyle.alignCenter}>
                <Image source={ICON.party} style={styles_m.iconSize} />
              </SpaceView>

              <SpaceView viewStyle={layoutStyle.alignCenter} mb={29}>
                {data.memberBase.profile_score >= 9 ? (
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
                )}

                {data.memberBase.profile_score < 9 &&
                data.memberBase.profile_score >= 8 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      꼭! 이분에게 관심을 표현하시길 바래요..!
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

                {data.memberBase.profile_score < 8 &&
                data.memberBase.profile_score >= 7 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      매칭되면 후회하지 않을 듯한 느낌이 들어요.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

                {data.memberBase.profile_score < 7 &&
                data.memberBase.profile_score >= 6 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      좋은 분이실지도 몰라서 소개시켜드려요.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

                {data.memberBase.profile_score < 6 &&
                data.memberBase.profile_score >= 5 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      사람의 코드는 예상치 못 하게 맞는 법이잖아요?{'\n'}
                      조심스럽게 소개시켜드려요.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

                {data.memberBase.profile_score < 5 &&
                data.memberBase.profile_score >= 4 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      신중한 관심 표현을 권장드려요.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

                {data.memberBase.profile_score < 4 ? (
                  <>
                    <CommonText
                      color={ColorType.gray8888}
                      textStyle={styles_m.textCenter}
                    >
                      이 회원분에게 소셜 평점을 높이라고 당부에 당부를 드리는
                      중입니다.
                    </CommonText>
                  </>
                ) : (
                  <></>
                )}

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
								</CommonText> */}
              </SpaceView>

              <SpaceView viewStyle={layoutStyle.rowBetween} mb={29}>
                <ToolTip
                  title={'프로필 평점'}
                  desc={'<라이브>에 소개된 내 프로필에 다른 이성들이 부여한 프로필 평점'}
                />

                <View>
                  <CommonText fontWeight={'700'} type={'h2'}>
                    {data.memberBase.profile_score}
                  </CommonText>
                </View>
              </SpaceView>
              <BarGrap score={data.memberBase.profile_score} />
            </View>

            {/* <MainProfileSlider /> */}
          </SpaceView>

          {/* ###################################################################################
               ####### 인터뷰 영역
               ################################################################################### */}
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
                  {data?.interviewList?.length ? (
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

            {/* ###############################################
                                 인터뷰 영역
                  ############################################### */}
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
          </SpaceView>

          <SpaceView mb={40}>
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
            <CommonText>신고 사유를 선택해주세요.</CommonText>
          </SpaceView>

          {/*
					<SpaceView mb={24}>
						{[
							{ text: '비속어 사용' },
							{ text: '과도한 성적 표현' },
							{ text: '불쾌감을 주는 표현' },
							{ text: '성차별 적 표현' },
							{ text: '기타' },
						].map((i, index) => (
							<CommonCheckBox label={i.text} key={index + 'checkbox'} />
						))}
					</SpaceView>
						*/}

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
              value={'신고 및 차단하기'}
              onPress={popupReport}
              type={'primary'}
            />
          </SpaceView>
        </View>
      </Modalize>

      {/* ###############################################
                        연락처 열기 팝업
            ############################################### */}
      <Modal visible={hpOpenPopup} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={modalStyle.modalStyle1}>
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                연락처 열기
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'}>
                패스를 소모하여 연락처를 확인하시겠습니까?
              </CommonText>
              <CommonText type={'h5'} color={ColorType.red}>
                패스 x25
              </CommonText>
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => setHpOpenPopup(false)}
              >
                <CommonText fontWeight={'500'}>취소</CommonText>
              </TouchableOpacity>
              <View style={modalStyle.modalBtnline} />
              <TouchableOpacity
                style={modalStyle.modalBtn}
                onPress={() => goHpOpen()}
              >
                <CommonText fontWeight={'500'} color={ColorType.red}>
                  확인
                </CommonText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  ) : null;
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
