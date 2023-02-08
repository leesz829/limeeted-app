import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICON } from 'utils/imageUtils';
//import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Color } from 'assets/styles/Color';
import { STACK } from 'constants/routes';
import { useInterView } from 'hooks/useInterView';

enum Mode {
  view = 'view',
  delete = 'delete',
}
export default function Interview() {
  const interview = useInterView();
  const navigation = useNavigation();
  const [mode, setMode] = useState(Mode.view);
  const [deleteList, setDeleteList] = useState([]);

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

  function onSelectDeleteItem(item: any) {
    if (deleteList.includes(item)) {
      setDeleteList((prev) => prev.filter((i) => i !== item));
    } else {
      setDeleteList([...deleteList, item]);
    }
  }
  return (
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
                      <CommonText textStyle={[styles.inputTextStyle_type02]}>
                        {answer}
                      </CommonText>
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
      </View>
    </SpaceView>
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
