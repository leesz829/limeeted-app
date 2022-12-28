import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { useState } from 'react';
import { Color } from 'assets/styles/Color';
import type { FC } from 'react';
import { ScreenNavigationProp } from '@types';
import { useNavigation } from '@react-navigation/native';
import { Image, Alert } from 'react-native';
import { ICON, IMAGE } from 'utils/imageUtils';
import { BasePopup } from 'screens/commonpopup/BasePopup';

interface Props {
	currentPath: string;
}
/**
 * 상단 네비게이션
 * @param {string} currentPath 현재 경로
 * @returns
 */
const TopNavigation: FC<Props> = (props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [currentNavi, setCurrentNavi] = useState<string>(props.currentPath);

	const [basePopup, setBasePopup] = React.useState(false);			// 기본 팝업 state
	const [basePopupText, setBasePopupText] = React.useState('');		// 기본 팝업 텍스트

	React.useEffect(() => {
		setCurrentNavi(props.currentPath);
	}, [props]);

	return (
		<View style={styles.tabContainer}>
			<TouchableOpacity
				style={[styles.tab]}
				onPress={() => {
					//navigation.navigate('StartPage');
					navigation.navigate('Main', {
						screen: 'Matching',
					});
				}}
			>
				<Text style={[styles.tabText, currentNavi === 'LIMEETED' && styles.tabTextActive]}>
					LIMEETED
				</Text>

				{/* <Image source={IMAGE.logoText} style={styles.logo1} resizeMode='contain' /> */}

				{currentNavi === 'LIMEETED' && <View style={styles.activeDot} />}
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab]}
				onPress={() => {
					navigation.navigate('Live');
				}}
			>
				<Text style={[styles.tabText, currentNavi === 'LIVE' && styles.tabTextActive]}>LIVE</Text>
				{currentNavi === 'LIVE' && <View style={styles.activeDot} />}
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab]}
				onPress={() => {
					setBasePopupText('준비중입니다.');
					setBasePopup(true);
				}}
				/* onPress={() => setCurrentNavi('STORY')} */
			>
				<Text style={[styles.tabText, currentNavi === 'STORY' && styles.tabTextActive]}>STORY</Text>
				{currentNavi === 'STORY' && <View style={styles.activeDot} />}
			</TouchableOpacity>

			
			
			{/* ######################################################################
			##### 팝업 영역
			###################################################################### */}

			{/* ### 기본 팝업 */}
			<BasePopup popupVisible={basePopup} setPopupVIsible={setBasePopup} title={''} text={basePopupText} />

		</View>
	);
};

export default TopNavigation;

const styles = StyleSheet.create({
	logo1: { width: 105, height: 29 },
	tabContainer: {
		flexDirection: 'row',
		paddingBottom: 16,
		paddingTop: 24,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: 'white',
	},
	tab: {
		paddingRight: 24,
	},
	tabText: {
		fontSize: 20,
		lineHeight: 32,
		color: Color.grayAAAA,
		fontFamily: 'AppleSDGothicNeoB00',
	},
	tabTextActive: {
		color: Color.black2222,
	},
	activeDot: {
		right: 18,
		top: 4,
		position: 'absolute',
		width: 4,
		height: 4,
		borderRadius: 20,
		backgroundColor: Color.black2222,
	},
});
