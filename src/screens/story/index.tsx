import { useIsFocused, useNavigation, useFocusEffect  } from '@react-navigation/native';
import { CommonCode, FileInfo, LabelObj, ProfileImg, LiveMemberInfo, LiveProfileImg, ScreenNavigationProp } from '@types';
import { styles, layoutStyle, commonStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import TopNavigation from 'component/TopNavigation';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { get_story_board_list } from 'api/models';
import { findSourcePath, IMAGE, GIF_IMG, findSourcePathLocal } from 'utils/imageUtils';
import { usePopup } from 'Context';
import { SUCCESS, NODATA } from 'constants/reusltcode';
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

  const [isEmpty, setIsEmpty] = useState(false); 
  //const [storyList, setStoryList] = useState<any>([]); // 스토리 목록
  const [storyList, setStoryList] = React.useState<any>([]);
  const [pageNum, setPageNum] = useState(0); // 페이지 번호

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
    getStoryBoardList('REFRESH', 0);
  };

  // ##################################################################################### 목록 더보기
  const loadMoreData = () => {
    console.log('ADD!!!!!!!!!!!!!!');
    getStoryBoardList('ADD', pageNum+1);
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
        page_num: _pageNum,
      };

      console.log('body ::::: ' , body);

      const { success, data } = await get_story_board_list(body);
      if(success) {
        switch (data.result_code) {
          case SUCCESS:
            if(_type == 'ADD') {
              let dataArray = storyList;
              data?.story_list.map((item: any) => {
                dataArray.push(item);
              })
              setStoryList(dataArray);
            } else {
              setStoryList(data?.story_list);
            };

            if(data?.story_list.length > 0) {
              setPageNum(isEmptyData(data?.page_num) ? data?.page_num : 0);
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

  /* ##################################################################################################################################
  ################## 아이템 렌더링 관련 함수
  ################################################################################################################################## */

  // ###############################  목록 아이템 렌더링
  const RenderListItem = React.memo(({ item, type }) => {
    const storyBoardSeq = item.story_board_seq;
    const imgUrl = findSourcePathLocal(item?.story_img_path);
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
      _width = (width - 40) / 1.64;
      _height = width - 40;
    } else {
      _width = (width - 40) / 2.27;
      _height = (width - 40);
    }

    return (
      <>
        <SpaceView mb={5} viewStyle={_styles.itemArea02(_width, _height)}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => { goStoryDetail(storyBoardSeq); }}>
            <SpaceView>
              {item?.story_type == 'VOTE' ? (
                <Image source={voteImgPath01} style={{width: _width, height: _height}} resizeMode={'cover'} />
              ) : (
                <Image source={imgUrl} style={{width: _width, height: _height}} resizeMode={'cover'} />
              )}
            </SpaceView>

            <SpaceView viewStyle={_styles.topArea}>
              <Image source={findSourcePath(item?.mst_img_path)} style={_styles.mstImgStyle} resizeMode={'cover'} />
              {/* <AuthLevel authAcctCnt={item?.auth_acct_cnt} type={'BASE'} />
              <ProfileGrade profileScore={item?.profile_score} type={'BASE'} /> */}

              <SpaceView>
                <Text style={_styles.activeText}>
                  {item?.profile_score > 0 && item?.profile_score}
                  {(isEmptyData(item?.auth_acct_cnt) && item?.profile_score > 0) && ' | '}
                  {isEmptyData(item?.auth_acct_cnt) && 'LV.' + item?.auth_acct_cnt}
                </Text>
                <Text style={_styles.nicknameText}>{item?.nickname}</Text>
              </SpaceView>

            </SpaceView>

            <SpaceView viewStyle={_styles.bottomArea}>
              <SpaceView><Text style={_styles.contentsText}>{item?.contents}</Text></SpaceView>
              {/* <SpaceView mt={8}><Text style={_styles.contentsText}>{item?.time_text}</Text></SpaceView> */}
            </SpaceView>

            <SpaceView viewStyle={_styles.typeArea(item?.story_type)}>
              <Text style={_styles.typeText}>{item?.story_type_name}</Text>
            </SpaceView>
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
      getStoryBoardList('BASE', 0);
    } else {
      //setStoryList([]);
    }
  }, [isFocus]);

  return (
    <>
      {isLoading && <CommonLoading />}

      <TopNavigation currentPath={'Story'} />

      <SpaceView mb={100}>

        {/* <MasonryList
          data={storyList}
          //keyExtractor={(item): string => item.id}
          //numColumns={2}
          //showsVerticalScrollIndicator={false}
          //refreshing={isLoadingNext}
          //onRefresh={() => refetch({first: ITEM_CNT})}
          //onEndReachedThreshold={0.1}
          //onEndReached={() => loadNext(ITEM_CNT)}

          renderItem={({ item }) => (
            <>
              <View style={{width: item?.size_type == 'LARGE' ? '50%' : '50%'}}>
                <ExampleRenderItem item={item} type={item?.size_type} />
              </View>
            </>
          )}
        /> */}

        <FlatList
          data={storyList}
          keyExtractor={(item, index) => index.toString()}
          style={_styles.contentWrap}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
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
            />
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
                  ) : (
                    <>
                      {innerItem.complex_list.map((item, index) => {
                        return (
                          <RenderListItem item={item} type={item?.size_type} />
                        )
                      })}

                      {/* {innerItem.complex_list.length == 1 && (
                        <SpaceView viewStyle={_styles.dummyArea(innerItem?.first_type)}>
                          <Text style={_styles.dummyText}>배너</Text>
                        </SpaceView>
                      )} */}
                    </>
                  )}

                </SpaceView>
              </>
            )
          }}
        />

        {/* ######################################################################### 첫번째 기존 UI */}
        {/* <FlatList
          contentContainerStyle={{marginBottom: 50, paddingHorizontal: 20}}
          //ref={noticeRef}
          data={storyList}
          renderItem={({ item:innerItem, index:innerIndex }) => {

            return (
              <>
                <SpaceView key={innerIndex} viewStyle={{flexDirection: 'column'}} mb={10}>

                  {innerItem.type == 'ONLY_LARGE' ? (
                    <>
                      {innerItem.large_list.map((item, index) => {
                        return (
                          <LargeRenderItem item={item} />
                        )
                      })}
                    </>
                  ) : innerItem.type == 'ONLY_MEDIUM' ? (
                    <>
                      <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {innerItem.medium_list.map((item, index) => {
                          return (
                            <MediumRenderItem item={item} />
                          )
                        })}

                        <SpaceView viewStyle={_styles.dummyArea('H')}>
                          <Text style={_styles.dummyText}>배너</Text>
                        </SpaceView>
                      </SpaceView>
                    </>
                  ) : innerItem.type == 'ONLY_SMALL' ? (
                    <>
                      <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {innerItem.small_list.map((item, index) => {
                          return (
                            <SmallRenderItem item={item} />
                          )
                        })}

                        {innerItem.small_list.length == 1 ? (
                          <>
                            <SpaceView viewStyle={_styles.dummyArea('')}><Text style={_styles.dummyText}>배너</Text></SpaceView>
                            <SpaceView viewStyle={_styles.dummyArea('')}><Text style={_styles.dummyText}>배너</Text></SpaceView>
                          </>
                        ) : innerItem.small_list.length == 2 && (
                          <SpaceView viewStyle={_styles.dummyArea('')}><Text style={_styles.dummyText}>배너</Text></SpaceView>
                        )}

                      </SpaceView>
                    </>
                  ) : innerItem.type == 'COMPLEX_MEDIUM' ? (
                    <>
                      <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {innerItem.medium_list.map((item, index) => {
                          return (
                            <MediumRenderItem item={item} />
                          )
                        })}
                        <SpaceView viewStyle={{flexDirection: 'column'}}>
                          {innerItem.small_list.map((item, index) => {
                            return (
                              <SpaceView mb={index == 0 ? 8 : 0}>
                                <SmallRenderItem item={item} />
                              </SpaceView>
                            )
                          })}

                          {innerItem.small_list.length < 2 && (
                            <SpaceView viewStyle={_styles.dummyArea('')}><Text style={_styles.dummyText}>배너</Text></SpaceView>
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
                              <SpaceView mb={index == 0 ? 8 : 0}>
                                <SmallRenderItem item={item} />
                              </SpaceView>
                            )
                          })}
                        </SpaceView>
                        {innerItem.small_list.length < 2 && (
                            <SpaceView viewStyle={_styles.dummyArea('')}><Text style={_styles.dummyText}>배너</Text></SpaceView>
                        )}
                        {innerItem.medium_list.map((item, index) => {
                          return (
                            <MediumRenderItem item={item} />
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
        /> */}
      </SpaceView>

      <SpaceView viewStyle={_styles.btnArea}>
        <SpaceView viewStyle={_styles.btnTextArea}>
          <TouchableOpacity onPress={() => { goStoryActive(); }}>
            <Text style={_styles.btnText}>활동</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { goStoryRegister(); }}>
            <Text style={_styles.btnText}>등록</Text>
          </TouchableOpacity>
        </SpaceView>
      </SpaceView>
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
    height: height-150,
  },
  itemWrap: (type:string) => {
    let loc = 'center';
    if(type == 'COMPLEX_RIGHT') {
      loc = 'flex-end';
    } else if(type == 'COMPLEX_LEFT') {
      loc = 'flex-start';
    }

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
    let _w = (width - 40) / 2.27;
    let _h = width - 40;

    if(type == 'SMALL') {
      _w = (width - 40) / 1.64;
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    width: 150,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  btnText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    color: '#fff',
  },
  topArea: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomArea: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  typeArea: (type:string) => {
    return {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: '#7986EE',
      borderRadius: 13,
      paddingVertical: 3,
      paddingHorizontal: 5,
    };
  },
  typeText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    color: '#fff',
  },
  mstImgStyle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  contentsText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 13,
    color: '#fff',
  },
  activeText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#fff',
  },
  nicknameText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 13,
    color: '#fff',
  },
  
});