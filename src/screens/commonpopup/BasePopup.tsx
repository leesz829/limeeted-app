import { ColorType } from '@types';
import { layoutStyle, modalStyle } from 'assets/styles/Styles';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import * as React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

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
  confirmCallbackFunc?: Function | undefined; // 확인 Callback 함수
  cancelCallbackFunc?: Function | undefined;
}

export const BasePopup = (props: Props) => {
  const onPressConfirm = () => {
    props.confirmCallbackFunc && props.confirmCallbackFunc();
    props.setPopupVIsible(false);
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
            <SpaceView mb={16} viewStyle={layoutStyle.alignCenter}>
              <CommonText fontWeight={'700'} type={'h4'}>
                {typeof props.title != 'undefined' && props.title != '' ? props.title : '알림'}
              </CommonText>
            </SpaceView>

            <SpaceView viewStyle={layoutStyle.alignCenter}>
              <CommonText type={'h5'} textStyle={layoutStyle.textCenter}>
                {typeof props.text != 'undefined' && props.text != '' ? props.text : ''}
              </CommonText>
              {/* <CommonText type={'h5'} color={ColorType.red}>패스 x5</CommonText> */}
            </SpaceView>

            <View style={modalStyle.modalBtnContainer}>
              {props.isConfirm ? (
                <>
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={onPressCancel}
                  >
                    <CommonText fontWeight={'500'}>취소</CommonText>
                  </TouchableOpacity>
                  <View style={modalStyle.modalBtnline} />
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={onPressConfirm}
                  >
                    <CommonText fontWeight={'500'} color={ColorType.red}>
                      확인
                    </CommonText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={modalStyle.modalBtn}
                    onPress={onPressConfirm}
                  >
                    <CommonText fontWeight={'500'} color={ColorType.red}>
                      확인
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
