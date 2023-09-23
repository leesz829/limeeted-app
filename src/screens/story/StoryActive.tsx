import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, Animated, Easing, PanResponder, Platform, TouchableWithoutFeedback } from 'react-native';
import { story_board_detail, story_like_save } from 'api/models';
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

  // 이미지 인덱스
  const imgRef = React.useRef();

  // 본인 데이터
  const memberBase = useUserInfo();

  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 체크
  const [isClickable, setIsClickable] = useState(true); // 클릭 여부
  const [isReplyVisible, setIsReplyVisible] = useState(false);

  // 선택된 댓글 데이터(댓글 등록 모달 적용)
  const [selectedReplyData, setSelectedReplyData] = useState({
    storyReplySeq: 0,
    depth: 0,
  });

  // 스토리 데이터
  const [storyData, setStoryData] = useState({
    board: {},
    imageList: [],
    replyList: [],
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
    console.log('_isRegi ::::: ' , _isRegi);

    if(_isRegi) {
      getStoryBoard();
    };

    setIsReplyVisible(false);
  };

  // 이미지 인덱스
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 이미지 스크롤 처리
  const handleScroll = (event) => {
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

  // ############################################################################# 스토리 조회
  const getStoryBoard = async () => {
    try {
      setIsLoading(true);

      const body = {
        story_board_seq: storyBoardSeq,
      };

      const { success, data } = await story_board_detail(body);
      if(success) {
        switch (data.result_code) {
        case SUCCESS:
          setStoryData({
            board: data.story,
            imageList: data.story_img_list,
            replyList: data.story_reply_list,
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
                  {item.nickname}  <Text style={_styles.replyContents}>{item.reply_contents}</Text> <Text style={_styles.replyTimeText}> 1분전</Text>
                </Text>

                <SpaceView pt={2} viewStyle={{alignItems: 'flex-start'}}>
                  <SpaceView viewStyle={_styles.replyItemEtcWrap}>
                    <TouchableOpacity 
                      disabled={memberBase.member_seq == item?.member_seq}
                      onPress={() => { likeFunc('REPLY', storyReplySeq); }}
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
      
    };
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <CommonHeader title={'스토리 활동 이력'} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: '#fff'}}>

        {/* ###################################################################################### 탭 영역 */}
        <SpaceView viewStyle={_styles.tabWrap}>
          <TouchableOpacity style={_styles.tabItem}>
            <Text style={_styles.tabItemText(currentIndex == 0 ? true : false)}>새소식</Text>
          </TouchableOpacity>
          <TouchableOpacity style={_styles.tabItem}>
            <Text style={_styles.tabItemText(currentIndex == 1 ? true : false)}>내가쓴글</Text>
          </TouchableOpacity>
        </SpaceView>

        {/* ###################################################################################### 컨텐츠 영역 */}
        <SpaceView>

          <FlatList
            ref={imgRef}
            data={['새소식','내가쓴글']}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            renderItem={({ item, index }) => {
              return (
                <View key={'reply_' + index} style={{width: width, minHeight: height,}}>
                  <Text>{index == 0 ? 'asdasldkmlasmkd' : 'qqqqqqqqqqqqq'}</Text>

                  {/* <ReplyRender 
                    item={item} 
                    index={index} 
                    likeFunc={storyLikeProc} 
                    replyModalOpenFunc={replyModalOpen}
                  /> */}
                </View>
              )
            }}
          />


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

    </>
  );

};


{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({

  tabWrap: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tabItem: {
    width: '50%',
    paddingVertical: 10,
  },
  tabItemText: (isOn:boolean) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 14,
      color: isOn ? '#000' : '#ACACAC',
      textAlign: 'center',
    };
  },


  
});