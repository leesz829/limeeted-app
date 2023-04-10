import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { ColorType, ScreenNavigationProp, StackParamList } from '@types';
import { Color } from 'assets/styles/Color';
import { layoutStyle, styles, modalStyle, commonStyle } from 'assets/styles/Styles';
import axios from 'axios';
import { CommonBtn } from 'component/CommonBtn';
import CommonHeader from 'component/CommonHeader';
import { CommonInput } from 'component/CommonInput';
import { CommonText } from 'component/CommonText';
import SpaceView from 'component/SpaceView';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { ICON } from 'utils/imageUtils';
import * as properties from 'utils/properties';
import { usePopup } from 'Context';
import { color } from 'react-native-reanimated';
import { CommonSwich } from 'component/CommonSwich';
import { Modalize } from 'react-native-modalize';
import { Terms } from 'screens/commonpopup/terms';
import { Privacy } from 'screens/commonpopup/privacy';
import { LocationService } from 'screens/commonpopup/locationService';


/* ################################################################################################################
###### 서비스 정책 화면
################################################################################################################### */
interface Props {
  navigation: StackNavigationProp<StackParamList, 'Policy'>;
  route: RouteProp<StackParamList, 'Policy'>;
}

export const Policy = (props: Props) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const { show } = usePopup();  // 공통 팝업

  const [allAgree, setAllAgree] = useState<boolean>(false);
  const [mrktAgree, setMrktAgree] = useState<boolean>(false);

  // 전체 동의
  const allAgreeBtn = async (type: string, value: boolean) => {
    console.log('value :::: ', value);

    /* if(type === 'ALL') {
      setAllAgree(value);
      setMrktAgree(value);
    } else if(type === 'MRKT') {
      setMrktAgree(value);
    } */
  };
  

  
  // 이용약관 팝업
  const terms_modalizeRef = useRef<Modalize>(null);
  const terms_onOpen = () => {
    terms_modalizeRef.current?.open();
  };
  const terms_onClose = () => {
    terms_modalizeRef.current?.close();
  };

  // 개인정보 취급방침 팝업
  const privacy_modalizeRef = useRef<Modalize>(null);
  const privacy_onOpen = () => {
    privacy_modalizeRef.current?.open();
  };
  const privacy_onClose = () => {
    privacy_modalizeRef.current?.close();
  };

  // 위치기반 서비스 이용약관 팝업
  const location_modalizeRef = useRef<Modalize>(null);
  const location_onOpen = () => {
    location_modalizeRef.current?.open();
  };
  const location_onClose = () => {
    location_modalizeRef.current?.close();
  };



  const { width, height } = Dimensions.get('window');

  return (
    <>
      <CommonHeader title={'서비스 정책'} />
      <ScrollView contentContainerStyle={[styles.scrollContainer]}>
        <SpaceView mb={20}>
          <CommonText textStyle={_styles.title}>
            아래 서비스 정책에 동의해주세요.
          </CommonText>
          <CommonText textStyle={_styles.subTitle}>
            아래 필수 서비스 정책을 모두 동의하셔야만 이용 가능합니다.{'\n'}
            허위가입 시 민/형사상 법적 조치를 취할 수 있습니다.
          </CommonText>
        </SpaceView>

        <SpaceView mb={24} viewStyle={styles.container}>
          <SpaceView viewStyle={layoutStyle.rowBetween} mb={30}>
            <View>
              <CommonText fontWeight={'700'} type={'h4'}>
                서비스 정책
              </CommonText>
            </View>
            <View style={[layoutStyle.rowBetween]}>
              <CommonText textStyle={_styles.agreeText}>
                전체동의  
              </CommonText>
              <CommonSwich
                callbackFn={(value: boolean) => { allAgreeBtn('ALL', value); }}
                isOn={allAgree} />
            </View>
          </SpaceView>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
            <View style={[layoutStyle.rowBetween]}>
              <View style={[styles.statusBtn, commonStyle.mr8]}>
                <CommonText type={'h6'} color={ColorType.white}>동의</CommonText>
              </View>
              <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>(필수)이용약관</CommonText>
            </View>
            <View style={[layoutStyle.rowBetween]}>
              <TouchableOpacity onPress={terms_onOpen}>
                <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>보기</CommonText>
              </TouchableOpacity>
            </View>
          </SpaceView>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
            <View style={[layoutStyle.rowBetween]}>
              <View style={[styles.statusBtn, commonStyle.mr8]}>
                <CommonText type={'h6'} color={ColorType.white}>동의</CommonText>
              </View>
              <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>(필수)개인정보처리방침</CommonText>
            </View>
            <View style={[layoutStyle.rowBetween]}>
              <TouchableOpacity onPress={privacy_onOpen}>
                <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>보기</CommonText>
              </TouchableOpacity>
            </View>
          </SpaceView>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
            <View style={[layoutStyle.rowBetween]}>
              <View style={[styles.statusBtn, commonStyle.mr8]}>
                <CommonText type={'h6'} color={ColorType.white}>동의</CommonText>
              </View>
              <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>(필수)위치기반서비스 이용약관</CommonText>
            </View>
            <View style={[layoutStyle.rowBetween]}>
              <TouchableOpacity onPress={location_onOpen}>
                <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>보기</CommonText>
              </TouchableOpacity>
            </View>
          </SpaceView>

          <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
            <View style={[layoutStyle.rowBetween]}>
              <View style={[styles.statusBtn, commonStyle.mr8]}>
                <CommonText type={'h6'} color={ColorType.white}>동의</CommonText>
              </View>
              <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>(선택)마케팅 수신동의</CommonText>
            </View>
            <View style={[layoutStyle.rowBetween]}>
              <CommonSwich
                callbackFn={(value: boolean) => {
                  allAgreeBtn('MRKT', value);
                }}
                isOn={mrktAgree} />
            </View>
          </SpaceView>
        </SpaceView>

        <SpaceView mb={24}>
          <CommonBtn
            value={'다음'}
            type={'primary'}
            onPress={() => {
              navigation.navigate({
                name : 'NiceAuth',
                params : {
                  type : 'JOIN'
                }
              });
            }}
          />
        </SpaceView>

      </ScrollView>



      {/* ###############################################
                    이용약관 팝업
      ############################################### */}
      <Modalize
        ref={terms_modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        adjustToContentHeight={false}
        FooterComponent={
          <>
            <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  onPress={terms_onClose}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  onPress={terms_onClose}
                  width={195}
                />
              </View>
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h3'}>
                (필수)이용약관
              </CommonText>
              <TouchableOpacity onPress={terms_onClose}>
                <Image source={ICON.xBtn} style={styles.iconSize24} />
              </TouchableOpacity>
            </View>
          </>
        }
      >
        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          <SpaceView
            mb={24}
            viewStyle={{ width: width - 32, backgroundColor: Color.grayF8F8 }}
          >
            <Terms />
          </SpaceView>
        </View>
      </Modalize>

      {/* ###############################################
                     개인정보 취급방침 팝업
         ############################################### */}
      <Modalize
        ref={privacy_modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        adjustToContentHeight={false}
        FooterComponent={
          <>
            <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  onPress={privacy_onClose}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  onPress={privacy_onClose}
                  width={195}
                />
              </View>
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h3'}>
                개인정보 취급방침
              </CommonText>
              <TouchableOpacity onPress={privacy_onClose}>
                <Image source={ICON.xBtn} style={styles.iconSize24} />
              </TouchableOpacity>
            </View>
          </>
        }
      >
        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {/* <SpaceView mb={24}>
						<CommonDatePicker />
					</SpaceView> */}

          <SpaceView
            mb={24}
            viewStyle={{ width: width - 32, backgroundColor: Color.grayF8F8 }}
          >
            <Privacy />
          </SpaceView>
        </View>
      </Modalize>

      {/* ###############################################
                     위치기반 서비스 이용약관 팝업
         ############################################### */}
      <Modalize
        ref={location_modalizeRef}
        handleStyle={modalStyle.modalHandleStyle}
        modalStyle={modalStyle.modalContainer}
        adjustToContentHeight={false}
        FooterComponent={
          <>
            <SpaceView viewStyle={layoutStyle.rowBetween} mb={16}>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  onPress={location_onClose}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.rowBetween]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  onPress={location_onClose}
                  width={195}
                />
              </View>
            </SpaceView>
          </>
        }
        HeaderComponent={
          <>
            <View style={modalStyle.modalHeaderContainer}>
              <CommonText fontWeight={'700'} type={'h3'}>
                개인정보 취급방침
              </CommonText>
              <TouchableOpacity onPress={location_onClose}>
                <Image source={ICON.xBtn} style={styles.iconSize24} />
              </TouchableOpacity>
            </View>
          </>
        }
      >
        <View style={[modalStyle.modalBody, layoutStyle.flex1]}>
          {/* <SpaceView mb={24}>
						<CommonDatePicker />
					</SpaceView> */}

          <SpaceView
            mb={24}
            viewStyle={{ width: width - 32, backgroundColor: Color.grayF8F8 }}
          >
            <Privacy />
          </SpaceView>
        </View>
      </Modalize>

    </>
  );
};







const _styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginBottom: 15
  },
  subTitle: {
    fontSize: 14,
    color: 'gray',
    lineHeight: 20
  },
  agreeText: {
    marginRight: 10
  },
});