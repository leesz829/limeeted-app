import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { get_story_active, save_story_like } from 'api/models';
import { findSourcePath, IMAGE, findSourcePathLocal } from 'utils/imageUtils';
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
import LikeListPopup from 'component/story/LikeListPopup';



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
    storyBoardSeq: 0,
    storyReplySeq: 0,
    depth: 0,
  });

  // 스토리 활동 데이터
  const [activeData, setActiveData] = React.useState({
    alarmData: [],
    storyData: [],
  });

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));

    setCurrentIndex(index);
  };

  const handleTabPress = (index) => {
    baseRef.current.scrollToIndex({ animated: true, index: index });
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

  // ############################################################################# 스토리 상세 이동
  const goStoryDetail = async (storyBoardSeq:number) => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryDetail',
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

  // ############################################################################# 게시글 좋아요 저장
  const storyLikeProc = async (type:string, storyBoardSeq:number, storyReplySeq:number) => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      try {
        setIsClickable(false);
        setIsLoading(true);
  
        const body = {
          type: type,
          story_board_seq: storyBoardSeq,
          story_reply_seq: storyReplySeq,
        };
  
        const { success, data } = await save_story_like(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              getStoryActive();
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
        setIsClickable(true);
        setIsLoading(false);
      }
    }

  };

  /* ##################################################################################################################################
  ################## 댓글 등록 관련 함수
  ################################################################################################################################## */

  // 댓글 모달 열기
  const replyModalOpen = async (_storyBoardSeq:number, _storyReplySeq:number, _depth:number) => {
    setSelectedReplyData({
      storyBoardSeq: _storyBoardSeq,
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
      getStoryActive();
    };

    setIsReplyVisible(false);
  };

  /* ##################################################################################################################################
  ################## 좋아요 목록 팝업 관련 함수
  ################################################################################################################################## */

  const [likeListPopup, setLikeListPopup] = React.useState(false);
  const [likeListTypePopup, setLikeListTypePopup] = React.useState('');
  const [replyInfo, setReplyInfo] = React.useState({});

  const popupStoryBoardActive = () => {
    setLikeListPopup(true);
    setLikeListTypePopup('BOARD');
  };

  const popupStoryReplyActive = (_storyBoardSeq:number, _storyReplySeq:number, _depth:number, replyInfo:{}) => {
    setLikeListPopup(true);
    setLikeListTypePopup('REPLY');
    setSelectedReplyData({
      storyBoardSeq: _storyBoardSeq,
      storyReplySeq: _storyReplySeq,
      depth: _depth,
    });
    setReplyInfo(replyInfo);
  };

  const likeListCloseModal = () => {
    setLikeListPopup(false);
  };

  /* ##################################################################################################################################
  ################## 렌더링 함수
  ################################################################################################################################## */

  // ############################################################################# 알림 렌더링
  const AlarmRender = ({ item, index, likeFunc, replyModalOpenFunc }) => {

    return (
      <>
        {item?.dataList?.length > 0 && (
          <SpaceView viewStyle={_styles.alarmWrap}>

            {/* ###### 제목 */}
            <SpaceView viewStyle={_styles.alarmTitle}>
              <Text style={_styles.alarmTitleText}>{item?.name}</Text>
            </SpaceView>

            {/* ###### 목록 */}
            <SpaceView>
              {item?.dataList?.map((_item, _index) => {

                const storyAlarmType = _item?.story_alarm_type; // 스토리 알림 유형
                const storyBoardSeq = _item?.story_board_seq; // 스토리 게시글 번호
                const storyReplySeq = _item?.story_reply_seq; // 스토리 댓글 번호
                const depth = _item?.depth; // 댓글 계층
                const memberLikeYn = _item?.member_like_yn; // 회원 좋아요 여부
                const replyContents = _item?.reply_contents; // 댓글 내용

                //const boardImgPath = findSourcePath(_item?.story_img_path); 운영 오픈시 반영
                const boardImgPath = findSourcePathLocal(_item?.story_img_path);

                return (
                  <SpaceView viewStyle={_styles.alarmItemWrap('ALARM')} key={'item' + _index}>

                    {/* 회원 대표사진 */}
                    <SpaceView viewStyle={_styles.alarmItemMember}>
                      <Image source={findSourcePath(_item?.mst_img_path)} style={_styles.alarmItemMemberThum} resizeMode={'cover'} />
                    </SpaceView>

                    <SpaceView viewStyle={{flex:2.5}}>

                      <TouchableOpacity 
                        onPress={() => { goStoryDetail(storyBoardSeq) }}
                        style={{flexDirection: 'row', justifyContent: 'space-between'}} >

                        {/* 내용 */}
                        <SpaceView viewStyle={_styles.alarmItemContent}>
                          <Text style={_styles.alarmContentText} numberOfLines={2}>
                            <Text style={_styles.alarmNickname}>{_item?.nickname}</Text>
                            {storyAlarmType == 'REPLY' ? (
                              <>
                                님이 {depth == 1 ? '게시글에 댓글' : '답글'}을 남겼습니다 : <Text>{replyContents}</Text>
                                <Text style={_styles.timeText}> {_item.time_text}</Text>
                              </>
                            ) : (
                              <>
                                님이 내 게시물을 좋아합니다.
                              </>
                            )}
                            
                          </Text>

                          {storyAlarmType == 'LIKE' && (
                            <SpaceView mt={3}><Text style={_styles.timeText}>{_item.time_text}</Text></SpaceView>
                          )}
                        </SpaceView>

                        {/* 게시글 썸네일 */}
                        <SpaceView viewStyle={_styles.alarmItemBoard}>
                          <Image source={isEmptyData(boardImgPath) ? boardImgPath : IMAGE.logoStoryBox} style={_styles.alarmItemStoryThum} resizeMode={'cover'} />
                        </SpaceView>

                      </TouchableOpacity>

                      {/* 좋아요, 답글달기 버튼 영역 */}
                      <SpaceView>
                        {storyAlarmType == 'REPLY' && (
                          <SpaceView mt={7} mb={5} viewStyle={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                            <SpaceView>
                              {depth == 1 && (
                                <TouchableOpacity onPress={() => { replyModalOpenFunc(storyBoardSeq, storyReplySeq, depth); }} hitSlop={commonStyle.hipSlop25}>
                                  <Text style={_styles.replyTextStyle}>답글달기</Text>
                                </TouchableOpacity>
                              )}
                            </SpaceView>

                            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <TouchableOpacity 
                                onPress={() => { likeFunc('REPLY', storyBoardSeq, storyReplySeq); }} 
                                style={{marginRight: 5}} 
                                hitSlop={commonStyle.hipSlop30}>

                                {(memberLikeYn == 'N') ? (
                                  <Image source={ICON.heartOffIcon} style={styles.iconSquareSize(14)} />
                                ) : (
                                  <Image source={ICON.heartOnIcon} style={styles.iconSquareSize(14)} />
                                )}
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => { popupStoryReplyActive(storyBoardSeq, storyReplySeq, depth, _item) }}
                                hitSlop={commonStyle.hipSlop10}>
                                <Text style={_styles.likeCntText}>좋아요{_item?.like_cnt > 0 && _item?.like_cnt + '개'}</Text>
                              </TouchableOpacity>
                              
                            </SpaceView>
                          </SpaceView>
                        )}
                      </SpaceView>
                    
                    </SpaceView>

                  </SpaceView>
                )}
              )}
            </SpaceView>
          </SpaceView>
        )}
      </>
    );
  };

  // ############################################################################# 스토리 렌더링
  const MyStoryRender = ({ item, index }) => {

    return (
      <>
        {item?.dataList?.length > 0 && (
          <SpaceView viewStyle={_styles.alarmWrap}>

            {/* ###### 제목 */}
            <SpaceView viewStyle={_styles.alarmTitle}>
              <Text style={_styles.alarmTitleText}>{item?.name}</Text>
            </SpaceView>

            {/* ###### 목록 */}
            <SpaceView>
              {item?.dataList?.map((_item, _index) => {

                const storyBoardSeq = _item?.story_board_seq; // 스토리 댓글 번호
                const contents = _item?.contents; // 내용
                const likeCnt = _item?.like_cnt; // 좋아요 수
                const replyCnt = _item?.reply_cnt; // 댓글 수
                const memberLikeYn = _item?.member_like_yn; // 좋아요 여부

                //const boardImgPath = findSourcePath(_item?.story_img_path); 운영 오픈시 반영
                const boardImgPath = findSourcePathLocal(_item?.story_img_path);

                return (
                  <TouchableOpacity 
                    key={'item' + _index}
                    style={_styles.alarmItemWrap('BOARD')} 
                    onPress={() => { goStoryDetail(storyBoardSeq) }} >

                    {/* 게시글 썸네일 */}
                    <SpaceView viewStyle={_styles.alarmItemBoard}>
                      <Image source={isEmptyData(boardImgPath) ? boardImgPath : IMAGE.logoStoryBox} style={_styles.alarmItemStoryThum} resizeMode={'cover'} />
                    </SpaceView>

                    <SpaceView viewStyle={_styles.storyItemContent}>

                      {/* 내용 */}
                      <SpaceView viewStyle={_styles.alarmContentArea}>
                        <Text style={_styles.alarmContentText} numberOfLines={2}>{contents}</Text>
                      </SpaceView>

                      {/* 좋아요수, 댓글수, 타임스탬프 노출 */}
                      <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center',}}>
                          <SpaceView mr={10} viewStyle={{flexDirection: 'row'}}>
                            {/* <Image source={ICON.storyHeart} style={styles.iconSquareSize(20)} /> */}

                            {(memberLikeYn == 'N') ? (
                              <Image source={ICON.heartOffIcon} style={styles.iconSquareSize(20)} />
                            ) : (
                              <Image source={ICON.heartOnIcon} style={styles.iconSquareSize(20)} />
                            )}


                            <Text style={_styles.storyCntText}>{likeCnt}</Text>
                          </SpaceView>

                          <SpaceView viewStyle={{flexDirection: 'row'}}>
                            <Image source={ICON.reply} style={styles.iconSquareSize(20)} />
                            <Text style={_styles.storyCntText}>{replyCnt}</Text>
                          </SpaceView>
                        </SpaceView>

                        {/* 타임스탬프 */}
                        <SpaceView>
                          <Text style={_styles.storyDateText}>{_item?.time_text}</Text>
                        </SpaceView>
                      </SpaceView>
                      
                    </SpaceView>
                  </TouchableOpacity>
                )}
              )}
            </SpaceView>
          </SpaceView>
        )}
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
          <TouchableOpacity style={_styles.tabItem(currentIndex == 0 ? true : false)} onPress={() => {handleTabPress(0)}}>
            <Text style={_styles.tabItemText(currentIndex == 0 ? true : false)}>새소식</Text>
          </TouchableOpacity>
          <TouchableOpacity style={_styles.tabItem(currentIndex == 1 ? true : false)} onPress={() => {handleTabPress(1)}}>
            <Text style={_styles.tabItemText(currentIndex == 1 ? true : false)}>내가쓴글</Text>
          </TouchableOpacity>
        </SpaceView>

        {/* ###################################################################################### 컨텐츠 영역 */}
        <SpaceView>
          <FlatList
            style={{backgroundColor: '#fff'}}
            ref={baseRef}
            data={['새소식','내가쓴글']}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            renderItem={({ item, index }) => {
              return (
                <View key={'active_' + index} style={{width: width}}>
                  {index == 0 ? (
                    <>
                      {/* ###################################################################### 새소식 */}
                      <FlatList
                        style={{height: height-135}}
                        contentContainerStyle={{ paddingBottom: 30 }} // 하단 여백 추가
                        contentInset={{ bottom: 50 }}
                        data={activeData.alarmData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
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
                              <AlarmRender item={innerItem} index={innerIndex} likeFunc={storyLikeProc} replyModalOpenFunc={replyModalOpen} />
                            </View>
                          )
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {/* ###################################################################### 내가쓴글 */}
                      <FlatList
                        style={{height: height-135}}
                        contentContainerStyle={{ paddingBottom: 30 }} // 하단 여백 추가
                        contentInset={{ bottom: 50 }}
                        data={activeData.storyData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
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
                              <MyStoryRender item={innerItem} index={innerIndex} />
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
      </View>

      {/* ##################################################################################
                댓글 입력 팝업
      ################################################################################## */}
      <ReplyRegiPopup 
        isVisible={isReplyVisible} 
        storyBoardSeq={selectedReplyData.storyBoardSeq}
        storyReplySeq={selectedReplyData.storyReplySeq}
        depth={selectedReplyData.depth}
        callbackFunc={replyRegiCallback} 
      />

      {/* ##################################################################################
                좋아요 목록 팝업
      ################################################################################## */}
      <LikeListPopup
        isVisible={likeListPopup}
        closeModal={likeListCloseModal}
        type={likeListTypePopup}
        _storyBoardSeq={selectedReplyData.storyBoardSeq}
        storyReplyData={selectedReplyData}
        replyInfo={replyInfo}
      />

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
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  alarmTitle: {
    marginBottom: 20,
  },
  alarmTitleText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 15,
    color: '#333',
  },
  alarmItemWrap: (type:string) => {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: type == 'ALARM' ? 23 : 20,
    }
  },
  alarmItemMember: {
    //width: 50,
    flex: 0.5,
  },
  alarmItemContent: {
    width: width - 150,
  },
  alarmNickname: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#000',
    fontSize: 14,
  },
  alarmContentText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#333',
    fontSize: 14,
  },
  timeText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#999',
    fontSize: 14,
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
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#555',
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
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#000',
    fontSize: 14,
  },
  storyItemContent: {
    width: width - 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  alarmContentArea: {
    height: 40,
  },
  storyDateText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#999',
    fontSize: 14,
  },
  storyItemThum: {
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  storyCntText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#555555',
    fontSize: 14,
    marginLeft: 6,
  },
  likeCntText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#555555',
    fontSize: 12,
  },
  
});