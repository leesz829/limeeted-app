import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { story_board_save, get_story_detail } from 'api/models';
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
import { CommonInput } from 'component/CommonInput';
import { VoteEndRadioBox } from 'component/story/VoteEndRadioBox';


/* ################################################################################################################
###### Story 등록 - 내용 입력
################################################################################################################ */

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: StackNavigationProp<StackParamList, 'StoryEdit'>;
  route: RouteProp<StackParamList, 'StoryEdit'>;
}

export default function StoryEdit(props: Props) {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const memberBase = useUserInfo(); // 회원 기본 데이터
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 체크
  const [isClickable, setIsClickable] = useState(true); // 클릭 여부
  
  const [storyBoardSeq, setStoryBoardSeq] = useState(props.route.params.storyBoardSeq);
  const [imageList, setImageList] = useState([]); // 이미지 목록

  // 스토리 기본 데이터
  const [storyData, setStoryData] = useState({
    storyBoardSeq: props.route.params.storyBoardSeq,
    storyType: isEmptyData(props.route.params.storyType) ? props.route.params.storyType : '',
    contents: '',
    voteEndType: '',
  });

  const [inputVoteName01, setInputVoteName01] = useState('');
  const [inputVoteName02, setInputVoteName02] = useState('');
  const [inputVoteFileData01, setInputVoteFileData01] = useState('');
  const [inputVoteFileData02, setInputVoteFileData02] = useState('');

  // 투표 데이터
  const [voteData, setVoteData] = useState({
    voteSeq01: null,
    voteSeq02: null,
    voteName01: '',
    voteName02: '',
    voteImgUrl01: '',
    voteImgUrl02: '',
  });

  // 이미지 데이터
  const [imgData, setImgData] = React.useState<any>({
    orgImgUrl01: { story_board_img_seq: '', imgPath: '', delYn: '' },
    orgImgUrl02: { story_board_img_seq: '', imgPath: '', delYn: '' },
    orgImgUrl03: { story_board_img_seq: '', imgPath: '', delYn: '' },
  });

  // 투표 마감기한 유형
  const [voteEndTypeList, setVoteEndTypeList] = useState([
    {label: '1시간', value: 'HOURS_1'},
    {label: '6시간', value: 'HOURS_6'},
    {label: '12시간', value: 'HOURS_12'},
    {label: '1일', value: 'DAY_1'},
    {label: '3일', value: 'DAY_3'},
  ]);

  // 투표 종료 유형 콜백 함수
  const voteEndTypeCallbackFn = (value: string) => {
    setStoryData({...storyData, voteEndType: value});
  };

  // ################################################################ 프로필 이미지 파일 콜백 함수
  const fileCallBack1 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 1 };
    imageDataApply(data);
  };

  const fileCallBack2 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 2 };
    imageDataApply(data);
  };

  const fileCallBack3 = async (uri: any, base64: string) => {
    let data = { file_uri: uri, file_base64: base64, order_seq: 3 };
    imageDataApply(data);
  };

  const voteFileCallBack01 = async (uri: any, base64: string) => {
    setInputVoteFileData01(base64);
  };

  const voteFileCallBack02 = async (uri: any, base64: string) => {
    setInputVoteFileData02(base64);
  };

  // ################################################################ 이미지 데이터 적용
  const imageDataApply = async (data:any) => {
    setImageList((prev) => {
      const dupChk = prev.some(item => item.order_seq === data.order_seq);
      if (!dupChk) {
          return [...prev, data];
      } else {
          return prev.map((item) => item.order_seq === data.order_seq 
              ? { ...item, uri: data.file_uri, file_base64: data.file_base64 }
              : item
          );
      }
    });
  };

  // ############################################################################# 사진 삭제 팝업
  const imgDel_modalizeRef = useRef<Modalize>(null);
  const imgDel_onOpen = (imgData: any, order_seq: any) => {
    /* setIsDelImgData({
      img_seq: imgData.member_img_seq,
      order_seq: order_seq,
      status: imgData.status,
      return_reason: imgData.return_reason,
    }); */
    imgDel_modalizeRef.current?.open();
  };
  const imgDel_onClose = () => {
    imgDel_modalizeRef.current?.close();
  };

  // ############################################################################# 스토리 등록
  const storyRegister = async () => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      setIsClickable(false);
      setIsLoading(true);

      try {
        let voteList = [];

        if(!isEmptyData(storyData.contents)) {
          show({ content: '내용을 입력해 주세요.' });
          return false;
        };
        
        if(storyData.storyType == 'VOTE') {
          if(!isEmptyData(voteData.voteName01) || !isEmptyData(voteData.voteName02)) {
            show({ content: '선택지를 작성해 주세요.' });
            return false;
          };

          if((!isEmptyData(voteData.voteImgUrl01) && !isEmptyData(inputVoteFileData01)) || (!isEmptyData(voteData.voteImgUrl02) && !isEmptyData(inputVoteFileData02))) {
            show({ content: '선택지를 작성해 주세요.' });
            return false;
          };

          if(!isEmptyData(storyData.voteEndType)) {
            show({ content: '투표 마감기한을 입력해 주세요.' });
            return false;
          };

          voteList = [
            {story_vote_seq: voteData.voteSeq01, order_seq: 1, vote_name: voteData.voteName01, file_base64: inputVoteFileData01},
            {story_vote_seq: voteData.voteSeq02, order_seq: 2, vote_name: voteData.voteName02, file_base64: inputVoteFileData02}
          ]
        };
    
        const body = {
          story_board_seq: storyBoardSeq,
          story_type: storyData.storyType,
          contents: storyData.contents,
          img_file_list: imageList,
          vote_list: voteList,
          vote_end_type: storyData.voteEndType,
        };

        //console.log('body :::::: ' , body);

        const { success, data } = await story_board_save(body);
        if(success) {
          switch (data.result_code) {
          case SUCCESS:

            navigation.navigate(STACK.TAB, {
              screen: 'Story',
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
            ...storyData,
            storyBoardSeq: data.story?.story_board_seq,
            storyType: data.story?.story_type,
            contents: data.story?.contents,
            voteEndType: data.story?.vote_end_type,
          });

          // 스토리 이미지 데이터 구성
          if(isEmptyData(null != data.story_img_list) && data.story_img_list?.length > 0) {
            let imgData: any = {
              orgImgUrl01: { story_board_img_seq: '', imgPath: '', delYn: '' },
              orgImgUrl02: { story_board_img_seq: '', imgPath: '', delYn: '' },
              orgImgUrl03: { story_board_img_seq: '', imgPath: '', delYn: '' },
            };

            data?.story_img_list?.map(({story_board_img_seq, img_file_path, order_seq}: { story_board_img_seq: any; img_file_path: any; order_seq: any; }) => {
              let data = {
                story_board_img_seq: story_board_img_seq,
                imgPath: img_file_path,
                delYn: 'N',
              };
              if(order_seq == 1) { imgData.orgImgUrl01 = data; }
              if(order_seq == 2) { imgData.orgImgUrl02 = data; }
              if(order_seq == 3) { imgData.orgImgUrl03 = data; }
            });

            setImgData({ ...imgData, imgData });
          };

          // 스토리 투표 데이터 구성
          if(isEmptyData(data.story_vote_list) && data.story_vote_list?.length > 0) {

            let voteSeq01 = null;
            let voteSeq02 = null;
            let voteName01 = '';
            let voteName02 = '';
            let voteImgUrl01 = '';
            let voteImgUrl02 = '';

            data?.story_vote_list?.map((item, index) => {
              if(item.order_seq == 1) {
                voteSeq01 = item.story_vote_seq;
                voteName01 = item.vote_name;
                voteImgUrl01 = item.file_path;
              } else if(item.order_seq == 2) {
                voteSeq02 = item.story_vote_seq;
                voteName02 = item.vote_name;
                voteImgUrl02 = item.file_path;
              }
            });

            setVoteData({
              ...voteData,
              voteSeq01: voteSeq01,
              voteSeq02: voteSeq02,
              voteName01: voteName01,
              voteName02: voteName02,
              voteImgUrl01: voteImgUrl01,
              voteImgUrl02: voteImgUrl02,
            })
          };
          
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

      <CommonHeader title={storyData.storyType == 'STORY' ? '스토리 등록' : storyData.storyType == 'VOTE' ? '투표형 게시글 등록' : '비밀 게시글 등록'} />

      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#fff'}}>

        {/* ############################################################################ 스토리형 */}
        {storyData.storyType == 'STORY' && (
          <SpaceView mt={50} pl={20} pr={20}>
            <SpaceView mb={25}>
              <Text style={_styles.titleText}>게시글 내용을 작성해 주세요.</Text>
            </SpaceView>
            
            <SpaceView viewStyle={_styles.imgArea}>
              {[0,1,2].map((i, index) => {
                return (
                  <>
                    {index == 0 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl01} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack1}  /> }
                    {index == 1 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl02} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack2}  /> }
                    {index == 2 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl03} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack3}  /> }
                  </>
                )
              })}
            </SpaceView>

            <SpaceView mt={20}>
              <CommonTextarea
                value={storyData.contents}
                onChangeText={(text) => setStoryData({...storyData, contents: text})}
                placeholder={'소소한 일상부터 음식, 여행 등 주제에 관계없이 자유롭게 소통해 보세요.\n\n20글자 이상 입력해 주세요.\n\n(주의)이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 제재 대상이 될 수 있으며 상대를 배려하는 마음으로 이용해 주세요.'}
                placeholderTextColor={'#C7C7C7'}
                maxLength={1000}
                exceedCharCountColor={'#990606'}
                fontSize={13}
                height={height-400}
                backgroundColor={'#F6F7FE'}
                fontColor={'#000'}
              />
            </SpaceView>
          </SpaceView>
        )}

        {/* ############################################################################ 투표형 */}
        {storyData.storyType == 'VOTE' && (
          <SpaceView mt={50} pl={20} pr={20}>

            {/* ############### 선택지 입력 영역 */}
            <SpaceView mb={30}>
              <SpaceView mb={10}>
                <Text style={_styles.titleText}>선택지를 작성해 주세요.</Text>
              </SpaceView>
              
              <SpaceView viewStyle={_styles.voteArea}>
                <SpaceView mb={10}>
                  <TextInput
                    value={voteData.voteName01}
                    onChangeText={(text) => setVoteData({...voteData, voteName01 : text})}
                    multiline={false}
                    autoCapitalize="none"
                    style={_styles.voteInput}
                    placeholder={'선택지 입력'}
                    placeholderTextColor={'#c7c7c7'}
                    editable={true}
                    secureTextEntry={false}
                    maxLength={50}
                    numberOfLines={1}
                  />

                  <SpaceView viewStyle={_styles.voteImgArea}>
                    <CommonImagePicker 
                      type={'STORY'} 
                      callbackFn={voteFileCallBack01} 
                      uriParam={isEmptyData(voteData.voteImgUrl01) ? voteData.voteImgUrl01 : ''}
                      imgWidth={48} 
                      imgHeight={48}
                      borderRadius={8}
                    />
                  </SpaceView>
                </SpaceView>
                <SpaceView>
                  <TextInput
                    value={voteData.voteName02}
                    onChangeText={(text) => setVoteData({...voteData, voteName02 : text})}
                    multiline={false}
                    autoCapitalize="none"
                    style={_styles.voteInput}
                    placeholder={'선택지 입력'}
                    placeholderTextColor={'#c7c7c7'}
                    editable={true}
                    secureTextEntry={false}
                    maxLength={50}
                    numberOfLines={1}
                  />

                  <SpaceView viewStyle={_styles.voteImgArea}>
                    <CommonImagePicker 
                      type={'STORY'} 
                      callbackFn={voteFileCallBack02} 
                      uriParam={isEmptyData(voteData.voteImgUrl02) ? voteData.voteImgUrl02 : ''}
                      imgWidth={48} 
                      imgHeight={48}
                      borderRadius={8}
                    />
                  </SpaceView>
                </SpaceView>
              </SpaceView>
            </SpaceView>

            {/* ############### 투표 마감기한 입력 영역 */}
            <SpaceView mb={30}>
              <SpaceView mb={10}>
                <Text style={_styles.titleText}>투표 마감기한을 입력해 주세요.</Text>
              </SpaceView>

              <SpaceView>
                <VoteEndRadioBox
                  value={storyData.voteEndType}
                  items={voteEndTypeList}
                  callBackFunction={voteEndTypeCallbackFn}
                />
              </SpaceView>
            </SpaceView>

            {/* ############### 투표 내용 입력 영역 */}
            <SpaceView mb={20}>
              <SpaceView mb={10}>
                <Text style={_styles.titleText}>투표 내용을 작성해 주세요.</Text>
              </SpaceView>
              <CommonTextarea
                value={storyData.contents}
                onChangeText={(text) => setStoryData({...storyData, contents: text})}
                placeholder={'소소한 일상부터 음식, 여행 등 주제에 관계없이 자유롭게 소통해 보세요.\n\n20글자 이상 입력해 주세요.\n\n(주의)이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 제재 대상이 될 수 있으며 상대를 배려하는 마음으로 이용해 주세요.'}
                placeholderTextColor={'#C7C7C7'}
                maxLength={1000}
                exceedCharCountColor={'#990606'}
                fontSize={13}
                height={height-400}
                backgroundColor={'#F6F7FE'}
                fontColor={'#000'}
              />
            </SpaceView>
          </SpaceView>
        )}
      </ScrollView>

      <SpaceView viewStyle={_styles.btnArea}>
        <TouchableOpacity onPress={() => { storyRegister(); }} style={_styles.regiBtn}>
          <Text style={_styles.regiBtnText}>등록</Text>
        </TouchableOpacity>
      </SpaceView>
    </>
  );

};

