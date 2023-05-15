import { styles, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { useState } from 'react';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import * as properties from 'utils/properties';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { RouteProp, useNavigation } from '@react-navigation/native';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';


/* ################################################################################################################
###################################################################################################################
###### 프로필 사진 미리보기
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'PreviewProfileImage'>;
	route: RouteProp<StackParamList, 'PreviewProfileImage'>;
}

export const PreviewProfileImage = (props: Props) => {

	return (
		<>
			<CommonHeader title={'최근 소식'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				
			</ScrollView>
		</>
	);
};



const _styles = StyleSheet.create({
	
});
  