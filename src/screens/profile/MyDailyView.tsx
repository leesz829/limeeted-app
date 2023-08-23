import { RouteProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, ColorType, ScreenNavigationProp } from '@types';
import { get_item_matched_info } from 'api/models';
import CommonHeader from 'component/CommonHeader';
import SpaceView from 'component/SpaceView';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { findSourcePath, ICON, IMAGE } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
import VisualImage from 'component/match/VisualImage';
import AddInfo from 'component/match/AddInfo';
import ProfileActive from 'component/match/ProfileActive';
import InterviewRender from 'component/match/InterviewRender';
import MemberIntro from 'component/match/MemberIntro';
import { STACK } from 'constants/routes';


const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<StackParamList, 'MyDailyView'>;
  route: RouteProp<StackParamList, 'MyDailyView'>;
}

export default function MyDailyView(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { show } = usePopup(); // 공통 팝업

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // 본인 데이터
  const memberBase = useUserInfo();

  // 매칭 회원 관련 데이터
  const [data, setData] = useState<any>({
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
    use_item: {},
  });

  // ############################################################ 데일리 매칭 정보 조회
  const getItemMatchedInfo = async () => {
    try {

      const body = {
        match_member_seq: memberBase?.member_seq
      }

      const { success, data } = await get_item_matched_info(body);
      
      if (success) {
        if (data.result_code == '0000') {
          const auth_list = data?.second_auth_list.filter(item => item.auth_status == 'ACCEPT');

          setData({
            match_member_info: data?.match_member_info,
            profile_img_list: data?.profile_img_list,
            second_auth_list: auth_list,
            interview_list: data?.interview_list,
            interest_list: data?.interest_list,
            use_item: data?.use_item,
          });

          if(data?.match_member_info == null) {
            setIsLoad(false);
            setIsEmpty(true);
          } else {
            setIsLoad(true);
          }          
        } else {
          setIsLoad(false);
          setIsEmpty(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  // ################################################################ 초기 실행 함수
  useEffect(() => {
    if(isFocus) {
      setIsEmpty(false);
      // 데일리 매칭 정보 조회
      getItemMatchedInfo();
    }
  }, [isFocus]);


  return (
    isLoad ? (
      <>
        <CommonHeader title={'내 프로필 카드'} />

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>

          {/* ####################################################################################
          ####################### 상단 영역
          #################################################################################### */}

          {data?.profile_img_list.length > 0 ? (
            <View>
              <VisualImage 
                imgList={data?.profile_img_list} 
                memberData={data?.match_member_info} 
                isButton={false}
                isAnimation={false} />
            </View>
          ) : (
            <View style={{minHeight: height * 0.7, backgroundColor: '#D6D3D3', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'AppleSDGothicNeoEB00', color: '#FE0456'}}>사진을 등록해 주세요!</Text>
            </View>
          )}

          <View style={_styles.padding}>
            
            {/* ############################################################## 프로필 인증 영역 */}
            {data.second_auth_list.length > 0 ? (
              <ProfileAuth level={data.match_member_info.auth_acct_cnt} data={data.second_auth_list} isButton={false} />
            ) : (
              <SpaceView viewStyle={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={_styles.title}>프로필 인증</Text>
                <SpaceView mt={15} viewStyle={_styles.authEmptyArea}>
                  <SpaceView mb={13}><Text style={_styles.authEmptyTit}>프로필 인증 변경 심사 후 인증 레벨을 부여 받을 수 있어요.</Text></SpaceView>
                  <SpaceView mt={5} viewStyle={{paddingHorizontal: 20}}>
                    <TouchableOpacity 
                      onPress={() => { navigation.navigate(STACK.COMMON, { screen: 'SecondAuth', }); }}
                      hitSlop={commonStyle.hipSlop15}>
                      
                      <Text style={_styles.authEmptyBtn}>프로필 인증 변경</Text>
                    </TouchableOpacity>
                  </SpaceView>
                </SpaceView>
              </SpaceView>
            )}

            {/* ############################################################## 관심사 영역 */}
            {/* {data.interest_list.length > 0 && (
              <>
                <Text style={_styles.title}>{data.match_member_info.nickname}님의 관심사</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 13, marginBottom: 10 }}>
                  {data.interest_list.map((item, index) => {
                    const isOn = true;
                    return (
                      <View key={index} style={_styles.interestItem(isOn)}>
                        <Text style={_styles.interestText(isOn)}>{item.code_name}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )} */}

            {/* ############################################################## 추가 정보 영역 */}
            {/* <AddInfo memberData={data?.match_member_info} /> */}

            {/* ############################################################## 프로필 활동지수 영역 */}
            <ProfileActive memberData={data?.match_member_info} />

            {/* ############################################################## 소개 */}
            <MemberIntro memberData={data?.match_member_info} imgList={data?.profile_img_list} interestList={data?.interest_list} isNoDataArea={true} />

            {/* ############################################################## 인터뷰 영역 */}
            {data?.interview_list.length > 0 ? (
              <SpaceView mt={30}>
                <InterviewRender title={data?.match_member_info?.nickname + '님을\n알려주세요!'} dataList={data?.interview_list} />
              </SpaceView>
            ) : (
              <>
                <SpaceView mt={30} viewStyle={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={_styles.title}>{data?.match_member_info?.nickname}님을{'\n'}알려주세요!</Text>
                  <SpaceView mt={15} viewStyle={_styles.authEmptyArea}>
                    <SpaceView mb={13}>
                      <Text style={_styles.authEmptyTit}>
                        등록된 인터뷰가 없네요.{'\n'}
                        인터뷰를 등록하면 이성들의 관심을 더 많이 받을 수 있어요.
                      </Text>
                    </SpaceView>
                    <SpaceView mt={5} viewStyle={{paddingHorizontal: 20}}>
                      <TouchableOpacity 
                        onPress={() => { 
                          navigation.navigate(STACK.COMMON, { 
                            screen: 'Profile1',
                            params: {
                              isInterViewMove: true
                            },
                          }); 
                        }}
                        hitSlop={commonStyle.hipSlop15}>
                        
                        <Text style={_styles.authEmptyBtn}>인터뷰 등록하기</Text>
                      </TouchableOpacity>
                    </SpaceView>
                  </SpaceView>
                </SpaceView>
              </>
            )}          

          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </>
    ) : (
      <>
        
      </>
    )
  );
}


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
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
  title: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#333333',
    marginTop: 20,
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
    marginTop: width * 0.10,
  },
  boostPannel: {
    width: '100%',
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
  interestItem: (isOn) => {
    return {
      borderRadius: 5,
      backgroundColor: isOn ? 'white' : '#f7f7f7',
      paddingHorizontal: 15,
      paddingVertical: 4,
      marginRight: 6,
      marginBottom: 6,
      borderColor: isOn ? '#697AE6' : '#f7f7f7',
      borderWidth: 1,
    };
  },
  interestText: (isOn) => {
    return {
      fontFamily: 'AppleSDGothicNeoR00',
      fontSize: 12,
      lineHeight: 22,
      letterSpacing: 0,
      color: isOn ? '#697AE6' : '#b1b1b1',
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
    fontSize: 12,
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
  }
});
