import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';
import Carousel from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';

const { width } = Dimensions.get('window');


interface Props {
  isVisible: boolean;
  closeModal: () => void;
  confirmFunc: (level:number) => void;
}

export default function SincerePopup({ isVisible, closeModal, confirmFunc }: Props) {
  const memberBase = useUserInfo(); // 회원 기본정보

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

  return (
    <Modal isVisible={isVisible}
            onRequestClose={() => {
              closeModal();
            }}>
      <SafeAreaView style={_styles.container}>
        <View style={_styles.container}>
          <View style={_styles.titleBox}>
            <Text style={_styles.titleText}>레벨 선택</Text>
          </View>
          <View style={_styles.body}>
            <Text style={_styles.infoText}>찐심을 보내는데 사용할 로얄패스를 선택해주세요.</Text>

            <View
              style={{
                width: '90%',
                flexDirection: `row`,
                alignItems: `center`,
                justifyContent: 'space-between',
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

            <View style={_styles.bottomBox}>
              <TouchableOpacity style={_styles.leftButton} onPress={() => closeModal()}>
                <Text style={_styles.leftButtonText}>취소 할래요!</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={_styles.rightButton} 
                onPress={() => {
                  if(royalPassChk()) {
                    confirmFunc(currentIndex+1);
                  }
                }}>

                {!royalPassChk() &&
                  <View style={_styles.alertArea}><Text style={_styles.alertText}>로얄패스가 부족해요.</Text></View>
                }
                <Text style={_styles.rightButtonText}>찐심 보내기</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const _styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 248,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    // borderStyle: 'solid',
    // borderWidth: 1,
    borderColor: '#ededed',
  },
  titleBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
    height: 35,
  },
  titleText: {
    fontFamily: 'AppleSDGothicNeoB00',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#676767',
  },
  body: {
    flexDirection: 'column',
    alignItems: `center`,
    justifyContent: 'space-between',
    height: 213,
  },
  infoText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#646464',
    marginTop: 25,
  },
  bottomBox: {
    width: '100%',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: 'space-between',
  },
  leftButton: {
    width: '50%',
    height: 49,
    borderBottomLeftRadius: 5,
    backgroundColor: '#d6d3d3',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  leftButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
  },
  rightButton: {
    width: '50%',
    height: 49,
    borderBottomEndRadius: 5,
    backgroundColor: '#697ae6',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  rightButtonText: {
    fontFamily: 'AppleSDGothicNeoSB00',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff',
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
    marginBottom: -15
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  passStyleText: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 11,
    color: '#82A0F4',
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
