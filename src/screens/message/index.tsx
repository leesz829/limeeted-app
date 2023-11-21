import { styles } from 'assets/styles/Styles';
import CommonHeader from 'component/CommonHeader';
import { EventRow } from 'component/EventRow';
import * as React from 'react';
import { ScrollView, View, Image, Modal, TouchableOpacity, Alert, Text, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, BottomParamList } from '@types';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { SUCCESS } from 'constants/reusltcode';
import { get_member_message_list } from 'api/models';
import { usePopup } from 'Context';
import TopNavigation from 'component/TopNavigation';
import { CommonText } from 'component/CommonText';
import { ICON } from 'utils/imageUtils';
import { Color } from 'assets/styles/Color';
import SpaceView from 'component/SpaceView';
import { CommonBtn } from 'component/CommonBtn';
import { ROUTES, STACK } from 'constants/routes';
import { useDispatch } from 'react-redux';
import { myProfile } from 'redux/reducers/authReducer';
import { CommonLoading } from 'component/CommonLoading';
import LinearGradient from 'react-native-linear-gradient';
import { useUserInfo } from 'hooks/useUserInfo';


/* ################################################################################################################
###################################################################################################################
###### 우편함 메시지
###################################################################################################################
################################################################################################################ */

const { width, height } = Dimensions.get('window');

interface Props {
	navigation: StackNavigationProp<BottomParamList, 'Message'>;
	route: RouteProp<BottomParamList, 'Message'>;
}

