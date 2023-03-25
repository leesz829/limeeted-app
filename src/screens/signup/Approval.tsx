import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image } from 'react-native';
import { IMAGE } from 'utils/imageUtils';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
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

  // 반려 사유 데이터
  const getRefuseData = function() {
    let code = 'IMAGE';
    let text = '프로필 사진';
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
      <View style={layoutStyle.alignCenter}>
        <SpaceView>
          <Image
            source={IMAGE.logoMark}
            style={styles.logoMark}
            resizeMode="contain"
          />
        </SpaceView>
        <SpaceView mb={25}>
          <Image
            source={IMAGE.logoText}
            style={styles.logo}
            resizeMode="contain"
          />
        </SpaceView>

        <SpaceView mb={50}>

          {accessType == 'REFUSE' ? (
            <>
              <View style={commonStyle.mb15}>
                <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'500'}>
                  가입 승인 부적격 안내
                </CommonText>
              </View>
              <View style={commonStyle.mb15}>
                <CommonText textStyle={layoutStyle.textCenter} type={'h5'}>
                  정성스레 작성해주신 프로필에 심사기준에{'\n'}
                  맞지 않는 사항이 있어 프로필 수정을 요청드려요.{'\n'}
                  반려사유를 확인하여 프로필을 수정해주세요.
                </CommonText>
              </View>
              <View>
                <CommonText textStyle={layoutStyle.textCenter} type={'h5'}>
                  반려사유 : {getRefuseData().text}
                </CommonText>
              </View>
            </>
          ) : (
            <CommonText textStyle={layoutStyle.textCenter}>
              가입 심사가 진행 중입니다.{'\n'}
              심사 기간은 1~3일이며,{'\n'}
              결과는 PUSH 메시지로 전송됩니다.
            </CommonText>
          )}
        </SpaceView>
      </View>
      <SpaceView viewStyle={styles.bottomBtnContainer} mb={20}>
        <CommonBtn
          value={'프로필 수정하기'}
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
