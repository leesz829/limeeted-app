import Modal from 'react-native-modal';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import { findSourcePath, IMAGE, GIF_IMG, ICON } from 'utils/imageUtils';
import Carousel from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import SpaceView from 'component/SpaceView';
import { styles } from 'assets/styles/Styles';
import { get_story_like_list } from 'api/models';
import { RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import { usePopup } from 'Context';
import AuthLevel from 'component/common/AuthLevel';
import ProfileGrade from 'component/common/ProfileGrade';
import { ScrollView } from 'react-native-gesture-handler';
import { isEmptyData } from 'utils/functions';


const { width, height } = Dimensions.get('window');

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  type: String;
  _storyBoardSeq: Number;
  storyReplyData: {};
  replyInfo: {};
  profileOpenFn: (memberSeq:number, openCnt:number) => void;
}

export default function LikeListPopup({ isVisible, closeModal, type, _storyBoardSeq, storyReplyData, replyInfo, profileOpenFn }: Props) {
  const { show } = usePopup();
	const [isLoading, setIsLoading] = useState(false);

  const memberBase = useUserInfo(); // 본인 데이터

  // 좋아요 목록 갯수
  const [likeListCnt, setLikeListCnt] = React.useState(0);

  // 좋아요 목록 데이터
  const [likeListData, setLikeListData] = React.useState({
    likeList: [],
  });

  // 좋아요 목록 조회
	const getStoryLikeList = async () => {
		setIsLoading(true);

    // 스토리 게시물 좋아요 파람
    const boardBody = {
      story_board_seq: _storyBoardSeq,
      type: type,
    };

    // 스토리 댓글 좋아요 파람
    const replyBody = {
      story_reply_seq: storyReplyData?.storyReplySeq,
      type: type,
    };

		try {
			const { success, data } = await get_story_like_list(type == 'BOARD' ? boardBody : replyBody);

			if (success) {
				if (data.result_code == '0000') {
          setLikeListData({likeList: data.like_list});
          setLikeListCnt(data.like_list.length);
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

  // 프로필 카드 열기
  const profileOpen = async (memberSeq:number, opcnCnt:number) => {
    closeModal();
    profileOpenFn(memberSeq, opcnCnt);
  };

  React.useEffect(() => {
    if(isVisible){
      getStoryLikeList();
    }
	}, [isVisible]);

  // ############################################################################# 좋아요 목록 렌더링
  const LikeListRender = ({ item, index }) => {
    const memberMstImgPath = findSourcePath(item?.mst_img_path); // 회원 대표 이미지 경로

    return (
      <>
        <SpaceView mt={15} mb={5} viewStyle={_styles.likeListArea}>
          <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              disabled={memberBase?.gender === item?.gender || memberBase?.member_seq === item?.member_seq}
              onPress={() => { profileOpen(item?.member_seq, item?.open_cnt); }} >

              <Image source={ memberMstImgPath } style={_styles.imageStyle(45)} resizeMode={'cover'} />
            </TouchableOpacity>
            {/* <Text style={_styles.likeListText}>{item.nickname}, {item.age}</Text> */}
            <SpaceView ml={6}>
              {/* 프로필 평점, 인증 레벨 */}
              {(isEmptyData(item?.auth_acct_cnt) || item?.profile_score > 0.0) && (
                <Text style={_styles.profileText}>
                  {item?.profile_score}
                  {(isEmptyData(item?.auth_acct_cnt) && item?.profile_score > 0.0) && ' | '}
                  {isEmptyData(item?.auth_acct_cnt) && 'Lv ' + item?.auth_acct_cnt}
                </Text>
              )}
              <Text style={_styles.nicknameText}>{item.nickname}</Text>
            </SpaceView>
          </SpaceView>
          
          {(memberBase?.gender != item?.gender && memberBase?.member_seq != item?.member_seq) && (
            <TouchableOpacity
              disabled={memberBase?.gender === item?.gender || memberBase?.member_seq === item?.member_seq}
              onPress={() => { profileOpen(item?.member_seq, item?.open_cnt); }}>

              <Text style={_styles.openBtn}>프로필 카드 열기</Text>
            </TouchableOpacity>
          )}
        </SpaceView>
      </>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onRequestClose={() => { closeModal(); }}
      onBackdropPress={closeModal} >
      <SafeAreaView style={_styles.container}>
        <View style={_styles.titleBox}>
          <Text style={_styles.titleText}>좋아요 목록</Text>
          <TouchableOpacity onPress={() => closeModal()}>
            <Image source={ICON.closeLight} style={_styles.iconSize} />
          </TouchableOpacity>
        </View>

        {type == 'REPLY' ? (
          <SpaceView viewStyle={_styles.replyArea}>
            <TouchableOpacity
              disabled={memberBase?.gender === replyInfo?.gender || memberBase?.member_seq === replyInfo?.reg_seq}
              onPress={() => { profileOpen(replyInfo?.reg_seq, replyInfo?.open_cnt); }} >

              <Image source={findSourcePath(replyInfo.mst_img_path)} style={[_styles.imageStyle(35), {marginTop: 15}]} resizeMode={'cover'} />
            </TouchableOpacity>
            <SpaceView mt={10} ml={5} pt={3} viewStyle={{flexDirection: 'column', flex: 1}}>
              <Text style={[_styles.mainNicknameText]}>{replyInfo.nickname}<Text style={{fontFamily: 'AppleSDGothicNeoR00', color: '#999'}}> {replyInfo.time_text}</Text></Text>
              <Text style={[_styles.replyText, {marginTop: 5}]}>{replyInfo.reply_contents}</Text>
            </SpaceView>
          </SpaceView>
        ) : (
          <></>
        )}

        <SpaceView viewStyle={{maxHeight: height - 350}}>
          <SpaceView viewStyle={_styles.likeCntArea}>
            <Text>{likeListCnt}<Text style={_styles.likeListText}>개의 좋아요</Text></Text>
          </SpaceView>
          
          <FlatList
            style={{marginBottom: 30}}
            data={likeListData.likeList}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <LikeListRender 
                    item={item}
                    index={index} 
                  />
                </View>
              )
            }}
          />
        </SpaceView>
        
      </SafeAreaView>
    </Modal>
  );
};

const _styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    textAlign: 'left',
    color: '#333',
  },
  contentBody: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 50,
  },
  likeListArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  likeCntArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  likeListText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    marginLeft: 10,
    marginTop: 5,
    letterSpacing: 0,
    fontWeight: '300',
    textAlign: 'left',
    color: '#333',
  },
  profileText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    color: '#333333',
  },
  mainNicknameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 15,
    color: '#333333',
  },
  nicknameText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    color: '#333333',
  },
  replyArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  replyText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 16,
    letterSpacing: 0,
    fontWeight: '300',
    textAlign: 'left',
    color: '#333',
  },
  imageStyle: (size:number) => {
    return {
      width: size,
      height: size,
      borderRadius: 50,
      overflow: 'hidden',
      marginRight: 5,
    };
  },
  iconSize: {
    width: 20,
    height: 20,
  },
  levelBadge: {
    width: 51,
    height: 21,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  openBtn: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#FF4381',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },


});
