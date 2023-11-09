import { RouteProp, useIsFocused, useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomParamList, ColorType, ScreenNavigationProp } from '@types';
import {
  get_daily_matched_info,
  report_check_user,
  report_check_user_confirm,
  update_additional,
} from 'api/models';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import { usePopup } from 'Context';
import { useUserInfo } from 'hooks/useUserInfo';
import * as React from 'react';
import { styles, modalStyle, layoutStyle, commonStyle } from 'assets/styles/Styles';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { useDispatch } from 'react-redux'; 
import { myProfile } from 'redux/reducers/authReducer';
import { MatchSearch } from 'screens/matching/MatchSearch';
import { findSourcePath, ICON, IMAGE, GUIDE_IMAGE, GIF_IMG } from 'utils/imageUtils';
import { Slider } from '@miblanchard/react-native-slider';
import ProfileAuth from 'component/ProfileAuth';
import { formatNowDate, isEmptyData } from 'utils/functions';
import { Watermark } from 'component/Watermark';
import InterestSendPopup from 'screens/commonpopup/InterestSendPopup';
import SincereSendPopup from 'screens/commonpopup/SincereSendPopup';
import Carousel from 'react-native-snap-carousel';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { ROUTES, STACK } from 'constants/routes';
import AsyncStorage from '@react-native-community/async-storage';
import { clearPrincipal } from 'redux/reducers/authReducer';
import LinearGradient from 'react-native-linear-gradient';



const { width, height } = Dimensions.get('window');
interface Props {
  navigation: StackNavigationProp<BottomParamList, 'MatchingList'>;
  route: RouteProp<BottomParamList, 'MatchingList'>;
}

