import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { get_story_detail, save_story_like, save_story_vote_member } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG, findSourcePathLocal } from 'utils/imageUtils';
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
import { useEffect, useRef, useState } from 'react';


/* ################################################################################################################
###### Story 상세
################################################################################################################ */

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StoryDetail'>;
  route: RouteProp<StackParamList, 'StoryDetail'>;
}

export default function StoryDetail(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  // 본인 데이터
  const memberBase = useUserInfo();

  // 이미지 인덱스
  const imgRef = React.useRef();

  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = React.useState(false); // 로딩 상태 체크
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부
  const [isReplyVisible, setIsReplyVisible] = React.useState(false);
  
  const [storyBoardSeq, setStoryBoardSeq] = React.useState(props.route.params.storyBoardSeq);
  const [storyType, setStoryType] = React.useState(isEmptyData(props.route.params.storyType) ? props.route.params.storyType : ''); // 스토리 유형

  // 선택된 댓글 데이터(댓글 등록 모달 적용)
  const [selectedReplyData, setSelectedReplyData] = React.useState({
    storyReplySeq: 0,
    depth: 0,
  });

  // 스토리 데이터
  const [storyData, setStoryData] = React.useState({
    board: {},
    imageList: [],
    voteList: [],
    replyList: [],
  });

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
    let contentOffset = event.nativeEvent.contentOffset;
    let index = Math.floor(contentOffset.x / (width-10));
    setCurrentIndex(index);
  };

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
    console.log('_isRegi ::::: ' , _isRegi);

    if(_isRegi) {
      getStoryBoard();
    };

    setIsReplyVisible(false);
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

  // ############################################################################# 스토리 조회
  const getStoryBoard = async () => {
    try {
      setIsLoading(true);

      const body = {
        story_board_seq: storyBoardSeq,
      };

      const { success, data } = await get_story_detail(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            setStoryData({
              board: data.story,
              imageList: data.story_img_list,
              replyList: data.story_reply_list,
              voteList: data.story_vote_list,
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
  const storyLikeProc = async (type:string, storyReplySeq:number) => {

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
              getStoryBoard();
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

  const [likeListPopup, setLikeListPopup] = useState(false);
  const [likeListTypePopup, setLikeListTypePopup] = useState('');
  const [replyInfo, setReplyInfo] = useState({});

  const popupStoryBoardActive = () => {
    setLikeListPopup(true);
    setLikeListTypePopup('BOARD');
  };

  const popupStoryReplyActive = (_storyReplySeq:number, _depth:number, replyInfo:{}) => {
    setLikeListPopup(true);
    setLikeListTypePopup('REPLY');
    setSelectedReplyData({
      storyReplySeq: _storyReplySeq,
      depth: _depth,
    });
    setReplyInfo(replyInfo);
  };

  const likeListCloseModal = () => {
    setLikeListPopup(false);
  };

  // ############################################################################# 투표하기 실행
  const voteProc = async (storyVoteSeq:number) => {
    console.log('storyVoteSeq ::::: ' , storyVoteSeq);

    // 중복 클릭 방지 설정
    if(isClickable) {
      try {
        setIsClickable(false);
        setIsLoading(true);
  
        const body = {
          story_board_seq: storyBoardSeq,
          story_vote_seq: storyVoteSeq,
        };
  
        const { success, data } = await save_story_vote_member(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              getStoryBoard();
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


  // ############################################################################# 댓글 렌더링
  const ReplyRender = ({ item, index, likeFunc, replyModalOpenFunc }) => {
    const memberMstImgPath = findSourcePath(item?.mst_img_path); // 회원 대표 이미지 경로
    const storyReplySeq = item?.story_reply_seq; // 댓글 번호
    const depth = item?.depth;

    let depthStyleSize = 0;

    if(depth == 2) {
      depthStyleSize = 15;
    }

    return (
      <>
        <SpaceView viewStyle={_styles.replyItemWarp}>
          <SpaceView ml={depthStyleSize} viewStyle={_styles.replyItemTopArea}>
            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'flex-start'}}>
              <Image source={memberMstImgPath} style={_styles.replyImageStyle} resizeMode={'cover'} />
              
              <SpaceView ml={5} pt={3} viewStyle={{flexDirection: 'column', width: width - 70 - depthStyleSize}}>
                <Text style={_styles.replyNickname}>
                  {item.nickname}  <Text style={_styles.replyTimeText}> {item.time_text}</Text>
                </Text>

                <Text style={_styles.replyContents}>{item.reply_contents}</Text>

                <SpaceView pt={2} mt={6} viewStyle={{alignItems: 'flex-start'}}>
                  <SpaceView viewStyle={_styles.replyItemEtcWrap}>
                    <TouchableOpacity 
                      onPress={() => { memberBase.member_seq == storyData.board?.member_seq ? popupStoryReplyActive(storyReplySeq, depth, item) : likeFunc('REPLY', storyReplySeq); }}
                      style={{marginRight: 3}}>

                      {(memberBase.member_seq == item?.member_seq || item?.member_like_yn == 'N') ? (
                        <Image source={ICON.storage} style={styles.iconSquareSize(15)} />
                      ) : (
                        <Image source={ICON.storageOn} style={styles.iconSquareSize(15)} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <Text style={_styles.replyLikeCntText}>{item?.like_cnt}</Text>
                    </TouchableOpacity>

                    {depth == 1 && (
                      <TouchableOpacity 
                        onPress={() => { replyModalOpenFunc(storyReplySeq, depth); }}
                        style={{marginLeft: 10}}>
                        <Text style={_styles.replyTextStyle}>답글달기</Text>
                      </TouchableOpacity>
                    )}
                  </SpaceView>
                </SpaceView>
              </SpaceView>
            </SpaceView>

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
      if(isEmptyData(props.route.params.storyBoardSeq)) {
        getStoryBoard();
      }
    };
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title={'스토리 상세'} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}>

        <SpaceView mb={20}>

          {/* ###################################################################################### 이미지 영역 */}
          <SpaceView>

            <View style={_styles.pagingContainer}>
              {storyData.imageList?.map((item, index) => {
                <View style={_styles.dotContainerStyle} key={'dot' + index}>
                  <View style={[_styles.pagingDotStyle, index == currentIndex && _styles.activeDot]} />
                </View>
              })}
            </View>

            <FlatList
              ref={imgRef}
              data={storyData.board?.story_type == 'VOTE' ? storyData.voteList : storyData.imageList}
              renderItem={ImageRender}
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
              horizontal
              pagingEnabled
            />
          </SpaceView>

          {/* ###################################################################################### 댓글 영역 */}
          <SpaceView mt={20}>
            <SpaceView pl={20} pr={20} pb={10} viewStyle={_styles.replyEtcArea}>
              <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => { memberBase.member_seq == storyData.board?.member_seq ? popupStoryBoardActive() : storyLikeProc('BOARD', 0); }}
                  style={{marginRight: 5}}>

                  {(memberBase.member_seq == storyData.board?.member_seq || storyData.board?.member_like_yn == 'N') ? (
                    <Image source={ICON.storage} style={styles.iconSquareSize(20)} />
                  ) : (
                    <Image source={ICON.storageOn} style={styles.iconSquareSize(20)} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={_styles.likeCntText}>{storyData.board?.like_cnt}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 10,}} onPress={() => { replyModalOpen(0, 0); }}>
                <Image source={ICON.reply} style={styles.iconSquareSize(20)} />
              </TouchableOpacity>
              </SpaceView>

              {memberBase?.member_seq == storyData.board?.member_seq && (
                <SpaceView viewStyle={_styles.btnArea}>
                  <TouchableOpacity
                    onPress={() => { goStoryModfy(); }}
                    style={_styles.regiBtn}>
                    <Text style={_styles.regiBtnText}>수정하기</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => { reply_onOpen(); }}
                    style={_styles.regiBtn}>
                    <Text style={_styles.regiBtnText}>댓글달기</Text>
                  </TouchableOpacity> */}
                </SpaceView>
              )}
            </SpaceView>

            {/* ###################################################################################### 내용 영역 */}
            <SpaceView pl={20} pr={20} pb={15} viewStyle={{borderBottomWidth: 1, borderBottomColor: '#eee'}}>
              <Text style={_styles.contentsText}>{storyData.board?.contents}</Text>
              <Text style={[_styles.contentsText], {color: '#999', marginTop: 10,}}>{storyData.board?.time_text}</Text>
            </SpaceView>

            <SpaceView ml={20} mr={20}>
              <SpaceView mt={10} mb={10}>
                <Text style={_styles.replyLengthText}>{storyData.replyList?.length}개의 댓글</Text>
              </SpaceView>

              <FlatList
                contentContainerStyle={_styles.replyListWrap}
                data={storyData.replyList}
                keyExtractor={(item) => item.story_reply_seq.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <View key={'reply_' + index}>
                      <ReplyRender 
                        item={item} 
                        index={index} 
                        likeFunc={storyLikeProc} 
                        replyModalOpenFunc={replyModalOpen}
                      />
                    </View>
                  )
                }}
              />
            </SpaceView>
          </SpaceView>
        </SpaceView>
      </ScrollView>

      {/* ##################################################################################
                댓글 입력 팝업
      ################################################################################## */}
      <ReplyRegiPopup 
        isVisible={isReplyVisible} 
        storyBoardSeq={storyData?.board?.story_board_seq}
        storyReplySeq={selectedReplyData.storyReplySeq}
        depth={selectedReplyData.depth}
        callbackFunc={replyRegiCallback} 
      />

      <LikeListPopup
        isVisible={likeListPopup}
        closeModal={likeListCloseModal}
        type={likeListTypePopup}
        _storyBoardSeq={props.route.params.storyBoardSeq}
        _storyReplySeq={selectedReplyData}
        replyInfo={replyInfo}
      />
    </>
  );


  /* ############# 이미지 렌더링 */
  function ImageRender({ item }) {
    const isVote = item?.vote_yn == 'Y' ? true : false; // 투표 여부

    //const url = findSourcePath(item?.img_file_path);  운영 반영시 적용
    let url = '';
    let baseColor = '#7A85EE';
    let baseColorArr = ['#7984ED', '#8759D5'];
    let textColor = '#ffffff';
    let btnText = '투표하기';

    if(isEmptyData(item?.img_file_path)) {
      url = findSourcePathLocal(item?.img_file_path);
    } else {
      url = findSourcePathLocal(item?.file_path);
    };

    // 작성자 여부 구분 처리
    if(memberBase?.member_seq == storyData.board?.member_seq) {
      if(storyData.board?.vote_end_yn == 'Y') {
        if(storyData.board?.selected_vote_seq != item?.story_vote_seq) {
          baseColorArr = ['#FE0456', '#FE0456'];
          baseColor = '#FE0456';
          btnText = item?.vote_member_cnt + '표';
        } else {
          btnText = item?.vote_member_cnt + '표(당선)';
        }
      } else {
        baseColorArr = ['#7984ED', '#7984ED'];
        btnText = item?.vote_member_cnt + '표';
      }
    } else {
      if(isVote) {
        baseColorArr = ['#FE0456', '#FE0456'];
        baseColor = '#FE0456';
        btnText = '투표완료';
      } else {
        if(storyData.board?.vote_end_yn == 'Y') {
          baseColorArr = ['#EEEEEE', '#EEEEEE'];
          baseColor = '#DDDDDD';
          textColor = '#555555';
          btnText = '투표마감';
        }
      }
    };

    return (
      <>
        <SpaceView>
          {storyData.board?.story_type == 'STORY' || storyData.board?.story_type == 'SECRET' ? (
            <Image source={url} style={_styles.imageStyle} resizeMode={'cover'} />
          ) : (
            <>
              <SpaceView mb={15}>
                <Image source={url} style={_styles.imageStyle} resizeMode={'cover'} />
              </SpaceView>
              <SpaceView viewStyle={_styles.voteArea(baseColor)}>
                <SpaceView mb={10} viewStyle={_styles.voteViewArea(baseColor)}><Text style={_styles.voteOrderText(textColor)}>0{item?.order_seq}</Text></SpaceView>
                <SpaceView mb={10}><Text style={_styles.voteNameText}>{item?.vote_name}</Text></SpaceView>
                <SpaceView mb={20} viewStyle={_styles.voteDescArea}>
                  <Text style={_styles.voteDescText}>투표 후에도 선택을 바꿀 수 있습니다.</Text>

                  {isEmptyData(storyData.board?.vote_time_text) && (
                    <Text style={_styles.voteTimeText}>({storyData.board?.vote_time_text})</Text>
                  )}
                </SpaceView>
                <TouchableOpacity
                  disabled={memberBase?.member_seq == storyData.board?.member_seq || isVote}
                  style={{width: '100%'}}
                  onPress={() => { voteProc(item?.story_vote_seq) }}>

                  <LinearGradient
                    colors={baseColorArr}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={_styles.voteBtn}>
                    <Text style={_styles.voteBtnText(textColor)}>{btnText}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </SpaceView>
            </>
          )}
        </SpaceView>
      </>
    );
  };

};


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({

  titleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 20,
    color: '#000',
  },
  imgArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgItem: {
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  imageStyle: {
    flex: 1,
    width: width,
    height: width,
  },
  btnArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regiBtn: {
    backgroundColor: '#B1B1B1',
    width: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  regiBtnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 5,
  },
  pagingContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    width,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 8,
  },
  pagingDotStyle: {
    width: 19,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
  },
  dotContainerStyle: {
    marginRight: 2,
    marginLeft: 2,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  contentsText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#363636',
  },
  replyEtcArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  replyListWrap: {
    flex: 1,
    width: width,
    //flexWrap: 'nowrap',
    //marginHorizontal: 5,
  },
  replyItemWarp: {
    marginBottom: 5,
  },
  replyItemTopArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  replyImageStyle: {
    width: 25,
    height: 25,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 5,
  },
  replyNickname: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 14,
    color: '#000',
    marginRight: 8,
  },
  replyContents: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 14,
    color: '#000',
    marginTop: 6,
    //flex: 0.8,
  },
  replyTimeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#999',
    fontSize: 14,
  },
  replyItemEtcWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyLikeIcon: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 12,
  },
  replyTextStyle: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 12,
  },
  replyLengthText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 13,
  },
  likeCntText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 14,
  },
  replyLikeCntText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#000',
    fontSize: 13,
  },
  voteArea: (bdColor: string) => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: bdColor,
      borderRadius: 10,
      overflow: 'hidden',
      marginHorizontal: 15,
      paddingVertical: 15,
    };
  },
  voteViewArea: (bgColor: string) => {
    return {
      backgroundColor: bgColor,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: '#DDD',
    };
  },
  voteOrderText: (textColor: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      fontSize: 14,
      borderRadius: 13,
      color: textColor,
      paddingHorizontal: 15,
      paddingVertical: 3,
    };
  },
  voteNameText: {
    fontFamily: 'AppleSDGothicNeoB00',
    color: '#333333',
    fontSize: 18,
  },
  voteDescArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteDescText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 14,
    color: '#555555',
  },
  voteTimeText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 14,
    color: '#EE2E62',
    marginLeft: 3,
  },
  voteBtn: {
    marginHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 15,
  },
  voteBtnText: (textColor: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoB00',
      color: textColor,
      fontSize: 16,
      textAlign: 'center',
    };
  },

  
});