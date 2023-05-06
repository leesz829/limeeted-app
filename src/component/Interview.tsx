import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import { ICON } from 'utils/imageUtils';
//import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { STACK } from 'constants/routes';
import { useInterView } from 'hooks/useInterView';
import { CommonBtn } from './CommonBtn';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { get_member_interview, update_interview } from 'api/models';
import { usePopup } from 'Context';
import { setPartialPrincipal } from 'redux/reducers/authReducer';
import { CommonInput } from './CommonInput';


interface InterviewProps {
  title?: string;
  callbackAnswerFn?: Function;
  callbackScrollBottomFn?: Function;
}

enum Mode {
  view = 'view',
  delete = 'delete',
}

const indexToKr = [
  '첫',
  '두',
  '세',
  '네',
  '다섯',
  '여섯',
  '일곱',
  '여덟',
  '아홉',
  '열',
];
export default function Interview({
  title,
  callbackAnswerFn,
  callbackScrollBottomFn,
}: InterviewProps) {
  const origin = useInterView();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(Mode.view);

  const [interview, setInterview] = useState<any>(origin);
  const [deleteList, setDeleteList] = useState([]);

  const { show } = usePopup(); // 공통 팝업

  useEffect(() => {
    //setInterview(origin?.filter((item: any) => item.use_yn === 'Y' && item.disp_yn === 'Y'));
    setInterview(origin?.filter((item: any) => item.use_yn === 'Y'));
  }, [origin]);

  // ###################################### 인터뷰 등록 페이지 이동 함수
  function onPressRegist(code) {
    let applyUseInterViewCnt = 0;
    interview.map((item:any) => {
      if(item.use_yn == 'Y') {
        applyUseInterViewCnt++;
      }
    });

    if(applyUseInterViewCnt >= 5) {
      show({
        title: '알림',
        content: '인터뷰는 최소 5개까지 등록 가능합니다.'
      });
      return;
    }

    setMode(Mode.view);
    navigation.navigate(STACK.COMMON, {
      screen: 'Profile2',
      params: {
        tgtCode: code,
      },
    });
  }

  const scrollViewRef = useRef();


  function onPressToggleMode() {
    if (mode === Mode.view) {
      setMode(Mode.delete);
      //callbackOnDelFn && callbackOnDelFn(true);
      //scrollViewRef.current.scrollToEnd({animated: true})
      callbackScrollBottomFn();
    } else {
      setMode(Mode.view);
      setDeleteList([]);
      //callbackOnDelFn && callbackOnDelFn(false);
    }
  }

  // 삭제 체크/해제 핸들러
  function onSelectDeleteItem(item: any) {
    if (deleteList.includes(item)) {
      setDeleteList((prev) => prev.filter((i) => i !== item));
    } else {
      setDeleteList([...deleteList, item]);
    }
  }

  // 저장버튼
  async function submit(item: any) {
    let applyInterviewList = [];

    let map = {
      code_name: item.code_name
      , common_code: item.common_code
      , disp_yn: item.disp_yn
      , member_interview_seq: item.member_interview_seq
      , order_seq: item.order_seq
      , use_yn: 'N'
    }

    applyInterviewList.push(map);

    /* const copiedDeleteList = deleteList.slice();
    deleteList.map((item: any, index) => {
      item.use_yn = 'N';

      let map = {
        code_name: item.code_name
        ,common_code: item.common_code
          ,disp_yn: item.disp_yn
          , member_interview_seq: item.member_interview_seq
          , order_seq: item.order_seq
          , use_yn: 'N'
      }

      console.log('map ::::: ' , map);
      applyInterviewList.push(map);
    }); */

    show({
      content: '선택한 인터뷰 아이템을 삭제하시겠습니까?',
      cancelCallback: function () {},
      confirmCallback: function () {
        saveAPI(applyInterviewList);
      },
    });
  }

  // ############################################# 인터뷰 정보 저장 API 호출
  const saveAPI = async (applyInterviewList:any) => {

    const body = {
      interview_list: applyInterviewList,
    };

    try {
      const { success, data } = await update_interview(body);
      console.log('data ::::: ' , data);
      if (success) {
        if (data.result_code == '0000') {
          dispatch(
            setPartialPrincipal({ mbr_interview_list: data.mbr_interview_list })
          );
          show({
            content: '삭제되었습니다.',
            confirmCallback: function () {

            },
          });
        } else {
          show({
            content: '오류입니다. 관리자에게 문의해주세요.',
            confirmCallback: function () {},
          });
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  /* 인터뷰 답변 핸들러 */
  const answerChangeHandler = (member_interview_seq: any, text: any) => {
    setInterview((prev) =>
      prev.map((item: any) =>
        item.member_interview_seq === member_interview_seq
          ? { ...item, answer: text }
          : item
      )
    );
    callbackAnswerFn && callbackAnswerFn(member_interview_seq, text);
  };
  return (
    <>

      <SpaceView>
          <SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
            <View>
              <CommonText fontWeight={'700'} type={'h3'}>
                {title || '인터뷰'}
              </CommonText>
            </View>

            <View style={[layoutStyle.rowBetween]}>
              {interview?.length > 0 && (
                <TouchableOpacity
                  style={style.deleteButton}
                  onPress={onPressToggleMode}
                >
                  <CommonText textStyle={style.deleteText}>
                    {mode === Mode.view ? '삭제' : '종료'}
                  </CommonText>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={style.registerButton}
                onPress={onPressRegist}
              >
                <CommonText textStyle={style.registerText}>등록</CommonText>
              </TouchableOpacity>
            </View>
          </SpaceView>

          {interview?.map((e, index) => (
            <View style={[style.contentItemContainer, index % 2 !== 0 && style.itemActive]}>
              {mode === 'delete' ? (
                <TouchableOpacity
                  /* onPress={() => onSelectDeleteItem(e)} */
                  onPress={() => submit(e)} 
                  style={[
                    style.checkContainer,
                    deleteList.includes(e) && style.active,
                  ]} >
                  <Image
                    source={deleteList.includes(e) ? ICON.checkOn : ICON.checkOff}
                    style={style.checkIconStyle}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onPressRegist(e.common_code)}
                  style={style.penPosition}
                >
                  <Image source={ICON.pen} style={style.penImage} />
                </TouchableOpacity>
              )}

              <View style={style.questionRow}>
                <Text style={style.questionText}>Q.</Text>
                <Text style={style.questionBoldText}>
                  {/* {indexToKr[index]}번째 질문 입니다. */}
                  <Text style={style.questionBoldText}>{e?.code_name}</Text>
                </Text>
              </View>

              <View style={style.answerRow}>
                <Text style={style.answerText}>A.</Text>
                {/* <TextInput
                  defaultValue={e?.answer}
                  onChangeText={(text) =>
                    answerChangeHandler(e.member_interview_seq, text)
                  }
                  style={[style.answerNormalText, Platform.OS == 'ios' ? {marginTop: -5} : {marginTop: -9}]}
                  multiline={true}
                  placeholder={'대답을 등록해주세요!'}
                  placeholderTextColor={'#c6ccd3'}
                  numberOfLines={3}
                  maxLength={200}
                /> */}

                <Text style={[style.answerNormalText, Platform.OS == 'ios' ? {marginTop: -5} : {marginTop: 0}]}>{e?.answer}</Text>
              </View>

            </View>
          ))}

          {interview?.length === 0 && (
            <View style={[style.contentItemContainer, { flexDirection: 'row' }]}>
              <SpaceView mr={16}>
                <Image source={ICON.manage} style={styles.iconSize40} />
              </SpaceView>

              <View style={styles.interviewLeftTextContainer}>
                <CommonText type={'h5'}>질문을 등록해주세요</CommonText>
              </View>
            </View>
          )}

          {/* {mode === Mode.delete && (
            <TouchableOpacity style={style.selectedDelete} onPress={submit}>
              <Text style={style.selectedDeleteText}>선택 삭제</Text>
            </TouchableOpacity>
          )} */}
      </SpaceView>
    </>
  );
}



{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const style = StyleSheet.create({
  registerButton: {
    borderColor: '#7986ee',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 2,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
  },
  registerText: {
    color: Color.primary,
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#7986ee',
    paddingHorizontal: 15,
    paddingVertical: 2,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteText: {
    color: Color.white,
    fontSize: 13,
  },

  checkIconStyle: {
    width: 12,
    height: 8,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Color.grayDDDD,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 6,
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
  contentItemContainer: {
    width: '100%',
    minHeight: 100,
    borderRadius: 10,
    backgroundColor: '#eff3fe',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#f9f9f9',
    padding: 20,
    marginBottom: 10,
  },
  itemActive: {
    backgroundColor: '#fff',
    borderColor: '#F7F7F7',
  },
  questionRow: {
    flexDirection: 'row',
    width: '80%',
  },
  questionText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
  },
  questionBoldText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#272727',
    marginLeft: 10,
    marginTop: 4,
  },
  questionNormalText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#272727',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: `flex-start`,
    justifyContent: 'flex-start',
    width: '90%',
    marginTop: 10,
  },
  answerText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginTop: 0,
    textAlignVertical: 'top',
    alignContent: 'flex-start'
  },
  answerNormalText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#7986ee',
    marginLeft: 10,
    textAlignVertical: 'top',
    alignContent: 'flex-start'
  },
  penPosition: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
  penImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  selectedDelete: {
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: '#363636',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  selectedDeleteText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
});
