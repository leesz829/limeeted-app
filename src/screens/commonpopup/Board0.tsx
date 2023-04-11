import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import * as properties from 'utils/properties';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { RouteProp, useNavigation } from '@react-navigation/native';

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
			<ScrollView contentContainerStyle={styles.container}>
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
