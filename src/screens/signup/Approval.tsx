import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { IMAGE, PROFILE_IMAGE, ICON } from 'utils/imageUtils';
import { RouteProp, useNavigation, } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { findSourcePath } from 'utils/imageUtils';
import { ROUTES } from 'constants/routes';


interface Props {
  navigation: StackNavigationProp<StackParamList, 'Approval'>;
  route: RouteProp<StackParamList, 'Approval'>;
}

export const Approval = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  
  const memberSeq = props.route.params.memberSeq;         // 회원 번호
  const gender = props.route.params.gender;               // 회원 성별
  const accessType = props.route.params.accessType;       // 접근 유형
  const refuseImgCnt = props.route.params.refuseImgCnt;   // 반려 이미지 갯수
  const refuseAuthCnt = props.route.params.refuseAuthCnt; // 반려 인증 갯수
  const mstImgPath = props.route.params.mstImgPath; // 대표이미지

  const authList = props.route.params.authList;

  // 반려 사유 데이터
  const getRefuseData = function() {
    let code = 'IMAGE';
    let text = '';
    if(accessType === 'REFUSE') {
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
    }
    return {code : code, text: text};
  }

  return (    
    <View style={[styles.container, layoutStyle.justifyCenter]}>

      <ScrollView style={[styles.scrollContainerAll, {marginBottom: 80}]}>
        <View style={layoutStyle.alignCenter}>
          <SpaceView mb={40} viewStyle={{position: 'relative'}}>
            <Image
              source={findSourcePath(mstImgPath)}
              style={styles.tmpImg} />
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

          <SpaceView mb={refuseImgCnt > 0 || refuseAuthCnt > 0 ? 30 : 150}>
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

        {(refuseImgCnt > 0 || (refuseAuthCnt > 0)) && (
          <>
            <SpaceView mb={30}>
              <View horizontal style={_styles.refuseTextArea}>
                <CommonText textStyle={_styles.refuseText01}>심사 반려 안내</CommonText>
                <CommonText textStyle={_styles.refuseText02}>
                  가입 기준에 맞지 않거나 증빙 자료가 불충분한 대상이 있어요.{'\n'}
                  "프로필 수정하기"를 이용해 재심사 신청을 해주세요.
                </CommonText>

                <ScrollView horizontal style={_styles.refuseIconArea}>
                  {refuseImgCnt > 0 &&
                    <>
                      <View style={_styles.refuseIconItem}>
                        <Image source={gender == 'W' ? ICON.refuseFemaleIcon : ICON.refuseMaleIcon} style={_styles.refuseIcon} />
                        <CommonText textStyle={_styles.refuseIconText}>사진</CommonText>
                      </View>
                    </>
                  }

                  {authList.map((item:any, index) => {
                    if(item.auth_status == 'REFUSE') {
                      return (
                        <View style={_styles.refuseIconItem}>
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

      
      

      <SpaceView viewStyle={styles.bottomBtnContainer} mb={5}>
        <CommonBtn
          value={'프로필 수정하기'}
          type={'blue2'}
          onPress={() => {
            if(accessType == 'REFUSE') {
              if(getRefuseData().code == 'ALL' || getRefuseData().code == 'AUTH') {
                navigation.navigate(ROUTES.SIGNUP01, {
                  memberSeq: memberSeq,
                  gender: gender,
                });
              } else if(getRefuseData().code == 'IMAGE') {
                navigation.navigate(ROUTES.SIGNUP02, {
                  memberSeq: memberSeq,
                  gender: gender,
                });
              }
            } else {
              navigation.navigate(ROUTES.SIGNUP01, {
                memberSeq: memberSeq,
                gender: gender,
              });
            }
          }}
        />
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
    fontSize: 13,
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
});