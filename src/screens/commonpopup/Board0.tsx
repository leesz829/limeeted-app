import { styles, layoutStyle } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { useState } from 'react';
import * as React from 'react';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import SpaceView from 'component/SpaceView';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import { get_board_list, board_detail_view } from 'api/models';
import { usePopup } from 'Context';
import { CommonLoading } from 'component/CommonLoading';


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

	const { show } = usePopup();
	const [isLoading, setIsLoading] = useState(false);
	const isFocus = useIsFocused();

	const [noticeList, setnoticeList] = React.useState([]);

	const [activeIndex, setActiveIndex] = useState(-1);

	// 토글
	const toggleAccordion = (item:any) => {
		const board_seq = item.board_seq;
		const view_yn = item.view_yn;

		if(activeIndex !== board_seq && view_yn == 'N') {
			boardDetailView(board_seq);
		};

		setActiveIndex(activeIndex === board_seq ? -1 : board_seq);
	};

	// 게시글 목록 조회
	const getBoardList = async () => {
		setIsLoading(true);
		try {
			const { success, data } = await get_board_list();
			if (success) {
				if (data.result_code == '0000') {
					setnoticeList(data.boardList);
				};
			} else {
				show({ content: '오류입니다. 관리자에게 문의해주세요.' });
			}
		} catch (error) {
			show({ content: '오류입니다. 관리자에게 문의해주세요.' });
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	// 게시글 상세 조회
	const boardDetailView = async (board_seq:any) => {
		try {
			const body = {
				board_seq: board_seq
			};
			const { success, data } = await board_detail_view(body);
			if (success) {
				if (data.result_code == '0000') {
					
					const newList = noticeList.map((item:any, index) => {
						if(item.board_seq == board_seq) {
							item.view_yn = 'Y';
						};

						return item;
					});

					setnoticeList(newList);
				};
			} else {
				show({ content: '오류입니다. 관리자에게 문의해주세요.' });
			}
		} catch (error) {
			show({ content: '오류입니다. 관리자에게 문의해주세요.' });
			console.log(error);
		} finally {

		}
	};

	// ######################################################################################## 초기 실행 함수
	React.useEffect(() => {
		if(isFocus) {
			getBoardList();
		};
	  }, [isFocus]);

	return (
		<>
			{isLoading && <CommonLoading />}

			<CommonHeader title={'최근 소식'} />
			
			<ScrollView contentContainerStyle={styles.scrollContainer} style={{backgroundColor: '#fff'}}>
				<SpaceView mb={45}>
					<View style={layoutStyle.alignStart}>
						<CommonText	type={'h2'} fontWeight={'200'}>리미티드의 소식을{'\n'}전해드립니다 :)</CommonText>
					</View>
				</SpaceView>

				{noticeList.map((item, index) => (
					<SpaceView mb={10} key={item.board_seq}>
						<View style={_styles.rowContainer}>
							<TouchableOpacity
								style={_styles.inner}
								activeOpacity={0.3}
								onPress={() => { 
									toggleAccordion(item);
								}}>
								
								<View style={[_styles.titleContainer, activeIndex === item.board_seq && _styles.active]}>
									<View style={{flexDirection:'row'}}>
										{item.board_type == 'EVENT' &&
											<Text style={_styles.iconType('#FEE16F')}>이벤트</Text>
										}
										{(item.board_type == 'RECENT_NEWS' && item.board_sub_type == 'NOTICE') &&
											<Text style={_styles.iconType('#00FFDC')}>공지사항</Text>
										}
										{(item.board_type == 'RECENT_NEWS' && item.board_sub_type == 'GUIDE') &&
											<Text style={_styles.iconType('#7F67FF')}>가이드</Text>
										}
									</View>

									<View>
										{(item.new_yn == 'Y' && item.view_yn == 'N') && (
											<View style={_styles.newIcon} />
										)}
										<CommonText textStyle={_styles.titleText} fontWeight={'500'} type={'h5'}>{item.title}</CommonText>
									</View>
								</View>

								<View style={[_styles.iconContainer, activeIndex === item.board_seq && _styles.activeIcon]}>
									<Image source={ICON.arrBottom} style={_styles.iconStyle} />
								</View>
							</TouchableOpacity>
						</View>

						{/* {new_yn == 'Y' &&
							<View style={_styles.newArea}>
								<Text style={_styles.newText}>NEW</Text>
							</View>
						} */}

						{activeIndex === item.board_seq && (
							<View style={_styles.descContainer}>
								<CommonText textStyle={_styles.descText} type={'h5'}>{item.content}</CommonText>
								<CommonText textStyle={_styles.dateText} type={'h5'}>{item.reg_dt}</CommonText>
							</View>
						)}
					</SpaceView>
				))}
			</ScrollView>
		</>
	);
};



const _styles = StyleSheet.create({
	iconContainer: {
	  	position: 'absolute',
		top: '45%',
	  	right: 20,
	  	transform: [{ rotate: '360deg' }],
	},
	activeIcon: {
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
	titleText: {
		paddingRight: 35,
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
	},
	dateText: {
		textAlign: 'right',
		paddingHorizontal: 15,
		marginTop: 5,
	},
	newArea: {
		position: 'absolute',
		top: -10,
		left: 0,
		backgroundColor: '#000',
		borderRadius: 20,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	newText: {
		fontFamily: 'AppleSDGothicNeoM00',
		fontSize: 12,
		color: '#fff',
	},
	iconType: (color:string) => {
		return {
			width: 50,
			fontFamily: 'AppleSDGothicNeoEB00',
			fontSize: 10,
			color: '#fff',
			backgroundColor: color,
			textAlign: 'center',
			borderRadius: Platform.OS == 'android' ? 10 : 7,
			marginRight: 5,
			overflow: 'hidden',
		};
	},
	newIcon: {
		position: 'absolute',
		top: 5,
		left: -7,
		width: 5,
		height: 5,
		backgroundColor: '#FF67F0',
		borderRadius: 30,
	},
  });