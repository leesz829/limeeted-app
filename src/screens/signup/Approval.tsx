import { layoutStyle, styles, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { View, Image } from 'react-native';
import { IMAGE, PROFILE_IMAGE, ICON } from 'utils/imageUtils';
import { RouteProp, useNavigation } from '@react-navigation/native';
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

  console.log('mstImgPath :::::::: ' , props.route.params.mstImgPath);
  
  const memberSeq = props.route.params.memberSeq;         // 회원 번호
  const gender = props.route.params.gender;               // 회원 성별
  const accessType = props.route.params.accessType;       // 접근 유형
  const refuseImgCnt = props.route.params.refuseImgCnt;   // 반려 이미지 갯수
  const refuseAuthCnt = props.route.params.refuseAuthCnt; // 반려 인증 갯수
  const mstImgPath = props.route.params.mstImgPath; // 대표이미지

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

        <SpaceView mb={150}>

          {accessType == 'REFUSE' ? (
            <>
              <View style={commonStyle.mb15}>
                <CommonText textStyle={layoutStyle.textCenter} type={'h3'} fontWeight={'500'}>
                  가입 승인 부적격 안내
                </CommonText>
              </View>
              <View style={commonStyle.mb15}>
                <CommonText textStyle={layoutStyle.textCenter} type={'h5'} color={'#6E6E6E'}>
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
          )}
        </SpaceView>
      </View>
      <SpaceView viewStyle={styles.bottomBtnContainer} mb={20}>
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
