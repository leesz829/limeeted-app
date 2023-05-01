import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import { View } from 'react-native';

export const lm_superLike = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  return <View style={{ backgroundColor: `red`, width: `100%`, height: 50 }} />;
};
