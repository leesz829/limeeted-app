import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView } from 'react-native';

export const Board0 = () => {
	return (
		<>
			<CommonHeader title={'최근 소식'} />
			<ScrollView contentContainerStyle={styles.container}>
				<EventRow
					label="공지"
					title="이용안내"
					desc={`믿음가는 사람들의 인연
LIMEETED 이용안내입니다.
해당 게시글에 대한 내용이 출력됩니다.`}
				/>
				<EventRow
					label="이벤트"
					title="크라운 결제 안내"
					desc={`믿음가는 사람들의 인연
LIMEETED 이용안내입니다.
해당 게시글에 대한 내용이 출력됩니다.`}
				/>
				<EventRow
					label="공지"
					title="8월 이벤트 당첨자"
					desc={`믿음가는 사람들의 인연
LIMEETED 이용안내입니다.
해당 게시글에 대한 내용이 출력됩니다.`}
				/>
			</ScrollView>
		</>
	);
};
