import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { get_story_active } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA } from 'constants/reusltcode';
import { useDispatch } from 'react-redux';
import Image from 'react-native-fast-image';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { isEmptyData } from 'utils/functions';
import CommonHeader from 'component/CommonHeader';
import { STACK } from 'constants/routes';
import { CommonImagePicker } from 'component/CommonImagePicker';
import { Modalize } from 'react-native-modalize';
import { CommonTextarea } from 'component/CommonTextarea';
import { CommonLoading } from 'component/CommonLoading';
import Modal from 'react-native-modal';
import ReplyRegiPopup from 'component/story/ReplyRegiPopup';



/* ################################################################################################################
###### Story 활동 정보
################################################################################################################ */

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StoryActive'>;
  route: RouteProp<StackParamList, 'StoryActive'>;
}

export default function StoryActive(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  // 기본 인덱스
  const baseRef = React.useRef();

  // 본인 데이터
  const memberBase = useUserInfo();

  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = React.useState(false); // 로딩 상태 체크
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부
  const [isReplyVisible, setIsReplyVisible] = React.useState(false);

  // 선택된 댓글 데이터(댓글 등록 모달 적용)
  const [selectedReplyData, setSelectedReplyData] = React.useState({
    storyReplySeq: 0,
    depth: 0,
  });

  // 스토리 활동 데이터
  const [activeData, setActiveData] = React.useState({
    alarmData: [],
    storyData: [],
  });

  // 댓글 모달 열기
  const replyModalOpen = async (_storyReplySeq:number, _depth:number) => {
    setSelectedReplyData({
      storyReplySeq: _storyReplySeq,
      depth: _depth,
    });

    setIsReplyVisible(true);
  };

  // 댓글 모달 닫기
  const replyModalClose = async () => {
    setIsReplyVisible(false);
  };

  // 댓글 등록 콜백 함수
  const replyRegiCallback = async (_isRegi:boolean) => {
    if(_isRegi) {
      //getStoryBoard();
    };

    setIsReplyVisible(false);
  };

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    console.log('event::', event);
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));

    setCurrentIndex(index);
  };

  // ############################################################################# 수정하기 이동
  const goStoryModfy = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryEdit',
      params: {
        storyBoardSeq: storyBoardSeq,
      }
    });
  };

  // ############################################################################# 스토리 활동 정보 조회
  const getStoryActive = async () => {
    try {
      setIsLoading(true);

      const body = {
        
      };

      const { success, data } = await get_story_active(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:

            console.log('data.alarm_data :::: ' , data.alarm_data);

            setActiveData({
              alarmData: data?.alarm_data,
              storyData: data?.story_data,
            });
          
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

  // ############################################################################# 알림 렌더링
  const AlarmRender = ({ item, index, likeFunc, replyModalOpenFunc }) => {

    return (
      <>
        <SpaceView viewStyle={_styles.alarmWrap}>
          <SpaceView mb={15} viewStyle={_styles.alarmTitle}>
            <Text style={_styles.alarmTitleText}>{item?.name}</Text>
          </SpaceView>
          <SpaceView pl={10} pr={10}>
            {item?.dataList?.length > 0 ? (
              <>
                {item?.dataList?.map((_item, _index) => {

                  const storyAlarmType = _item?.story_alarm_type; // 스토리 알림 유형
                  const storyReplySeq = _item?.story_reply_seq; // 스토리 댓글 번호
                  const depth = _item?.depth; // 댓글 계층
                  const memberLikeYn = _item?.member_like_yn; // 회원 좋아요 여부
                  const replyContents = _item?.reply_contents; // 댓글 내용

                  return (
                    <SpaceView viewStyle={_styles.alarmItemWrap} key={'item' + _index}>
                      <SpaceView mb={20} viewStyle={_styles.alarmItemMember}>
                        <Image source={findSourcePath(_item?.mst_img_path)} style={_styles.alarmItemMemberThum} resizeMode={'cover'} />
                      </SpaceView>

                      <SpaceView viewStyle={_styles.alarmItemContent}>
                        <Text style={_styles.alarmContentText}>
                          <Text style={_styles.alarmNickname}>{_item?.nickname}</Text>
                          {storyAlarmType == 'REPLY' ? (
                            <>
                              님이 게시글에 댓글을 남겼습니다 : {replyContents}
                            </>
                          ) : (
                            <>
                              님이 내 게시물을 좋아합니다
                            </>
                          )}
                        </Text>

                        <SpaceView>
                          <Text style={{color: '#999'}}> {_item.time_text}</Text>
                        </SpaceView>

                        {storyAlarmType == 'REPLY' && (
                          <SpaceView mt={2} viewStyle={{alignItems: 'flex-start'}}>
                            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center',}}>
                              <TouchableOpacity onPress={() => { likeFunc('REPLY', storyReplySeq); }} style={{marginRight: 3}}>
                                {(memberLikeYn == 'N') ? (
                                  <Image source={ICON.storage} style={styles.iconSquareSize(15)} />
                                ) : (
                                  <Image source={ICON.storageOn} style={styles.iconSquareSize(15)} />
                                )}
                              </TouchableOpacity>

                              {/* <TouchableOpacity>
                                <Text style={_styles.replyLikeCntText}>{item?.like_cnt}</Text>
                              </TouchableOpacity> */}

                              {depth == 1 && (
                                <TouchableOpacity 
                                  onPress={() => { replyModalOpenFunc(storyReplySeq, depth); }}
                                  style={{marginLeft: 10}}>
                                  <Text style={_styles.replyTextStyle}>답글달기</Text>
                                </TouchableOpacity>
                              )}
                            </SpaceView>
                          </SpaceView>
                        )}
                      </SpaceView>
                      
                      <SpaceView viewStyle={_styles.alarmItemBoard}>
                        <Image source={PROFILE_IMAGE.womanTmp1} style={_styles.alarmItemStoryThum} resizeMode={'cover'} />
                      </SpaceView>
                    </SpaceView>
                  )
                  })}
              </>
            ) : (
              <>
                <Text style={_styles.emptyText}>등록된 새소식이 없습니다.</Text>
              </>
            )}
          </SpaceView>
        </SpaceView>
      </>
    );
  };

  // ############################################################################# 스토리 렌더링
  const StoryRender = ({ item, index }) => {

    return (
      <>
        <SpaceView mb={15} viewStyle={_styles.alarmWrap}>
          <SpaceView mb={8} viewStyle={_styles.alarmTitle}>
            <Text style={_styles.alarmTitleText}>{item?.name}</Text>
          </SpaceView>
          <SpaceView pl={10} pr={10}>
            {item?.dataList?.length > 0 ? (
              <>
                {item?.dataList?.map((_item, _index) => {

                  const storyBoardSeq = _item?.story_board_seq; // 스토리 댓글 번호
                  const contents = _item?.contents; // 내용
                  const likeCnt = _item?.like_cnt; // 좋아요 수
                  const replyCnt = _item?.reply_cnt; // 댓글 수

                  return (
                    <SpaceView mb={10} viewStyle={_styles.alarmItemWrap} key={'item' + _index}>

                      <SpaceView viewStyle={_styles.alarmItemBoard}>
                        <Image source={PROFILE_IMAGE.womanTmp1} style={_styles.storyItemThum} resizeMode={'cover'} />
                        {/* <Image source={findSourcePath(_item?.story_img_path)} style={_styles.alarmItemStoryThum} resizeMode={'cover'} /> */}
                      </SpaceView>

                      <SpaceView viewStyle={_styles.storyItemContent}>

                        {/* 내용 */}
                        <SpaceView viewStyle={_styles.alarmContentArea}>
                          <Text style={_styles.alarmContentText} numberOfLines={2}>
                            {contents}
                          </Text>
                        </SpaceView>

                        {/* 좋아요수, 댓글수, 타임스탬프 노출 */}
                        <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center',}}>
                            <SpaceView mr={10} viewStyle={{flexDirection: 'row'}}>
                              <Image source={ICON.storyHeart} style={styles.iconSquareSize(20)} />
                              <Text style={_styles.storyCntText}>{likeCnt}</Text>
                            </SpaceView>

                            <SpaceView viewStyle={{flexDirection: 'row'}}>
                              <Image source={ICON.reply} style={styles.iconSquareSize(20)} />
                              <Text style={_styles.storyCntText}>{replyCnt}</Text>
                            </SpaceView>
                          </SpaceView>
                          <SpaceView>
                            <Text style={_styles.storyDateText}>{_item?.time_text}</Text>
                          </SpaceView>
                        </SpaceView>
                        
                      </SpaceView>
                    </SpaceView>
                  )
                  })}
              </>
            ) : (
              <>
                <Text style={_styles.emptyText}>등록된 스토리가 없습니다.</Text>
              </>
            )}
          </SpaceView>
        </SpaceView>
      </>
    );
  };

  /* ##################################################################################################################################
  ################## 초기 실행 함수
  ################################################################################################################################## */
  React.useEffect(() => {
    if(isFocus) {
      getStoryActive();
    };
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title={'스토리 활동 이력'} />

      <View style={{backgroundColor: '#fff'}}>

        {/* ###################################################################################### 탭 영역 */}
        <SpaceView mb={15} viewStyle={_styles.tabWrap}>
          <TouchableOpacity style={_styles.tabItem(currentIndex == 0 ? true : false)} onPress={() => {setCurrentIndex(0)}}>
            <Text style={_styles.tabItemText(currentIndex == 0 ? true : false)}>새소식</Text>
          </TouchableOpacity>
          <TouchableOpacity style={_styles.tabItem(currentIndex == 1 ? true : false)} onPress={() => {setCurrentIndex(1)}}>
            <Text style={_styles.tabItemText(currentIndex == 1 ? true : false)}>내가쓴글</Text>
          </TouchableOpacity>
        </SpaceView>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#fff', height: height-120}}>

          {/* ###################################################################################### 컨텐츠 영역 */}
          <SpaceView>

            <FlatList
              ref={baseRef}
              data={['새소식','내가쓴글']}
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
              renderItem={({ item, index }) => {
                return (
                  <View key={'active_' + index} style={{width: width, minHeight: height}}>
                    {index == 0 ? (
                      <>
                        {/* ###################################################################### 새소식 */}
                        <FlatList
                          //style={_styles.itemWrap}
                          //contentContainerStyle={_styles.itemWrap}
                          data={activeData.alarmData}
                          keyExtractor={(item, index) => index.toString()}
                          removeClippedSubviews={true}
                          /* getItemLayout={(data, index) => (
                            {
                                length: (width - 54) / 2,
                                offset: ((width - 54) / 2) * index,
                                index
                            }
                          )} */
                          renderItem={({ item: innerItem, index: innerIndex }) => {
                            return (
                              <View key={'alarm_' + index}>
                                <AlarmRender item={innerItem} index={innerIndex} likeFunc={undefined} replyModalOpenFunc={undefined} />
                              </View>
                            )
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {/* ###################################################################### 내가쓴글 */}
                        <FlatList
                          //style={_styles.itemWrap}
                          //contentContainerStyle={_styles.itemWrap}
                          data={activeData.storyData}
                          keyExtractor={(item, index) => index.toString()}
                          removeClippedSubviews={true}
                          /* getItemLayout={(data, index) => (
                            {
                                length: (width - 54) / 2,
                                offset: ((width - 54) / 2) * index,
                                index
                            }
                          )} */
                          renderItem={({ item: innerItem, index: innerIndex }) => {
                            return (
                              <View key={'alarm_' + index}>
                                <StoryRender item={innerItem} index={innerIndex} />
                              </View>
                            )
                          }}
                        />                      
                      </>
                    )}
                  </View>
                )
              }}
            />

          </SpaceView>
        </ScrollView>

      </View>

      {/* ##################################################################################
                댓글 입력 팝업
      ################################################################################## */}
      {/* <ReplyRegiPopup 
        isVisible={isReplyVisible} 
        storyBoardSeq={storyData?.board?.story_board_seq}
        storyReplySeq={selectedReplyData.storyReplySeq}
        depth={selectedReplyData.depth}
        callbackFunc={replyRegiCallback} 
      /> */}

    </>
  );

};


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({

  alarmWrap: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alarmTitle: {
    paddingHorizontal: 10,
  },
  alarmTitleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    color: '#333',
  },
  alarmItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alarmItemMember: {

  },
  alarmItemContent: {
    width: width - 130,
  },
  alarmNickname: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#000',
    fontWeight: '900',
  },
  alarmContentText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#333',
    fontSize: 14,
    fontWeight: '100',
  },
  alarmItemBoard: {

  },
  alarmItemMemberThum: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
  },
  alarmItemStoryThum: {
    width: 50,
    height: 50,
    overflow: 'hidden',
  },
  replyLikeCntText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 13,
  },
  replyTextStyle: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 12,
  },
  tabWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabItem: (isOn:boolean) => {
    return {
      width: '50%',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isOn ? '#7A85EE' : '#eee',
    }
  },
  tabItemText: (isOn:boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 14,
      color: isOn ? '#000' : '#ACACAC',
      textAlign: 'center',
    };
  },
  emptyText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 13,
  },
  storyItemContent: {
    width: width - 90,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  alarmContentArea: {
    height: 40,
  },
  storyDateText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#999',
    fontSize: 13,
  },
  storyItemThum: {
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  storyCntText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 13,
    marginLeft: 6,
  },
  
});