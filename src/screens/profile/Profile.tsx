import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { ScrollView, View, Modal, TouchableOpacity, Alert, StyleSheet, Dimensions, Text } from 'react-native';
import * as React from 'react';
import { CommonBtn } from 'component/CommonBtn';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { ROUTES, STACK } from 'constants/routes';
import { clearPrincipal } from 'redux/reducers/authReducer';
import { useUserInfo } from 'hooks/useUserInfo';
import { update_setting, member_logout, update_member_exit, update_member_sleep } from 'api/models';
import { usePopup } from 'Context';
import { SUCCESS } from 'constants/reusltcode';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { isEmptyData } from 'utils/functions';


/* ################################################################################################################
###################################################################################################################
###### 내 계정 정보
###################################################################################################################
################################################################################################################ */

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Profile'>;
  route: RouteProp<StackParamList, 'Profile'>;
}

export const Profile = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get('window');

  const { show } = usePopup(); // 공통 팝업

  const memberBase = useUserInfo(); // 회원 기본정보

  const [emailId, setEmailId] = React.useState<any>(memberBase?.email_id);
  const [nickname, setNickname] = React.useState<any>(memberBase?.nickname);
  const [name, setName] = React.useState<any>(memberBase?.name);
  const [gender, setGender] = React.useState<any>(memberBase?.gender);
  const [age, setAge] = React.useState<any>(String(memberBase?.age));
  const [phoneNumber, setPhoneNumber] = React.useState<any>(
    memberBase?.phone_number
  );
  const [recommender, setRecommender] = React.useState<any>(memberBase?.recommender);
  

  // ###################################################################### 닉네임 저장 버튼
  const btnSaveNickName = async () => {
    let special_pattern = /[^a-zA-Z0-9ㄱ-힣]/g;

    if(nickname == '' || typeof nickname == 'undefined' || nickname == null || !nickname.trim()) {
			show({ content: '닉네임을 입력해 주세요.' });
			return;
		}

    if(nickname.length > 12 || special_pattern.test(nickname) == true) {
			show({ content: '한글, 영문, 숫자 12글자까지 입력할 수 있어요.' });
			return;
		}

    // 닉네임 변경 여부 체크
    if (memberBase?.nickname == nickname) {
      show({
        title: '알림',
        content: '동일한 닉네임 입니다.',
        confirmCallback: function() {

        },
      });

    } else {
      show({
        title: '닉네임 변경',
        content: '닉네임을 변경하시겠습니까?\n패스 x25',
        cancelCallback: function() {
  
        },
        confirmCallback: function() {
          let dataJson = {
            nickname: nickname,
            comment: '',
            match_yn: '',
            use_pass_yn: 'Y',
            friend_mathch_yn: '',
            recommender: '',
          };

          saveMemberBase(dataJson);
        },
      });
    }
  };

  // ###################################################################### 추천인 저장 버튼
  const btnSaveRecommender = async () => {

    if(!recommender) {
      show({
        title: '알림',
        content: '추천인을 입력해주세요.',
      });
    } else if (memberBase?.nickname == recommender) {
      show({
        title: '알림',
        content: '다른 회원의 닉네임만 추천할 수 있습니다.',
      });
    } else {
      show({
        title: '알림',
        content: '추천인을 등록하시겠습니까?',
        cancelCallback: function() {
  
        },
        confirmCallback: function() {
          let dataJson = {
            nickname: '',
            comment: '',
            match_yn: '',
            use_pass_yn: 'N',
            friend_mathch_yn: '',
            recommender: recommender,
          };
    
          saveMemberBase(dataJson);
        },
      });
    }
  }

	// ###################################################################### 비밀번호 변경 버튼
	const btnChangePassword = async () => {
		navigation.navigate('ChangePassword', {});
	};

  // ###################################################################### 내 계정 정보 저장
  const saveMemberBase = async (dataJson:any) => {
    const body = dataJson;
    try {
      const { success, data } = await update_setting(body);
      if (success) {
        if (data.result_code == '0000' || data.result_code == '0055') {
          dispatch(setPartialPrincipal({
            mbr_base : data.mbr_base
          }));

          //let content = data.result_code == '0055'?'입력하신 추천인이 등록되었습니다.':'저장되었습니다.';
          let content = '저장되었습니다.';

          if(isEmptyData(dataJson.nickname)) {
            content = '닉네임이 변경되었습니다.';
          } else if(isEmptyData(dataJson.recommender)) {
            content = '추천인이 등록되었습니다.';
          }

          show({
            type: 'RESPONSIVE',
            content: content,
          });

          /* navigation.navigate(STACK.TAB, {
            screen: 'Roby',
          }); */

        } else if (data.result_code == '6010') {
          show({ content: '보유 패스가 부족합니다.' });
          return false;
        } else if (data.result_code == '8005') {
          show({ content: '존재하지 않는 추천인 입니다.' });
          return false;
        } else if (data.result_code == '8006') {
          show({ content: '이미 사용하고 있는 닉네임 입니다.' });
          return false;
        } else {
          show({ content: '오류입니다. 관리자에게 문의해 주세요.' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ###################################################################### 휴면계정 전환하기
  const btnMemberSleep = async () => {
    show({
			title: '휴면회원 전환',
			content: '휴면회원 전환을 진행하시겠습니까?\n휴면회원 전환 시 보유하고 있는 아이템은 그대로 유지되며,\n상대방에게 회원님에 정보는 노출되지 않습니다.',
			cancelCallback: function() {},
			confirmCallback: function() {
				sleepProc();
			}
		});
  };

  // ###################################################################### 휴면계정 전환하기
  const sleepProc = async () => {
    const { success, data } = await update_member_sleep();
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            dispatch(clearPrincipal());
          break;
          default:
            show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          break;
        }
      
      } else {
        show({ content: '오류입니다. 관리자에게 문의해주세요.' });
      }
  }

  // ################### 팝업 관련 #####################
  const [nickNameUpdatePopup, setNicknameUpdatePopup] = React.useState(false); // 닉네임 변경 팝업

  const logout = async () => {
    console.log('logout');
    // #todo pushtoken 비워줄 로그아웃 api
    // await AsyncStorage.clear();
    //#todo mbr base = > principal reducer
    //navigation.navigate(STACK.AUTH, { screen: ROUTES.LOGIN });

    try {
      const { success, data } = await member_logout();
      if (success) {
        if (data.result_code == '0000') {
          dispatch(clearPrincipal());
        } else {
          show({ content: '오류입니다. 관리자에게 문의해주세요.' });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }

  };

  return (
    <>
      <CommonHeader title={'내 계정 정보'} />
      <ScrollView contentContainerStyle={[ styles.scrollContainerAll ]} style={{backgroundColor: '#fff'}}>

        <View style={commonStyle.paddingHorizontal20}>
          <SpaceView mb={40}>
            <CommonInput
              label={'계정'}
              value={emailId}
              disabled={true}
            />
          </SpaceView>

          <SpaceView mb={40}>

            <View style={{width: (width) / 1.45}}>
              <CommonInput
                label={'전화번호'}
                placeholder=""
                value={phoneNumber}
                disabled={true} />
            </View>

            <View style={[_styles.modfyHpBtn]}>
              <CommonBtn 
                value={'변경'} 
                type={'white'} 
                height={40} 
                width={70} 
                fontSize={14}
                borderRadius={5}
                onPress={() => {
                  navigation.navigate({
                    name : 'NiceAuth',
                    params : {
                      type : 'HP_MODFY'
                    }
                  });
                }} />
            </View>
          </SpaceView>

          <SpaceView mb={40}>

            <View style={{width: (width) / 1.45}}>
              <CommonInput
                label={'닉네임'}
                placeholder=""
                value={nickname}
                onChangeText={(nickname) => setNickname(nickname)}
                rightPen={false}
                maxLength={20}
              />
            </View>
            <View style={[_styles.modfyHpBtn]}>
              <CommonBtn 
                value={'저장'} 
                type={'blue'} 
                height={40} 
                width={70} 
                fontSize={14}
                borderRadius={5}
                onPress={() => {
                  btnSaveNickName();
                }} />
            </View>
          </SpaceView>

          <SpaceView mb={40}>
            <CommonInput
              label={'이름'}
              placeholder=""
              value={name}
              disabled={true}
            />
          </SpaceView>

          <SpaceView mb={24} viewStyle={styles.halfContainer}>
            <View style={styles.halfItemLeft}>
              <CommonInput
                label={'성별'}
                placeholder=""
                value={gender == 'M' ? '남자' : '여자'}
                disabled={true}
              />
            </View>

            <View style={styles.halfItemRight}>
              <CommonInput
                label={'나이'}
                placeholder=""
                value={age}
                disabled={true}
              />
            </View>
          </SpaceView>

          <SpaceView>
            <View style={{width: (width) / 1.45}}>
              <CommonInput
                label={'추천인'}
                placeholder="추천인의 닉네임을 입력해주세요."
                placeholderTextColor={'#c6ccd3'}
                value={recommender}
                onChangeText={(recommender) => setRecommender(recommender)}
                rightPen={false}
                disabled={memberBase?.recommender?true:false}
              />
            </View>
            {
              memberBase?.recommender ?
              <View style={[_styles.modfyHpBtn]}>
                <CommonBtn 
                  value={'저장'} 
                  type={'gray3'} 
                  height={40} 
                  width={70} 
                  fontSize={14}
                  borderRadius={5}
                  onPress={() => {}} />
              </View>
            : <View style={[_styles.modfyHpBtn]}>
                <CommonBtn 
                  value={'저장'} 
                  type={'blue'} 
                  height={40} 
                  width={70} 
                  fontSize={14}
                  borderRadius={5}
                  onPress={() => {
                    btnSaveRecommender();
                  }} />
              </View>
            }
          </SpaceView>

          <SpaceView mt={7} mb={40}>
            <Text style={_styles.recomDesc}>TIP.혜택 내용은 "최근소식"의 이벤트 안내를 확인해주세요.</Text>
          </SpaceView>

            {/* <SpaceView mb={24}>
                  <CommonInput 
                    label={'회사명'} 
                    placeholder="" />
            </SpaceView> */}

            {/* <SpaceView mb={24}>
                  <CommonInput label={'계정 ID'} placeholder="heighten@kakao.com" rightPen={true} />
            </SpaceView> */}

        </View>

        <SpaceView mb={40} mt={20} viewStyle={commonStyle.paddingHorizontal20}>
          <SpaceView mb={10}>
            <CommonBtn value={'개인정보 변경 및 관리'} type={'blackW'} borderRadius={12} onPress={btnChangePassword} />
          </SpaceView>

          <SpaceView>
            <CommonBtn value={'휴면회원 전환하기'} type={'blackW'} borderRadius={12} onPress={btnMemberSleep} />
          </SpaceView>
        </SpaceView>

        <SpaceView viewStyle={layoutStyle.rowBetween}>
          <View>
            <CommonBtn
              value={'로그아웃'} 
              type={'black'} 
              width={width}
              borderWidth={0}
              borderRadius={1}
              onPress={logout} />
          </View>

          {/* <View >
            <CommonBtn 
              value={'저장'} 
              type={'primary'}
              width={width/2}
              borderRadius={1}
              onPress={btnSave} />
          </View> */}
        </SpaceView>

      </ScrollView>
    </>
  );
};

const _styles = StyleSheet.create({
  modfyHpBtn: {
    position: 'absolute',
    right: 0,
    top: 21,
    height: '100%',
    justifyContent: 'center',
  },
  recomDesc: {
    fontSize: 13,
    fontFamily: 'AppleSDGothicNeoM00',
    backgroundColor: '#F6F7FE',
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: '#909090',
    borderRadius: 15,
  }

});