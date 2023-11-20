import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { layoutStyle, modalStyle, styles } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { isEmptyData } from 'utils/functions';
import { ICON, IMAGE } from 'utils/imageUtils';
import LinearGradient from 'react-native-linear-gradient';

/* ################################################################################################################
###################################################################################################################
###### 기본 팝업 UI Component
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
  cancelCallbackFunc?: Function | undefined;
  confirmBtnText?: string;
  cancelBtnText?: string;
  btnExpYn?: string;
  passType?: string;
  passAmt?: string;
  type?: string;
}

export const BasePopup = (props: Props) => {
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

  return (
    <>
      <Modal visible={props.popupVisible} transparent={true}>
        <View style={modalStyle.modalBackground}>
          <View style={[modalStyle.modalStyle1, {overflow: 'hidden'}]}>
            <LinearGradient
            colors={['#1A1E1C', '#333B41']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }} >
              {props.type != 'AUCTION' ? 
                <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalHeader]}>
                  <CommonText fontWeight={'600'} type={'h5'} color={'#D5CD9E'}>
                    {typeof props.title != 'undefined' && props.title != '' ? props.title : '알림'}
                  </CommonText>
                </SpaceView>
                :
                <TouchableOpacity>
                  <SpaceView pr={20} mt={20} viewStyle={[layoutStyle.alignEnd]}>
                    <Image source={ICON.closeBlack} style={styles.iconSize18} />
                  </SpaceView>
                </TouchableOpacity>
              }

              <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalBody]}>
                {props.type == 'REPORT' &&
                  <Image source={ICON.sirenMark} style={[styles.iconSize60, {marginBottom: 15}]} />
                }

                {props.type == 'AUCTION' &&
                  <Image source={ICON.hifive} style={[styles.iconSize60, {marginBottom: 15}]} />
                }

                <CommonText type={'h6'} fontWeight='500' textStyle={layoutStyle.textCenter} color={'#D5CD9E'}>
                  {typeof props.text != 'undefined' && props.text != '' ? props.text : ''}
                </CommonText>

                {typeof props.subText != 'undefined' && props.subText != '' &&
                  <CommonText type={'h6'} textStyle={layoutStyle.textCenter} color={'#9c89e5'} fontWeight={'700'}>
                    {props.subText}
                  </CommonText>
                }

                {isEmptyData(props.passAmt) && (
                  <SpaceView mt={5} viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={styles.iconSquareSize(25)} source={isEmptyData(props.passType) && props.passType == 'ROYAL' ? ICON.royalPassCircle : ICON.passCircle} resizeMode={'contain'} />
                    <Text style={_styles.openPopupDescIcon(props.passType)}>{!props.passAmt ? 'X 15' : 'X ' + props.passAmt}</Text>
                  </SpaceView>
                )}

                {/* <CommonText type={'h5'} color={ColorType.red}>패스 x{props.passAmt}</CommonText> */}
              </SpaceView>

              {(!isEmptyData(props.btnExpYn) || props.btnExpYn == 'Y') &&
                <View style={modalStyle.modalBtnContainer}>
                  {props.isConfirm ? (
                    <>
                      <TouchableOpacity
                        style={[modalStyle.modalBtn, {backgroundColor: '#FFF', borderBottomLeftRadius: 20}]}
                        onPress={onPressCancel}>
                        <CommonText fontWeight={'500'} color={'#3D4348'} textStyle={{fontSize: 16}}>
                          {typeof props.cancelBtnText != 'undefined' ? props.cancelBtnText : '닫기'}
                        </CommonText>
                      </TouchableOpacity>

                      {/* <View style={modalStyle.modalBtnline} /> */}

                      <TouchableOpacity
                        style={[modalStyle.modalBtn, {backgroundColor: '#FFDD00', borderBottomRightRadius: 20}]}
                        onPress={onPressConfirm}>
                        <CommonText fontWeight={'500'} color={'#3D4348'} textStyle={{fontSize: 16}}>
                          {typeof props.confirmBtnText != 'undefined' ? props.confirmBtnText : '확인하기'}
                        </CommonText>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* <TouchableOpacity
                        style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}]}
                        onPress={onPressConfirm}>
                        <CommonText type={'h5'} fontWeight={'500'} color={Color.white}>
                          {typeof props.confirmBtnText != 'undefined' ? props.confirmBtnText : '확인'}
                        </CommonText>
                      </TouchableOpacity> */}
                      {/* 리뉴얼 */}
                      <TouchableOpacity
                        style={[modalStyle.modalBtn, {backgroundColor: '#FFDD00', borderBottomLeftRadius: 20, borderBottomRightRadius: 20}]}
                        onPress={onPressConfirm}>
                        <CommonText fontWeight={'600'} textStyle={{fontSize: 16, color: '#3D4348'}}>
                          {typeof props.confirmBtnText != 'undefined' ? props.confirmBtnText : '확인'}
                        </CommonText>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              }
            </LinearGradient>
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
  openPopupDescIcon: (passType: string) => {
    return {
      fontFamily: 'AppleSDGothicNeoEB00',
      fontSize: 16,
      color: passType == 'ROYAL' ? '#FE0456' : '#697AE6',
      marginLeft: 3,
    };
  },
});