import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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


enum Mode {
  view = 'view',
  delete = 'delete',
}
export default function Interview({ callbackAnswerFn, callbackOnDelFn }) {
  const origin = useInterView();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(Mode.view);
  const [interview, setInterview] = useState(origin);
  const [deleteList, setDeleteList] = useState([]);
  const temp = useSelector(({ auth }) => auth.principal);

  const { show } = usePopup();  // 공통 팝업

  useEffect(() => {
    //setInterview(origin?.filter((item: any) => item.use_yn === 'Y' && item.disp_yn === 'Y'));
    setInterview(origin?.filter((item: any) => item.use_yn === 'Y'));
  }, [origin]);

  // ###################################### 인터뷰 등록 페이지 이동 함수
  function onPressRegist(code) {
    console.log('code :::::: ', code);
    setMode(Mode.view);
    navigation.navigate(STACK.COMMON, { 
      screen: 'Profile2',
      params: {
        tgtCode: code
      }
    });
  }

  function onPressToggleMode() {
    if (mode === Mode.view) {
      setMode(Mode.delete);
      callbackOnDelFn(true);
    } else {
      setMode(Mode.view);
      setDeleteList([]);
      callbackOnDelFn(false);
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
  async function submit() {
    if(deleteList.length > 0) {
      show({ 
        content: '선택한 인터뷰 아이템을 삭제하시겠습니까?' ,
        cancelCallback: function() {
          
        },
        confirmCallback: function() {
          deleteList?.filter((item: any) => item.use_yn = 'N');
          saveAPI();
        }
      });
    } else {
      show({ content: '삭제할 인터뷰를 선택해 주세요.' });
    }
  }

  // ############################################# 인터뷰 정보 저장 API 호출
  const saveAPI = async () => {
    const body = {
      interview_list : deleteList
    };
    try {
      const { success, data } = await update_interview(body);
      if(success) {
        if(data.result_code == '0000') {
          dispatch(setPartialPrincipal({mbr_interview_list : data.mbr_interview_list}));
          show({
            content: '삭제되었습니다.' ,
            confirmCallback: function() {
            }
          });
        } else {
          show({ 
            content: '오류입니다. 관리자에게 문의해주세요.' ,
            confirmCallback: function() {}
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
        item.member_interview_seq === member_interview_seq ? { ...item, answer: text } : item
      )
    );

    callbackAnswerFn(member_interview_seq, text);
  };
  return (
    <>
      <SpaceView>
        <SpaceView viewStyle={[layoutStyle.rowBetween]} mb={16}>
          <View>
            <CommonText fontWeight={'700'} type={'h3'}>
              인터뷰
            </CommonText>
          </View>

          <View style={[layoutStyle.rowBetween]}>
            <TouchableOpacity
              style={style.registerButton}
              onPress={onPressRegist}
            >
              <CommonText textStyle={style.registerText}>등록</CommonText>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.deleteButton}
              onPress={onPressToggleMode}
            >
              <CommonText textStyle={style.deleteText}>
                {mode === Mode.view ? '삭제' : '종료'}
              </CommonText>
            </TouchableOpacity>
          </View>
        </SpaceView>
        <View style={styles.interviewContainer}>
          {interview?.length > 0 ? (
            interview.map(
              (item: { member_interview_seq: any; common_code: any; code_name: any; answer: any; use_yn: any; disp_yn: any; }) => {
                const { member_interview_seq, common_code, code_name, answer, use_yn, disp_yn } = item;
                return (
                  <View key={common_code}>
                    <SpaceView
                      mb={32}
                      viewStyle={[layoutStyle.row, layoutStyle.alignCenter]}
                    >
                      <SpaceView mr={16}>
                        <Image source={ICON.manage} style={styles.iconSize40} />
                      </SpaceView>

                      <View style={layoutStyle.row}>
                        <View style={styles.interviewLeftTextContainer}>
                          <CommonText type={'h5'}>{code_name}</CommonText>
                        </View>
                      </View>
                      {mode === 'delete' ? (
                        <TouchableOpacity
                          onPress={() => onSelectDeleteItem(item)}
                        >
                          <View style={[style.checkContainer, deleteList.includes(item) && style.active]}>
                            <Image
                              source={
                                deleteList.includes(item)
                                  ? ICON.checkOn
                                  : ICON.checkOff
                              }
                              style={style.iconStyle}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => onPressRegist(item.common_code)}
                        >
                          <Image
                            source={ICON.pen}
                            style={{ width: 25, height: 25, marginLeft: 10 }}
                          />
                        </TouchableOpacity>
                        
                      )}
                    </SpaceView>

                    <SpaceView
                      mb={32}
                      viewStyle={[layoutStyle.row, layoutStyle.selfEnd]}
                    >
                      <SpaceView
                        viewStyle={styles.interviewRightTextContainer}
                        mr={16}
                      >
                        <TextInput
                          defaultValue={answer}
                          onChangeText={(text) =>
                            answerChangeHandler(member_interview_seq, text)
                          }
                          style={[styles.inputTextStyle_type02]}
                          multiline={true}
                          placeholder={'대답을 등록해주세요!'}
                          placeholderTextColor={'#c6ccd3'}
                          numberOfLines={3}
                          maxLength={200}
                        />
                      </SpaceView>
                      <SpaceView>
                        <Image source={ICON.boy} style={styles.iconSize40} />
                      </SpaceView>
                    </SpaceView>
                  </View>
                );
              }
            )
          ) : (
            <>
              <SpaceView mb={32} viewStyle={layoutStyle.row}>
                <SpaceView mr={16}>
                  <Image source={ICON.manage} style={styles.iconSize40} />
                </SpaceView>

                <View style={styles.interviewLeftTextContainer}>
                  <CommonText type={'h5'}>질문을 등록해주세요</CommonText>
                </View>
              </SpaceView>
            </>
          )}

          {(mode === Mode.delete) && (
            <View>
              <CommonBtn value={'선택 삭제'} type={'primary'} onPress={submit} />
            </View>
          )}     

        </View>
      </SpaceView>
    </>
  );
}

const style = StyleSheet.create({
  registerButton: {
    backgroundColor: Color.primary,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
    marginRight: 8,
  },
  registerText: {
    color: 'white',
  },
  deleteButton: {
    backgroundColor: Color.grayDDDD,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    borderRadius: 8,
  },
  deleteText: {
    color: Color.gray6666,
  },
  checkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  iconStyle: {
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
    marginLeft: 10
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
});