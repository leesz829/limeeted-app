import { useIsFocused, useNavigation, useFocusEffect, RouteProp  } from '@react-navigation/native';
import { StackParamList, ScreenNavigationProp, ColorType } from '@types';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, TextInput, InputAccessoryView, Platform, KeyboardAvoidingView } from 'react-native';
import { save_story_board, get_story_detail } from 'api/models';
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
import { CommonBtn } from 'component/CommonBtn';


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
  const inputRef = React.useRef();
  
  const [storyBoardSeq, setStoryBoardSeq] = useState(props.route.params.storyBoardSeq);
  const [imageList, setImageList] = useState([]); // 이미지 목록

  const [imgDelSeqStr, setImgDelSeqStr] = useState('');

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
    /* voteImgData01: { vote_seq: '', imgPath: '', delYn: '' },
    voteImgData02: { vote_seq: '', imgPath: '', delYn: '' }, */
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

  const handleTextInputClick = async () => {
    console.log('dddd');
  }

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

  const voteFileCallBack01 = async (uri: any, base64: string, i: number) => {
    setInputVoteFileData01(base64);
  };

  const voteFileCallBack02 = async (uri: any, base64: string, i: number) => {
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

  // ############################################################################# 사진 변경/삭제 팝업
  const imgDel_modalizeRef = useRef<Modalize>(null);

  const imgDel_onOpen = (imgSeq: any, orderSeq: any, type: string) => {
    setIsDelImgData({
      img_seq: imgSeq,
      order_seq: orderSeq,
      type: type,
    });
    imgDel_modalizeRef.current?.open();
  };
  const imgDel_onClose = () => {
    imgDel_modalizeRef.current?.close();
  };

  // ############################################################################# 사진삭제 컨트롤 변수
  const [isDelImgData, setIsDelImgData] = React.useState<any>({
    img_seq: '',
    order_seq: '',
    type: '',
  });

  // ############################################################################# 사진 삭제
  const imgDelProc = () => {

    if(isDelImgData.type == 'STORY') {
      if(isDelImgData.order_seq == '1') {
        setImgData({
          ...imgData,
          orgImgUrl01: { ...imgData.orgImgUrl01, delYn: 'Y' },
        });
      }
      if(isDelImgData.order_seq == '2') {
        setImgData({
          ...imgData,
          orgImgUrl02: { ...imgData.orgImgUrl02, delYn: 'Y' },
        });
      }
      if(isDelImgData.order_seq == '3') {
        setImgData({
          ...imgData,
          orgImgUrl03: { ...imgData.orgImgUrl03, delYn: 'Y' },
        });
      }
    } else if(isDelImgData.type == 'VOTE') {
      if(isDelImgData.order_seq == '1') {
        setVoteData({...voteData, voteImgUrl01: ''});
      } else if(isDelImgData.order_seq == '2') {
        setVoteData({...voteData, voteImgUrl02: ''});
      }
    }    

    let delArr = imgDelSeqStr;
    if (!isEmptyData(delArr)) {
      delArr = isDelImgData.img_seq;
    } else {
      delArr = delArr + ',' + isDelImgData.img_seq;
    }

    setImgDelSeqStr(delArr);
    imgDel_onClose();
  };

  // ############################################################################# 사진 수정
  const imgModProc = () => {

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

        if(storyData.contents.length < 10) {
          show({ content: '최소 10글자 이상 입력해 주세요.' });
          return false;
        }
        
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
            show({ content: '투표 마감기한을 선택해 주세요.' });
            return false;
          };

          voteList = [
            {story_vote_seq: voteData.voteSeq01, order_seq: 1, vote_name: voteData.voteName01, file_base64: inputVoteFileData01},
            {story_vote_seq: voteData.voteSeq02, order_seq: 2, vote_name: voteData.voteName02, file_base64: inputVoteFileData02}
          ]
        };

        //return;
    
        const body = {
          story_board_seq: storyBoardSeq,
          story_type: storyData.storyType,
          contents: storyData.contents,
          img_file_list: imageList,
          img_del_seq_str: storyData.storyType == 'STORY' ? imgDelSeqStr : '',
          vote_list: voteList,
          vote_end_type: storyData.voteEndType,
        };

        const { success, data } = await save_story_board(body);
        if(success) {
          switch (data.result_code) {
          case SUCCESS:

            if(isEmptyData(storyBoardSeq)) {
              navigation.goBack();
            } else {
              navigation.navigate(STACK.TAB, {
                screen: 'Story',
              });
            }
            
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

      <CommonHeader 
        type={'STORY_REGI'}
        title={storyData.storyType == 'STORY' ? '스토리' : storyData.storyType == 'VOTE' ? '투표' : '시크릿'}
        callbackFunc={storyRegister} />

      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: '#fff'}}
        behavior={Platform.OS === 'ios' ? 'padding' : null} // iOS에서는 'padding'을 사용합니다.
      >      
        <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#fff'}}>

          <SpaceView mt={20} pl={20} pr={20}>

            {/* ##############################################################################################################
            ##### 타이틀 영역
            ############################################################################################################## */}
            <SpaceView mb={25}>
              <Text style={_styles.titleText}>
                {storyData.storyType == 'SECRET' ? (
                  <>이야기 앞에 <Text style={_styles.titleHightText}>"비밀"</Text>이 붙으면{'\n'}더 재밌어지는 법이죠!</>
                ) : storyData.storyType == 'VOTE' ? (
                  <><Text style={_styles.titleHightText}>왼 VS 오 어떤것?</Text>{'\n'}선택 장애 해결! 밸런스 게임 즐기기!</>
                ) : (
                  <>소소한 일상부터 음식, 여행 등{'\n'}<Text style={_styles.titleHightText}>주제에 관계없이 자유롭게</Text> 소통해 보세요.</>
                )}
              </Text>
              {/* <View style={_styles.titleUnderline(storyData.storyType)} /> */}
            </SpaceView>

            {/* ##############################################################################################################
            ##### 내용 영역
            ############################################################################################################## */}
            {(storyData.storyType == 'STORY' || storyData.storyType == 'SECRET') && (
              <>
                {/* ############################################################################ 스토리형 또는 비밀 */}
                <SpaceView viewStyle={_styles.imgArea}>
                  {[0,1,2].map((i, index) => {
                    return (
                      <>
                        {index == 0 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl01} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack1} storyType={storyData.storyType} /> }
                        {index == 1 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl02} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack2} storyType={storyData.storyType} /> }
                        {index == 2 && <ImageRenderItem index={index} _imgData={imgData.orgImgUrl03} delFn={imgDel_onOpen} fileCallBackFn={fileCallBack3} storyType={storyData.storyType} /> }
                      </>
                    )
                  })}
                </SpaceView>

                <SpaceView mt={20}>
                  <CommonTextarea
                    value={storyData.contents}
                    onChangeText={(text) => setStoryData({...storyData, contents: text})}
                    placeholder={
                      storyData.storyType == 'SECRET' ? '10글자 이상 입력해 주세요.\n\n이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 작성자의 동의없이 게시글이 삭제 될 수 있으며, 이용 제재 대상이 될 수 있습니다.\n\n상대를 배려하는 마음으로 이용해 주세요.' :
                      '10글자 이상 입력해 주세요.\n\n이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 작성자의 동의없이 게시글이 삭제 될 수 있으며, 이용 제재 대상이 될 수 있습니다.\n\n상대를 배려하는 마음으로 이용해 주세요.'
                    }
                    placeholderTextColor={'#A9A9A9'}
                    maxLength={1000}
                    exceedCharCountColor={'#990606'}
                    fontSize={13}
                    height={350}
                    backgroundColor={'#fff'}
                    fontColor={'#000'}
                    borderColor={isEmptyData(storyData.contents) ? '#7986EE' : '#DDDDDD'}
                    borderRadius={10}
                    padding={20}
                    paddingTop={20}
                  />
                </SpaceView>
              </>
            )}

            {/* ############################################################################ 투표형 */}
            {storyData.storyType == 'VOTE' && (
              <>
                {/* ############### 선택지 입력 영역 */}
                <SpaceView mb={20}>
                  <SpaceView viewStyle={_styles.voteArea}>
                      {[0,1].map((i, index) => {
                        return (
                          <>
                            <SpaceView mb={7}>
                              <TextInput
                                value={voteData[`voteName0${i+1}`]}
                                onChangeText={(text) => setVoteData({...voteData, [`voteName0${i+1}`] : text})}
                                multiline={false}
                                autoCapitalize="none"
                                style={_styles.voteInput(isEmptyData(voteData[`voteName0${i+1}`]))}
                                placeholder={'선택지 입력'}
                                placeholderTextColor={'#c7c7c7'}
                                editable={true}
                                secureTextEntry={false}
                                maxLength={50}
                                numberOfLines={1}
                              />

                              <SpaceView viewStyle={_styles.voteImgArea}>
                                {index == 0 && <VoteImageRenderItem index={index} _imgData={voteData.voteImgUrl01} delFn={imgDel_onOpen} fileCallBackFn={voteFileCallBack01} storyType={storyData.storyType} />}
                                {index == 1 && <VoteImageRenderItem index={index} _imgData={voteData.voteImgUrl02} delFn={imgDel_onOpen} fileCallBackFn={voteFileCallBack02} storyType={storyData.storyType} />}
                              </SpaceView>
                            </SpaceView>
                          </>
                        )
                      })}

                  </SpaceView>
                </SpaceView>

                {/* ############### 투표 마감기한 입력 영역 */}
                <SpaceView mb={35}>
                  <SpaceView mb={20}>
                    <Text style={_styles.subTitleText}>투표 마감기한을 선택해 주세요.</Text>
                  </SpaceView>

                  <SpaceView>
                    <VoteEndRadioBox
                      value={storyData.voteEndType}
                      items={voteEndTypeList}
                      callBackFunction={voteEndTypeCallbackFn}
                      isModfy={isEmptyData(storyBoardSeq) ? false : true}
                    />
                  </SpaceView>
                </SpaceView>

                {/* ############### 투표 내용 입력 영역 */}
                <SpaceView>
                  <SpaceView mb={20}>
                    <Text style={_styles.subTitleText}>투표 내용을 작성해 주세요.</Text>
                  </SpaceView>

                  <SpaceView>
                    <CommonTextarea
                      value={storyData.contents}
                      onChangeText={(text) => setStoryData({...storyData, contents: text})}
                      placeholder={'10글자 이상 입력해 주세요.\n\n이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 작성자의 동의없이 게시글이 삭제 될 수 있으며, 이용 제재 대상이 될 수 있습니다.\n\n상대를 배려하는 마음으로 이용해 주세요.'}
                      placeholderTextColor={'#C7C7C7'}
                      maxLength={1000}
                      exceedCharCountColor={'#990606'}
                      fontSize={13}
                      height={250}
                      backgroundColor={'#fff'}
                      fontColor={'#000'}
                      borderColor={isEmptyData(storyData.contents) ? '#7986EE' : '#ebe9ef'}
                      borderRadius={10}
                      padding={20}
                      paddingTop={20}
                    />

                      {/* <TextInput
                        ref={inputRef}
                        value={storyData.contents}
                        onChangeText={(text) => setStoryData({...storyData, contents: text})}
                        multiline={true}
                        textAlignVertical="top"
                        autoCapitalize="none"
                        style={_styles.contentInputText(isEmptyData(storyData.contents))}
                        placeholder={'20글자 이상 입력해 주세요.\n\n(주의*)이용 약관 또는 개인 정보 취급 방침 등 위배되는 게시글을 등록하는 경우 제재 대상이 될 수 있으며 상대를 배려하는 마음으로 이용해 주세요.'}
                        placeholderTextColor={'#c7c7c7'}
                        editable={true}
                        secureTextEntry={false}
                        maxLength={1000}
                        //autoFocus={true}
                        //onSubmitEditing={() => { this.inputRef.focus(); }}
                      /> */}

                  </SpaceView>

                </SpaceView>
              </>
            )}
          </SpaceView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ###############################################
							사진 변경/삭제 팝업
			############################################### */}
      <Modalize
        ref={imgDel_modalizeRef}
        adjustToContentHeight={true}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={[modalStyle.modalContainer]} >

        <View style={modalStyle.modalHeaderContainer}>
          <CommonText fontWeight={'700'} type={'h3'}>
            사진 삭제
          </CommonText>
          <TouchableOpacity onPress={imgDel_onClose} hitSlop={commonStyle.hipSlop20}>
            <Image source={ICON.xBtn2} style={styles.iconSize20} />
          </TouchableOpacity>
        </View>

        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {/* <SpaceView>
            <CommonBtn value={'사진 변경'} type={'primary2'} borderRadius={12} onPress={imgModProc} />
          </SpaceView> */}
          <SpaceView mt={10}>
            <CommonBtn value={'사진 삭제'} type={'primary2'} borderRadius={12} onPress={imgDelProc} />
          </SpaceView>
        </View>

        <TouchableOpacity style={_styles.modalCloseText} onPress={imgDel_onClose} hitSlop={commonStyle.hipSlop20}>
          <Text style={{color: '#fff', fontFamily: 'AppleSDGothicNeoEB00', fontSize: 16}}>확인</Text>
        </TouchableOpacity>
      </Modalize>
    </>
  );

};

