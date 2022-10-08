import RNPickerSelect from 'react-native-picker-select';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { TextInputProps, StyleProp } from 'react-native';
import * as React from 'react';
import { FC } from 'react';
import { Color } from 'assets/styles/Color';
import { ICON } from 'utils/imageUtils';

type Props = {
	label?: string;
	placeholder?: string;
	items: { label: string; value: string }[];
	selectValue: string;
	callbackFn: (value: string) => void;
} & StyleProp<TextInputProps>;

/**
 * 공통 select
 *
 */

export const CommonSelect : FC<Props> = (props) => {
	const [response, setResponse] = React.useState<any>(null);
	const [value, setValue] = React.useState<any>(null);

	React.useEffect(() => {
		if(value != null && null != props.callbackFn) {
			props.callbackFn(value);
		}
	}, [value]);

	return props.items ? (
		<>
			<View style={styles.selectContainer}>
				<View>
					<Text style={styles.labelStyle}>{props.label}</Text>
					<View style={styles.inputContainer}>
						<RNPickerSelect
							style={pickerSelectStyles}
							useNativeAndroidPickerStyle={false}
							onValueChange={value => setValue(value)}
							value={props.selectValue}
							items={props.items}
						/>
					</View>
				</View>
				<View style={styles.selectImgContainer}>
					<Image source={ICON.arrRight} style={styles.icon} />
				</View>
			</View>



			{/* {props.items.map((item, index) => {
				return (
					<View style={styles.selectContainer}>
						<View>
							<Text style={styles.labelStyle}>{props.label}</Text>
							<View style={styles.inputContainer}>
								<RNPickerSelect
									style={pickerSelectStyles}
									useNativeAndroidPickerStyle={false}
									onValueChange={(value) => console.log('value ::: ', value)}
									value={props.selectValue}
									items={props.items} />
							</View>
						</View>
						<View style={styles.selectImgContainer}>
							<Image source={ICON.arrRight} style={styles.icon} />
						</View>
					</View>
					
				);
			})} */}
		</>
	) : (
		<>
			<View style={styles.selectContainer}>
				<View>
					<Text style={styles.labelStyle}>{props.label}</Text>
					<View style={styles.inputContainer}>
						<RNPickerSelect
							style={pickerSelectStyles}
							useNativeAndroidPickerStyle={false}
							onValueChange={(value) => console.log(value)}
							value={''}
							items={[
								{ label: '선택', value: '' },
								{ label: '축구', value: '축구' },
								{ label: 'Baseball', value: 'baseball' },
								{ label: 'Hockey', value: 'hockey' },
							]}
						/>
					</View>
				</View>
				<View style={styles.selectImgContainer}>
					<Image source={ICON.arrRight} style={styles.icon} />
				</View>
			</View>
		</>
	);

	/* return (
		<View style={styles.selectContainer}>
			<View>
				<Text style={styles.labelStyle}>{props.label}</Text>
				<View style={styles.inputContainer}>
					<RNPickerSelect
						style={pickerSelectStyles}
						useNativeAndroidPickerStyle={false}
						onValueChange={(value) => console.log(value)}
						value={''}
						items={[
							{ label: '선택', value: '' },
							{ label: '축구', value: '축구' },
							{ label: 'Baseball', value: 'baseball' },
							{ label: 'Hockey', value: 'hockey' },
						]}
					/>
				</View>
			</View>
			<View style={styles.selectImgContainer}>
				<Image source={ICON.arrRight} style={styles.icon} />
			</View>
		</View>
	); */
};

const styles = StyleSheet.create({
	selectImgContainer: {
		position: 'absolute',
		height: '100%',
		justifyContent: 'center',
		right: 16,
	},
	selectContainer: {},
	labelContainer: {
		marginBottom: 8,
	},
	labelStyle: {
		fontSize: 14,
		lineHeight: 20,
		fontFamily: 'AppleSDGothicNeoR',
		color: Color.gray6666,
		marginBottom: 8,
	},
	inputContainer: {
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: Color.grayDDDD,
	},
	icon: {
		width: 16,
		height: 16,
		transform: [{ rotate: '90deg' }],
	},
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM',
		padding: 0,
		marginTop: 8,
	},
	inputAndroid: {
		fontSize: 16,
		lineHeight: 24,
		color: Color.black2222,
		fontFamily: 'AppleSDGothicNeoM',
		padding: 0,
	},
});
