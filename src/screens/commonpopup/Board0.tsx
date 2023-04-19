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
###### 최근 소식
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<StackParamList, 'Board0'>;
	route: RouteProp<StackParamList, 'Board0'>;
}

export const Board0 = (props: Props) => {
	const [noticeList, setnoticeList] = React.useState<any>(props.route.params.boardList);

	const [activeIndex, setActiveIndex] = useState(-1);

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? -1 : index);
	};

	return (
		<>
			<CommonHeader title={'최근 소식'} />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<SpaceView mb={45}>
					<View style={layoutStyle.alignStart}>
						<CommonText	type={'h2'} fontWeight={'200'}>리미티드의 소식을{'\n'}전해드립니다 :)</CommonText>
					</View>
				</SpaceView>

				{noticeList.map(
					({
						board_seq,
						board_type_name,
						title,
						content,
					}: {
						board_seq: any;
						board_type_name: string;
						title: string;
						content: string;
					}) => (
						
						<View key={board_seq} style={{marginBottom: 10}}>
							<View style={_styles.rowContainer}>
								<TouchableOpacity
								style={_styles.inner}
								onPress={() => { 
									toggleAccordion(board_seq);
								}}
								activeOpacity={0.3} >
								{/* 
								<View style={styles.labelContainer}>
									<CommonText type={'h4'} color={ColorType.black3333} fontWeight={'200'}>
									{props.label}
									</CommonText>
								</View> */}
								
								<View style={[_styles.titleContainer, activeIndex === board_seq && _styles.active]}>
									<CommonText fontWeight={'500'} type={'h5'}>{title}</CommonText>
								</View>          
								</TouchableOpacity>

								<View style={[_styles.iconContainer, activeIndex === board_seq && _styles.activeIcon]}>
								<Image source={ICON.arrBottom} style={_styles.iconStyle} />
								</View>
							</View>

							{activeIndex === board_seq && (
								<View style={_styles.descContainer}>
								<CommonText textStyle={_styles.descText} type={'h5'}>{content}</CommonText>
								</View>
							)}
						</View>
					),
				)}
			</ScrollView>
		</>
	);
};



const _styles = StyleSheet.create({
	iconContainer: {
	  top: 20,
	  right: 40,
	  transform: [{ rotate: '360deg' }],
	},
	activeIcon: {
	  top: -20,
	  transform: [{ rotate: '180deg' }],
	},
	inner: {
	  width: '100%',
	},
	labelContainer: {
	  marginBottom: 12,
	},
	rowContainer: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  
	  // alignItems: 'center',
	  // height: 84,
	},
	iconStyle: {
	  width: 18,
	  height: 10,
	},
	titleContainer: {
	  borderWidth: 1,
	  borderColor: Color.grayEBE,
	  borderRadius: 15,
	  paddingHorizontal: 15,
	  paddingVertical: 15,
	},
	active: {
	  borderBottomWidth: 0,
	  borderBottomLeftRadius: 0,
	  borderBottomRightRadius: 0,
	},
	descContainer: {
	  //padding: 16,
	  paddingHorizontal: 10,
	  paddingBottom: 20,
	  borderWidth: 1,
	  borderTopWidth: 0,
	  borderColor: Color.grayEBE,
	  borderBottomLeftRadius: 15,
	  borderBottomRightRadius: 15,
	},
	descText: {
	  backgroundColor: Color.grayF8F8,
	  paddingHorizontal: 15,
	  paddingVertical: 20,
	}
  });
  