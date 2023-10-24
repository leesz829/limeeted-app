import { View, StyleSheet, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';

const { width, height } = Dimensions.get('window');

interface Props {
  value: string;
  items: { label: string; value: string }[];
  callBackFunction: (value: string) => void;
  isModfy: boolean;
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
            <TouchableOpacity 
              disabled={!props.isModfy}
              key={index} 
              style={_styles.checkWrap(item.value === checkValue)} 
              onPress={() => onPressFn(index, item.value)}
              activeOpacity={0.9}>
              <Text style={_styles.labelText(item.value === checkValue)}>{item.label}</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4FD',
    borderRadius: 35,
    overflow: 'hidden',
    //paddingHorizontal: 10,
  },
  checkWrap: (isOn:boolean) => {
    return {
      backgroundColor: isOn ? '#7984ED' : '#F3F4FD',
      //paddingHorizontal: 22,
      paddingVertical: 13,
      borderRadius: isOn ? 35 : 0,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },

  labelText: (isOn:boolean) => {
    return {
      fontFamily: isOn ? 'Pretendard-Bold' : 'Pretendard-Regular',
      fontSize: 14,
      color: isOn ? '#fff' : '#7986EE',
      textAlign: 'center',
      width: (width / 5) - 8,
    };
  },
});