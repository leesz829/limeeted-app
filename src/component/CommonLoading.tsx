import React from 'react';
import type { FC } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { TextStyle, StyleProp } from 'react-native';
import { ColorType, WeightType } from '@types';
import { Color } from 'assets/styles/Color';
import { GIF_IMG } from 'utils/imageUtils';

export const CommonLoading  = () => {
  
  return (
    <View style={_styles.loadingArea}>
      <Image source={GIF_IMG.loading} style={{width: 60, height: 60}}></Image>
    </View>
  ) ;
};


const _styles = StyleSheet.create({
  loadingArea : {
    position: 'absolute'
    , left: 0
    , right: 0
    , top: 0
    , bottom: 0
    , opacity: 0.5
    , zIndex: 10
    , backgroundColor: 'black'
    , alignItems: 'center'
    , justifyContent: 'center'
  }
});