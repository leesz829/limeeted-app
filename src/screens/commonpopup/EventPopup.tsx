import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { commonStyle, layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, ScrollView, Dimensions, Animated, StyleSheet } from 'react-native';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import LinearGradient from 'react-native-linear-gradient';
import { IMAGE, PROFILE_IMAGE, findSourcePath } from 'utils/imageUtils';


/* ################################################################################################################
###################################################################################################################
###### Event 팝업 Component
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
  eventType?: string;
  eventPopupList?: any;
  etcCallbackFunc?: Function | undefined;
}

const { width, height } = Dimensions.get('window');

export const EventPopup = (props: Props) => {
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

  const onPressEtc = (pop_bas_seq:number, sub_img_path:string, index:number) => {
    props.etcCallbackFunc(pop_bas_seq, sub_img_path, index);
    props.setPopupVIsible(false);
  }

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
        <View style={modalStyle.modalBackground}>

          {props.eventType == 'EVENT' ? (
            <>
              {/* #########################################################################################################
              ##### 이벤트 팝업 영역
              ######################################################################################################### */}
              <View style={_styles.popupContainer()}>

                {/* <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalHeader]}>
                  <Image source={IMAGE.popupLogo} style={{width: 94, height: 19}} />
                </SpaceView> */}

                <Carousel
                  ref={ref}
                  data={props.eventPopupList}
                  firstItem={pageIndex}
                  onSnapToItem={setCurrentIndex}
                  sliderWidth={width-45}
                  itemWidth={width-45}
                  /* inactiveSlideScale={10}
                  inactiveSlideOpacity={0.5} */
                  inactiveSlideShift={10}
                  pagingEnabled
                  renderItem={({item, index}) => {
                    return (
                      <>
                        <View key={index}>
                          <SpaceView viewStyle={_styles.eventContent}>

                            <TouchableOpacity 
                              activeOpacity={0.8} 
                              onPress={() => onPressEtc(item?.pop_bas_seq, item?.sub_img_path, index)}>

                              {/* 로고 영역 */}
                              {/* <SpaceView viewStyle={_styles.logoArea}>
                                <Image source={IMAGE.popupLogo} style={{width: 94, height: 19}} />
                              </SpaceView> */}

                              {/* 상세보기 버튼 영역 */}
                              <View style={_styles.detailBtn}>
                                <Text style={_styles.detailBtnText}>상세보기</Text>
                              </View>

                              {/* 이미지 영역 */}
                              <View style={{minHeight: 200, overflow: 'hidden'}}>
                                <Image source={findSourcePath(item?.main_img_path)} style={{width: width - 45, height: 200}} resizeMode={'cover'} />
                              </View>

                              {/* 텍스트 영역 */}
                              <SpaceView viewStyle={_styles.eventTextArea}>
                                <View style={{paddingHorizontal: 10, paddingVertical: 10, zIndex: 1}}>
                                  <Text style={_styles.eventSubText}>{item?.sub_title}</Text>
                                  <Text style={_styles.eventDescText}>{item?.contents}</Text>
                                </View>

                                <LinearGradient
                                  colors={['transparent', '#000000']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 0, y: 1 }}
                                  style={_styles.eventThumnailArea} />

                              </SpaceView>

                            </TouchableOpacity>
                          </SpaceView>
                        </View>
                      </>
                    )
                  }}
                />

                <SpaceView viewStyle={_styles.dotContainer}>
                  {props.eventPopupList.map((item, index) => (
                    <>
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
                    </>
                  ))}
                </SpaceView>

                <SpaceView mt={15} mb={12} viewStyle={_styles.eventBtnArea}>
                  <TouchableOpacity onPress={() => onPressConfirm(false)} style={{marginBottom: 5}}>
                    <LinearGradient 
                      colors={['#9283A4', '#829BCE']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={_styles.eventConfirmBtn}>
                      
                      <Text style={_styles.eventConfirmText}>확인</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onPressConfirm(true)} style={_styles.eventPassBtn}>
                    <Text style={_styles.eventPassText}>오늘은 그만보기</Text>
                  </TouchableOpacity>
                </SpaceView>
              </View>
            </>

          ) : props.eventType == 'NOTICE' ? (
            <>
              {/* #########################################################################################################
              ##### 공지 팝업 영역
              ######################################################################################################### */}
              <View>

              </View>
            
            </>
          
          ) : props.eventType == 'PROMOTION' ? (
            <>
              {/* #########################################################################################################
              ##### 프로모션 팝업 영역
              ######################################################################################################### */}
              <View>

              </View>        
            </>
          ) : null}

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
    width: 8,
    height: 8,
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
  scrollViewArea: (height) => {
    return {
      maxHeight: height - 70, 
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
    };
  },






  popupContainer: () => {
    return {
      width: width - 45,
      backgroundColor: 'white',
      borderRadius: 15,
      paddingHorizontal: 0,
      overflow: 'hidden',
    }
  },
  eventTitText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 22,
    color: '#9283A4'
  },
  eventContent: {
    backgroundColor: '#fff',
    //borderRadius: 20,
    //paddingVertical: 15,
    //marginLeft: 4,
    //marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.23,
    shadowRadius: 3,
    elevation: 6,
    //overflow: 'visible',
  },
  detailBtn: {
    position: 'absolute',
    bottom: 10,
    right: 7,
    backgroundColor: '#9F71B2',
    zIndex: 2,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  detailBtnText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 10,
    color: '#fff'
  },
  eventBtnArea: {
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  eventConfirmBtn: {
    paddingVertical: 5,
    borderRadius: 6,
  },
  eventConfirmText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  eventPassBtn: {
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#BBB1C6',
    borderStyle: 'dotted',
    borderRadius: 6,
  },
  eventPassText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#BBB1C6',
    textAlign: 'center',
  },
  logoArea: {
    position: 'absolute',
    top: 7,
    left: 7,
    zIndex: 1,
  },
  eventTextArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  eventSubText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 16,
    //color: '#BEC4FF',
    color: '#fff',
  },
  eventDescText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  eventThumnailArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    height: 70,
  },

});