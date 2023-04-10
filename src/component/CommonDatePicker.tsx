import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as React from 'react';
import { useState } from 'react';
import { ICON } from 'utils/imageUtils';
import { CommonText } from './CommonText';
import SpaceView from './SpaceView';

/**
 * 공통 데이트 피커
 *
 *
 */
export const CommonDatePicker = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    console.warn('A date has been picked: ', date);
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={showDatePicker}
        style={styles.datepickerContainer}
      >
        <SpaceView mr={8}>
          <CommonText fontWeight={'500'}>2021-08-29</CommonText>
        </SpaceView>
        <Image source={ICON.arrRight} style={styles.iconSize} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  datepickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSize: {
    width: 16,
    height: 16,
    transform: [{ rotate: '90deg' }],
  },
});
