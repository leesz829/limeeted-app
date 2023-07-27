import { Color } from 'assets/styles/Color';
import { commonStyle, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, ScrollView, Dimensions, Animated, StyleSheet } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { GUIDE_IMAGE } from 'utils/imageUtils';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { ICON } from 'utils/imageUtils';


/* ################################################################################################################
###################################################################################################################
###### Guide 팝업 Component
###################################################################################################################
################################################################################################################ */

interface Props {
  popupVisible?: boolean; // popup state
  setPopupVIsible?: any; // popup setState
  isConfirm?: boolean; // confirm 여부
  title?: string; // 팝업 제목
  text?: string; // 팝업 문구
  subText?: string;
  confirmCallbackFunc?: Function | undefined; // 확인 Callback 함수
  guideType?: string;
  guideSlideYn?: string;
  guideNexBtnExpoYn?: string;
}

export const GuidePopup = (props: Props) => {
  const { width, height } = Dimensions.get('window');
  const ref = React.useRef();
  const pageIndex = 0;
  const [currentIndex, setCurrentIndex] = React.useState(pageIndex);

  //const [isNextChk, setIsNextChk] = React.useState(false);
  const memberBase = useUserInfo();

  const onPressConfirm = (isNextChk) => {
    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {

    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc(isNextChk);
      props.setPopupVIsible(false);
    };
  };

  const onPressDot = (index) => {
    ref?.current?.snapToItem(index);
  };

  React.useEffect(() => {
    setCurrentIndex(0);
    //setIsNextChk(false);
  }, [props]);

  // ################################################################ 초기 실행 함수

  return (
    <>
      <Modal visible={props.popupVisible} transparent={true}>
        <View style={_styles.modalBackground(height)}>
          <View style={_styles.guideModalArea(height)}>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              scrollEnabled={height < 800 ? true : false}
              style={_styles.guideScrollArea}>

              <View style={[_styles.guideModalStyle]}>

                {/* ################################################################################### 슬라이드 영역 */}
                {typeof props.guideSlideYn != 'undefined' && props.guideSlideYn != null && props.guideSlideYn == 'Y' ? (
                  <>
                    {props.guideType == 'DAILY' && 
                      <SpaceView viewStyle={[layoutStyle.alignCenter, {backgroundColor: '#B8D1D1', paddingTop: 10}]}>
                        <Image source={GUIDE_IMAGE.daily01Thumnail} style={{width: 230, height: 334}} resizeMode={'cover'} />
                      </SpaceView>
                    }

                    {props.guideType == 'ROBY' && 
                      <SpaceView viewStyle={[layoutStyle.alignCenter, {backgroundColor: '#B8D1D1', paddingVertical: 15}]}>
                        <Image source={GUIDE_IMAGE.robyThumnail} style={{width: 230, height: 322}} resizeMode={'cover'} />
                      </SpaceView>
                    }

                    <Carousel
                      ref={ref}
                      data={(props.guideType == 'SHOP_BASIC' && memberBase?.gender == 'M') || props.guideType == 'ROBY_PROFILE' ? [1,2] : [1,2,3]}
                      firstItem={pageIndex}
                      onSnapToItem={setCurrentIndex}
                      sliderWidth={width-62}
                      itemWidth={width-62}
                      pagingEnabled
                      renderItem={({item, index}) => {
                        return (
                          <>
                            {props.guideType == 'DAILY' && 
                              <SpaceView viewStyle={layoutStyle.alignCenter}>
                                {index == 0 && <Image source={GUIDE_IMAGE.daily01Content} style={{width: 281, height: 154, marginTop: 10}} resizeMode={'cover'} />}
                                {index == 1 && <Image source={GUIDE_IMAGE.daily02Content} style={{width: 281, height: 154, marginTop: 10}} resizeMode={'cover'} />}
                                {index == 2 && <Image source={GUIDE_IMAGE.daily03Content} style={{width: 281, height: 154, marginTop: 10}} resizeMode={'cover'} />}
                              </SpaceView>
                            }

                            {props.guideType == 'LIVE' && 
                              <>
                                <LinearGradient 
                                  colors={['#DBEEEE', '#FFF']}
                                  start={{ x: 0.5, y: 0 }}
                                  end={{ x: 0.5, y: 1 }}
                                  style={[layoutStyle.flex1]}>
                                  
                                  <SpaceView viewStyle={[layoutStyle.alignCenter, {paddingTop: 10, paddingBottom: 10}]}>
                                    {index == 0 && <Image source={GUIDE_IMAGE.live01Thumnail} style={{width: 205, height: 340}} resizeMode={'cover'} /> }
                                    {index == 1 && <Image source={GUIDE_IMAGE.live02Thumnail} style={{width: 205, height: 340}} resizeMode={'cover'} /> }
                                    {index == 2 && <Image source={GUIDE_IMAGE.live03Thumnail} style={{width: 205, height: 340}} resizeMode={'cover'} /> }
                                  </SpaceView>
                                  <SpaceView mt={15}>
                                    <SpaceView mb={10} ml={15}><Text style={_styles.liveTxt01}>"LIVE" 인상 투표</Text></SpaceView>
                                    <SpaceView ml={15}><Text style={_styles.liveTxt02}>패스가 필요하신가요?{'\n'}인상 투표에 참여하시면 패스를 드려요!</Text></SpaceView>
                                    <SpaceView mt={20} viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                      {index == 0 && <Text style={_styles.liveTxt03}>"상대방이 받을 별을 선택 후 <Text style={{color: '#697AE6'}}>확인</Text>을 눌러주세요."</Text> }
                                      {index == 1 && <Text style={_styles.liveTxt03}>"상대방에게 가장 어울리는 인상을 선택해주세요."</Text> }
                                      {index == 2 && <Text style={[_styles.liveTxt03, {marginTop: -10}]}>"투표를 마칠 때 마다 <Image source={ICON.passCircle} style={{width: 23, height: 23}} />1개가 지급됩니다."</Text> }
                                    </SpaceView>
                                  </SpaceView>
                                </LinearGradient>
                              </>
                            }

                            {props.guideType == 'ROBY' && 
                              <>
                                <SpaceView mt={15} ml={15}>
                                  <SpaceView mb={10}><Text style={_styles.liveTxt01}>"마이홈"의 주요 기능 알아보기</Text></SpaceView>
                                  <SpaceView viewStyle={layoutStyle.alignStart}>
                                    {index == 0 && <Image source={GUIDE_IMAGE.roby01Content} style={{width: 280, height: 115}} resizeMode={'cover'} /> }
                                    {index == 1 && <Image source={GUIDE_IMAGE.roby02Content} style={{width: 280, height: 115}} resizeMode={'cover'} /> }
                                    {index == 2 && <Image source={GUIDE_IMAGE.roby03Content} style={{width: 280, height: 115}} resizeMode={'cover'} /> }
                                  </SpaceView>
                                </SpaceView>
                              </>
                            }

                            {props.guideType == 'PROFILE' && 
                              <SpaceView viewStyle={[layoutStyle.alignCenter, {backgroundColor: '#fff', paddingTop: 20, paddingBottom: 10}]}>
                                {index == 0 && <Image source={GUIDE_IMAGE.profile01Img} style={{width: 280, height: 444}} resizeMode={'cover'} /> }
                                {index == 1 && <Image source={GUIDE_IMAGE.profile02Img} style={{width: 280, height: 444}} resizeMode={'cover'} /> }
                                {index == 2 && <Image source={GUIDE_IMAGE.profile03Img} style={{width: 280, height: 444}} resizeMode={'cover'} /> }
                              </SpaceView>
                            }

                            {(props.guideType == 'SHOP_BASIC' || props.guideType == 'SHOP_SUBSCRIPTION' || props.guideType == 'SHOP_PACKAGE') && 
                              <SpaceView viewStyle={[{backgroundColor: '#ffffff', paddingTop: 20}]}>
                                <SpaceView mb={10} ml={15} viewStyle={layoutStyle.alignStart}><Text style={_styles.liveTxt01}>"상점" 알아보기</Text></SpaceView>
                                <SpaceView viewStyle={[{backgroundColor: '#ffffff'}]}>
                                  <SpaceView viewStyle={layoutStyle.alignCenter} mb={10}>
                                    {index == 0 &&
                                      <>
                                        {props.guideType == 'SHOP_BASIC' && <Image source={GUIDE_IMAGE.shop01ContentBasic} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                                        {props.guideType == 'SHOP_SUBSCRIPTION' && <Image source={GUIDE_IMAGE.shop01ContentBoosting} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                                        {props.guideType == 'SHOP_PACKAGE' && <Image source={GUIDE_IMAGE.shop01ContentPackage} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                                      </>                                
                                    }
                                    {index == 1 && <Image source={GUIDE_IMAGE.shop02Content} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                                    {memberBase?.gender == 'W' && index == 2 && <Image source={GUIDE_IMAGE.shop03Content} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                                  </SpaceView>

                                  <SpaceView viewStyle={commonStyle.paddingHorizontal15}>
                                    {index == 0 &&
                                      <>
                                        {props.guideType == 'SHOP_BASIC' &&
                                          <>
                                            <Text style={_styles.liveTxt02}>#패스상품</Text>
                                            <Text style={_styles.liveTxt03}>관심과 찐심을 보낼 때 사용하는 재화를 구매 할 수 있어요.</Text>
                                          </>
                                        }
                                        {props.guideType == 'SHOP_SUBSCRIPTION' &&
                                          <>
                                            <Text style={_styles.liveTxt02}>#부스팅상품</Text>
                                            <Text style={_styles.liveTxt03}>
                                              관심 보낼 사람은 많은데 패스가 부족한가요?{'\n'}
                                              관심 보내기 자유 이용권을 구매하면 패스 걱정 없이 관심을 보낼 수 있어요.
                                            </Text>
                                          </>
                                        }
                                        {props.guideType == 'SHOP_PACKAGE' &&
                                          <>
                                            <Text style={_styles.liveTxt02}>#패키지상품</Text>
                                            <Text style={_styles.liveTxt03}>
                                              나에게 필요한 아이템을 저렴한 비용으로 획득하는 방법.{'\n'}
                                              높은 할인율의 패키지 상품을 만나 보세요!
                                            </Text>
                                          </>
                                        }
                                      </>
                                    }
                                    {index == 1 &&
                                      <>
                                        <Text style={_styles.liveTxt02}>#인벤토리</Text>
                                        <Text style={_styles.liveTxt03}>구매한 아이템은 인벤토리에 보관돼요.</Text>
                                        <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>TIP 리미티드의 다양한 보상도 인벤토리에서 확인 가능!</Text>
                                      </>
                                    }
                                    {memberBase?.gender == 'W' && index == 2 &&
                                      <>
                                        <Text style={_styles.liveTxt02}>#리밋샵! 여성 회원만의 특권</Text>
                                        <Text style={_styles.liveTxt03}>
                                          리밋샵은 여성 회원 전용의 마일리지 상점이에요.{'\n'}
                                          그동안 모아둔 리밋으로 원하는 상품으로 교환해보세요!
                                        </Text>
                                        <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>TIP 모바일쿠폰은 KT 비즈콘을 통해 SMS 전송됩니다.</Text>
                                      </>
                                    }
                                  </SpaceView>
                                  
                                </SpaceView>
                              </SpaceView>
                            }

                            {props.guideType == 'ROBY_PROFILE' && 
                                <LinearGradient 
                                  colors={['#DBEEEE', '#FFF']}
                                  start={{ x: 0.5, y: 0 }}
                                  end={{ x: 0.5, y: 1 }}>
                                  <SpaceView mb={10} ml={15} mt={20} viewStyle={layoutStyle.alignStart}><Text style={_styles.liveTxt01}>"프로필 평점" 알아보기</Text></SpaceView>
                                  <SpaceView viewStyle={layoutStyle.alignCenter} mb={10}>
                                    {index == 0 && <Image source={GUIDE_IMAGE.robyProfile01Content} style={{width: 299, height: 178}} resizeMode={'cover'} /> }
                                    {index == 1 && <Image source={GUIDE_IMAGE.robyProfile02Content} style={{width: 299, height: 178}} resizeMode={'cover'} /> }
                                  </SpaceView>
                                  <SpaceView viewStyle={commonStyle.paddingHorizontal15}>
                                    {index == 0 &&
                                      <>
                                        <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#프로필 평점</Text>
                                        <Text style={_styles.liveTxt03}>내 프로필 평점과 동등한 이성을 소개받을 수 있어요.</Text>
                                      </>
                                    }
                                    {index == 1 &&
                                      <>
                                        <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#프로필 평점</Text>
                                        <Text style={_styles.liveTxt03}>
                                          <Text style={{color: '#697AE6'}}>"내 프로필 재심사"</Text>를 받고 높은 프로필 평점에 도전해보세요.!{'\n'}
                                          {/* 프로필 평점 <Text style={{color: '#697AE6'}}>7.0</Text>이 되면 프로필 인증 레벨이 <Text style={{color: '#697AE6'}}>+1</Text>이 가산돼요.{'\n'}
                                          (7 / 8 / 9 / 10 마다 +1씩 가산) */}
                                        </Text>
                                      </>
                                    }
                                  </SpaceView>
                                </LinearGradient>
                            }

                            {props.guideType == 'ROBY_GRADE' && 
                                <LinearGradient 
                                  colors={['#DBEEEE', '#FFF']}
                                  start={{ x: 0.5, y: 0 }}
                                  end={{ x: 0.5, y: 1 }}>
                                  <SpaceView mb={10} ml={15} mt={20} viewStyle={layoutStyle.alignStart}><Text style={_styles.liveTxt01}>"소셜 평점" 알아보기</Text></SpaceView>
                                  <SpaceView viewStyle={layoutStyle.alignCenter} mb={10}>
                                    {index == 0 && <Image source={GUIDE_IMAGE.robyGrade01Content} style={{width: 299, height: 178}} resizeMode={'cover'} /> }
                                    {index == 1 && <Image source={GUIDE_IMAGE.robyGrade02Content} style={{width: 299, height: 178}} resizeMode={'cover'} /> }
                                    {index == 2 && <Image source={GUIDE_IMAGE.robyGrade03Content} style={{width: 299, height: 178}} resizeMode={'cover'} /> }
                                  </SpaceView>
                                  <SpaceView viewStyle={commonStyle.paddingHorizontal15}>
                                    {index == 0 &&
                                      <>
                                        <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#올바른 매칭 문화의 클린 필터</Text>
                                        <Text style={_styles.liveTxt03}>활동 이력을 기반으로 착한 회원, 나쁜 회원이 구분돼요.</Text>
                                        <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>TIP 소셜 평점이 4.0 이하인 회원은 악성 회원일 확률이 높아요.</Text>
                                      </>
                                    }
                                    {index == 1 &&
                                      <>
                                        <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#높은 소셜 평점을 받으면,</Text>
                                        <Text style={_styles.liveTxt03}>데일리뷰에서 더 많은 이성을 소개받을 수 있어요.</Text>
                                        <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>TIP 6.0 / 8.0을 넘기면 데일리뷰에 프로필 소개 횟수 증가</Text>
                                      </>
                                    }
                                    {index == 2 &&
                                      <>
                                        <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#소셜 평점이 갱신되는 매주 월요일마다</Text>
                                        <Text style={_styles.liveTxt03}>소셜 평점 6.0 이상이 되면 패스를 받을 수 있어요.</Text>
                                        <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>TIP "상점 - 인벤토리"를 확인 해주세요.</Text>
                                      </>
                                    }
                                  </SpaceView>
                                </LinearGradient>
                            }
                          </>
                        )
                      }}
                    />

                    <SpaceView viewStyle={_styles.dotContainer}>
                      {(props.guideType == 'SHOP_BASIC' && memberBase?.gender == 'M') || props.guideType == 'ROBY_PROFILE' ? (
                          [1,2].map((_, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => onPressDot(index)}
                              style={[
                                _styles.dot,
                                {
                                  backgroundColor: index === currentIndex ? '#697ae6' : '#707070',
                                },
                              ]}
                            />
                          ))
                      ) : (
                        [1,2,3].map((_, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => onPressDot(index)}
                            style={[
                              _styles.dot,
                              {
                                backgroundColor: index === currentIndex ? '#697ae6' : '#707070',
                              },
                            ]}
                          />
                        ))
                      )}
                    </SpaceView>
                  </>
                ) : (
                  <>
                    {props.guideType == 'STORAGE_GUIDE' ? (
                      <LinearGradient 
                        colors={['#DBEEEE', '#FFF']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}>
                        <SpaceView mb={10} ml={15} mt={20} viewStyle={layoutStyle.alignStart}><Text style={_styles.liveTxt01}>첫 "매칭 성공"을 축하 드려요!</Text></SpaceView>
                        <SpaceView viewStyle={layoutStyle.alignCenter} mb={10}>
                          <Image source={GUIDE_IMAGE.storageContent} style={{width: 300, height: 120}} resizeMode={'cover'} />
                        </SpaceView>
                        <SpaceView viewStyle={commonStyle.paddingHorizontal15}>
                          <Text style={[_styles.liveTxt02, {marginBottom: 8}]}>#연락처 확인하기</Text>
                          <Text style={_styles.liveTxt03}>
                            리미티드는 허위 프로필 ZERO 정책! 응답없는 채팅방 NO!{'\n'}
                            진짜 회원의 진짜 연락처로 진짜 매칭을 체험하세요.
                          </Text>
                          <Text style={[_styles.liveTxt03, {color: '#697AE6'}]}>
                            TIP 첫 "연락처 확인하기" 비용은 리미티드가 부담할게요.{'\n'}
                            편안함을 주는 메세지로 즐거운 대화하시길 바래요.
                          </Text>
                        </SpaceView>
                      </LinearGradient>
                    ) : (
                      <SpaceView viewStyle={[{backgroundColor: '#ffffff', paddingTop: 20}]}>
                        <SpaceView mb={10} ml={15} viewStyle={layoutStyle.alignStart}><Text style={_styles.liveTxt01}>"상점" 알아보기</Text></SpaceView>
                        <SpaceView viewStyle={[{backgroundColor: '#ffffff'}]}>
                          <SpaceView viewStyle={layoutStyle.alignCenter} mb={10}>
                            {props.guideType == 'SHOP_SUBSCRIPTION' && <Image source={GUIDE_IMAGE.shop01ContentBoosting} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                            {props.guideType == 'SHOP_PACKAGE' && <Image source={GUIDE_IMAGE.shop01ContentPackage} style={{width: 320, height: 257}} resizeMode={'cover'} /> }
                          </SpaceView>

                          <SpaceView viewStyle={commonStyle.paddingHorizontal15}>
                            {props.guideType == 'SHOP_SUBSCRIPTION' &&
                              <>
                                <Text style={_styles.liveTxt02}>#부스팅상품</Text>
                                <Text style={_styles.liveTxt03}>
                                  관심 보낼 사람은 많은데 패스가 부족한가요?{'\n'}
                                  관심 보내기 자유 이용권을 구매하면 패스 걱정 없이 관심을 보낼 수 있어요.
                                </Text>
                              </>
                            }
                            {props.guideType == 'SHOP_PACKAGE' &&
                              <>
                                <Text style={_styles.liveTxt02}>#패키지상품</Text>
                                <Text style={_styles.liveTxt03}>
                                  나에게 필요한 아이템을 저렴한 비용으로 획득하는 방법.{'\n'}
                                  높은 할인율의 패키지 상품을 만나 보세요!
                                </Text>
                              </>
                            }
                          </SpaceView>
                        </SpaceView>
                      </SpaceView>
                    )}
                  </>
                )}


                {/* ################################################################################### 버튼 영역 */}
                <SpaceView mt={20} mb={10} viewStyle={modalStyle.guideModalBtnContainer}>
                  {props.guideType == 'STORAGE_GUIDE' ? (
                    <TouchableOpacity style={[_styles.checkRadio(true), {backgroundColor: '#FE0456', borderColor: '#FE0456'}]} onPress={() => onPressConfirm(false)}>
                      <CommonText type={'h5'} fontWeight={'200'} color={'#ffffff'}>패스 100개 받기</CommonText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[_styles.checkRadio(true)]} onPress={() => onPressConfirm(false)}>
                      <CommonText type={'h5'} fontWeight={'200'} color={'#697AE6'}>확인</CommonText>
                    </TouchableOpacity>
                  )}
                </SpaceView>

                {typeof props.guideNexBtnExpoYn != 'undefined' && props.guideNexBtnExpoYn != null && props.guideNexBtnExpoYn == 'Y' &&
                  <SpaceView mb={10} viewStyle={modalStyle.guideModalBtnContainer}>
                    <TouchableOpacity style={[ _styles.checkRadio(true) ]} onPress={() => onPressConfirm(true)}>
                      <SpaceView ml={8}>
                        <CommonText type={'h5'} fontWeight={'200'} color={'#989898'}>그만보기</CommonText>
                      </SpaceView>
                    </TouchableOpacity>
                  </SpaceView>
                }
                </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};




{/* #######################################################################################################
###########################################################################################################
##################### Style 영역
###########################################################################################################
####################################################################################################### */}

const _styles = StyleSheet.create({

  dotContainer: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 9,
    height: 9,
    backgroundColor: '#707070',
    borderRadius: 5,
    marginHorizontal: 2,
  },
  checkRadio: (isChk) => {
    return {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      backgroundColor: Color.white,
      borderRadius: 20,
      borderColor: isChk ? '#697AE6' : '#989898',
      borderWidth: 1,
      overflow: 'hidden',
    };
  },

  liveTxt01: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 19,
    color: '#000000',
  },
  liveTxt02: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    color: '#262626',
  },
  liveTxt03: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#8E8E8E',
  },

  modalBackground: (height) => {
    return {
      height,
      backgroundColor: 'rgba(0,0,0,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  guideModalArea: (height) => {
    return {
      maxHeight: height - 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 30,
      borderRadius: 15,
      overflow: 'hidden',
    };
  },
  guideScrollArea: {

  },
  guideModalStyle: {
    //width: width - 62,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    borderRadius: 15,
    overflow: 'hidden',
  },

});