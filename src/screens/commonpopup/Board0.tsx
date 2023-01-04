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
						board_code,
						title,
						contents,
					}: {
						board_seq: any;
						board_code: string;
						title: string;
						contents: string;
					}) => (
						<EventRow key={board_seq} label="공지" title={title} desc={contents} />
					),
				)}
			</ScrollView>
		</>
	);
};
