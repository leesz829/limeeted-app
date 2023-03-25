import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import * as properties from 'utils/properties';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, BottomParamList } from '@types';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { SUCCESS } from 'constants/reusltcode';
import { ROUTES } from 'constants/routes';
import { get_member_message_list } from 'api/models';
import { usePopup } from 'Context';
import TopNavigation from 'component/TopNavigation';


/* ################################################################################################################
###################################################################################################################
###### 우편함 메시지
###################################################################################################################
################################################################################################################ */

interface Props {
	navigation: StackNavigationProp<BottomParamList, 'Message'>;
	route: RouteProp<BottomParamList, 'Message'>;
}

export const Message = (props: Props) => {
	const [messageList, setMessageList] = React.useState<any>([]);

	const isFocus = useIsFocused();
	const { show } = usePopup();  // 공통 팝업


	// ############################################################  메시지 목록 조회
	const getMessageList = async () => {
		try {
		  const { success, data } = await get_member_message_list();
		  console.log('data ::::: ', data);
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				setMessageList(data.message_list);
				break;
			  default:
				show({
				  content: '오류입니다. 관리자에게 문의해주세요.' ,
				  confirmCallback: function() {}
				});
				break;
			}
		   
		  } else {
			show({
			  content: '오류입니다. 관리자에게 문의해주세요.' ,
			  confirmCallback: function() {}
			});
		  }
		} catch (error) {
		  console.log(error);
		} finally {
		  
		}
		  
	};


	// ############################################################################# 최초 실행
	React.useEffect(() => {
		getMessageList();
	}, [isFocus]);

	return (
		<>
			<TopNavigation currentPath={''} />
			<ScrollView contentContainerStyle={styles.container}>
				{messageList.map(
					({
						msg_send_seq,
						msg_type_name,
						title,
						contents,
					}: {
						msg_send_seq: any;
						msg_type_name: string;
						title: string;
						contents: string;
					}) => (
						<EventRow key={msg_send_seq} label={msg_type_name} title={title} desc={contents} />
					),
				)}
			</ScrollView>
		</>
	);
};
