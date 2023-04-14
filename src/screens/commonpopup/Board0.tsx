import { styles, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
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
						<EventRow key={board_seq} label={board_type_name} title={title} desc={content} />
					),
				)}
			</ScrollView>
		</>
	);
};
