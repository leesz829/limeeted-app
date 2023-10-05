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


const { width } = Dimensions.get('window');

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  type: String;
  _storyBoardSeq: Number;
  _storyReplySeq: {};
  replyInfo: {};
}

export default function LikeListPopup({ isVisible, closeModal, type, _storyBoardSeq, _storyReplySeq, replyInfo }: Props) {
  const { show } = usePopup();
	const [isLoading, setIsLoading] = useState(false);

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
      story_reply_seq: _storyReplySeq.storyReplySeq,
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
          <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Image source={ memberMstImgPath } style={_styles.imageStyle} resizeMode={'cover'} />
            <Text style={_styles.likeListText}>{item.nickname}, {item.age}</Text>
          </SpaceView>
          <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={_styles.levelBadge}>
              <AuthLevel authAcctCnt={item.auth_acct_cnt} type={'BASE'} />
            </View>
            <ProfileGrade profileScore={item.profile_score} type={'BASE'} />
          </View>
        </SpaceView>
      </>
    );
  };

  return (
    <Modal isVisible={isVisible}>
      <SafeAreaView style={_styles.container}>
        <View style={_styles.titleBox}>
          <Text style={_styles.titleText}>좋아요 목록</Text>
          <TouchableOpacity onPress={() => closeModal()}>
            <Image source={ICON.closeBlack} style={_styles.iconSize} />
          </TouchableOpacity>
        </View>

          {
            type == 'REPLY' ? 
              <SpaceView viewStyle={_styles.replyArea}>
                <Image source={findSourcePath(replyInfo.mst_img_path)} style={[_styles.imageStyle, {marginTop: 15}]} resizeMode={'cover'} />
                <SpaceView mt={10} ml={5} pt={3} viewStyle={{flexDirection: 'column', flex: 1}}>
                  <Text style={{fontSize: 16}}>{replyInfo.nickname}<Text style={{fontWeight: '200'}}> 1분전</Text></Text>
                  <Text style={{marginTop: 10, fontSize: 16, fontWeight: '200'}}>{replyInfo.reply_contents}</Text>
                </SpaceView>
              </SpaceView>
              : <></>
          }

        <SpaceView viewStyle={_styles.likeCntArea}>
          <Text>{likeListCnt}<Text style={[_styles.likeListText, {fontWeight: '200'}]}>개의 좋아요</Text></Text>
        </SpaceView>
        
        <FlatList
          style={{marginBottom: 50, minHeight: 300}}
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
      </SafeAreaView>
    </Modal>
  );
};

const _styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginHorizontal: 15,
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#676767',
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
    paddingHorizontal: 20,
  },
  likeCntArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  likeListText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 16,
    marginLeft: 10,
    letterSpacing: 0,
    fontWeight: '300',
    textAlign: 'left',
    color: '#646464',
  },
  replyArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  imageStyle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 5,
  },
  iconSize: {
    width: 15,
    height: 15,
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
});
