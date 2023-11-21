import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Image from 'react-native-fast-image';
import { ICON } from 'utils/imageUtils';
import Carousel from 'react-native-snap-carousel';
import { useUserInfo } from 'hooks/useUserInfo';
import { CommonTextarea } from 'component/CommonTextarea';
import SpaceView from 'component/SpaceView';
import { commonStyle, styles } from 'assets/styles/Styles';
import { isEmptyData, formatNowDate } from 'utils/functions';


const { width } = Dimensions.get('window');

interface Props {
  isVisible: boolean;
  closeModal: () => void;
  confirmFunc: (level:number) => void;
  useItem: undefined;
}

export default function InterestSendPopup({ isVisible, closeModal, confirmFunc, useItem }: Props) {
  const memberBase = useUserInfo(); // 회원 기본정보
  const [message, setMessage] = React.useState(''); // 메시지
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // 자유이용권 아이템 사용 여부
  const [isFreeItemUse, setIsFreeItemUse] = React.useState(function() {
    let result = false;
    if(isEmptyData(useItem) && isEmptyData(useItem?.FREE_LIKE)) {
      let endDt = useItem?.FREE_LIKE?.end_dt;
      if(endDt > formatNowDate()) {
        result = true;
      }
    };
    return result;
  });

  return (
    <Modal isVisible={isVisible} onRequestClose={() => { closeModal(); }}>
      <SafeAreaView style={_styles.container}>

        {/* <TouchableOpacity style={_styles.closeBtnArea} onPress={() => { closeModal(); }} hitSlop={commonStyle.hipSlop20}>
          <Image style={styles.iconSquareSize(25)} source={ICON.xBlueIcon} resizeMode={'contain'} />
        </TouchableOpacity> */}

        <View style={_styles.titleBox}>
          {/* <Image style={styles.iconSquareSize(20)} source={ICON.logoTransIcon} resizeMode={'contain'} /> */}
          <Text style={_styles.titleText}>메시지 작성</Text>
          {/* <Text style={_styles.countText}>({message.length}/150)</Text> */}
        </View>
        
        <View style={_styles.contentBody}>
          <SpaceView viewStyle={_styles.messageArea}>
            <TextInput
              value={message}
              onChangeText={(message) => setMessage(message)}
              multiline={true}
              autoCapitalize="none"
              style={_styles.inputStyle}
              placeholder={'(선택)상대에게 전할 정성스러운 메시지를 작성해 보세요!'}
              placeholderTextColor={'#E1DFD1'}
              editable={true}
              secureTextEntry={false}
              maxLength={150}
              numberOfLines={4}
            />
          </SpaceView>
        </View>

        <View style={_styles.bottomBox}>
          <TouchableOpacity 
            style={[_styles.allButton, {backgroundColor: '#FFF'}]} 
            onPress={() => {
              closeModal();
            }}>    

            <Text style={_styles.allButtonText}>
              취소하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={_styles.allButton} 
            onPress={() => {
              confirmFunc(message);
            }}>    

            <Text style={_styles.allButtonText}>
              {/* {!isFreeItemUse ? '패스 15개로 ' : ''}관심 보내기 */}
              관심 보내기
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};



const _styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#3D4348',
    //borderColor: '#ededed',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleBox: {
    //borderBottomWidth: 1,
    //borderBottomColor: '#ededed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFDD00',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  titleText: {
    fontFamily: 'Pretendard-Bold',
    color: '#445561',
    //marginLeft: 5,
    //marginTop: -1,
  },
  // countText: {
  //   fontFamily: 'AppleSDGothicNeoR00',
  //   fontSize: 12,
  //   color: '#ffffff',
  //   marginLeft: 3,
  // },
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
    width: '50%',
    height: 49,
    backgroundColor: '#FFDD00',
    flexDirection: `row`,
    alignItems: `center`,
    justifyContent: `center`,
  },
  allButtonText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    color: '#3D4348',
  },
  inputStyle: {
    width: '100%',
    height: 100,
    maxHeight: 100,
    //borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#445561',
    color: '#E1DFD1',
    //borderColor: "#EBE9EF",
    fontSize: 12,
  },
  // closeBtnArea: {
  //   position: 'absolute',
  //   top: -8,
  //   right: -5,
  //   zIndex: 1,
  // },
});