// ############################################################################# 이미지 렌더링 아이템
function ImageRenderItem ({ index, _imgData, delFn, fileCallBackFn, storyType }) {

  const imgUrl = findSourcePathLocal(_imgData?.imgPath);
  const imgDelYn = _imgData?.delYn;

  return (
    <View style={_styles.imgItem}>
      {((isEmptyData(imgUrl) && imgDelYn == 'Y') || !isEmptyData(imgUrl)) ? (
        <>
          <LinearGradient
            colors={['#F3F4FD', '#CACFFF']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{borderRadius: 10, overflow: 'hidden'}} >

            <CommonImagePicker 
              type={'STORY'} 
              callbackFn={fileCallBackFn} 
              uriParam={''}
              imgWidth={(width - 70) / 3} 
              imgHeight={(width - 70) / 3}
            />
          </LinearGradient>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => { delFn(_imgData?.story_board_img_seq, index+1, storyType); }}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={_styles.imageStyle}
              key={imgUrl}
              source={imgUrl}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// ############################################################################# 투표 이미지 렌더링 아이템
function VoteImageRenderItem ({ index, _imgData, delFn, fileCallBackFn, storyType }) {

  const imgUrl = findSourcePathLocal(_imgData);
  const imgDelYn = _imgData?.delYn;

  return (
    <View style={_styles.imgItem}>
      {((isEmptyData(imgUrl) && imgDelYn == 'Y') || !isEmptyData(imgUrl)) ? (
        <>
          <LinearGradient
            colors={['#F3F4FD', '#CACFFF']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{borderRadius: 10, overflow: 'hidden'}} >

            <CommonImagePicker 
              type={'STORY'} 
              callbackFn={fileCallBackFn} 
              uriParam={''}
              imgWidth={48}
              imgHeight={48}
              iconSize={15}
            />
          </LinearGradient>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => { delFn(_imgData, index+1, storyType); }}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{width: 48, height: 48, borderRadius: 10, overflow: 'hidden'}}
              key={imgUrl}
              source={imgUrl}
            />
          </TouchableOpacity>
        </>
      )}
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
    color: '#333333',
    lineHeight: 30,
  },
  titleHightText: {
    color: '#7B81EC',
  },
  subTitleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    color: '#333333',
  },
  titleUnderline: (storyType:string) => {
    let _top = 42;
    let _left = -2;
    let _width = width-195;

    if(storyType == 'SECRET') {
      _top = 17;
      _left = 95;
      _width = width-345;
    } else if(storyType == 'VOTE') {
      _top = 17;
      _left = 0;
      _width = width-262;
    }

    return {
      position: 'absolute',
      top: _top,
      left: _left,
      width: _width,
      height: 10,
      backgroundColor: '#7986EE',
      zIndex: -1,
    };
  },
  imgArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgItem: {
    backgroundColor: 'rgba(155, 165, 242, 0.12)',
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
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
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  regiBtn: {
    backgroundColor: '#eee',
    width: '90%',
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  regiActiveBtn: {
    width: '90%',
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  regiBtnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingVertical: 8,
  },
  voteArea: {
    //{borderColor: '#7986EE'} : {borderColor:'#DDDDDD'}
  },
  voteInput: (isOn:boolean) => {
    return {
      fontFamily: 'Pretendard-Regular',
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderColor: isOn ? '#7986EE' : '#DDDDDD',
      borderWidth: 1,
      borderRadius: 8,
      width: '84%',
      marginTop: 3,
      height: 48,
      color: '#000',
      elevation: isOn ? 10 : 0,
      shadowColor: "#0047FF",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    };
  },
  voteImgArea: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
  modalCloseText: {
    width: '100%',
    backgroundColor: '#7984ED',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInputText: (isOn:boolean) => {
    return {
      borderColor: isOn ? '#7986EE' : '#ebe9ef',
      backgroundColor: '#fff',
      fontFamily: 'Pretendard-Regular',
      fontSize: 13,
      color: '#000',
      borderRadius: 20,
      borderWith: 1,
      padding: 20,
      height: 240,
    };
  },

});