export const Message = (props: Props) => {
	const navigation = useNavigation<ScreenNavigationProp>();
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = React.useState(false);

	const [messageList, setMessageList] = React.useState<any>([]);
	const [activeIndex, setActiveIndex] = React.useState(-1);

	const isFocus = useIsFocused();
	const { show } = usePopup();  // 공통 팝업

  const memberBase = useUserInfo(); //hooksMember.getBase();

	const toggleAccordion = (index) => {
		setActiveIndex(activeIndex === index ? -1 : index);
	};

	// ############################################################  메시지 목록 조회
	const getMessageList = async () => {
		setIsLoading(true);

		try {
		  const { success, data } = await get_member_message_list();
		  if(success) {
			switch (data.result_code) {
			  case SUCCESS:
				setMessageList(data.message_list);
				dispatch(myProfile());
				break;
			  default:
				show({ content: '오류입니다. 관리자에게 문의해주세요.' });
				break;
			}
		   
		  } else {
			show({ content: '오류입니다. 관리자에게 문의해주세요.' });
		  }
		} catch (error) {
		  console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	// ############################################# 바로가기 이동 함수
	const goLink = async (item:any) => {
		const type = item.msg_type;
		const link_end_yn = item.link_end_yn;

		if(link_end_yn == 'Y') {
			show({ content: '보관함 보관 기간이 만료 되었습니다.' });
		} else {
			if(type == 'MSG_TP_14') {
				navigation.navigate(STACK.COMMON, { screen: ROUTES.SHOP_INVENTORY });
			} else if(type == 'MSG_TP_16') {
				navigation.navigate(STACK.TAB, { screen: 'Roby' });
			} else if(type == 'MSG_TP_04' || type == 'MSG_TP_05') {
				navigation.navigate(STACK.COMMON, { screen: 'SecondAuth' });
			} else if(type == 'MSG_TP_02' || type == 'MSG_TP_03' || type == 'MSG_TP_06' || type == 'MSG_TP_07') {
				navigation.navigate(STACK.COMMON, { screen: 'Profile1' });
			} else if(type == 'MSG_TP_08' || type == 'MSG_TP_09') {
				navigation.navigate(STACK.COMMON, {
					screen: 'Storage',
					params: {
					  headerType: 'common',
					  pageIndex: 'RES',
					},
				});
			} else if(type == 'MSG_TP_10') {
				navigation.navigate(STACK.COMMON, {
					screen: 'Storage',
					params: {
					  headerType: 'common',
					  loadPage: 'LIVE',
					},
				});
			} else if(type == 'MSG_TP_28') {
				navigation.navigate(STACK.COMMON, {
					screen: 'Storage',
					params: {
					  headerType: 'common',
					  loadPage: 'MATCH',
					},
				});
			} else if(type == 'MSG_TP_30' || type == 'MSG_TP_31' || type == 'MSG_TP_32' || type == 'MSG_TP_33') {
				navigation.navigate(STACK.COMMON, {
					screen: 'StoryDetail',
					params: {
						storyBoardSeq: item.story_board_seq,
					}
				});
			}
		}
	};

	// ############################################################################# 최초 실행
	React.useEffect(() => {
		if(isFocus) {
			getMessageList();
		}
	}, [isFocus]);

	return (
		<>
			{isLoading && <CommonLoading />}

			<TopNavigation currentPath={''} />
      <ScrollView>
        <LinearGradient
          colors={['#3D4348', '#1A1E1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <SpaceView pt={40} pl={20} pr={20} pb={10}>
            <Text style={_styles.mainTitle}>
              <Text style={{color: '#F3E270'}}>{memberBase?.nickname}</Text>
              님에게{'\n'}전달해드리는 소식
            </Text>
          </SpaceView>

          {messageList.map((item : any, index) => (
            <SpaceView key={item.msg_send_seq}>
              <View style={_styles.rowContainer}>
                <TouchableOpacity
                  style={_styles.inner}
                  onPress={() => { 
                    toggleAccordion(item.msg_send_seq);
                  }}
                  activeOpacity={0.3}>
                  
                  <View style={[_styles.titleContainer, activeIndex === item.msg_send_seq && _styles.active]}>
                    <CommonText textStyle={_styles.titleText} fontWeight={'500'} type={'h5'}>{item.title}</CommonText>
                  </View>

                  <View style={[_styles.iconContainer, activeIndex === item.msg_send_seq && _styles.activeIcon]}>
                    <Image source={ICON.circleArrow} style={_styles.iconStyle} />
                  </View>
                </TouchableOpacity>
              </View>

              {activeIndex === item.msg_send_seq && (
                <View style={_styles.descContainer}>
                  <View style={_styles.descText}>
                    <CommonText fontWeight={'300'} color={'#E1DFD1'}>{item.contents}</CommonText>

                    <View style={_styles.dateArea}>
                      <CommonText fontWeight={'300'} color={'#E1DFD1'} textStyle={_styles.dateText}>{item.reg_dt}</CommonText>
                    </View>
                  </View>

                  {(
                    item.msg_type == 'MSG_TP_02' || item.msg_type == 'MSG_TP_03' || item.msg_type == 'MSG_TP_04' || item.msg_type == 'MSG_TP_05' 
                    || item.msg_type == 'MSG_TP_06' || item.msg_type == 'MSG_TP_07' || item.msg_type == 'MSG_TP_08' || item.msg_type == 'MSG_TP_09'
                    || item.msg_type == 'MSG_TP_10' || item.msg_type == 'MSG_TP_14' || item.msg_type == 'MSG_TP_16' || item.msg_type == 'MSG_TP_28'
                    || item.msg_type == 'MSG_TP_30' || item.msg_type == 'MSG_TP_31' || item.msg_type == 'MSG_TP_32' || item.msg_type == 'MSG_TP_33'
                  ) &&
                    <SpaceView mt={10}>
                      <TouchableOpacity 
                        disabled={item.link_end_yn == 'Y' ? true : false}
                        onPress={() => { goLink(item); }}>
                        <Text style={_styles.linkText(item.link_end_yn == 'Y' ? true : false)}>{item.link_end_yn == 'Y' ? '기간만료' : '바로가기'}</Text>
                      </TouchableOpacity>
                    </SpaceView>
                  }
                </View>
              )}
            </SpaceView>
          ))}
        </LinearGradient>
      </ScrollView>
		</>
	);
};


const _styles = StyleSheet.create({
  mainTitle: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: '#D5CD9E',
  },
	iconContainer: {
		position: 'absolute',
		top: '38%',
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
		height: 18,
	},
	titleContainer: {
		borderTopWidth: 1,
		borderColor: '#E1DFD1',
		paddingHorizontal: 15,
		paddingVertical: 15,
	},
	titleText: {
		paddingRight: 35,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#D5CD9E',
	},
	active: {
		borderBottomWidth: 0,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	descContainer: {
		//padding: 16,
		paddingHorizontal: 10,
		paddingBottom: 10,
    borderTopColor: '#E1DFD1',
    borderTopWidth: 1,
	},
	descText: {
		paddingHorizontal: 5,
		paddingVertical: 20,
	},
	dateArea: {
		marginTop: 20,
	},
	dateText: {
		textAlign: 'right',
	},
	linkText: (isDisabled: boolean) => {
		return {
		  fontFamily: 'Pretendard-Regular',
		  fontSize: 10,
		  color: isDisabled ? '#C7C7C7' : '#D5CD9E',
		  textAlign: 'center',
		  borderColor: isDisabled ? '#C7C7C7' : '#D5CD9E',
		  borderWidth: 1,
		  borderRadius: 5,
		  paddingVertical: 8,
		};
	  },
  });