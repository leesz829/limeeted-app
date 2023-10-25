import { useIsFocused, useNavigation, useFocusEffect  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, ScreenNavigationProp } from '@types';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { get_story_board_list, profile_open } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG, findSourcePathLocal } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA, EXIST } from 'constants/reusltcode';
import { useDispatch } from 'react-redux';
import Image from 'react-native-fast-image';
import { ICON, PROFILE_IMAGE } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import { ColorType } from '@types';
import { isEmptyData } from 'utils/functions';
import { STACK } from 'constants/routes';
import AuthLevel from 'component/common/AuthLevel';
import ProfileGrade from 'component/common/ProfileGrade';
import MasonryList from '@react-native-seoul/masonry-list';
import { CommonLoading } from 'component/CommonLoading';
import LinearGradient from 'react-native-linear-gradient';



/* ################################################################################################################
###### Story
################################################################################################################ */

const { width, height } = Dimensions.get('window');

export const Story = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();

  const memberBase = useUserInfo(); // 본인 데이터
  const { show } = usePopup(); // 공통 팝업
  const [isLoading, setIsLoading] = React.useState(false); // 로딩 상태 체크
  const [isRefreshing, setIsRefreshing] = useState(false); // 새로고침 여부
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩 여부
  const [isClickable, setIsClickable] = React.useState(true); // 클릭 여부
  const flatListRef = useRef(null);

  const [isTopBtn, setIsTopBtn] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false); 
  //const [storyList, setStoryList] = useState<any>([]); // 스토리 목록
  const [storyList, setStoryList] = React.useState<any>([]);
  const [pageNum, setPageNum] = useState(1); // 페이지 번호

  // 스토리 등록 이동
  const goStoryRegister = async () => {
    navigation.navigate(STACK.COMMON, { screen: 'StoryRegi', });
  };

  // 스토리 알림 이동
  const goStoryActive = async () => {
    navigation.navigate(STACK.COMMON, { screen: 'StoryActive', });
  };

  // 스토리 상세 이동
  const goStoryDetail = async (storyBoardSeq:number) => {
    navigation.navigate(STACK.COMMON, {
      screen: 'StoryDetail',
      params: {
        storyBoardSeq: storyBoardSeq,
      }
    });
  };

  // ##################################################################################### 목록 새로고침
  const handleRefresh = () => {
    console.log('refresh!!!!!!!!!!!!!!');
    getStoryBoardList('REFRESH', 1);
  };

  // ##################################################################################### 목록 더보기
  const loadMoreData = () => {
    console.log('ADD!!!!!!!!!!!!!!');
    getStoryBoardList('ADD', pageNum+1);
  };

  // ##################################################################################### 맨위 이동
  const scrollToTop = () => {
    flatListRef.current.scrollToIndex({ animated: true, index: 0 });
  };

  // ##################################################################################### 프로필 카드 열람 팝업 활성화
  const profileCardOpenPopup = (memberSeq:number, openCnt:number) => {
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
        title: '프로필 카드 열람',
        content: '(7일간)프로필을 열람하시겠습니까?',
        passAmt: '15',
        confirmCallback: function() {
          if(memberBase?.pass_has_amt >= 15) {
            profileCardOpen(memberSeq);
          } else {
            show({
              content: '패스가 부족합니다.',
              isCross: true,
            });
          }
        },
        cancelCallback: function() {
        },
      });
    }
  };

  // ##################################################################################### 프로필 카드 열람
  const profileCardOpen =  async (memberSeq:number) => {

    // 중복 클릭 방지 설정
    if(isClickable) {
      try {
        setIsClickable(false);
        setIsLoading(true);
  
        const body = {
          type: 'STORY',
          trgt_member_seq: memberSeq
        };
  
        const { success, data } = await profile_open(body);
        if(success) {
          switch (data.result_code) {
            case SUCCESS:
              getStoryBoardList('ADD', pageNum);
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

  // ############################################################################# 스토리 목록 조회
  const getStoryBoardList = async (_type:string, _pageNum:number) => {
    try {
      if(_type == 'REFRESH') {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      };

      const body = {
        load_type: _type,
        page_num: _pageNum,
      };

      console.log('body ::::: ' , body);

      const { success, data } = await get_story_board_list(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            /* if(_type == 'ADD') {
              let dataArray = storyList;
              data?.story_list.map((item: any) => {
                dataArray.push(item);
              })
              setStoryList(dataArray);
            } else {
              setStoryList(data?.story_list);
            }; */

            setStoryList(data?.story_list);

            /* if(data?.story_list.length > 0) {
              console.log('data?.page_num :::: ' ,data?.page_num);
              setPageNum(isEmptyData(data?.page_num) ? data?.page_num : 0);
            } */

            if(_type == 'REFRESH') {
              setPageNum(1);
            } else {
              if(data?.story_list.length > storyList.length) {
                setPageNum(isEmptyData(data?.page_num) ? data?.page_num : 0);
              }
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
      if(_type == 'REFRESH') {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  /* ################################################################################ 스크롤 제어 */
  const handleScroll = async (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if(yOffset > 300) {
      setIsTopBtn(true);
    } else {
      setIsTopBtn(false);
    }
  };

  /* ##################################################################################################################################
  ################## 아이템 렌더링 관련 함수
  ################################################################################################################################## */

  // ###############################  목록 아이템 렌더링
  const RenderListItem = React.memo(({ item, type }) => {
    const storyBoardSeq = item.story_board_seq; // 스토리 게시글 번호
    const storyType = item?.story_type; // 스토리 유형
    const imgPath = findSourcePathLocal(item?.story_img_path);
    const voteImgPath01 = findSourcePathLocal(item?.vote_img_path_01);
    const voteImgPath02 = findSourcePathLocal(item?.vote_img_path_02);

    let _width = 0; // 가로길이
    let _height = 0; // 세로길이

    if(type == 'LARGE') {
      _width = width - 16;
      _height = width - 43;
      /* _width = (width - 43) / 2;
      _height = (width - 43) /1; */
    } else if(type == 'MEDIUM') {
      _width = (width - 40) / 1.91;
      _height = width - 40;
    } else {
      _width = (width - 40) / 1.91;
      _height = (width - 45) / 2;
    }

    let isNoImageLayout = (storyType == 'SECRET' || storyType == 'STORY') && !isEmptyData(imgPath) ? true : false; // 노이미지 레이아웃 여부
    let bgColor:any = []; // 배경색

    if(storyType == 'SECRET') {
      bgColor = ['#8E1DFF', '#000000'];
    } else if(storyType == 'STORY') {
      bgColor = ['#FFD76B', '#FFB801'];
    } else if(storyType == 'VOTE') {
      bgColor = ['#A9DBFF', '#7B81EC'];
    }

    return (
      <>
        <SpaceView mb={type == 'SMALL' ? 0 : 5} viewStyle={_styles.itemArea02(_width, _height)}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { goStoryDetail(storyBoardSeq); }}>
            {isNoImageLayout ? (
              <>
                <LinearGradient
                  colors={bgColor}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={_styles.noImageArea(item?.gender, storyType)} >

                  {storyType == 'SECRET' ? (
                    <>
                      {/* 시크릿 아이콘 */}
                      <SpaceView viewStyle={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center'}}>
                        <Image source={ICON.storySecretIcon} style={_styles.secretIconStyle(type)} resizeMode={'cover'} />
                      </SpaceView>

                      {/* 스토리 유형 */}
                      <SpaceView viewStyle={_styles.typeArea(storyType)}>
                        <Text style={_styles.typeText}>{item?.story_type_name}</Text>
                      </SpaceView>

                      <SpaceView pr={10} pl={10} viewStyle={{position: 'absolute', bottom: 10, left: 0, right: 0}}>
                        <SpaceView>
                          <Text style={_styles.contentsText('#ffffff')} numberOfLines={type == 'SMALL' ? 4 : 10}>{item?.contents}</Text>
                        </SpaceView>

                        <SpaceView mt={15}>
                          {/* <Text style={_styles.nicknameText(storyType == 'SECRET' ? '#ffffff' : '#333333', type == 'SMALL' ? 12 : 13, type)}>{item?.nickname}</Text> */}
                          <Text style={_styles.nicknameText('#ffffff', 12, type)}>{item?.nickname_modifier}</Text>
                          <Text style={_styles.nicknameText('#ffffff', 12, type)}>{item?.nickname_noun}</Text>
                        </SpaceView>
                      </SpaceView>
                    </>
                  ) : (
                    <>
                      {/* 썸네일 이미지 */}
                      <TouchableOpacity 
                        disabled={memberBase?.gender === item?.gender || memberBase?.member_seq === item?.member_seq || storyType == 'SECRET'}
                        onPress={() => { profileCardOpenPopup(item?.member_seq, item?.open_cnt); }} >

                        <Image source={findSourcePath(item?.mst_img_path)} style={_styles.mstImgStyle(type == 'SMALL' ? 50 : 80, 40)} resizeMode={'cover'} />
                      </TouchableOpacity>

                      {/* 스토리 유형 */}
                      <SpaceView viewStyle={_styles.typeArea(storyType)}>
                        <Text style={_styles.typeText}>{item?.story_type_name}</Text>
                      </SpaceView>

                      <SpaceView mt={10} viewStyle={{flexDirection: 'column', alignItems: 'center'}}>

                        {/* 프로필 평점, 인증 레벨 */}
                        {(storyType != 'SECRET' && ((isEmptyData(item?.auth_acct_cnt) && item?.auth_acct_cnt >= 5) || item?.profile_score >= 7.0)) && (
                          <>
                            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                              {(storyType != 'SECRET' && (item?.profile_score >= 7.0 || (isEmptyData(item?.auth_acct_cnt) && item?.auth_acct_cnt >= 5))) && (
                                <>
                                  {item?.profile_score >= 7.0 && (
                                    <SpaceView mr={5} viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                                      <Image source={ICON.starBlack} style={styles.iconSquareSize(13)} resizeMode={'cover'} />
                                      <SpaceView ml={2}><Text style={_styles.activeText('#555555')}>{item?.profile_score}</Text></SpaceView>
                                    </SpaceView>
                                  )}
                                  {(isEmptyData(item?.auth_acct_cnt) && item?.auth_acct_cnt >= 5) && (
                                    <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                                      <Image source={ICON.bookmarkBlack} style={styles.iconSquareSize(13)} resizeMode={'cover'} />
                                      <SpaceView ml={2}><Text style={_styles.activeText('#555555')}>20</Text></SpaceView>
                                    </SpaceView>
                                  )}
                                </>
                              )}
                            </SpaceView>
                          </>
                        )}

                        {/* 닉네임 */}
                        <SpaceView mt={3}><Text style={[_styles.nicknameText(storyType == 'SECRET' ? '#ffffff' : '#333333', 12, type), {textAlign: 'center'}]}>{item?.nickname}</Text></SpaceView>
                      </SpaceView>

                      {/* 내용 */}
                      <SpaceView mt={type == 'SMALL' ? 10 : 20} pl={10} pr={10}>
                        <Text style={_styles.contentsText(storyType == 'SECRET' ? '#ffffff' : '#333333')} numberOfLines={type == 'SMALL' ? 2 : 6}>{item?.contents}</Text>
                      </SpaceView>
                    </>
                  )}
                </LinearGradient>
              </>
            ) : (
              <>
                {/* 이미지가 2개 이상인 경우 표시 */}
                {item.img_cnt > 1 && (
                  <SpaceView viewStyle={_styles.multiImageArea}>
                    <Image source={ICON.murtipleImage} style={styles.iconSquareSize(18)} resizeMode={'cover'} />
                  </SpaceView>
                )}

                {/* 썸네일 이미지 */}
                <SpaceView>
                  {item?.story_type == 'VOTE' ? (
                    <Image source={voteImgPath01} style={{width: _width, height: _height}} resizeMode={'cover'} />
                  ) : (
                    <Image source={imgPath} style={{width: _width, height: _height}} resizeMode={'cover'} />
                  )}
                </SpaceView>

                {/* 스토리 유형 */}
                <SpaceView viewStyle={_styles.typeArea(storyType)}>
                  <Text style={_styles.typeText}>{item?.story_type_name}</Text>
                </SpaceView>

                {/* 프로필 영역 */}
                <SpaceView viewStyle={_styles.profileArea}>
                  <SpaceView mr={5}>
                    <TouchableOpacity 
                      disabled={memberBase?.gender === item?.gender || memberBase?.member_seq === item?.member_seq}
                      onPress={() => { profileCardOpenPopup(item?.member_seq, item?.open_cnt); }}>
                      <Image source={storyType == 'SECRET' ? ICON.storyNoIcon : findSourcePath(item?.mst_img_path)} style={_styles.mstImgStyle(30, 20)} resizeMode={'cover'} />
                    </TouchableOpacity>
                  </SpaceView>

                  <SpaceView>
                    <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                      {(storyType != 'SECRET' && (item?.profile_score >= 7.0 || (isEmptyData(item?.auth_acct_cnt) && item?.auth_acct_cnt >= 5))) && (
                        <>
                          {item?.profile_score >= 7.0 && (
                            <SpaceView mr={5} viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                              <Image source={ICON.starYellow} style={styles.iconSquareSize(13)} resizeMode={'cover'} />
                              <SpaceView ml={2}><Text style={_styles.activeText('#ffffff')}>{item?.profile_score}</Text></SpaceView>
                            </SpaceView>
                          )}
                          {(isEmptyData(item?.auth_acct_cnt) && item?.auth_acct_cnt >= 5) && (
                            <SpaceView viewStyle={{flexDirection: 'row', alignItems: 'center'}}>
                              <Image source={ICON.bookmarkPurple} style={styles.iconSquareSize(13)} resizeMode={'cover'} />
                              <SpaceView ml={2}><Text style={_styles.activeText('#ffffff')}>{item?.auth_acct_cnt}</Text></SpaceView>
                            </SpaceView>
                          )}
                        </>
                      )}
                    </SpaceView>

                    {storyType == 'SECRET' ? (
                      <>
                        <Text style={_styles.nicknameText('#ffffff', 13, type)}>{item?.nickname_modifier}</Text>
                        <Text style={_styles.nicknameText('#ffffff', 13, type)}>{item?.nickname_noun}</Text>
                      </>                    
                    ) : (
                      <Text style={_styles.nicknameText('#ffffff', 12, type)}>{item?.nickname}</Text>
                    )}
                  </SpaceView>
                </SpaceView>

                <SpaceView viewStyle={_styles.bottomArea}>
                  {/* <SpaceView><Text style={_styles.contentsText('#fff')}>{item?.contents}</Text></SpaceView> */}
                  {/* <SpaceView mt={8}><Text style={_styles.contentsText}>{item?.time_text}</Text></SpaceView> */}
                </SpaceView>              

                {/* 딤 처리 영역 */}
                <LinearGradient
                  colors={['transparent', '#000000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={_styles.dimsArea} />
              </>
            )}

          </TouchableOpacity>
        </SpaceView>
      </>
    );
  });

  /* ##################################################################################################################################
  ################## 초기 실행 함수
  ################################################################################################################################## */
  React.useEffect(() => {
    if(isFocus) {
      setIsRefreshing(false);

      getStoryBoardList('ADD', pageNum == 0 ? 1 : pageNum);

      if(storyList.length == 0) {
        //getStoryBoardList('BASE', 0);
      }
    } else {
      //setStoryList([]);
    }
  }, [isFocus]);


  function CustomRefreshControl({ refreshing, onRefresh }) {
    console.log('refreshing ::::::: ' , refreshing);
    console.log('onRefresh ::::::: ' , onRefresh);

    return (
      <>
        <View style={{ position: 'absolute', top: 0, height: 100, backgroundColor: '#fff' }}>
        {refreshing ? (
          <Text>Pull to Refresh</Text>
        ) : (
          <Text>Pull to Refresh</Text>
        )}
      </View>
      </>
      
    );
  }

  return (
    <>
      {isLoading && <CommonLoading />}

      <TopNavigation currentPath={'Story'} />

      <SpaceView>

        {storyList.length > 0 ? (
          <>
            <FlatList
              data={storyList}
              ref={flatListRef}
              keyExtractor={(item, index) => index.toString()}
              style={_styles.contentWrap}
              contentContainerStyle={{ paddingBottom: 30 }} // 하단 여백 추가
              contentInset={{ bottom: 60 }}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              onScroll={handleScroll} // 스크롤 감지 이벤트 핸들러
              /* getItemLayout={(data, index) => (
                {
                    length: (width - 54) / 2,
                    offset: ((width - 54) / 2) * index,
                    index
                }
              )} */
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
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.1}
              ListFooterComponent={isLoadingMore && <Text>Loading more...</Text>}
              renderItem={({ item:innerItem, index:innerIndex }) => {

                return (
                  <>
                    <SpaceView key={innerIndex} viewStyle={_styles.itemWrap(innerItem.type)}>

                      {innerItem.type == 'ONLY_LARGE' ? (
                        <>
                          {innerItem.large_list.map((item, index) => {
                            return (
                              <RenderListItem item={item} type={item?.size_type} />
                            )
                          })}
                        </>
                      ) : innerItem.type == 'ONLY_MEDIUM' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {innerItem.medium_list.map((item, index) => {
                              return (
                                <RenderListItem item={item} type={item?.size_type} />
                              )
                            })}

                            {innerItem.medium_list.length < 2 && (
                              <LinearGradient colors={['#7984ED', '#8759D5']} style={_styles.dummyArea('M')} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} >
                                <Image source={IMAGE.logoStoryTmp} style={{width: 150, height: 45}} resizeMode={'cover'} />
                              </LinearGradient>
                            )}
                          </SpaceView>
                        </>
                      ) : innerItem.type == 'ONLY_SMALL' ? (
                        <>
                          <SpaceView mb={5} viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {innerItem.small_list.map((item, index) => {
                              return (
                                <RenderListItem item={item} type={item?.size_type} />
                              )
                            })}

                            {innerItem.medium_list.length < 2 && (
                              <LinearGradient colors={['#7984ED', '#8759D5']} style={_styles.dummyArea('S')} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} >
                                <Image source={IMAGE.logoStoryTmp} style={{width: 150, height: 45}} resizeMode={'cover'} />
                              </LinearGradient>
                            )}
                          </SpaceView>
                        </>
                      ) : innerItem.type == 'COMPLEX_MEDIUM' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            {innerItem.medium_list.map((item, index) => {
                              return (
                                <RenderListItem item={item} type={item?.size_type} />
                              )
                            })}
                            <SpaceView viewStyle={{flexDirection: 'column'}}>
                              {innerItem.small_list.map((item, index) => {
                                return (
                                  <SpaceView mb={index == 0 ? 5 : 0}>
                                    <RenderListItem item={item} type={item?.size_type} />
                                  </SpaceView>
                                )
                              })}

                              {innerItem.small_list.length < 2 && (
                                <LinearGradient colors={['#7984ED', '#8759D5']} style={_styles.dummyArea('S')} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} >
                                  <Image source={IMAGE.logoStoryTmp} style={{width: 150, height: 45}} resizeMode={'cover'} />
                                </LinearGradient>
                              )}
                            </SpaceView>
                          </SpaceView>
                        </>
                      ) : innerItem.type == 'COMPLEX_SMALL' ? (
                        <>
                          <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <SpaceView viewStyle={{flexDirection: 'column'}}>
                              {innerItem.small_list.map((item, index) => {
                                return (
                                  <SpaceView mb={index == 0 ? 5 : 0}>
                                    <RenderListItem item={item} type={item?.size_type} />
                                  </SpaceView>
                                )
                              })}
                              {innerItem.small_list.length < 2 && (
                                  <LinearGradient colors={['#7984ED', '#8759D5']} style={_styles.dummyArea('S')} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} >
                                    <Image source={IMAGE.logoStoryTmp} style={{width: 150, height: 45}} resizeMode={'cover'} />
                                  </LinearGradient>
                              )}
                            </SpaceView>
                            {innerItem.medium_list.map((item, index) => {
                              return (
                                <RenderListItem item={item} type={item?.size_type} />
                              )
                            })}
                          </SpaceView>
                        </>
                      ) : (
                        <>
                          
                        </>
                      )}

                    </SpaceView>
                  </>
                )
              }}
            />
          </>
        ) : (
          <>
            <SpaceView viewStyle={_styles.noData}>
              <Text style={_styles.noDataText}>스토리가 없습니다.</Text>
            </SpaceView>
          </>
        )}

      </SpaceView>

      {/* ###################################################################################################### 하단 버튼 */}
      <SpaceView viewStyle={_styles.btnArea}>
        <SpaceView viewStyle={_styles.btnTextArea}>
          <TouchableOpacity onPress={() => { goStoryActive(); }} style={_styles.btnItemArea}>
            <Image source={ICON.clockIcon} style={styles.iconSquareSize(18)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { goStoryRegister(); }} style={_styles.btnItemArea}>
            <Image source={ICON.storyPlusIcon} style={styles.iconSquareSize(18)} />
          </TouchableOpacity>
        </SpaceView>
      </SpaceView>

      {/* ###################################################################################################### 맨위 이동 버튼 */}

      {(storyList.length > 0 && isTopBtn) && (
        <SpaceView viewStyle={_styles.topBtnArea}>
          <TouchableOpacity onPress={() => { scrollToTop(); }}>
            <Text style={_styles.topBtnText}>TOP</Text>
            {/* <Image source={ICON.boxTipsIcon} style={styles.iconSquareSize(50)} /> */}
          </TouchableOpacity>
        </SpaceView>
      )}
    </>
  );
};





{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({
  
  wrap: {
    backgroundColor: '#fff',
  },
  contentWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingBottom: 50,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    width: width,
    height: height-120,
  },
  itemWrap: (type:string) => {
    let loc = 'center';
    /* if(type == 'COMPLEX_RIGHT') {
      loc = 'flex-end';
    } else if(type == 'COMPLEX_LEFT') {
      loc = 'flex-start';
    } */

    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: loc,
      width: '100%',
    };
  },
  itemArea02: (width:number, height:number) => {
    return {
      width: width,
      height: height,
      borderRadius: 10,
      overflow: 'hidden',
      marginHorizontal: 3,
    };
  },
  itemArea: (size:number) => {
    return {
      width: size,
      height: size,
      borderRadius: 10,
      overflow: 'hidden',
    };
  },
  dummyArea: (type:string) => {
    let _w = (width - 40) / 1.91;
    let _h = width - 40;

    if(type == 'S') {
      _w = (width - 40) / 1.91;
      _h = (width - 45) / 2;
    }

    return {
      width: _w,
      height: _h,
      backgroundColor: '#FE0456',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      marginHorizontal: 3,
    };
  },
  dummyText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
  },
  btnArea: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  btnTextArea: {
    flexDirection: 'row',
  },
  btnItemArea: {
    width: 50,
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(38,38,38,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
  },
  profileArea: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  typeArea: (type:string) => {
    let bgColor = '#FF9900';

    if(type == 'VOTE') {
      bgColor = '#7B81EC';
    } else if(type == 'SECRET') {
      bgColor = '#B873FF';
    }

    return {
      position: 'absolute',
      top: 10,
      left: 10,
      //backgroundColor: 'rgba(0,0,0,0.5)',
      backgroundColor: bgColor,
      borderRadius: 15,
      paddingVertical: 4,
      width: 45,
    };
  },
  typeText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  mstImgStyle: (size:number, bdRadius:number) => {
    return {
      width: size,
      height: size,
      borderRadius: bdRadius,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#fff',
    };
  },
  secretIconStyle: (sizeType:string) => {
    let size = 230;

    if(sizeType == 'MEDIUM') {
      size = 160;
    } else if(sizeType == 'SMALL') {
      size = 120;
    }

    return {
      width: size,
      height: size,
      overflow: 'hidden',
    };
  },
  contentsText: (_color:string) => {
    return {
      fontFamily: 'Pretendard-Regular',
      fontSize: 13,
      color: _color,
    };
  },
  activeText: (_color:string) => {
    return {
      fontFamily: 'Pretendard-SemiBold',
      fontSize: 12,
      color: _color,
    };
  },
  nicknameText: (_color:string, _fontSize:number, _sizeType:string) => {
    return {
      fontFamily: 'Pretendard-Bold',
      fontSize: _fontSize,
      color: _color,
      width: _sizeType == 'LARGE' ? '100%' : width - 260,
    };
  },
  noImageArea: (gender:string, storyType:string) => {
    return {
      width: '100%',
      height: '100%',
      //backgroundColor: gender == 'M' ? '#D5DAFC' : '#FEEFF2',
      alignItems: storyType == 'SECRET' ? 'flex-start' : 'center',
      justifyContent: storyType == 'SECRET' ? 'flex-end' : 'center',
    };
  },
  topBtnArea: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  topBtnText: {
    textAlign: 'center',
    //backgroundColor: '#222222',
    backgroundColor: 'rgba(38,38,38,0.9)',
    width: 100,
    paddingVertical: 2,
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dimsArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.6,
    height: 80,
  },
  noData: {
    paddingHorizontal: 20,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 180,
    backgroundColor: '#fff',
  },
  noDataText: {
    fontFamily: 'AppleSDGothicNeoM00',
    color: '#555555',
    fontSize: 15,
  },
  multiImageArea: {
    position: 'absolute',
    top: 13,
    right: 13,
    zIndex: 1,
  },

});