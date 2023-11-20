import * as React from 'react';
import { RouteProp, useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp } from '@types';
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE } from 'utils/imageUtils';
import SpaceView from 'component/SpaceView';
import LinearGradient from 'react-native-linear-gradient';
import { STACK, ROUTES } from 'constants/routes';
import { modalStyle, layoutStyle, commonStyle, styles } from 'assets/styles/Styles';
import { isEmptyData } from 'utils/functions';
import { useUserInfo } from 'hooks/useUserInfo';


const { width, height } = Dimensions.get('window');

export default function MemberIntro({ memberData, isEditBtn, isNoDataArea, faceList }) {
  const navigation = useNavigation<ScreenNavigationProp>();

  const memberBase = useUserInfo();

  return (
    <>
      {((isEmptyData(memberData?.height) || isEmptyData(memberData?.form_body) || isEmptyData(memberData?.job_name) || isEmptyData(memberData?.religion) ||
        isEmptyData(memberData?.drinking) || isEmptyData(memberData?.smoking)) || isNoDataArea) ? (

        <SpaceView>

          <SpaceView mb={10} viewStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <SpaceView>
              <Text style={_styles.introTitleText}>{memberData?.nickname}님의 간단 소개🙂</Text>
            </SpaceView>

            {(isEmptyData(isEditBtn) && isEditBtn) && (
              <TouchableOpacity 
                onPress={() => { navigation.navigate(STACK.COMMON, { screen: ROUTES.PROFILE_ADDINFO }); }} 
                style={_styles.modBtn}>
                <Image source={ICON.squarePen} style={styles.iconSize16} />
                <Text style={_styles.modBtnText}>수정</Text>
              </TouchableOpacity>
            )}
          </SpaceView>

          {/* ############################################################################################### 간단 소개 영역 */}
          <LinearGradient
            colors={['#F1B10E', '#EEC80C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={_styles.introWrap}
          >
            {faceList.length > 0 &&
              <SpaceView>
                <SpaceView mb={5} viewStyle={{flexDirection: 'row'}}>
                  <SpaceView viewStyle={_styles.faceArea}>
                    <Text style={_styles.faceText}>#{faceList}</Text>
                  </SpaceView>
                </SpaceView>
                <SpaceView mt={2}>
                  <Text style={_styles.faceDesc}>LIVE에서 HOT한 반응을 받으셨어요!</Text>
                </SpaceView>
              </SpaceView>
            }

            <SpaceView mt={40}>
              {(isEmptyData(memberData?.height) || isEmptyData(memberData?.form_body) || isEmptyData(memberData?.job_name) || isEmptyData(memberData?.religion) ||
                isEmptyData(memberData?.drinking) || isEmptyData(memberData?.smoking)) ? (

                  <SpaceView>
                    <Text style={_styles.addText}>
    
                      {(isEmptyData(memberData?.height) || isEmptyData(memberData?.form_body) || isEmptyData(memberData?.job_name)) && (
                        <>
                          저는{' '}
                          {isEmptyData(memberData?.height) && (
                            <>
                              <Text style={_styles.addActiveText}>{memberData?.height}cm</Text>
                              {(isEmptyData(memberData?.form_body) || isEmptyData(memberData?.job_name)) ? (
                                <>이고, </>
                              ) : (
                                <> 입니다.{'\n'}</>
                              )}
                            </>
                          )}
                          {isEmptyData(memberData?.form_body) && (
                            <>
                              {memberData?.gender == 'M' ? (
                                <>
                                  {(memberData?.form_body == 'NORMAL' || memberData?.form_body == 'SKINNY') && (
                                    <>
                                      <Text style={_styles.addActiveText}>{memberData?.form_body == 'NORMAL' ? '보통 체형' : memberData?.form_body_type}</Text>
                                      {isEmptyData(memberData?.job_name) ? (
                                        <>의 </>
                                      ) : (
                                        <>입니다.{'\n'}</>
                                      )}
                                    </>
                                  )}
                                  {memberData?.form_body == 'FIT' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? (
                                        <>
                                          <Text style={_styles.addActiveText}>헬스를 즐기는</Text>{' '}
                                        </>
                                      ) : (
                                        <>
                                          평소에 <Text style={_styles.addActiveText}>헬스를 즐기는</Text> 편이에요.{'\n'}
                                        </>
                                      )} 
                                    </> 
                                  )}
                                  {memberData?.form_body == 'GIANT' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>건장한 피지컬</Text>의{' '}
                                        </>
                                      ) : ( 
                                        <>
                                          <Text style={_styles.addActiveText}>건장한 피지컬</Text>의 소유자 입니다.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'SLIM' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>운동을 즐기는</Text>{' '}
                                        </>
                                      ) : ( 
                                        <>
                                          <Text style={_styles.addActiveText}>운동으로 단련된 몸</Text>을 갖고 있어요.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'CHUBBY' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>통통한</Text> 체형의{' '}
                                        </>
                                      ) : ( 
                                        <>
                                          <Text style={_styles.addActiveText}>통통한</Text> 체형 입니다.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                </>
                              ) : (
                                <>
                                  {(memberData?.form_body == 'NORMAL' || memberData?.form_body == 'SEXY' || memberData?.form_body == 'CHUBBY') && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>{memberData?.form_body_type}</Text> 체형의{' '}
                                        </>
                                      ) : (
                                        <>
                                          <Text style={_styles.addActiveText}>{memberData?.form_body_type}</Text> 체형 입니다.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'SKINNY' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>날씬한</Text> 체형의{' '}
                                        </>
                                      ) : (
                                        <>
                                          매끄럽고 <Text style={_styles.addActiveText}>날씬한</Text> 체형 이에요.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'GLAMOUR' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <Text style={_styles.addActiveText}>글래머러스한{' '}</Text>
                                      ) : (
                                        <>
                                          <Text style={_styles.addActiveText}>글래머러스{' '}</Text>합니다.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'COMPACT' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>아담한 </Text>체형의{' '}
                                        </>
                                      ) : (
                                        <>
                                          <Text style={_styles.addActiveText}>아담하고 귀여운{' '}</Text>편이에요.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                  {memberData?.form_body == 'MODEL' && (
                                    <>
                                      {isEmptyData(memberData?.job_name) ? ( 
                                        <>
                                          <Text style={_styles.addActiveText}>비율이 좋은</Text>{' '}
                                        </>
                                      ) : (
                                        <>
                                          <Text style={_styles.addActiveText}>비율이 좋은{' '}</Text>편입니다.{'\n'}
                                        </>
                                      )}
                                    </> 
                                  )}
                                </>
                              )}
                            </>
                          )}

                          {isEmptyData(memberData?.job_name) && (
                            <>
                              <Text style={_styles.addActiveText}>{memberData?.job_name}</Text> 입니다.{'\n'}
                            </>
                          )}
                        </>
                      )}
    
                      {(isEmptyData(memberData?.religion) || isEmptyData(memberData?.drinking)) && (
                        <>
                          {isEmptyData(memberData?.religion) && (
                            <>
                              종교는{' '}
                              
                              {memberData?.religion == 'NONE' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      <Text style={_styles.addActiveText}>무신론자</Text>이며{' '}
                                    </>
                                  ) : (
                                    <>
                                      <Text style={_styles.addActiveText}>무신론자{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </> 
                              }
                              {memberData?.religion == 'THEIST' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      <Text style={_styles.addActiveText}>무교이지만 신앙은 존중</Text>하며{' '}
                                    </>
                                  ) : (
                                    <>
                                      <Text style={_styles.addActiveText}>무교이지만 신앙은 존중{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </> 
                              }
                              {memberData?.religion == 'JEJUS' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>기독교</Text>이고{' '}
                                    </>
                                  ) : (
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>기독교{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </>
                              }
                              {memberData?.religion == 'BUDDHA' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>불교</Text>이고{' '}
                                    </>
                                  ) : (
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>불교{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </>
                              }
                              {memberData?.religion == 'ALLAH' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>이슬람교</Text>이고{' '}
                                    </>
                                  ) : (
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>이슬람교{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </>
                              }
                              {memberData?.religion == 'MARIA' &&
                                <>
                                  {isEmptyData(memberData?.drinking) ? ( 
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>천주교</Text>이고{' '}
                                    </>
                                  ) : (
                                    <>
                                      신앙이 있으며{' '}<Text style={_styles.addActiveText}>천주교{' '}</Text>입니다.{'\n'}
                                    </>
                                  )}
                                </>
                              }
                            </>
                          )}
    
                          {isEmptyData(memberData?.drinking) && (
                            <>
                              {memberData?.drinking == 'NONE' &&
                                <>
                                  술은 <Text style={_styles.addActiveText}>멀리하며</Text> 마시지 않습니다.{'\n'}
                                </>
                              }
                              {memberData?.drinking == 'LIGHT' &&
                                <>
                                  술은 <Text style={_styles.addActiveText}>가볍게 즐기는</Text> 편이에요.{'\n'}
                                </>
                              }
                              {memberData?.drinking == 'HARD' &&
                                <>
                                  술은 <Text style={_styles.addActiveText}>자주 즐기는</Text> 편이에요.{'\n'}
                                </>
                              }
                            </>
                          )}
                        </>
                      )}
    
                      {isEmptyData(memberData?.smoking) && (
                        <>
                          {memberData?.smoking == 'NONE' &&
                            <>
                              그리고 <Text style={_styles.addActiveText}>비흡연가</Text>이니 참고해 주세요.
                            </>
                          }
                          {memberData?.smoking == 'LIGHT' &&
                            <>
                              <Text style={_styles.addActiveText}>흡연은 가끔</Text> 하는 편이니 참고해 주세요.
                            </>
                          }
                          {memberData?.smoking == 'HARD' &&
                            <>
                            <Text style={_styles.addActiveText}>애연가</Text>이니 참고해 주세요.
                          </>
                          }
                        </>
                      )}
    
                    </Text>
                  </SpaceView>

              ) : (
                <>
                  {isNoDataArea &&
                    <SpaceView mt={15} viewStyle={_styles.authEmptyArea}>
                      <SpaceView mb={13}>
                        <Text style={_styles.authEmptyTit}>
                          등록된 소개 정보가 없어요.{'\n'}
                          나를 궁금해 할 이성을 위해 소개 정보를 입력해 주세요.
                        </Text>
                      </SpaceView>
                      <SpaceView mt={5} viewStyle={{paddingHorizontal: 20}}>
                        <TouchableOpacity 
                          onPress={() => { navigation.navigate(STACK.COMMON, { screen: 'Introduce' }); }}
                          hitSlop={commonStyle.hipSlop15}>
                          
                          <Text style={_styles.authEmptyBtn}>소개 정보 등록하기</Text>
                        </TouchableOpacity>
                      </SpaceView>
                    </SpaceView>
                  }
                </>
              )}
            </SpaceView>
          </LinearGradient>
        </SpaceView>
      ) : (
        <>

        </>
      )}
    </>
  );

}


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({

  introWrap: {
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  faceArea: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#FFF8CC',
    borderRadius: 20,
  },
  faceText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    color: '#4A4846',
  },
  faceDesc: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    color: '#FFF8CC',
  },
  introTitleText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    color: '#EEEAEB',
  },
  addText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#4A4846',
    textAlign: 'left',
    lineHeight: 20,
  },
  addActiveText: {
    color: '#FFF8CC',
    textAlign: 'left',
  },
  interestTitle: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    color: '#333333',
    textAlign: 'left',
  },
  interestWrap: {
    
  },
  interestItem: (isOn) => {
    return {
      borderRadius: 5,
      backgroundColor: isOn ? '#0D9BA3' : '#FFF8CC',
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 6,
      marginBottom: 6,
      overflow: 'hidden',
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'Pretendard-Regular',
      fontSize: 12,
      color: isOn ? '#FFF8CC' : '#FE8C12',
    };
  },
  authEmptyArea: {
    width: '100%',
    backgroundColor: '#ffffff', 
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1, 
    borderRadius: 10, 
    borderColor: '#8E9AEB', 
    borderStyle: 'dotted',
  },
  authEmptyTit: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 11,
    color: '#7986EE',
    textAlign: 'center',
  },
  authEmptyBtn: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#697AE6',
    borderRadius: 7,
    textAlign: 'center',
    paddingVertical: 8,
  },
  modBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  modBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#D5CD9E',
    marginLeft: 3,
  },
});