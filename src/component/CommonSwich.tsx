import * as React from 'react';
import { useState } from 'react';
import { Color } from 'assets/styles/Color';
import ToggleSwitch from 'toggle-switch-react-native';

/**
 * 공통 swich
 *
 */

export const CommonSwich = () => {
	const [value, setValue] = useState(false);

	return (
		<ToggleSwitch
			isOn={value}
			onColor={Color.primary}
			offColor={Color.grayDDDD}
			size="small"
			onToggle={(isOn) => setValue(isOn)}
		/>
	);
};
