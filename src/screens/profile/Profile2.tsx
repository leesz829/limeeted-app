import { useNavigation } from '@react-navigation/native';
import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { layoutStyle, styles } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonSwich } from 'component/CommonSwich';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useMemo, useState } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICON } from 'utils/imageUtils';

import { useInterView } from 'hooks/useInterView';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

enum Mode {
  view = 'view',
  edit = 'edit',
}
export const Profile2 = () => {
  const [text, setText] = useState('');
  const navi = useNavigation();
  const origin = useInterView();
  const [interview, setInterview] = useState(origin);
  const [target, setTarget] = useState(null);
  const [mode, setMode] = useState(Mode.view);

  //질문 초기화 핸들러
  function onPressResetTarget() {
    setTarget(null);
  }

  //편집버튼 핸들러
  function onPressModify() {
    setMode(mode === Mode.view ? Mode.edit : Mode.view);
  }

  function toggleFunction(value, id) {
    //해당 인터뷰 노출여부 토글
    // const {success, data} = await toggleDisplay(id, )
  }
  function onDragEnd({
    from,
    to,
    data,
  }: {
    from: number;
    to: number;
    data: any;
  }) {
    setInterview(data);
  }
  const list = useMemo(() => {
    if (text === '') return interview;
    return interview?.filter((item: any) => item?.code_name?.includes(text));
  }, [text, interview]);

  return (
    <View style={{ flex: 1 }}>
      <CommonHeader title={'인터뷰'} />
      <View
        style={{
          paddingTop: 24,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: 'white',
          flex: 1,
        }}
      >
        <SpaceView viewStyle={layoutStyle.rowCenter} mb={32}>
          <SpaceView viewStyle={styles.questionContainer} mr={16}>
            <CommonText textStyle={layoutStyle.textCenter}>
              {target !== null
                ? target?.code_name
                : `첫번째 질문이에요${'\n'}질문에 성실하게 답해주세요`}
            </CommonText>
          </SpaceView>
          <TouchableOpacity onPress={onPressResetTarget}>
            <Image source={ICON.refreshDark} style={styles.iconSize24} />
          </TouchableOpacity>
        </SpaceView>

        <SpaceView viewStyle={styles.interviewContainer}>
          <SpaceView viewStyle={{ alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={style.modifyButton}
              onPress={onPressModify}
            >
              <CommonText
                type={'h5'}
                textStyle={{ color: 'white' }}
                color={ColorType.gray6666}
              >
                {mode === Mode.view ? '편집' : '종료'}
              </CommonText>
            </TouchableOpacity>
          </SpaceView>
          <SpaceView viewStyle={layoutStyle.rowBetween} mb={24}>
            <SpaceView viewStyle={styles.searchInputContainer}>
              <TextInput
                value={text}
                onChangeText={(e) => setText(e)}
                style={styles.searchInput}
                placeholder={'검색'}
                placeholderTextColor={Color.gray6666}
              />
              <View style={styles.searchInputIconContainer}>
                <Image source={ICON.searchGray} style={styles.iconSize24} />
              </View>
              {text.length > 0 && (
                <TouchableOpacity
                  style={styles.searchDeleteBtnContainer}
                  onPress={() => setText('')}
                >
                  <Image source={ICON.xBtn} style={styles.iconSize24} />
                </TouchableOpacity>
              )}
            </SpaceView>
          </SpaceView>

          <DraggableFlatList
            data={list}
            showsVerticalScrollIndicator={false}
            containerStyle={{ marginBottom: 100 }}
            renderItem={({ item, drag, isActive }) => (
              <ScaleDecorator>
                <SpaceView
                  viewStyle={layoutStyle.rowBetween}
                  mb={16}
                  mr={8}
                  ml={8}
                >
                  <TouchableOpacity onPress={() => setTarget(item)}>
                    <SpaceView viewStyle={styles.questionItemTextContainer}>
                      <CommonText>{item?.code_name}</CommonText>
                    </SpaceView>
                  </TouchableOpacity>

                  <View style={styles.questionIconContainer}>
                    {mode === Mode.edit ? (
                      <CommonSwich
                        isOn={item.disp_yn === 'Y'}
                        callbackFn={(value) =>
                          toggleFunction(value, item.interview_seq)
                        }
                      />
                    ) : (
                      <TouchableOpacity onPressIn={drag} disabled={isActive}>
                        <Image source={ICON.align} style={styles.iconSize24} />
                      </TouchableOpacity>
                    )}
                  </View>
                </SpaceView>
              </ScaleDecorator>
            )}
            keyExtractor={(item, index) => index.toString()}
            onDragEnd={onDragEnd}
          />
        </SpaceView>
      </View>
      <SpaceView>
        <CommonBtn value={'저장'} type={'primary'} />
      </SpaceView>
    </View>
  );
};

const style = StyleSheet.create({
  modifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: Color.purple,
    borderRadius: 8,
    marginBottom: 5,
  },
});
