import React from 'react';
import type { FC } from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';
import { ColorType, WeightType } from '@types';
import { Color } from 'assets/styles/Color';

type TextType = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextProps = {
  textStyle?: StyleProp<TextStyle>;
  type?: TextType;
  color?: ColorType;
  fontWeight?: WeightType;
  lineHeight?: number;
};
/**
 * 공통 인풋박스
 * @param {string} label 인풋 라벨
 * @param {TextType} type h2(24) ~ h6(12) 까지 폰트 사이즈 설정, default 16
 * @param {ColorType} color 폰트 색 여부
 * @param {WeightType} fontWeight 폰트 굵기
 * @param {StyleProp<TextStyle>} textStyle 텍스트 스타일이 있을 시
 *
 *
 */
export const CommonText: FC<TextProps> = (props) => {
  const { textStyle, type, color, fontWeight, children, lineHeight } = props;
  const style = styles({ type, color, fontWeight, lineHeight });

  return <Text style={[style.textStyle, textStyle]}>{children}</Text>;
};

const styles = ({
  type,
  color,
  fontWeight,
  lineHeight,
}: {
  type?: string;
  color?: ColorType;
  fontWeight?: WeightType;
  lineHeight?: number;
}) => {
  let fontSize = 16;
  let fontFamily = 'AppleSDGothicNeoR00';

  switch (type) {
    case 'h2':
      fontSize = 24;
      break;
    case 'h3':
      fontSize = 20;
      break;
    case 'h4':
      fontSize = 18;
      break;
    case 'h5':
      fontSize = 14;
      break;
    case 'h6':
      fontSize = 12;
      break;
    case 'h7':
      fontSize = 10;
      break;
  }

  // switch (fontWeight) {
  //   case '200':
  //     fontFamily = 'AppleSDGothicNeoEB00';
  //     break;
  //   case '300':
  //     fontFamily = 'AppleSDGothicNeoT00';
  //     break;
  //   case '500':
  //     fontFamily = 'AppleSDGothicNeoM00';
  //     break;
  //   case '600':
  //     fontFamily = 'AppleSDGothicNeoR00';
  //     break;
  //   case '700':
  //     fontFamily = 'AppleSDGothicNeoB00';
  //     break;
  // }

  switch (fontWeight) {
    case '200':
      fontFamily = 'Pretendard-Light';
      break;
    case '300':
      fontFamily = 'Pretendard-Regular';
      break;
    case '500':
      fontFamily = 'Pretendard-SemiBold';
      break;
    case '600':
      fontFamily = 'Pretendard-Bold';
      break;
  }

  if (typeof lineHeight !== 'undefined') {
    lineHeight = lineHeight;
  } else {
    lineHeight = fontSize + 8;
  }

  return StyleSheet.create({
    textStyle: {
      //lineHeight: fontSize + 8,
      lineHeight: lineHeight,
      color: color ? color : Color.black2222,
      fontSize,
      fontFamily,
    },
  });
};
