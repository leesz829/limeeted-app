import * as React from 'react';
import { useState } from 'react';
import { Color } from 'assets/styles/Color';
import ToggleSwitch from 'toggle-switch-react-native';
import { FC } from 'react';

/**
 * 공통 swich
 *
 */

interface Props {
  callbackFn: (value: boolean) => void;
  isOn: boolean;
  width?: number;
  height?: number;
}

export const CommonSwich: FC<Props> = (props) => {
  const [value, setValue] = React.useState(false);
  const [activeYn, setActiveYn] = React.useState('N');

  React.useEffect(() => {
    if (activeYn == 'N') {
      setValue(props.isOn);
    }
  });

  const toggleActive = async (value: boolean) => {
    setActiveYn('Y');
    setValue(value);
    props.callbackFn(value);
  };

  return (
    <ToggleSwitch
      isOn={value}
      onColor={Color.primary}
      offColor={Color.grayDDDD}
      size="small"
      onToggle={(isOn) => toggleActive(isOn)}
      trackOffStyle={{
        width: typeof props.width != 'undefined' ? props.width : 45,
        height: typeof props.height != 'undefined' ? props.height : 20
      }}
    />
  );
};
