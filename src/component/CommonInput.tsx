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
  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.labelStyle}>{props.label}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          placeholder={props.placeholder || ''}
          placeholderTextColor={Color.black2222}
          {...props}
          editable={props.disabled ? false : true}
          secureTextEntry={props.isMasking ? true : false}
          maxLength={props.maxLength ? props.maxLength : 1000}
        />
      </View>

      {props.rightPen && (
        <View style={styles.penContainer}>
          <Image source={ICON.penGray} style={styles.iconSize} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  penContainer: {
    position: 'absolute',
    right: 16,
    top: 12,
    height: '100%',
    justifyContent: 'center',
  },
  iconSize: {
    width: 18,
    height: 18,
  },
  labelContainer: {
    marginBottom: 8,
  },
  labelStyle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'AppleSDGothicNeoR00',
    color: Color.gray6666,
  },
  inputContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Color.grayDDDD,
  },
  inputStyle: {
    fontSize: 16,
    lineHeight: 24,
    color: Color.black2222,
    padding: 0,
    margin: 0,
    fontFamily: 'AppleSDGothicNeoM00',
  },
});
