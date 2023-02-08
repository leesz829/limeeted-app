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

import { myProfile, setPrincipal } from 'redux/reducers/authReducer';

enum Mode {
  view = 'view',
  delete = 'delete',
}
export default function Interview() {
  const origin = useInterView();
  console.log('origin : ', JSON.stringify(origin));
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mode, setMode] = useState(Mode.view);
  const [interview, setInterview] = useState(origin);
  const [deleteList, setDeleteList] = useState([]);
  const temp = useSelector(({ auth }) => auth.principal);

  useEffect(() => {
    setInterview(origin);
  }, [origin]);
  function onPressRegist() {
    navigation.navigate(STACK.COMMON, { screen: 'Profile2' });
  }

  function onPressToggleMode() {
    if (mode === Mode.view) {
      setMode(Mode.delete);
    } else {
      setMode(Mode.view);
      setDeleteList([]);
    }
  }

  //삭제 체크/해제 핸들러
  function onSelectDeleteItem(item: any) {
    if (deleteList.includes(item)) {
      setDeleteList((prev) => prev.filter((i) => i !== item));
    } else {
      setDeleteList([...deleteList, item]);
    }
  }
  //저장버튼
  async function submit() {
    // if (mode === Mode.delete) {
    //   const { success, data } = await deleteInterview(deleteList);
    //   if (success) {
    //     dispatch(myProfile());
    //     setDeleteList([]);
    //   }
    // } else {
    //   const { success, data } = await updateInterview(interview);
    //   if (success) {
    //     dispatch(myProfile());
    //   }
    // }
  }

  /* 인터뷰 답변 핸들러 */
  const answerChangeHandler = (v_code: any, text: any) => {
    setInterview((prev) =>
      prev.map((item: any) =>
        item.common_code === v_code ? { ...item, answer: text } : item
      )
    );
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
              (item: { common_code: any; code_name: any; answer: any }) => {
                const { common_code, code_name, answer } = item;
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
                      {mode === 'delete' && (
                        <TouchableOpacity
                          onPress={() => onSelectDeleteItem(item)}
                        >
                          <Image
                            source={
                              deleteList.includes(item)
                                ? ICON.pen
                                : ICON.penCircleGray
                            }
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
                            answerChangeHandler(common_code, text)
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
          {(JSON.stringify(origin) !== JSON.stringify(interview) ||
            mode === Mode.delete) && (
            <View>
              <CommonBtn value={'저장'} type={'primary'} onPress={submit} />
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
});
