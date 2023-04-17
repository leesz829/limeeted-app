import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { FC, useState, useEffect } from 'react';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';

interface Props {
  items: { label: string; value: string }[];
  callBackFunction: (value: string) => void;
}

export const RadioCheckBox_3: FC<Props> = (props) => {
  const [checkIndex, setCheckIndex] = useState(-1);

  const onPressFn = (index: number, value: string) => {
    setCheckIndex(index)
    props.callBackFunction(value);
  };

  return props.items ? (
    <>
      {props.items.map((item, index) => {
        if (!item.label) return;

        return (
          <SpaceView
            key={index + 'check'}
          >
            <TouchableOpacity
              style={[
                styles.checkWrap,
              ]}
              onPress={() => onPressFn(index, item.value)}
            >
              
              <View
                style={[
                  styles.checkContainer,
                  index === checkIndex && styles.active,
                ]}
              >
                <Image
                  source={index === checkIndex ? ICON.checkOn : ICON.checkOff}
                  style={styles.iconStyle}
                />
              </View>


              <SpaceView ml={8}>
                <CommonText fontWeight={'500'} color={index === checkIndex ? '#697AE6' : '#B2B2B2'}>{item.label}</CommonText>
              </SpaceView>

              
            </TouchableOpacity>
          </SpaceView>
        );
      })}
    </>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  checkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  iconStyle: {
    width: 12,
    height: 8,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Color.grayDDDD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: Color.primary,
    borderColor: Color.primary,
  },
});