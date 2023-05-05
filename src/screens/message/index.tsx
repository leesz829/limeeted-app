import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions } from 'react-native';
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
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';


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
	const [activeIndex, setActiveIndex] = React.useState(-1);

	const isFocus = useIsFocused();
	const { show } = usePopup();  // 공통 팝업

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? -1 : index);
	};

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
			<ScrollView contentContainerStyle={styles.scrollContainer}>
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

						<View key={msg_send_seq} style={{marginBottom: 10}}>
							<View style={_styles.rowContainer}>
								<TouchableOpacity
								style={_styles.inner}
								onPress={() => { 
									toggleAccordion(msg_send_seq);
								}}
								activeOpacity={0.3} >
								
								<View style={[_styles.titleContainer, activeIndex === msg_send_seq && _styles.active]}>
									<CommonText fontWeight={'500'} type={'h5'}>{title}</CommonText>
								</View>          
								</TouchableOpacity>

								<View style={[_styles.iconContainer, activeIndex === msg_send_seq && _styles.activeIcon]}>
									<Image source={ICON.arrBottom} style={_styles.iconStyle} />
								</View>
							</View>

							{activeIndex === msg_send_seq && (
								<View style={_styles.descContainer}>
									<CommonText textStyle={_styles.descText} type={'h5'}>{contents}</CommonText>
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