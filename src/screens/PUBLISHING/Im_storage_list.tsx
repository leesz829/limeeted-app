import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@types';
import { View } from 'react-native';

export const Im_storage_list = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  return <View style={{ backgroundColor: `red`, width: `100%`, height: 50 }} />;
};
