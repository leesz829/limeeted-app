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
  passAmt?: string;
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
          <View style={modalStyle.modalStyle1}>
            <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalHeader]}>
              <CommonText fontWeight={'700'} type={'h5'} color={'#676767'}>
                {typeof props.title != 'undefined' && props.title != '' ? props.title : '알림'}
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={[layoutStyle.alignCenter, modalStyle.modalBody]}>
              <CommonText type={'h6'} textStyle={layoutStyle.textCenter} color={'#646464'}>
                {typeof props.text != 'undefined' && props.text != '' ? props.text : ''}
              </CommonText>

              {typeof props.subText != 'undefined' && props.subText != '' &&
                <CommonText type={'h6'} textStyle={layoutStyle.textCenter} color={'#9c89e5'} fontWeight={'700'}>
                  {props.subText}
                </CommonText>
              }

              {isEmptyData(props.passAmt) && (
                <SpaceView mt={5} viewStyle={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Image style={styles.iconSquareSize(25)} source={ICON.passCircle} resizeMode={'contain'} />
                  <Text style={_styles.openPopupDescIcon}>{!props.passAmt ? 'X 15' : 'X ' + props.passAmt}</Text>
                </SpaceView>
              )}

              {/* <CommonText type={'h5'} color={ColorType.red}>패스 x{props.passAmt}</CommonText> */}
            </SpaceView>

            {(!isEmptyData(props.btnExpYn) || props.btnExpYn == 'Y') &&
              <View style={modalStyle.modalBtnContainer}>
                {props.isConfirm ? (
                  <>
                    <TouchableOpacity
                      style={[modalStyle.modalBtn, {backgroundColor: Color.grayD6D3D3, borderBottomLeftRadius: 20}]}
                      onPress={onPressCancel}>
                      <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
                        {typeof props.cancelBtnText != 'undefined' ? props.cancelBtnText : '닫기'}
                      </CommonText>
                    </TouchableOpacity>

                    <View style={modalStyle.modalBtnline} />

                    <TouchableOpacity
                      style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomRightRadius: 20}]}
                      onPress={onPressConfirm}>
                      <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
                        {typeof props.confirmBtnText != 'undefined' ? props.confirmBtnText : '확인하기'}
                      </CommonText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}]}
                      onPress={onPressConfirm}>
                      <CommonText type={'h5'} fontWeight={'500'} color={Color.white}>
                        {typeof props.confirmBtnText != 'undefined' ? props.confirmBtnText : '확인'}
                      </CommonText>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            }

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
  openPopupDescIcon: {
    fontFamily: 'AppleSDGothicNeoEB00',
    fontSize: 16,
    color: '#697AE6',
    marginLeft: 3,
  },
});