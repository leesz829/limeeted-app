import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';

interface Props {
  value: string;
  items: { label: string; value: string }[];
  callBackFunction: (value: string) => void;
}

export const VoteEndRadioBox: FC<Props> = (props) => {
  const [checkValue, setCheckValue] = useState(props.value);

  const onPressFn = (index: number, value: string) => {
    setCheckValue(value);
    props.callBackFunction(value);
  };

  return props.items ? (
    <>
      <SpaceView viewStyle={_styles.wrap}>
        {props.items.map((item, index) => {
          if (!item.label) return;

          return (
            <SpaceView mr={5} key={index + 'check'}>
              <TouchableOpacity style={_styles.checkWrap(item.value === checkValue)} onPress={() => onPressFn(index, item.value)}>
                <Text style={_styles.labelText(item.value === checkValue)}>{item.label}</Text>
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
      backgroundColor: isOn ? '#697AE6' : '#fff',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 5,
      overflow: 'hidden',
      width: 60,
      borderWidth: 1,
      borderColor: '#697AE6',
      marginRight: 7.5,
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
      color: isOn ? '#fff' : '#697AE6',
      textAlign: 'center',
    };
  },
});