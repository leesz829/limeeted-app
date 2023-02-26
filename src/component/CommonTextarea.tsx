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
  
  const [charCount, setCharCount] = React.useState(0);

  const handleChangeText = (text: string) => {
    setCharCount(text.length);
    if (props.onChangeText) props.onChangeText(text);
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.labelStyle}>{props.label}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          multiline={true}
          autoCapitalize="none"
          style={styles.inputStyle}
          placeholder={props.placeholder || ''}
          placeholderTextColor={Color.black2222}
          {...props}
          editable={props.disabled ? false : true}
          secureTextEntry={props.isMasking ? true : false}
          maxLength={props.maxLength ? props.maxLength : 1000}
        />
      </View>
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
    margin: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 10 ,
    backgroundColor : "#FFFFFF",
    height: 150
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
