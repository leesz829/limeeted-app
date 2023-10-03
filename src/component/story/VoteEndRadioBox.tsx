import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';

interface Props {
  items: { label: string; value: string }[];
  callBackFunction: (value: string) => void;
}

export const VoteEndRadioBox: FC<Props> = (props) => {
  const [checkIndex, setCheckIndex] = useState(-1);

  const onPressFn = (index: number, value: string) => {
    setCheckIndex(index);
    props.callBackFunction(value);
  };

  return props.items ? (
    <>
      <SpaceView viewStyle={_styles.wrap}>
        {props.items.map((item, index) => {
          if (!item.label) return;

          return (
            <SpaceView mr={5} key={index + 'check'}>
              <TouchableOpacity style={_styles.checkWrap(index === checkIndex)} onPress={() => onPressFn(index, item.value)}>
                <Text style={_styles.labelText(index === checkIndex)}>{item.label}</Text>
              </TouchableOpacity>
            </SpaceView>
          );
        })}
      </SpaceView>
    </>
  ) : (
    <></>
  );
};

const _styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  checkWrap: (isOn:boolean) => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isOn ? '#697AE6' : '#D0D0D0',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 5,
      overflow: 'hidden',
      width: 60,
    };
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },

  labelText: (isOn:boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 14,
      color: isOn ? '#fff' : '#fff',
      textAlign: 'center',
    };
  },
});