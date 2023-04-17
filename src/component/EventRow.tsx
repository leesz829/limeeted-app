import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as React from 'react';
import { useState } from 'react';
import { CommonText } from './CommonText';
import type { FC } from 'react';
import { ColorType } from '@types';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';

interface Props {
  title: string;
  desc: string;
  label: string;
}
/**
 * 이벤트 페이지 행
 * @param {string} title 타이틀
 * @param {string} desc 클릭 시 나오는 설명
 * @param {string} label 분류라벨
 *
 *
 */
export const EventRow: FC<Props> = (props) => {
  const [openRow, setOpenRow] = useState(false);

  return (
    <View style={{marginBottom: 10}}>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.inner}
          onPress={() => setOpenRow(!openRow)}
          activeOpacity={0.3} >
          {/* 
          <View style={styles.labelContainer}>
            <CommonText type={'h4'} color={ColorType.black3333} fontWeight={'200'}>
              {props.label}
            </CommonText>
          </View> */}
          
          <View style={[styles.titleContainer, openRow && styles.active]}>
            <CommonText fontWeight={'500'} type={'h5'}>{props.title}</CommonText>
          </View>          
        </TouchableOpacity>

        <View style={[styles.iconContainer, openRow && styles.activeIcon]}>
          <Image source={ICON.arrBottom} style={styles.iconStyle} />
        </View>
      </View>

      {openRow && (
        <View style={styles.descContainer}>
          <CommonText textStyle={styles.descText} type={'h5'}>{props.desc}</CommonText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    top: 20,
    right: 40,
    transform: [{ rotate: '360deg' }],
  },
  activeIcon: {
    top: -20,
    transform: [{ rotate: '180deg' }],
  },
  inner: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    // alignItems: 'center',
    // height: 84,
  },
  iconStyle: {
    width: 18,
    height: 10,
  },
  titleContainer: {
    borderWidth: 1,
    borderColor: Color.grayEBE,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  active: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  descContainer: {
    //padding: 16,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Color.grayEBE,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  descText: {
    backgroundColor: Color.grayF8F8,
    paddingHorizontal: 15,
    paddingVertical: 20,
  }
});
