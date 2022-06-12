import { styles } from 'assets/styles/Styles';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { ICON } from 'utils/imageUtils';
import type { FC, useState, useEffect } from 'react';
import RNFetchBlob from 'rn-fetch-blob';

interface Action {
	title: string;
	type: 'library';
	options: ImageLibraryOptions;
}

interface Props {
	isBig: boolean;
	callbackFn: (
			uri:string
			, fileName:string
			, fileSize: number
			, type: string
	) => void;
}

const includeExtra = true;
const options: Action = {
	title: '이미지를 선택해 주세요.',
	type: 'library',
	options: {
		maxHeight: 200,
		maxWidth: 200,
		selectionLimit: 0,
		mediaType: 'photo',
		includeBase64: false,
		includeExtra,
	},
};
export const ImagePicker: FC<Props> = (props) => {
	const [response, setResponse] = React.useState<any>(null);
	const onButtonPress = React.useCallback(() => {
		launchImageLibrary(options, setResponse);
	}, []);

	React.useEffect(() => {
		console.log(response);

		props.callbackFn(
				response?.assets[0].uri
				, response?.assets[0].fileName
				, response?.assets[0].fileSize
				, response?.assets[0].type
		);

	});

	return (
		<TouchableOpacity
			onPress={onButtonPress}
			style={props.isBig ? styles.tempBoxBig : styles.tempBoxSmall}
		>
			{response?.assets ? (
				response?.assets.map(({ uri }: { uri: any }) => (
					<Image
						resizeMode="cover"
						resizeMethod="scale"
						style={props.isBig ? styles.tempBoxBig : styles.tempBoxSmall}
						source={{ uri }}
					/>
				))
			) : (
				<Image source={ICON.purplePlus} style={styles.boxPlusIcon} />
			)}
		</TouchableOpacity>
	);
};
