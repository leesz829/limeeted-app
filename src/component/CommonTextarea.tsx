import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps, StyleProp } from 'react-native';
import * as React from 'react';
import { FC } from 'react';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';

type Props = {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  isMasking?: boolean;
  maxLength?: number;
  exceedCharCountColor?: string;
  onChangeText: (text: string) => void;
  height?: number;
  borderWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  fontColor?: string;
  lineCount?: number;
} & StyleProp<TextInputProps>;

/**
 * 공통 인풋박스
 * @param {string} label 인풋 라벨
 * @param {string} placeholder 인풋 플레이스 홀더
 * @param {boolean} disabled 비활성화 여부
 * @param {boolean} isMasking 마스킹 처리 여부
 *
 */
export const CommonTextarea: FC<Props> = (props: any) => {
  const _style = _styles(props);  
  const [charCount, setCharCount] = React.useState(0);

  const handleChangeText = (text: string) => {
    if (props.onChangeText) props.onChangeText(text);
  };

  return (
    <View>
      {props.label != '' && props.label != null && (
        <View style={_style.labelContainer}>
          <Text style={_style.labelStyle}>{props.label}</Text>
        </View>
      )}
      <View style={_style.inputContainer}>
        <TextInput
          multiline={true}
          autoCapitalize="none"
          style={_style.inputStyle}
          placeholder={props.placeholder || ''}
          placeholderTextColor={Color.black2222}
          {...props}
          editable={props.disabled ? false : true}
          secureTextEntry={props.isMasking ? true : false}
          maxLength={props.maxLength ? props.maxLength : 1000}
          numberOfLines={props.lineCount ? props.lineCount : 20}
        />
      </View>
    </View>
  );
};


const _styles = (props: Props) => {

  return StyleSheet.create({
    labelContainer: {
      marginBottom: 15,
    },
    labelStyle: {
      fontSize: 14, 
      lineHeight: 20,
      fontFamily: 'AppleSDGothicNeoR00',
      color: Color.gray6666,
    },
    inputContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStyle: {
      width: '100%',
      height: props.height != null ? props.height : 420,
      maxHeight: props.height != null ? props.height : 420,
      borderWidth: props.borderWidth != null ? props.borderWidth : 1,
      borderRadius: props.borderRadius != null ? props.borderRadius : 10,
      padding: 10,
      textAlignVertical: 'top',
      backgroundColor: '#ffffff',
      color: props.fontColor != null ? props.fontColor : '#000000',
      borderColor: "#ebe9ef",
      borderStyle: "solid",
      fontSize: props.fontSize != null ? props.fontSize : 14,
    },
  })
};

/* 
const styles = StyleSheet.create({
  labelContainer: {
    marginBottom: 15,
  },
  labelStyle: {
    fontSize: 14, 
    lineHeight: 20,
    fontFamily: 'AppleSDGothicNeoR00',
    color: Color.gray6666,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    width: '100%',
    height: 420,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderColor: "#ebe9ef",
    borderStyle: "solid",
  },
});
 */