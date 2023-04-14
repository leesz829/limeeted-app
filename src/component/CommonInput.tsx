import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps, StyleProp } from 'react-native';
import * as React from 'react';
import { FC } from 'react';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';

type Props = {
  label?: string;
  placeholder?: string;
  rightPen?: boolean;
  disabled?: boolean;
  isMasking?: boolean;
  maxLength?: number;
  placeholderTextColor?: string;
  borderBottomType?: string;
} & StyleProp<TextInputProps>;

/**
 * 공통 인풋박스
 * @param {string} label 인풋 라벨
 * @param {string} placeholder 인풋 플레이스 홀더
 * @param {boolean} rightPen 오른쪽 펜 모양 여부
 * @param {boolean} disabled 비활성화 여부
 * @param {boolean} isMasking 마스킹 처리 여부
 *
 */
export const CommonInput: FC<Props> = (props: any) => {
  const style = styles(props);

  return (
    <View>
      <View style={style.labelContainer}>
        <Text style={style.labelStyle}>{props.label}</Text>
      </View>
      <View style={style.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={style.inputStyle}
          placeholder={props.placeholder || ''}
          placeholderTextColor={Color.black2222}
          {...props}
          editable={props.disabled ? false : true}
          secureTextEntry={props.isMasking ? true : false}
          maxLength={props.maxLength ? props.maxLength : 1000}
        />
      </View>

      {props.rightPen && (
        <View style={style.penContainer}>
          <Image source={ICON.penGray} style={style.iconSize} />
        </View>
      )}
    </View>
  );
};

const styles = (props: Props) => {
  let bordrBottomWIdth = 1;
  let borderBottomColor = Color.grayDDDD;

  switch (props.borderBottomType) {
    case 'black':
      bordrBottomWIdth = 1;
      borderBottomColor = Color.black0000;
      break;

    default:
      break;
  }
  return StyleSheet.create({
    penContainer: {
      position: 'absolute',
      right: 16,
      top: 16,
      height: '100%',
      justifyContent: 'center',
    },
    iconSize: {
      width: 18,
      height: 18,
    },
    labelContainer: {
      marginBottom: 13,
    },
    labelStyle: {
      fontSize: 17,
      lineHeight: 23,
      fontFamily: 'AppleSDGothicNeoB00',
      color: Color.balck333333,
    },
    inputContainer: {
      paddingBottom: 3,
      borderBottomWidth: bordrBottomWIdth,
      borderBottomColor: borderBottomColor,
    },
    inputStyle: {
      fontSize: 16,
      lineHeight: 30,
      color: Color.balck4848,
      padding: 0,
      margin: 0,
      fontFamily: 'AppleSDGothicNeoM00',
    },

  })
};
