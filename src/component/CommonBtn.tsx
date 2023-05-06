import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageSourcePropType,
} from 'react-native';
import { FC } from 'react';
import * as React from 'react';
import { Color } from 'assets/styles/Color';
import type { TouchableOpacityProps, StyleProp } from 'react-native';
import { Image } from 'react-native';
import SpaceView from './SpaceView';
import LinearGradient from 'react-native-linear-gradient';


type BtnType = 'gray' | 'gray2' | 'gray3' | 'primary' | 'kakao' | 'purple' | 'white' | 'blue' | 'blue2' | 'g_blue' | 'black' | 'blackW' | 'red';
type Props = {
  onPress?: () => void;
  value: string;
  type?: BtnType;
  icon?: ImageSourcePropType;
  iconSize?: number;
  iconPosition?: 'left' | 'right';
  height?: number;
  width?: number;
  fontSize?: number;
  isGradient?: boolean;
  borderRadius?: number;
  borderWidth?: number;
} & StyleProp<TouchableOpacityProps>;
/**
 * 공통 버튼
 * @param {function} onPress 누를 시 실행 함수
 * @param {value} value 버튼 텍스트
 * @param {string} type 버튼 색 및 타입, 'gray','primary','kakao','purple','white' 중 하나를 가질 수 있으며, default는 gray
 * @param {ImageSourcePropType} icon 아이콘이 있을 시 아이콘 이미지 주입 필요
 * @param {number} iconSize 아이콘 사이즈
 * @param {string} iconPosition 아이콘 위치 left or right
 * @param {number} height 버튼 높이
 *
 *
 */
export const CommonBtn: FC<Props> = (props) => {
  const style = styles(props);

  const g_blue:any = ['#89b0fa', '#aaa1f7'];

  const useItem = () => {
    let colors = [''];

    if(props.isGradient) {
      if(props.type == 'g_blue') {
        colors.push('#89b0fa');
        colors.push('#aaa1f7');
      } else {
        colors.push('#89b0fa');
      }
    }

    return colors;
  }


  return (
    <>
      {props.isGradient ? (
          <TouchableOpacity onPress={props.onPress}>
            <LinearGradient colors={['#89b0fa', '#aaa1f7']} style={[style.btnStyle_gradient]}>
              <Text style={{color: '#fff', fontSize: props.fontSize ? props.fontSize : 16}}>{props.value}</Text>
            </LinearGradient>
          </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={props.onPress}
          style={[style.btnStyle]}
          {...props} >

          {props.icon && props.iconPosition !== 'right' && (
            <SpaceView mr={4}>
              <Image
                source={props.icon}
                style={[
                  style.iconStyle,
                  props.iconSize
                    ? { width: props.iconSize, height: props.iconSize }
                    : {},
                ]}
              />
            </SpaceView>
          )}
          <Text style={style.btnText}>{props.value}</Text>
          {props.icon && props.iconPosition === 'right' && (
            <SpaceView ml={4}>
              <Image
                source={props.icon}
                style={[
                  style.iconStyle,
                  props.iconSize
                    ? { width: props.iconSize, height: props.iconSize }
                    : {},
                ]}
              />
            </SpaceView>
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = (props: Props) => {
  let backgroundColor = Color.grayEEEE;
  let textColor = Color.black2222;
  let borderColor = Color.grayEEEE;

  let g_backgroundColor = [];

  switch (props.type) {
    case 'gray':
      backgroundColor = Color.grayEEEE;
      textColor = Color.black2222;
      break;
    case 'gray2':
      backgroundColor = Color.white;
      textColor = '#C7C7C7';
      borderColor = '#C7C7C7';
      break;
    case 'gray3':
      backgroundColor = '#D6D3D3';
      textColor = Color.white;
      borderColor = '#D6D3D3';
      break;
    case 'primary':
      backgroundColor = Color.primary;
      textColor = 'white';
      break;
    case 'purple':
      backgroundColor = Color.purple;
      textColor = 'white';
      break;
    case 'kakao':
      backgroundColor = '#FEE500';
      textColor = Color.black2222;
      break;
    case 'white':
      backgroundColor = 'white';
      textColor = Color.purple;
      borderColor = Color.purple;
      break;
    case 'blue':
      backgroundColor = '#8caffa';
      textColor = Color.white;
      borderColor = '#8caffa';
      break;
    case 'blue2':
      backgroundColor = Color.white;
      textColor = Color.blue02;
      borderColor = '#697AE6';
      break;
    case 'g_blue':
      g_backgroundColor = ['#89b0fa', '#aaa1f7'];
      textColor = Color.black2222;
      borderColor = Color.grayDDDD;
      break;
    case 'black':
      backgroundColor = Color.black0000;
      textColor = Color.white;
      break;
    case 'blackW':
      backgroundColor = Color.white;
      textColor = Color.black0000;
      borderColor = Color.black0000;
      break;
    case 'red':
      backgroundColor = Color.red2;
      textColor = Color.white;
      break;
    default:
      backgroundColor = Color.grayEEEE;
      textColor = Color.black2222;
      break;
  }
  return StyleSheet.create({
    btnStyle: {
      width: props.width ? props.width : '100%',
      height: props.height ? props.height : 50,
      borderRadius: props.borderRadius ? props.borderRadius : 30,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: props.borderWidth ? props.borderWidth : 1,
      borderColor: borderColor,
      flexDirection: 'row',
    },
    btnStyle_gradient: {
      width: props.width ? props.width : '100%',
      height: props.height ? props.height : 50,
      borderRadius: props.borderRadius ? props.borderRadius : 30,
      backgroundColor: backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: props.borderWidth ? props.borderWidth : 1,
      borderColor,
      flexDirection: 'row',
    },
    btnText: {
      fontSize: props.fontSize ? props.fontSize : 16,
      lineHeight: 26,
      color: textColor,
      fontFamily: 'AppleSDGothicNeoM00',
    },
    iconStyle: {
      width: 16,
      height: 16,
    }

  });
};
