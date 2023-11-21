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
import { commonStyle, layoutStyle, styles } from 'assets/styles/Styles';
import { isEmptyData, formatNowDate } from 'utils/functions';
import LinearGradient from 'react-native-linear-gradient';


const { width } = Dimensions.get('window');

interface Props {
  popupVisible?: boolean; // popup state
  setPopupVIsible?: any; // popup setState
  isConfirm?: boolean; // confirm 여부
  title?: string; // 팝업 제목
  text?: string; // 팝업 문구
  subText?: string;
  confirmCallbackFunc?: Function | undefined; // 확인 Callback 함수
  cancelCallbackFunc?: Function | undefined;
  confirmBtnText?: string;
  cancelBtnText?: string;
  btnExpYn?: string;
  passType?: string;
  passAmt?: string;
  type?: string;
}

export const OpenProfilePopup = (props: Props) => {
  const onPressConfirm = () => {
    if(props.confirmCallbackFunc == null && typeof props.confirmCallbackFunc != 'undefined') {
      
    } else {
      props.confirmCallbackFunc && props.confirmCallbackFunc();
      props.setPopupVIsible(false);
    }
  };
  const onPressCancel = () => {
    props.cancelCallbackFunc && props.cancelCallbackFunc();
    props.setPopupVIsible(false);
  };
  const [message, setMessage] = React.useState(''); // 메시지

  return (
    <>
      <Modal isVisible={popupVisible} onRequestClose={() => { closeModal(); }}>
        <LinearGradient
          colors={['#3D4348', '#1A1E1C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={_styles.container}
        >
          <View style={_styles.titleBox}>
            <Text style={_styles.titleText}>프로필 열람</Text>
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
                maxLength={80}
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

              <Text style={_styles.allButtonText}>취소하기</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={_styles.allButton} 
              onPress={() => {
                confirmFunc(message);
              }}>    
              
              <Text style={[_styles.allButtonText, {marginTop: 5}]}>확인하기</Text>
              <SpaceView viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={ICON.polygonGreen} style={{width: 20, height: 25}} />
                  <Text style={_styles.passAmtText}>15</Text>
              </SpaceView>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </>
  );
};



const _styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    borderBottomColor: '#EDEDED',
    borderBottomWidth: 1,
  },
  titleText: {
    fontFamily: 'Pretendard-Bold',
    color: '#D5CD9E',
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
    width: '50%',
    height: 49,
    backgroundColor: '#FFDD00',
    flexDirection: `column`,
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
    borderRadius: 10,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#445561',
    color: '#E1DFD1',
    fontSize: 12,
  },
  passAmtText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    color: '#32F9E4',
    marginBottom: 2,
  }
});
