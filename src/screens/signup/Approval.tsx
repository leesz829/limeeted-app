import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { IMAGE, PROFILE_IMAGE, ICON } from 'utils/imageUtils';
import { RouteProp, useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { findSourcePath } from 'utils/imageUtils';
import { ROUTES } from 'constants/routes';
import { get_member_approval, join_cancel } from 'api/models';
import { usePopup } from 'Context';
import { isEmptyData } from 'utils/functions';


interface Props {
  navigation: StackNavigationProp<StackParamList, 'Approval'>;
  route: RouteProp<StackParamList, 'Approval'>;
}

export const Approval = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const { show } = usePopup();
  const isFocus = useIsFocused();
  
  const memberSeq = props.route.params.memberSeq;         // 회원 번호

  // 심사 데이터
  const [apprData, setApprData] = React.useState({
    result_code: '',
    refuseImgCnt: 0,
    refuseAuthCnt: 0,
    authList: [],
    gender: '',
    mstImgPath: '',
    ci: '',
    name: '',
    mobile: '',
    birthday: '',
    emailId: '',
  });

  // ############################################################ 가입심사 정보 조회
  const getApprovalInfo = async () => {
    const body = {
      member_seq : memberSeq
    };
    const { success, data } = await get_member_approval(body);
      if(success) {
        if(isEmptyData(data.mbr_base)) {
          setApprData({
            ...apprData,
            result_code: data.result_code,
            refuseImgCnt: data.refuse_img_cnt,
            refuseAuthCnt: data.refuse_auth_cnt,
            authList: data.mbr_second_auth_list,
            gender: data.mbr_base.gender,
            mstImgPath: data.mbr_base.mst_img_path,
            ci: data.mbr_base.ci,
            name: data.mbr_base.name,
            mobile: data.mbr_base.phone_number,
            birthday: data.mbr_base.birthday,
            emailId: data.mbr_base.email_id,
          });
        };
      } else {
        show({ content: '오류입니다. 관리자에게 문의해주세요.' });
      }
  };


  // 반려 사유 데이터
  const getRefuseData = function() {
    let code = 'IMAGE';
    let text = '';
    /* if(accessType === 'REFUSE') {
      if(refuseImgCnt > 0 && refuseAuthCnt > 0) {
        code = 'ALL';
        text += '프로필 사진, 프로필 인증';
      } else if(refuseImgCnt > 0) {
        code = 'IMAGE';
        text += '프로필 사진';
      } else if(refuseAuthCnt > 0) {
        code = 'AUTH';
        text += '프로필 인증';
      }
    } */

    if(apprData.refuseImgCnt > 0 && apprData.refuseAuthCnt > 0) {
      code = 'ALL';
      text += '프로필 사진, 프로필 인증';
    } else if(apprData.refuseImgCnt > 0) {
      code = 'IMAGE';
      text += '프로필 사진';
    } else if(apprData.refuseAuthCnt > 0) {
      code = 'AUTH';
      text += '프로필 인증';
    }

    return {code : code, text: text};
  };

  // ########################################################################## 수정하기 버튼
  const modifyBtn = async () => {
    if(apprData.result_code == '0003') {
      if(apprData.refuseAuthCnt > 0) {
        goJoin('01');
      } else if(apprData.refuseImgCnt > 0) {
        goJoin('02');
      }
    } else {
      goJoin('01');
    };
  };

  // ########################################################################## 탈퇴하기 버튼
  const exitBtn = async () => {
    show({
			title: '회원 탈퇴',
			content: '회원 탈퇴는 24시간 뒤 완료 처리되며, 암호화된\n모든 개인정보는 자동으로 폐기됩니다.\n단, 24시간 이내에 로그인 시 회원 탈퇴는 자동 철회됩니다.',
      cancelBtnText: '취소하기',
			cancelCallback: function() {},
			confirmCallback: function() {
				exitProc();
			}
		});
  };

  // ########################################################################## 회원가입 이동
  const goJoin = async (status:string) => {

    navigation.navigate(ROUTES.SIGNUP_IMAGE, {
      memberSeq: memberSeq,
      gender: apprData.gender,
    });
    

    return;

    if(status == '01') {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Login01' },
            { 
              name: ROUTES.APPROVAL ,
              params: {
                memberSeq: memberSeq,
              }
            },
            {
              name: ROUTES.SIGNUP_PASSWORD,
              params: {
                ci: apprData.ci,
                name: apprData.name,
                gender: apprData.gender,
                mobile: apprData.mobile,
                birthday: apprData.birthday,
                memberSeq: memberSeq,
                emailId: apprData.emailId
              }
            },
            {
              name: ROUTES.SIGNUP01,
              params: {
                memberSeq: memberSeq,
                gender: apprData.gender,
              }
            },
          ],
        })
      );
    } else if(status == '02') {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Login01' },
            { 
              name: ROUTES.APPROVAL ,
              params: {
                memberSeq: memberSeq,
              }
            },
            {
              name: ROUTES.SIGNUP_PASSWORD,
              params: {
                ci: apprData.ci,
                name: apprData.name,
                gender: apprData.gender,
                mobile: apprData.mobile,
                birthday: apprData.birthday,
                memberSeq: memberSeq,
                emailId: apprData.emailId
              }
            },
            {
              name: ROUTES.SIGNUP01,
              params: {
                memberSeq: memberSeq,
                gender: apprData.gender,
              }
            },
            {
              name: ROUTES.SIGNUP02,
              params: {
                memberSeq: memberSeq,
                gender: apprData.gender,
              }
            },
          ],
        })
      );
    }
  };

  // ########################################################################## 탈퇴 처리
  const exitProc = async () => {
    const body = {
      member_seq : memberSeq
    };
    const { success, data } = await join_cancel(body);
    if(success) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Login01' },
          ],
        })
      );
    } else {
      show({ content: '오류입니다. 관리자에게 문의해주세요.' });
    }
  };

  // ########################################################################## 초기 실행
  React.useEffect(() => {
    if(isFocus) {
      getApprovalInfo();
    };

  }, [isFocus]);

  return (
    <View style={[styles.container, layoutStyle.justifyCenter]}>

      <ScrollView style={[styles.scrollContainerAll, { marginBottom: 80 }]}>
        <View style={layoutStyle.alignCenter}>
          <SpaceView mb={40} viewStyle={{position: 'relative'}}>
            {isEmptyData(apprData.mstImgPath) ? (
              <Image source={findSourcePath(apprData.mstImgPath)} style={styles.tmpImg} />
            ) : (
              <View style={styles.tmpImg} />
            )}
            <View style={{position: 'absolute', top: 35, left: -30}}>
              <Image
                source={ICON.heartPurple}
                style={[styles.iconSize60]} />
            </View>
            <View style={{position: 'absolute', bottom: 35, right: -30}}>
              <Image
                source={ICON.heartPurple}
                style={[styles.iconSize60]} />
            </View>
          </SpaceView>

          <SpaceView mb={apprData.refuseImgCnt > 0 || apprData.refuseAuthCnt > 0 ? 30 : 150}>
            <View style={commonStyle.mb15}>
              <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'} color={'#697AE6'}>
                가입 심사 진행중
              </CommonText>
              <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'} color={'#000000'}>
                심사 기간은 1 ~ 3일 이며,
              </CommonText>
            </View>
            <View style={commonStyle.mb15}>
              <CommonText textStyle={layoutStyle.textCenter} type={'h5'} color={'#818181'} fontWeight={'500'}>
                결과는 PUSH 메세지로 전송됩니다.
              </CommonText>
            </View>

            {/* {accessType == 'REFUSE' ? (
              <>
                <View style={commonStyle.mb15}>
                  <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'}>심사 결과</CommonText>
                  <SpaceView mt={5}>
                    <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'} color={ColorType.primary}>반려</CommonText>
                  </SpaceView>
                </View>
                <View style={commonStyle.mb15}>
                  <CommonText textStyle={_styles.refuseText} type={'h5'} color={'#6E6E6E'}>
                    심사 진행 결과 아쉽게도 반려되었음을 안내드립니다.{'\n'}
                    아래 '프로필 수정하기'를 메뉴에 반려 사유 확인 및{'\n'}
                    재심사 요청을 해주시면 재심사가 진행됩니다.
                  </CommonText>
                </View>
                <View>
                  <CommonText textStyle={layoutStyle.textCenter} type={'h5'}>
                    반려사유 : {getRefuseData().text}
                  </CommonText>
                </View>
              </>
            ) : (
              <>
                <View style={commonStyle.mb15}>
                  <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'} color={'#697AE6'}>
                    가입 심사가 진행중
                  </CommonText>
                  <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'700'} color={'#000000'}>
                    심사 기간은 1 ~ 3일 이며,
                  </CommonText>
                </View>
                <View style={commonStyle.mb15}>
                  <CommonText textStyle={layoutStyle.textCenter} type={'h5'} color={'#818181'} fontWeight={'500'}>
                    결과는 PUSH 메세지로 전송됩니다.
                  </CommonText>
                </View>
              </>
            )} */}
          </SpaceView>
        </View>

        {(apprData.refuseImgCnt > 0 || (apprData.refuseAuthCnt > 0)) && (
          <>
            <SpaceView mb={30}>
              <View style={_styles.refuseTextArea}>
                <CommonText textStyle={_styles.refuseText01}>심사 반려 안내</CommonText>
                <CommonText textStyle={_styles.refuseText02}>
                  가입 기준에 맞지 않거나 증빙 자료가 불충분한 항목이 있어요.{'\n'}
                  "프로필 수정하기"를 이용하여 상세 반려 사유 확인 및 재심사 신청을 해주세요.
                </CommonText>

                <ScrollView horizontal style={_styles.refuseIconArea}>
                  {apprData.refuseImgCnt > 0 &&
                    <>
                      <View style={_styles.refuseIconItem}>
                        <Image source={apprData.gender == 'W' ? ICON.refuseFemaleIcon : ICON.refuseMaleIcon} style={_styles.refuseIcon} />
                        <CommonText textStyle={_styles.refuseIconText}>사진</CommonText>
                      </View>
                    </>
                  }

                  {apprData.authList.map((item:any, index) => {
                    if(item.auth_status == 'REFUSE') {
                      return (
                        <View key={index} style={_styles.refuseIconItem}>
                          {item.common_code == 'JOB' && <Image source={ICON.refuseJobIcon} style={_styles.refuseIcon} />}
                          {item.common_code == 'EDU' && <Image source={ICON.refuseEduIcon} style={_styles.refuseIcon} />}
                          {item.common_code == 'INCOME' && <Image source={ICON.refuseIncomeIcon} style={_styles.refuseIcon} />}
                          {item.common_code == 'ASSET' && <Image source={ICON.refuseAssetIcon} style={_styles.refuseIcon} />}
                          {item.common_code == 'SNS' && <Image source={ICON.refuseSnsIcon} style={_styles.refuseIcon} />}
                          {item.common_code == 'VEHICLE' && <Image source={ICON.refuseVehicleIcon} style={_styles.refuseIcon} />}
                          <CommonText textStyle={_styles.refuseIconText}>{item.code_name}</CommonText>
                        </View>
                      )
                    }
                  })}
                </ScrollView>
              </View>
            </SpaceView>
          </>
        )}
      </ScrollView>

      <SpaceView pl={16} pr={16} viewStyle={styles.bottomBtnContainer}>
        <SpaceView mb={5}>
          <TouchableOpacity onPress={() => { modifyBtn(); }}>
            <Text style={_styles.btnText('MOD')}>프로필 수정하기</Text>
          </TouchableOpacity>
        </SpaceView>
        <SpaceView>
          <TouchableOpacity onPress={() => { exitBtn(); }}>
            <Text style={_styles.btnText('EXIT')}>
              탈퇴하기{'\n'}
              <Text style={_styles.exitDescText}>가입 시 작성한 회원 정보 삭제 및 탈퇴 처리</Text>
            </Text>
          </TouchableOpacity>
        </SpaceView>
      </SpaceView>
    </View>
  );
};


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  refuseText: {
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeoM00',
    lineHeight: 20,
  },
  refuseTextArea: {
    backgroundColor: '#F6F7FE',
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  refuseText01: {
    color: '#262626',
    fontSize: 14,
    fontFamily: 'AppleSDGothicNeoEB00',
  },
  refuseText02: {
    color: '#8E8E8E',
    fontSize: 12,
    fontFamily: 'AppleSDGothicNeoM00',
    lineHeight: 18,
  },
  refuseIconArea: {
    flexDirection: 'row',
    marginTop: 15,
    overflow: 'scroll',
  },
  refuseIconItem: {
    marginRight: 18,
  },
  refuseIcon: {
    width: 41,
    height: 42,
    marginBottom: 5,
  },
  refuseIconText: {
    backgroundColor: '#697AE6',
    color: '#fff',
    fontSize: 11,
    fontFamily: 'AppleSDGothicNeoM00',
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    lineHeight: 20,
  },
  btnText: (type: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: 15,
      color: type == 'MOD' ? '#697AE6' : '#707070',
      textAlign: 'center',
      borderColor: type == 'MOD' ? '#697AE6' : '#707070',
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: type == 'MOD' ? 11 : 5,
    };
  },
  exitDescText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 10,
    color: '#B5B5B5',
  },
});