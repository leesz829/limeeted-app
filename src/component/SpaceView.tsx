import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import type { FC } from 'react';
type Props = {
  mb?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  pl?: number;
  pr?: number;
  pb?: number;
  pt?: number;
  viewStyle?: StyleProp<ViewStyle>;
};

/**
 * 간격을 가진 View
 * 일반 view와 같으나, 마진이나 패딩을 가질 수 있음
 * @param {number} mb 아래 마진
 * @param {number} mt 상단 마진
 * @param {number} mr 왼쪽 마진
 * @param {number} ml 오른쪽 마진
 * @param {number} mr 오른쪽 패딩
 * @param {number} ml 왼쪽 패딩
 * @param {number} mt 상단 패딩
 * @param {number} mb 아래 패딩
 * @param {number} viewStyle view 스타일
 */
const SpaceView: FC<Props> = (props) => {
  const { mb, mt, ml, mr, pb, pt, pl, pr, children } = props;
  const style = styles({
    mb,
    mt,
    ml,
    mr,
    pb,
    pt,
    pl,
    pr,
  });

  return (
    <View {...props} style={[props.viewStyle, style.viewStyle]}>
      {children}
    </View>
  );
};

const styles = ({
  mb,
  mt,
  ml,
  mr,
  pb,
  pt,
  pl,
  pr,
}: {
  mb?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  pb?: number;
  pt?: number;
  pl?: number;
  pr?: number;
}) => {
  const obj: any = {};
  if (mb) {
    obj.marginBottom = mb;
  }
  if (mt) {
    obj.marginTop = mt;
  }
  if (ml) {
    obj.marginLeft = ml;
  }
  if (mr) {
    obj.marginRight = mr;
  }
  if (pb) {
    obj.paddingBottom = pb;
  }
  if (pt) {
    obj.paddingTop = pt;
  }
  if (pl) {
    obj.paddingLeft = pl;
  }
  if (pr) {
    obj.paddingRight = pr;
  }

  return StyleSheet.create({
    viewStyle: {
      ...obj,
    },
  });
};

export default SpaceView;
