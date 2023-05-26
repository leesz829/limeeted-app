import { ColorType } from '@types';
import { Color } from 'assets/styles/Color';
import { layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { color } from 'react-native-reanimated';

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
  cancelBtnText?: string;
  cancelConfirmText?: string;
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
              
              {/* <CommonText type={'h5'} color={ColorType.red}>패스 x5</CommonText> */}
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              {props.isConfirm ? (
                <>
                  <TouchableOpacity
                    style={[modalStyle.modalBtn, {backgroundColor: Color.grayD6D3D3, borderBottomLeftRadius: 5}]}
                    onPress={onPressCancel}>
                    <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
                      {typeof props.cancelBtnText != 'undefined' ? props.cancelBtnText : '취소 할래요!'}
                    </CommonText>
                  </TouchableOpacity>

                  <View style={modalStyle.modalBtnline} />

                  <TouchableOpacity
                    style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomRightRadius: 5}]}
                    onPress={onPressConfirm}>
                    <CommonText type={'h5'} fontWeight={'500'} color={ColorType.white}>
                      {typeof props.cancelConfirmText != 'undefined' ? props.cancelConfirmText : '확인하기'}
                    </CommonText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[modalStyle.modalBtn, {backgroundColor: Color.blue02, borderBottomLeftRadius: 5, borderBottomRightRadius: 5}]}
                    onPress={onPressConfirm}>
                    <CommonText type={'h5'} fontWeight={'500'} color={Color.white}>
                      {typeof props.cancelConfirmText != 'undefined' ? props.cancelConfirmText : '확인'}
                    </CommonText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
