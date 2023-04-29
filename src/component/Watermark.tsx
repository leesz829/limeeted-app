import { FC } from 'react';
import * as React from 'react';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';


type Props = {
  value: string;
};
/**
 * 공통 버튼
 * @param {value} value 워터마크 값
 *
 */
export const Watermark: FC<Props> = (props) => {

  return (
    <>
      <Svg height="100%" width="100%" position="absolute">
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.4)"
      />  
      <SvgText
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        x="10%"
        y="10%"
        opacity="0.1"
        textAnchor="middle"
        transform="rotate(315,100,100)"
      >{props?.value}</SvgText>
      <SvgText
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        x="26%"
        y="26%"
        opacity="0.1"
        textAnchor="middle"
        transform="rotate(315,100,100)"
      >{props?.value}</SvgText>
      <SvgText
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        x="-10%"
        y="26%"
        opacity="0.1"
        textAnchor="middle"
        transform="rotate(315,100,100)"
      >{props?.value}</SvgText>
      <SvgText
        fill="#fff"
        fontSize="15"
        fontWeight="bold"
        x="8%"
        y="43%"
        opacity="0.1"
        textAnchor="middle"
        transform="rotate(315,100,100)"
      >{props?.value}</SvgText>
    </Svg>
    </>
  );
};
