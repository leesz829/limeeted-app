import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';
import Carousel from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommonTextarea } from 'component/CommonTextarea';
import SpaceView from 'component/SpaceView';
import { commonStyle, styles } from 'assets/styles/Styles';


const { width } = Dimensions.get('window');

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  confirmFunc: (level:number) => void;
}

export default function SincereSendPopup({ isVisible, closeModal, confirmFunc }: Props) {
  const memberBase = useUserInfo(); // 회원 기본정보
  const isFocus = useIsFocused();

  const [isLevelVisible, setIsLevelVisible] = React.useState(false);

  const [message, setMessage] = React.useState(''); // 메시지


  const ref = useRef(null);
  const onPressPrev = () => {
    ref?.current?.snapToPrev();
  };
  const onPressNext = () => {
    ref?.current?.snapToNext();
  };

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const datas = [
    {
      level: 1,
      title: 'LV.1 로얄패스 2개'
    },
    {
      level: 2,
      title: 'LV.2 로얄패스 3개'
    },
    {
      level: 3,
      title: 'LV.3 로얄패스 4개'
    },
    {
      level: 4,
      title: 'LV.4 로얄패스 9개'
    },
    {
      level: 5,
      title: 'LV.5 로얄패스 13개'
    },
  ];

  const royalPassChk = () => {
    let isChk = false;

    if((currentIndex == 0 && memberBase?.royal_pass_has_amt < 2) ||
    (currentIndex == 1 && memberBase?.royal_pass_has_amt < 3) ||
    (currentIndex == 2 && memberBase?.royal_pass_has_amt < 4) ||
    (currentIndex == 3 && memberBase?.royal_pass_has_amt < 9) ||
    (currentIndex == 4 && memberBase?.royal_pass_has_amt < 13)) {
      isChk = false;
    } else {
      isChk = true;
    }

    return isChk;
  };

  // 레벨 선택 창 열기
  const levelOpen = async () => {
    setIsLevelVisible(true);
  };

  React.useEffect(() => {
    if(isFocus) {
      setIsLevelVisible(false);
    };
  }, [isVisible]);

  return (
    <Modal isVisible={isVisible} onRequestClose={() => { closeModal(); }}>

      {!isLevelVisible ? (
        <SafeAreaView style={_styles.container}>
          <TouchableOpacity style={_styles.closeBtnArea} onPress={() => { closeModal(); }} hitSlop={commonStyle.hipSlop20}>
            <Image style={styles.iconSquareSize(25)} source={ICON.xRedIcon} resizeMode={'contain'} />
          </TouchableOpacity>

          <View style={_styles.titleBox}>
            <Image style={styles.iconSquareSize(20)} source={ICON.logoTransIcon} resizeMode={'contain'} />
            <Text style={_styles.titleText}>메시지 작성</Text>
          </View>
          
          <View style={_styles.contentBody}>

            {/* <SpaceView mt={15} mb={15} viewStyle={_styles.infoArea}>
              <Text style={_styles.infoText}>패스를 소모하여 관심을 보내시겠습니까?</Text>
              <SpaceView mt={5} viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Image style={styles.iconSquareSize(25)} source={ICON.passCircle} resizeMode={'contain'} />
                <Text style={_styles.infoSubText}>패스 15</Text>
              </SpaceView>
            </SpaceView> */}

            <SpaceView viewStyle={_styles.messageArea}>
              <TextInput
                value={message}
                onChangeText={(message) => setMessage(message)}
                multiline={true}
                autoCapitalize="none"
                style={_styles.inputStyle}
                placeholder={'(선택)상대에게 전할 정성스러운 메시지를 작성해 보세요!'}
                placeholderTextColor={'#c7c7c7'}
                editable={true}
                secureTextEntry={false}
                maxLength={200}
                numberOfLines={3}
              />
            </SpaceView>
          </View>

          <View style={_styles.bottomBox}>
            <TouchableOpacity 
              style={_styles.allButton} 
              onPress={() => {
                //confirmFunc(message);
                levelOpen();
              }}>

              <Text style={_styles.allButtonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={_styles.container}>
          <View style={_styles.titleBox}>
            <Text style={_styles.titleText}>레벨 선택</Text>
          </View>

          <View style={_styles.contentBody}>

            <SpaceView mt={15} mb={15} viewStyle={_styles.infoArea}>
              <Text style={_styles.infoText}>찐심을 보내는데 사용할 로얄패스를 선택해주세요.</Text>
            </SpaceView>

            <View
              style={{
                width: '90%',
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>

              <TouchableOpacity onPress={onPressPrev}>
                <Image source={ICON.arrLeft02} style={_styles.arrowIcon} />
              </TouchableOpacity>

              <View style={_styles.swiperWrapper}>
                <Carousel
                  ref={ref}
                  data={datas}
                  onSnapToItem={setCurrentIndex}
                  sliderWidth={width * 0.6}
                  itemWidth={width * 0.6}
                  pagingEnabled
                  renderItem={({item, index}) => {
                    return (
                      <View style={_styles.passStyle}>
                        <Image source={ICON.royalPassCircle} style={_styles.passIcon} resizeMode="contain" />
                        <Text style={_styles.passStyleText}>{item.title}</Text>
                      </View>
                    )
                  }}
                />
              </View>

              <TouchableOpacity onPress={onPressNext}>
                <Image source={ICON.arrRight02} style={_styles.arrowIcon} />
              </TouchableOpacity>

            </View>
          </View>

          <View style={_styles.bottomBox}>
            <TouchableOpacity style={_styles.leftButton} onPress={() => closeModal()}>
              <Text style={_styles.leftButtonText}>취소 할래요!</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={_styles.rightButton} 
              onPress={() => {
                if(royalPassChk()) {
                  confirmFunc(currentIndex+1, message);
                }
              }}>

              {!royalPassChk() &&
                <View style={_styles.alertArea}><Text style={_styles.alertText}>로얄패스가 부족해요.</Text></View>
              }
              <Text style={_styles.rightButtonText}>찐심 보내기</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
};



const _styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderColor: '#ededed',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    backgroundColor: '#FE0456',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoR00',
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
    marginLeft: 5,
  },
  contentBody: {
    flexDirection: 'column',
    alignItems: `center`,
  },
  infoArea: {
    flexDirection: 'column',
  },
  infoText: {
    fontFamily: 'AppleSDGothicNeoM00',
    fontSize: 13,
    textAlign: 'center',
    color: '#646464',
  },
  infoSubText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 12,
    color: '#625AD1',
    marginLeft: 1,
  },
  messageArea: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  bottomBox: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  allButton: {
    width: '100%',
    height: 49,
    backgroundColor: '#FE296F',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  allButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 16,
    color: '#ffffff',
  },
  inputStyle: {
    width: '100%',
    height: 100,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#F6F7FE',
    color: '#333333',
    borderColor: "#EBE9EF",
    fontSize: 12,
  },
  closeBtnArea: {
    position: 'absolute',
    top: -8,
    right: -5,
    zIndex: 1,
  },

  arrowIcon: {
    width: 20,
    height: 20,
  },
  swiperWrapper: {
    height: 100,
    width: '60%',
    alignItems: `center`,
    justifyContent: `center`,
  },
  passStyle: {
    flex: 1,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  passIcon: {
    width: 90,
    height: 90,
    marginBottom: -5
  },
  passStyleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: '#82A0F4',
  },
  leftButton: {
    width: '50%',
    height: 49,
    borderBottomLeftRadius: 20,
    backgroundColor: '#d6d3d3',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  leftButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  rightButton: {
    width: '50%',
    height: 49,
    borderBottomEndRadius: 20,
    backgroundColor: '#697ae6',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  rightButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  alertArea: {
    position: 'absolute',
    top: -11,
    left: 0,
    width: '100%',
    paddingHorizontal: 40,
  },
  alertText: {
    backgroundColor: '#151515',
    color: '#fff',
    fontSize: 9,
    fontFamily: 'AppleSDGothicNeoM00',
    paddingVertical: 3,
    borderRadius: 5,
    textAlign: 'center',
  },





});
