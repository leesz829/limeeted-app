import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, FlatList, Text, Dimensions } from 'react-native';
import { ICON } from 'utils/imageUtils';
import { Modalize } from 'react-native-modalize';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RadioCheckBox_2 } from 'component/RadioCheckBox_2';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { regist_introduce, get_member_introduce_guide } from 'api/models';
import { SUCCESS, MEMBER_NICKNAME_DUP } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { CommonLoading } from 'component/CommonLoading';
import { CommonTextarea } from 'component/CommonTextarea';
import { isEmptyData } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';



/* ################################################################################################################
###################################################################################################################
###### 회원가입 - 프로필 소개
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation : StackNavigationProp<StackParamList, 'SignUp_Introduce'>;
	route : RouteProp<StackParamList, 'SignUp_Introduce'>;
}

const { width, height } = Dimensions.get('window');

export const SignUp_Introduce = (props : Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const { show } = usePopup();  // 공통 팝업
	const isFocus = useIsFocused();
	const [isLoading, setIsLoading] = React.useState(false);
	const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부

	return (
		<>
			<LinearGradient
				colors={['#3D4348', '#1A1E1C']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={_styles.wrap}
			>
				<ScrollView>
				<SpaceView>
					<Text>프로필 소개</Text>
				</SpaceView>

				</ScrollView>

				<SpaceView>
				<CommonBtn
					value={'다음'}
					type={'primary'}
					height={60}
					borderRadius={1}
					onPress={() => {
					navigation.navigate({
						name : ROUTES.SIGNUP_AUTH
					});
					}}
				/>
				</SpaceView>
			</LinearGradient>
		</>
	);
};



/* ################################################################################################################
###### Style 영역
################################################################################################################ */
const _styles = StyleSheet.create({
	wrap: {
		minHeight: height,
	  },
});