export default function MatchingList(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const scrollRef = React.useRef();

  const { show } = usePopup(); // 공통 팝업

  // 로딩 상태 체크
  const [isLoad, setIsLoad] = React.useState(false);
  const [isEmpty, setIsEmpty] = React.useState(false);

  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

  // 본인 데이터
  const memberBase = useUserInfo();

  // 매칭 회원 관련 데이터
  const [matchData, setMatchData] = React.useState<any>({
    match_member_info: {},
    profile_img_list: [],
    second_auth_list: [],
    interview_list: [],
    interest_list: [],
    report_code_list: [],
    safe_royal_pass: Number,
    use_item: {},
    refuse_list: [],
    add_list: [],
    intro_second_yn: '',
  });

  // 팝업 목록
  let popupList = [];
  let isPopup = true;  

  // ############################################################ 데일리 매칭 정보 조회
  const getDailyMatchInfo = async (isPopupShow:boolean) => {

    // 기존 데이터 존재 여부
    let ordMemberSeq = matchData?.match_member_info?.member_seq;

    try {
      const body = {
        gender: memberBase.gender
      }
      const { success, data } = await get_daily_matched_info(body);
      //console.log('get_daily_matched_info data :::: ', data.use_item.FREE_LIKE);
      
      if (success) {
        if (data.result_code == '0000') {

          const auth_list = data?.second_auth_list.filter(item => item.auth_status == 'ACCEPT');
          setMatchData({
            match_member_info: data?.match_member_info,
            profile_img_list: data?.profile_img_list,
            second_auth_list: auth_list,
            interview_list: data?.interview_list,
            interest_list: data?.interest_list,
            report_code_list: data?.report_code_list,
            safe_royal_pass: data?.safe_royal_pass,
            use_item: data?.use_item,
            refuse_list: data?.refuse_list,
            add_list: data?.profile_add_list,
            intro_second_yn: data?.intro_second_yn,
          });

          if(data?.match_member_info == null) {
            setIsLoad(false);
            setIsEmpty(true);
          } else {
            setIsLoad(true);
          }

          // 이벤트 팝업 노출
          if(data.popup_list?.length > 0) {
            popupList = data.popup_list;

            // 튜토리얼 팝업 닫혀있는 경우 호출
            if(isPopupShow) {
              popupShow();
            }
          };

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

  // ############################################################ 팝업 활성화
  const popupShow = async () => {
    if(popupList.length > 0 && isPopup) {
      let type = popupList[0].type;  // 팝업 유형
      let nowDt = formatNowDate().substring(0, 8);
      let endDt = await AsyncStorage.getItem('POPUP_ENDDT_' + type);

      if(null == endDt || endDt < nowDt) {
        show({
          type: 'EVENT',
          eventType: 'EVENT',
          eventPopupList: popupList,
          confirmCallback: async function(isNextChk) {
            if(isNextChk) {
              // 팝업 종료 일시 Storage 저장
              await AsyncStorage.setItem('POPUP_ENDDT_' + type, nowDt);
              isPopup = false;
            }
          },
          etcCallback: async function(pop_bas_seq, sub_img_path, index) {
            navigation.navigate(STACK.COMMON, { 
              screen: 'EventDetail',
              params: {
                index: index,
                view_type: 'MATCH',
              }
            });
          },
        });
      }
    }
  };

  // ############################################################ 유저 제제대상 체크
  const checkUserReport = async () => {

    const body = {
      report_member_seq: matchData.match_member_info?.member_seq
    };

    try {
      const { success, data } = await report_check_user(body);
      if(success) {
        if(data.report_cnt < 10) return false;

        show({
          title: '서비스 이용 경고 알림',
          content: '회원님의 계정에 다수의 신고건수가 누적되어 알려드립니다.\n상대방을 배려하여 서비스 이용 부탁드립니다.',
          confirmCallback : reportCheckUserConfirm() 
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      
    }
  };

  const reportCheckUserConfirm = () => {
    const body = {
      report_member_seq: matchData.match_member_info?.member_seq
    };
    report_check_user_confirm(body);
  };

  // ############################################################ 회원 튜토리얼 노출 정보 저장
  const saveMemberTutorialInfo = async () => {
    const body = {
      tutorial_daily_yn: 'N'
    };
    const { success, data } = await update_additional(body);
    if(success) {
      if(null != data.mbr_base && typeof data.mbr_base != 'undefined') {
        dispatch(setPartialPrincipal({
          mbr_base : data.mbr_base
        }));
      }
    }
  };


  // ################################################################ 초기 실행 함수
  React.useEffect(() => {
    if(isFocus) {
      if(memberBase?.status == 'BLOCK') {
        show({
          title: '서비스 이용 제한 알림',
          content: '서비스 운영정책 위반으로 회원님의 계정상태가\n이용제한 상태로 전환되었습니다.\n문의사항 : cs@limeeted.com',
          confirmCallback: function() {
            dispatch(clearPrincipal());
          }
        });
      } else {

        checkUserReport();
        setIsEmpty(false);
        
        let isPopupShow = true;

        // 튜토리얼 팝업 노출
        if(!isEmptyData(memberBase?.tutorial_daily_yn) || memberBase?.tutorial_daily_yn == 'Y') {
          isPopupShow = false;

          show({
            type: 'GUIDE',
            guideType: 'DAILY',
            guideSlideYn: 'Y',
            guideNexBtnExpoYn: 'Y',
            confirmCallback: function(isNextChk) {
              if(isNextChk) {
                saveMemberTutorialInfo();
              }
              popupShow();
            }
          });
        };

        // 데일리 매칭 정보 조회
        getDailyMatchInfo(isPopupShow);
      }
    };
  }, [isFocus]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // 스크롤 최상단 이동
        /* scrollRef.current?.scrollTo({y: 0, animated: false});
        setIsLoad(false);
        setIsEmpty(false); */
      };
    }, []),
  );

  return (
    <>
      <TopNavigation currentPath={'LIMEETED'} />

      <SpaceView pb={50} viewStyle={{backgroundColor:'#fff'}}>
        <FlatList
          ref={scrollRef}
          data={matchData?.profile_img_list}
          renderItem={RenderItem}
          //onScroll={handleScroll}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={height * 0.75 + 30}
        />
      </SpaceView>
    </>
  );

  function RenderItem({ item }) {
    const url = findSourcePath(item?.img_file_path);

    return (
      <>
        <SpaceView mb={30}>
          <SpaceView viewStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FlatList
              //style={{width: width - 40}}
              contentContainerStyle={{ overflow: 'visible', paddingHorizontal: 20 }} // overflow를 visible로 설정
              data={[0,1,2]}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={width * 0.85 + 5}
              renderItem={({ _item, _index }) => {
                return (
                  <View key={_index} style={_styles.imgItemWrap}>
                    <SpaceView viewStyle={{borderRadius: 20, overflow: 'hidden'}}>
                      <Image
                        source={findSourcePath(item?.img_file_path)}
                        style={{
                          flex: 1,
                          width: width * 0.85,
                          height: height * 0.75,
                          //marginHorizontal: -10,
                        }}
                        resizeMode={'cover'}
                      />

                      <SpaceView viewStyle={_styles.infoArea}>
                        <SpaceView viewStyle={{justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={_styles.distanceText}>12.9Km</Text>
                          <Text style={_styles.nicknameText}>리미티드, 29</Text>
                          <Text style={_styles.introText}>리미티드의 여신</Text>
                        </SpaceView>
                      </SpaceView>

                      <LinearGradient
                        colors={['transparent', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={_styles.thumnailDimArea} />
                    </SpaceView>
                  </View>
                )
              }}
            />
          </SpaceView>
        </SpaceView>
      </>
    );
  }
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  imgItemWrap: {
    marginHorizontal: 5,
  },
  infoArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 25,
  },
  distanceText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  nicknameText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 25,
    color: '#fff',
    marginBottom: 3,
  },
  introText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#fff',
  },
  thumnailDimArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    height: height * 0.24,
  },

});


