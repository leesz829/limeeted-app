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
export const CommonRoundInput: FC<Props> = (props: any) => {
  return (
    <View>
      {/* <View style={styles.labelContainer}>
        <Text style={styles.labelStyle}>{props.label}</Text>
      </View> */}
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={styles.inputStyle}
          placeholder={props.placeholder || ''}
          placeholderTextColor={Color.black2222}
          
          {...props}
          editable={props.disabled ? false : true}
          secureTextEntry={props.isMasking ? true : false}
          maxLength={props.maxLength ? props.maxLength : 1000} />

        <Text style={styles.labelStyle2}>{props.label}</Text>
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
    width: 29,
    height: 22,
    fontFamily: "AppleSDGothicNeoB00",
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.85,
    textAlign: "left",
    color: "#262626"
  },
  labelStyle: {
    width: 29,
    height: 22,
    fontFamily: "AppleSDGothicNeoB00",
    fontSize: 17,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.85,
    textAlign: "left",
    color: "#262626"
  },
  inputContainer: {
    position: 'relative',
    paddingBottom: 0,
    // borderBottomWidth: 1,
    // borderBottomColor: Color.grayDDDD,
    width: 156,
    height: 45,
    opacity: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputStyle: {
    fontSize: 16,
    lineHeight: 20,
    color: Color.black2222,
    paddingLeft: 15,
    paddingRight: 20,
    marginTop: 0,
    height: 45,
    fontFamily: 'AppleSDGothicNeoM00',
    textAlignVertical: "center",
  },
  labelStyle2: {
    position: 'absolute',
    top: 10,
    right: 8,
    fontSize: 15,
    color: '#919191',
    fontFamily: 'AppleSDGothicNeoB00',
  }
});