// ############################################################################# 이미지 렌더링 아이템
function ImageRenderItem ({ index, _imgData, delFn, fileCallBackFn }) {
  //const imgUrl = findSourcePath(_imgData?.imgPath);  운영 반영시 적용
  const imgUrl = findSourcePathLocal(_imgData?.imgPath);
  const imgDelYn = _imgData?.delYn;

  return (
    <View style={_styles.imgItem}>
      {/* {isEmptyData(imgUrl) && imgDelYn == 'N' ? (
        <TouchableOpacity onPress={() => { delFn(_imgData, index+1); }}>
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={_styles.imageStyle}
            key={imgUrl}
            source={imgUrl}
          />
        </TouchableOpacity>
      ) : (
        <CommonImagePicker 
          type={'STORY'} 
          callbackFn={fileCallBackFn} 
          uriParam={''}
          imgWidth={(width - 70) / 3} 
          imgHeight={(width - 70) / 3}
        />
      )} */}

      <CommonImagePicker 
        type={'STORY'} 
        callbackFn={fileCallBackFn} 
        uriParam={isEmptyData(imgUrl) ? imgUrl : ''}
        imgWidth={(width - 70) / 3} 
        imgHeight={(width - 70) / 3}
      />
    </View>
  );
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
    width: (width - 70) / 3,
    height: (width - 70) / 3,
    //margin: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  btnArea: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  regiBtn: {
    backgroundColor: '#B1B1B1',
    width: 100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  regiBtnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 5,
  },
  voteArea: {

  },
  voteInput: {
    backgroundColor: '#F0F0F0',
    paddingLeft: 10,
    paddingRight: 50,
  },
  voteImgArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
    overflow: 'hidden',
  },

  
});