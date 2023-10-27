import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { RefreshControl, ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { get_story_detail, save_story_like, save_story_vote_member, profile_open, save_story_board } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG, findSourcePathLocal } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA, EXIST } from 'constants/reusltcode';
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
import { CommonBtn } from 'component/CommonBtn';


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
    isSecret: false,
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

  // 게시글 수정/삭제 팝업 활성화
  const storyMod_modalizeRef = useRef<Modalize>(null);

  const storyMod_onOpen = (imgSeq: any, orderSeq: any, type: string) => {
    storyMod_modalizeRef.current?.open();
  };
  const storyMod_onClose = () => {
    storyMod_modalizeRef.current?.close();
  };

  /* #########################################################################################################
  ######## 댓글 모달 관련
  ######################################################################################################### */

  // 댓글 모달 열기
  const replyModalOpen = async (_storyReplySeq:number, _depth:number, _isSecret:boolean) => {

    // 비밀 댓글 여부 구분 처리
    if(_isSecret) {
      show({
        title: '비밀 댓글 달기',
        content: '게시글 등록자만 볼 수 있는 댓글을 등록합니다.', 
        passAmt: 10,
        confirmBtnText: '변경하기',
        cancelCallback: function() {
          
        },
        confirmCallback: function () {
          if(memberBase?.pass_has_amt >= 10) {
            setSelectedReplyData({
              storyReplySeq: _storyReplySeq,
              depth: _depth,
              isSecret: _isSecret,
            });
            setIsReplyVisible(true);

          } else {
            show({
              title: '비밀 댓글 달기',
              content: '보유 패스가 부족합니다.',
              confirmBtnText: '상점 이동',
              isCross: true,
              cancelCallback: function() { 
              },
              confirmCallback: function () {
                navigation.navigate(STACK.TAB, { screen: 'Cashshop' });
              },
            });
          }
        },
      });

    } else {
      setSelectedReplyData({
        storyReplySeq: _storyReplySeq,
        depth: _depth,
        isSecret: _isSecret,
      });
      setIsReplyVisible(true);
    }
  };

  // 댓글 모달 닫기
  const replyModalClose = async () => {
    setIsReplyVisible(false);
  };

  // 댓글 등록 콜백 함수
  const replyRegiCallback = async (_isRegi:boolean) => {
    if(_isRegi) {
      getStoryBoard();
    };

    setIsReplyVisible(false);
  };

  // ############################################################################# 수정하기 이동
  const goStoryModify = async () => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryEdit',
      params: {
        storyBoardSeq: storyBoardSeq,
      }
    });
  };

  // ############################################################################# 스토리 조회
  const getStoryBoard = async (_type:string) => {
    try {
      if(_type == 'REFRESH') {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      };

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
      if(_type == 'REFRESH') {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
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

  // ##################################################################################### 프로필 카드 열람 팝업 활성화
  const profileCardOpenPopup = async (memberSeq:number, openCnt:number, isSecret:boolean) => {
    if(openCnt > 0) {
      navigation.navigate(STACK.COMMON, { 
        screen: 'MatchDetail',
        params: {
          trgtMemberSeq: memberSeq,
          type: 'OPEN',
          //matchType: 'STORY',
        } 
      });

    } else {
      show({
        title: isSecret ? '비공개 프로필 열람' : '프로필 카드 열람',
        content: isSecret ? '(7일간)비밀 프로필을 열람하시겠습니까?' : '(7일간)프로필을 열람하시겠습니까?',
        passType: isSecret ? 'ROYAL' : 'PASS',
        passAmt: '15',
        confirmCallback: function() {

          if(isSecret) {
            if(memberBase?.royal_pass_has_amt >= 15) {
              profileCardOpen(memberSeq, isSecret);
            } else {
              show({
                title: isSecret ? '비공개 프로필 열람' : '프로필 카드 열람',
                content: '보유 로얄패스가 부족합니다.',
                confirmBtnText: '상점 이동',
                isCross: true,
                cancelCallback: function() { 
                },
                confirmCallback: function () {
                  navigation.navigate(STACK.TAB, { screen: 'Cashshop' });
                },
              });
            }
          } else {
            if(memberBase?.pass_has_amt >= 15) {
              profileCardOpen(memberSeq, isSecret);
            } else {
              show({
                title: isSecret ? '비공개 프로필 열람' : '프로필 카드 열람',
                content: '보유 패스가 부족합니다.',
                confirmBtnText: '상점 이동',
                isCross: true,
                cancelCallback: function() { 
                },
                confirmCallback: function () {
                  navigation.navigate(STACK.TAB, { screen: 'Cashshop' });
                },
              });
            }
          }
        },
        cancelCallback: function() {
        },
      });
    }
  };

  // ##################################################################################### 프로필 카드 열람
  const profileCardOpen =  async (memberSeq:number, isSecret:boolean) => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      try {
        setIsClickable(false);
        setIsLoading(true);
  
        const body = {
          type: 'STORY',
          trgt_member_seq: memberSeq,
          secret_yn: isSecret ? 'Y' : 'N',
        };
  
        const { success, data } = await profile_open(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              navigation.navigate(STACK.COMMON, { 
                screen: 'MatchDetail',
                params: {
                  trgtMemberSeq: memberSeq,
                  type: 'OPEN',
                  //matchType: 'STORY',
                } 
              });
              break;
            case EXIST:
              show({
                content: '이미 보관함에 존재하는 회원입니다.',
                isCross: true,
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
        setIsClickable(true);
        setIsLoading(false);
      }
    }
  };

  // ##################################################################################### 스토리 게시물 삭제
  const deleteStoryBoard =  async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      try {
        setIsClickable(false);
        setIsLoading(true);
  
        const body = {
          story_board_seq: storyBoardSeq,
          del_yn: 'Y',
        };
        const { success, data } = await save_story_board(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              show({
                title: '스토리 삭제',
                content: '스토리 게시물이 삭제되었습니다.', 
                confirmCallback: function () {
                  navigation.navigate(STACK.TAB, {
                    screen: 'Story',
                  });
                },
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
        setIsClickable(true);
        setIsLoading(false);
      }
    }
  }

  // ############################################################################# 댓글 렌더링
  const ReplyRender = ({ item, index, likeFunc, replyModalOpenFunc }) => {
    const memberMstImgPath = findSourcePath(item?.mst_img_path); // 회원 대표 이미지 경로
    const storyReplySeq = item?.story_reply_seq; // 댓글 번호
    const depth = item?.depth;
    const gender = item?.gender; // 성별
    const secretYn = item?.secret_yn; // 비밀 여부

    // 영역 사이즈 설정
    let _w = width - 70;
    let depthStyleSize = 0;

    if(depth == 2) {
      _w = _w - 15;
      depthStyleSize = 15;
    }

    if(storyData.board?.story_type == 'SECRET') {
      _w = _w + 15;
    };

    // 비밀 댓글 노출
    let isApplySecret = false;
    if(secretYn == 'Y') {
      if(memberBase?.member_seq != storyData.board?.member_seq && memberBase?.member_seq != item?.member_seq) {
        isApplySecret = true;
      }
    };
    
    console.log('item::', item)

    return (
      <>
        <SpaceView viewStyle={_styles.replyItemWarp}>
          <SpaceView ml={depthStyleSize} viewStyle={_styles.replyItemTopArea}>
            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'flex-start'}}>

              {/* 썸네일 */}
              {(storyData.board?.story_type == 'SECRET' || isApplySecret) ? (
                <>
                  {storyData.board?.story_type == 'SECRET' ? (
                    <SpaceView mt={5} viewStyle={{width:15}}>
                      {(storyData.board?.story_type == 'SECRET' && memberBase?.member_seq === item?.member_seq) && (
                        <Image source={gender == 'M' ? ICON.maleIcon : ICON.femaleIcon} style={styles.iconSquareSize(15)} resizeMode={'cover'} />
                      )}
                    </SpaceView>
                  ) : (
                    <SpaceView mt={5}>
                      <Image source={gender == 'M' ? ICON.padlockMale : ICON.padlockFemale} style={_styles.replyImageStyle} resizeMode={'cover'} />
                    </SpaceView>
                  )}
                </>                
              ) : (
                <TouchableOpacity 
                  disabled={memberBase?.gender === item?.gender || memberBase?.member_seq === item?.member_seq}
                  onPress={() => { profileCardOpenPopup(item?.member_seq, item?.open_cnt, false); }}>

                  <Image source={memberMstImgPath} style={_styles.replyImageStyle} resizeMode={'cover'} />
                </TouchableOpacity>
              )}
              
              <SpaceView ml={5} pt={3} viewStyle={{flexDirection: 'column', width: _w}}>

                {/* 닉네임, 타임 텍스트 */}
                <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={_styles.replyNickname}>
                    <Text style={_styles.replyNicknameText(storyData.board?.story_type, item.gender)}>{isApplySecret ? '비밀글' : item.nickname}</Text>{' '}
                    <Text style={[_styles.replyTimeText, {justifyContent: 'center'}]}>{item.time_text}</Text>     
                  </Text>
                  <View>
                    {secretYn == 'Y' && (<Image source={item.gender == 'W' ? ICON.padlockFemale : ICON.padlockMale} style={{width: 14, height: 14,}} />)}
                  </View>
                </SpaceView>


                {/* 댓글 내용 */}
                <Text style={_styles.replyContents}>{isApplySecret ? '게시글 작성자에게만 보이는 글입니다.' : item.reply_contents}</Text>

                {/* 버튼 영역 */}
                <SpaceView pt={2} mt={10} viewStyle={{alignItems: 'flex-start'}}>
                  <SpaceView viewStyle={_styles.replyItemEtcWrap}>

                    {/* 댓글달기 버튼 */}
                    {depth == 1 && (
                      <TouchableOpacity onPress={() => { replyModalOpenFunc(storyReplySeq, depth, false); }}>
                        <Text style={_styles.replyTextStyle}>댓글달기</Text>
                      </TouchableOpacity>
                    )}

                    {/* 좋아용 버튼 */}
                    <SpaceView viewStyle={_styles.likeArea}>
                      <TouchableOpacity 
                        onPress={() => { likeFunc('REPLY', storyReplySeq); }}
                        style={{marginRight: 6}} 
                        hitSlop={commonStyle.hipSlop20}>

                        {(item?.member_like_yn == 'N') ? (
                          <Image source={ICON.heartOffIcon} style={styles.iconSquareSize(15)} />
                        ) : (
                          <Image source={ICON.heartOnIcon} style={styles.iconSquareSize(15)} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity 
                        //disabled={memberBase.member_seq != item?.member_seq}
                        hitSlop={commonStyle.hipSlop10}
                        onPress={() => { popupStoryReplyActive(storyReplySeq, depth, item) }}>
                        <Text style={_styles.replyLikeCntText}>좋아요{item?.like_cnt > 0 && item?.like_cnt + '개'}</Text>
                      </TouchableOpacity>
                    </SpaceView>

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
      setIsRefreshing(false);

      if(isEmptyData(props.route.params.storyBoardSeq)) {
        getStoryBoard();
      }
    };
  }, [isFocus]);

  const [isRefreshing, setIsRefreshing] = useState(false); // 새로고침 여부
  
  // ##################################################################################### 목록 새로고침
  const handleRefresh = () => {
    console.log('refresh!!!!!!!!!!!!!!');
    getStoryBoard('REFRESH', 1);
  };

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader 
        title={(storyData.board?.story_type == 'STORY' ? '스토리' : storyData.board?.story_type == 'VOTE' ? '투표' : '시크릿')}
        type={'STORY_DETAIL'} 
        mstImgPath={findSourcePath(storyData.board?.mst_img_path)} 
        nickname={storyData.board?.nickname}
        gender={storyData.board?.gender}
        profileScore={storyData.board?.profile_score}
        authLevel={storyData.board?.auth_acct_cnt}
        storyType={storyData.board?.story_type}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#ff0000" // Pull to Refresh 아이콘 색상 변경
            //title="Loading..." // Pull to Refresh 아이콘 아래에 표시될 텍스트
            titleColor="#ff0000" // 텍스트 색상 변경
            colors={['#ff0000', '#00ff00', '#0000ff']} // 로딩 아이콘 색상 변경
            progressBackgroundColor="#ffffff" >
          </RefreshControl>
        }
        >

        <SpaceView mb={20}>

          {/* ###################################################################################### 이미지 영역 */}
          <SpaceView>
            <View style={_styles.pagingContainer}>
              {storyData.board?.story_type == 'VOTE' ? (
                <>
                  {storyData.voteList?.map((item, index) => {
                    return (
                      <View style={_styles.dotContainerStyle} key={'dot' + index}>
                        <LinearGradient
                          colors={['#727FFF', '#B8BFFF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[_styles.pagingDotStyle(index == currentIndex)]} />
                      </View>
                    )
                  })}
                </>
              ) : (
                <>
                  {storyData.imageList?.map((item, index) => {
                    return (
                      <View style={_styles.dotContainerStyle} key={'dot' + index}>
                        <LinearGradient
                          colors={['#727FFF', '#B8BFFF']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[_styles.pagingDotStyle(index == currentIndex)]} />
                      </View>
                    )
                  })}
                </>
              )}
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

          {/* ###################################################################################### 투표 선택 영역 */}
          {storyData.board?.story_type == 'VOTE' && (
            <SpaceView>
              <SpaceView viewStyle={_styles.voteSelectArea}>

                <SpaceView viewStyle={{flexDirection:'row', zIndex:1}}>
                  {storyData.voteList?.map((item, index) => {
                    const isVote = item?.vote_yn == 'Y' ? true : false; // 투표 여부
                    const isRegiMember = (memberBase?.member_seq == storyData.board?.member_seq) ? true : false;
                    const isVoteEndYn = storyData.board?.vote_end_yn == 'Y' ? true : false;

                    const firVoteMmbrCntVal = storyData.voteList[0]['vote_member_cnt'];
                    const secVoteMmbrCntVal = storyData.voteList[1]['vote_member_cnt'];

                    let baseColor = '#3616CF';
                    let textColor = '#333333';
                    let bgColorArr = ['#8759D5', '#7984ED'];
                    let _display = 'none';
                    let iconName = ICON.pickWhite;

                    // 작성자 여부 구분 처리
                    if(memberBase?.member_seq == storyData.board?.member_seq) {
                      if(storyData.board?.vote_end_yn == 'Y' && (firVoteMmbrCntVal != secVoteMmbrCntVal)) {
                        if(storyData.board?.selected_vote_seq != item?.story_vote_seq) {                      
                          baseColor = '#3616CF';
                          bgColorArr = ['#FFF', '#FFF'];
                          _display = isVote ? 'flex' : 'none';
                          iconName = isVoteEndYn ? ICON.pickPurple : ICON.pickWhite;
                        } else {
                          textColor = '#FFF';
                          _display = isVote ? 'flex' : 'none';
                        };
                      } else {
                        baseColor = '#999999';
                        bgColorArr = ['#EEE', '#EEE'];
                        textColor = '#999999';
                        _display = isVote ? 'flex' : 'none';
                        iconName = isVoteEndYn ? ICON.pickPurple : ICON.pickWhite;
                      } 
                    } else {
                        if(storyData.board?.vote_end_yn == 'N'){
                          if(isVote) {
                            baseColor = '#3616CF';
                            bgColorArr = ['#7984ED', '#7984ED'];
                            textColor = '#FFF';
                            _display ='flex';
                          }else {
                            bgColorArr = ['#FFF', '#FFF'];
                          }
                        }else {
                          if(storyData.board?.selected_vote_seq == item?.story_vote_seq) {
                            baseColor = '#3616CF';
                            bgColorArr = ['#8759D5', '#7984ED'];
                            textColor = '#FFF';
                            _display = isVote ? 'flex' : 'none';
                            iconName = isVote ? ICON.pickWhite : ICON.pickPurple;
                          }else {
                            bgColorArr = ['#FFF', '#FFF'];
                            _display = isVote ? 'flex' : 'none';
                            iconName = isVote ? ICON.pickPurple : ICON.pickWhite;
                          }
                        }
                        
                        if(storyData.board?.vote_end_yn == 'Y' && (firVoteMmbrCntVal == secVoteMmbrCntVal)) {
                          baseColor = '#999999';
                          bgColorArr = ['#EEE', '#EEE'];
                          textColor = '#999999';
                          _display = isVote ? 'flex' : 'none';
                          iconName = ICON.pickPurple;
                        }
                    };
                    
                    return (
                      <>
                        <SpaceView viewStyle={_styles.voteVsArea}>
                          <Text style={_styles.voteVsText}>{isVoteEndYn && (firVoteMmbrCntVal == secVoteMmbrCntVal) ? 'DRAW' : 'VS'}</Text>
                        </SpaceView>
                     
                        <SpaceView key={index}>
                          <TouchableOpacity
                            disabled={isVote || isVoteEndYn}
                            onPress={() => { voteProc(item?.story_vote_seq) }}
                          >
                    
                            <LinearGradient
                              colors={bgColorArr}
                              start={{ x: 1, y: 1 }}
                              end={{ x: 1, y: 0 }}
                              style={_styles.voteArea(baseColor, bgColorArr)}>
                              

                              <Image source={iconName} style={[styles.iconSize20, {display: _display, position: 'absolute', top: 10, right: 10, zIndex: 15}]} />
                              
                              {/* 투표 이미지 */}
                              <SpaceView mt={5}>
                                <Image source={findSourcePathLocal(item?.file_path)} style={_styles.voteImgStyle} resizeMode={'cover'} />
                              </SpaceView>

                              {/* 투표 명 */}
                              <SpaceView mt={15} mb={20} viewStyle={{zIndex:2}}>
                                <Text numberOfLines={3} style={_styles.voteNameText(textColor)}>{item?.vote_name}</Text>
                              </SpaceView>
                              
                              {/* PICK 텍스트 및 이미지 */}
                              {isVoteEndYn && (storyData.board?.selected_vote_seq == item?.story_vote_seq) && (firVoteMmbrCntVal != secVoteMmbrCntVal) ?
                                <> 
                                  <View style={_styles.voteMmbrCntArea}>
                                    <Text style={_styles.votePickText}>PICK</Text>
                                  </View>
                                  <Image source={ICON.confetti} style={_styles.votePickImg} />
                                </>
                                : 
                                <>
                                  {(!isVoteEndYn) &&
                                    <>
                                      <View style={[_styles.voteMmbrCntArea, {opacity: (isRegiMember) ? 0.75 : 0, backgroundColor: '#664EDB'}]}></View>
                                      <View style={[_styles.voteMmbrCntArea, {opacity: (isRegiMember) ? 1 : 0}]}>
                                        <Text style={_styles.voteCntText}>{item?.vote_member_cnt}표</Text>
                                      </View>
                                    </>
                                  }
                                </>
                              }
                            </LinearGradient>
                          </TouchableOpacity>

                          {/* <SpaceView viewStyle={_styles.votePickShadow(baseColor)} /> */}
                        </SpaceView>
                      </>
                    )}
                  )}

                </SpaceView>
              </SpaceView>

              {/* 투표 선택 알림글 */}
              {isEmptyData(storyData.board?.vote_time_text) && (
                <>
                <SpaceView pl={20} mt={15} viewStyle={{width: '100%',}}>
                  <Text style={_styles.voteDescText}>투표 후에도 선택을 바꿀 수 있습니다.&nbsp;
                      <Text style={_styles.voteTimeText}>({storyData.board?.vote_time_text})</Text>
                  </Text>
                </SpaceView>
                </>
              )}
              
            </SpaceView>
          )}

          {/* ###################################################################################### 버튼 영역 */}
          <SpaceView mt={20}>
            <SpaceView pl={20} pr={20} pb={10} mb={8} viewStyle={_styles.replyEtcArea}>
              <SpaceView viewStyle={{width: '100%', height: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                {/* 수정하기 버튼 */}
                {memberBase?.member_seq == storyData.board?.member_seq ? (
                  <SpaceView viewStyle={_styles.btnArea}>
                    <Image source={findSourcePath(storyData.board?.mst_img_path)} style={_styles.mstImgStyle} />
                    <Text style={_styles.nicknameText(storyData.board?.story_type == 'SECRET' || storyData.board?.secret_yn == 'Y', storyData.board?.gender, 12)}>{storyData.board?.nickname}</Text>
                    {/* <TouchableOpacity
                      onPress={() => { goStoryModfy(); }}
                      style={_styles.regiBtn}>
                      <Image source={ICON.modfyIcon} style={styles.iconSquareSize(20)} />
                      <Text style={_styles.regiBtnText}>수정하기</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity
                      onPress={() => { reply_onOpen(); }}__11
                      style={_styles.regiBtn}>
                      <Text style={_styles.regiBtnText}>댓글달기</Text>
                    </TouchableOpacity> */}
                  </SpaceView>
                ) : (
                  <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                    {((memberBase?.member_seq != storyData.board?.member_seq && storyData.board?.secret_yn == 'Y') || storyData.board?.story_type == 'SECRET') ? (
                      <TouchableOpacity
                        disabled={memberBase.gender === storyData.board?.gender || memberBase?.member_seq === storyData.board?.member_seq}
                        //onPress={() => { secretPropfilePopupOpen(); }}
                        onPress={() => { profileCardOpenPopup(storyData.board?.member_seq, storyData.board?.open_cnt, true); }} 
                      >
                        <Text style={_styles.nicknameText(storyData.board?.story_type == 'SECRET' || storyData.board?.secret_yn == 'Y', storyData.board?.gender, 14)}>
                          {storyData.board?.nickname_modifier}{' '}{storyData.board?.nickname_noun}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          disabled={memberBase?.gender === storyData.board?.gender || memberBase?.member_seq === storyData.board?.member_seq}
                          onPress={() => { profileCardOpenPopup(storyData.board?.member_seq, storyData.board?.open_cnt, false); }} >

                          <Image source={findSourcePath(storyData.board?.mst_img_path)} style={_styles.mstImgStyle} />
                        </TouchableOpacity>

                        <SpaceView viewStyle={{flexDirection: 'column'}}>

                          {/* 프로필 평점, 인증 레벨 */}
                          {((isEmptyData(storyData.board?.auth_acct_cnt) && storyData.board?.auth_acct_cnt >= 5) || storyData.board?.profile_score >= 7.0) && (
                            <>
                              <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                                {storyData.board?.profile_score >= 7.0 && (
                                  <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={ICON.starYellow} style={styles.iconSize16} />
                                    <Text style={_styles.scoreText}>{storyData.board?.profile_score}</Text>
                                  </SpaceView>
                                )}

                                {(isEmptyData(storyData.board?.auth_acct_cnt) && storyData.board?.auth_acct_cnt >= 5) && (
                                  <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={ICON.bookmarkPurple} style={[styles.iconSize16, {marginLeft: 5}]} />
                                    <Text style={_styles.scoreText}>{storyData.board?.auth_acct_cnt}</Text>
                                  </SpaceView>
                                )}
                              </SpaceView>
                            </>
                          )}

                          {/* 닉네임 */}
                          <SpaceView ml={3}>
                            <Text style={_styles.nicknameText(storyData.board?.story_type == 'SECRET' || storyData.board?.secret_yn == 'Y', storyData.board?.gender, 12)}>{storyData.board?.nickname}</Text>
                          </SpaceView>
                        </SpaceView>
                      </>
                    )}
                  </SpaceView>
                )}

                {/* ################################################################################################# 버튼 영역 */}
                <SpaceView viewStyle={{flexDirection: 'row', position: 'absolute', top: 0, right: 0,}}>

                  {/* 좋아요 버튼 */}
                  <TouchableOpacity 
                    onPress={() => { storyLikeProc('BOARD', 0); }} 
                    hitSlop={commonStyle.hipSlop20}>

                    {storyData.board?.member_like_yn == 'N' ? (
                      <Image source={ICON.heartOffIcon} style={styles.iconSquareSize(20)} />
                    ) : (
                      <Image source={ICON.heartOnIcon} style={styles.iconSquareSize(20)} />
                    )}
                  </TouchableOpacity>

                  {/* 비밀 댓글 버튼 */}
                  {(memberBase?.member_seq != storyData.board?.member_seq && storyData.board?.story_type != 'SECRET') && (
                    <TouchableOpacity style={{marginLeft: 12}} onPress={() => { replyModalOpen(0, 0, true); }}>
                      <Image source={ICON.speechDotline} style={styles.iconSquareSize(20)} />
                    </TouchableOpacity>
                  )}

                  {/* 일반 댓글 버튼 */}
                  <TouchableOpacity style={{flexDirection: 'row', marginLeft: 12}} onPress={() => { replyModalOpen(0, 0, false); }}>
                    <Image source={ICON.reply} style={styles.iconSquareSize(21)} />
                  </TouchableOpacity>
                  
                  {/* 메뉴바 버튼 */}
                  {(memberBase?.member_seq == storyData.board?.member_seq) && (
                    <TouchableOpacity onPress={() => { storyMod_onOpen(); }} style={{flexDirection:'row', alignItems: 'center', marginLeft: 12}}>
                      <View style={[_styles.blackDot, {marginRight: 3}]}></View>
                      <View style={[_styles.blackDot, {marginRight: 3}]}></View>
                      <View style={_styles.blackDot}></View>
                    </TouchableOpacity>
                  )}
                </SpaceView>
              </SpaceView>
            </SpaceView>

            {/* ###################################################################################### 내용 영역 */}
            <SpaceView mt={8} pl={20} pr={20} pb={15} viewStyle={{borderBottomWidth: 1, borderBottomColor: '#eee'}}>
              <Text style={_styles.contentsText}>{storyData.board?.contents}</Text>
              <Text style={_styles.timeText}>{storyData.board?.time_text}</Text>
            </SpaceView>

            {/* ###################################################################################### 댓글 영역 */}
            <SpaceView ml={20} mr={20}>
              {/* <TouchableOpacity style={{marginLeft: 15}} onPress={() => { replyModalOpen(0, 0); }}>
                  <Image source={ICON.reply} style={styles.iconSquareSize(21)} />
                </TouchableOpacity> */}

              <SpaceView mt={15} mb={10} viewStyle={{flexDirection:'row'}}>
                  <Text style={_styles.replyLengthText}>댓글{storyData.replyList?.length > 0 && storyData.replyList?.length + '개'}</Text>
                  <TouchableOpacity 
                    hitSlop={commonStyle.hipSlop10}
                    style={{marginLeft: 15}}
                    onPress={() => { popupStoryBoardActive(); }}>
                    <Text style={_styles.likeCntText}>좋아요{storyData.board?.like_cnt > 0 && storyData.board?.like_cnt + '개'}</Text>
                  </TouchableOpacity>  
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
        isSecret={selectedReplyData.isSecret}
        callbackFunc={replyRegiCallback} 
      />

      {/* ##################################################################################
                좋아요 목록 팝업
      ################################################################################## */}
      <LikeListPopup
        isVisible={likeListPopup}
        closeModal={likeListCloseModal}
        type={likeListTypePopup}
        _storyBoardSeq={props.route.params.storyBoardSeq}
        storyReplyData={selectedReplyData}
        replyInfo={replyInfo}
        profileOpenFn={profileCardOpenPopup}
      />

      {/* ###############################################
			게시글 수정/삭제 팝업
			############################################### */}
      <Modalize
        ref={storyMod_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={[modalStyle.modalContainer]} >

        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            스토리 관리
          </CommonText>
          <TouchableOpacity onPress={storyMod_onClose} hitSlop={commonStyle.hipSlop20}>
            <Image source={ICON.xBtn2} style={styles.iconSize20} />
          </TouchableOpacity>
        </View>

        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          <SpaceView mt={10}>
            <CommonBtn value={'스토리 수정하기'} type={'primary2'} borderRadius={12} onPress={ goStoryModify } />
          </SpaceView>
          <SpaceView mt={10}>
            <CommonBtn value={'스토리 삭제하기'} type={'primary2'} borderRadius={12} onPress={ deleteStoryBoard } />
          </SpaceView>
        </View>

        <TouchableOpacity style={_styles.modalCloseText} onPress={storyMod_onClose} hitSlop={commonStyle.hipSlop20}>
          <Text style={{color: '#fff', fontFamily: 'Pretendard-Bold', fontSize: 16}}>확인</Text>
        </TouchableOpacity>
      </Modalize>
    </>
  );


  /* ################################################################################################## 이미지 렌더링 */
  function ImageRender({ item }) {
    //const isVote = item?.vote_yn == 'Y' ? true : false; // 투표 여부

    //const url = findSourcePath(item?.img_file_path);  운영 반영시 적용
    let url = '';
    // let baseColor = '#7A85EE';
    // let baseColorArr = ['#7984ED', '#8759D5'];
    // let textColor = '#ffffff';
    // let btnText = '투표하기';

    if(isEmptyData(item?.img_file_path)) {
      url = findSourcePathLocal(item?.img_file_path);
    } else {
      url = findSourcePathLocal(item?.file_path);
    };

    // 작성자 여부 구분 처리
    // if(memberBase?.member_seq == storyData.board?.member_seq) {
    //   if(storyData.board?.vote_end_yn == 'Y') {
    //     if(storyData.board?.selected_vote_seq != item?.story_vote_seq) {
    //       baseColorArr = ['#FE0456', '#FE0456'];
    //       baseColor = '#FE0456';
    //       btnText = item?.vote_member_cnt + '표';
    //     } else {
    //       btnText = item?.vote_member_cnt + '표(PICK)';
    //     }
    //   } else {
    //     baseColorArr = ['#7984ED', '#7984ED'];
    //     btnText = item?.vote_member_cnt + '표';
    //   }
    // } else {
    //   if(isVote) {
    //     baseColorArr = ['#FE0456', '#FE0456'];
    //     baseColor = '#FE0456';
    //     btnText = '투표완료';
    //   } else {
    //     if(storyData.board?.vote_end_yn == 'Y') {
    //       baseColorArr = ['#EEEEEE', '#EEEEEE'];
    //       baseColor = '#DDDDDD';
    //       textColor = '#555555';
    //       btnText = '투표마감';
    //     }
    //   }
    // };

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
            </>
          )}
        </SpaceView>

        {/* <SpaceView viewStyle={_styles.voteArea(baseColor)}>
              <SpaceView mb={10} viewStyle={_styles.voteViewArea(baseColor)}><Text style={_styles.voteOrderText(textColor)}>0{item?.order_seq}</Text></SpaceView>
              <SpaceView mb={10}><Text style={_styles.voteNameText}>{item?.vote_name}</Text></SpaceView>
              <SpaceView mb={20} viewStyle={_styles.voteDescArea}>
                <Text style={_styles.voteDescText}>투표 후에도 선택을 바꿀 수 있습니다.</Text>

                {isEmptyData(storyData.board?.vote_time_text) && (
                  <Text style={_styles.voteTimeText}>({storyData.board?.vote_time_text})</Text>
                )}
              </SpaceView>
              <TouchableOpacity
                disabled={memberBase?.member_seq == storyData.board?.member_seq || isVote || storyData.board?.vote_end_yn == 'Y'}
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
            </SpaceView> */}
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
    fontFamily: 'Pretendard-Bold',
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
    height: width * 1.3,
  },
  btnArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regiBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //width: 200,
  },
  regiBtnText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#555555',
  },
  pagingContainer: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    top: width * 1.3 - 20,
    left: 0,
    right: 0,
  },
  pagingDotStyle: (isOn:boolean) => {
    return {
      width: isOn ? 20 : 4,
      height: 4,
      borderRadius: 10,
    };
  },
  dotContainerStyle: {
    marginRight: 2,
    marginLeft: 2,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  contentsText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#333',
  },
  timeText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  replyEtcArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  replyListWrap: {
    flex: 1,
    //flexWrap: 'nowrap',
    //marginHorizontal: 5,
  },
  replyItemWarp: {
    marginBottom: 20,
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
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  replyContents: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    //flex: 0.8,
  }, 
  replyNicknameText: (storyType:string, gender:string) => {
    let clr = '#000';

    if(storyType == 'SECRET') {
      if(gender == 'M') {
        clr = '#7986EE';
      } else {
        clr = '#FE0456';
      }
    }

    return {
      color: clr,
    };
  },
  replyTimeText: {
    fontFamily: 'Pretendard-Regular',
    color: '#999',
    fontSize: 14,
  },
  replyItemEtcWrap: {
    width: '97%',
    height: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyTextStyle: {
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    fontSize: 14,
  },
  replyLengthText: {
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    fontSize: 14,
    marginLeft: 1,
  },
  likeCntText: {
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    fontSize: 14,
  },
  replyLikeCntText: {
    fontFamily: 'Pretendard-Regular',
    color: '#555',
    fontSize: 14,
    marginLeft: 6,
  },
  likeArea: {
    flexDirection: 'row',
    //alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,
    right: 0,
    //width: 80,
  },
  nicknameText: (isSecret:boolean, gender:string, _frSize:number) => {
    let clr = '#333333';
    if(isSecret) {
      if(gender == 'M') {
        clr = '#7986EE';
      } else {
        clr = '#FE0456';
      }
    }

    return {
      fontFamily: 'Pretendard-Bold',
      fontSize: _frSize,
      color: clr,
    };
  },
  scoreText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    color: '#333333',
  },
  voteSelectArea: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
    flex:1,
    flexDirection: 'row',
  },
  voteVsArea: {
    width: 55,
    height: 28,
    backgroundColor: '#000',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -27.5}, {translateY: -14}],
    zIndex: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteVsText: {
    color: '#FFF',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
  voteArea: (bdColor: string, bgColor: string) => {
    return {
      alignItems: 'center',
      borderWidth: 1,
      borderColor: bdColor,
      backgroundColor: bgColor,
      borderRadius: 10,
      paddingVertical: 15,
      width: width - 215,
      height: width - 210,
      paddingHorizontal: 13,
      marginHorizontal: 3,
      overflow: 'hidden',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
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
      fontFamily: 'Pretendard-Bold',
      fontSize: 14,
      borderRadius: 13,
      color: textColor,
      paddingHorizontal: 15,
      paddingVertical: 3,
    };
  },
  voteNameText: (textColor: string) => {
    return {
      fontFamily: 'Pretendard-Regular',
      color: textColor,
      fontSize: 14,
      textAlign: 'center',
    }
  },
  voteDescArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteDescText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#555555',
  },
  voteTimeText: {
    fontFamily: 'Pretendard-Regular',
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
      fontFamily: 'Pretendard-Medium',
      color: textColor,
      fontSize: 16,
      textAlign: 'center',
    };
  },
  mstImgStyle: {
    width: 32,
    height: 32,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 7,
  },
  voteImgStyle: {
    borderRadius: 50,
    overflow: 'hidden',
    width: 75,
    height: 75,
    marginRight: 0,
  },
  voteMmbrCntArea: {
    width: width - 216,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  votePickText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    marginTop: -60,
  },
  votePickImg: {
    zIndex: 1,
    width: width - 215,
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  votePickShadow: (bdColor: string) => {
    return {
      position:'absolute',
      top: 0,
      left: 0,
      width: width - 215,
      height: 180,
      alignItems: 'center',
      marginLeft: 3,
      marginRight: 3,
      borderRadius: 10,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
      backgroundColor: '#FFF',
      zIndex: -1,
      shadowColor: bdColor,
    }
  },
  voteCntText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Pretendard-Medium',
  },
  blackDot: {
    width: 4,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  modalCloseText: {
    width: '100%',
    backgroundColor: '#7984ED',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

});