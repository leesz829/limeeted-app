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
import ToggleSwitch from 'toggle-switch-react-native';


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
  const { width, height } = Dimensions.get('window');

  const [allAgree, setAllAgree] = useState<boolean>(false);
  const [termsAgree, setTermsAgree] = useState<boolean>(false); // 이용약관
  const [privacyAgree, setPrivacyAgree] = useState<boolean>(false); // 개인정보처리방침
  const [locationAgree, setLocationAgree] = useState<boolean>(false); // 위치기반서비스
  const [mrktAgree, setMrktAgree] = useState<boolean>(false); // 마케팅 수신동의

  // 전체 동의
  const allAgreeBtn = async (value: boolean) => {
    if(value) {
      setTermsAgree(true);
      setPrivacyAgree(true);
      setLocationAgree(true);
      setMrktAgree(true);
    } else {
      setTermsAgree(false);
      setPrivacyAgree(false);
      setLocationAgree(false);
      setMrktAgree(false);
    }
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

  // toggle 활성화
  const toggleActive = async (type:string, value: boolean) => {
    if(type == 'terms') {
      terms_onOpen();
    } else if(type == 'privacy') {
      privacy_onOpen();
    } else if(type == 'location') {
      location_onOpen();
    } else if(type == 'marketing') {
      setMrktAgree(value);
    }
  };

  return (
    <>
      <CommonHeader title={'서비스 정책'} />
      <ScrollView contentContainerStyle={[styles.scrollContainerAll]} style={{backgroundColor: '#fff'}}>
        <SpaceView mb={20} viewStyle={{paddingHorizontal:16}}>
          <CommonText textStyle={_styles.title}>
            아래 서비스 정책에 동의해주세요.
          </CommonText>
          <CommonText textStyle={_styles.subTitle}>
            아래 필수 서비스 정책을 모두 동의하셔야만 이용 가능합니다.{'\n'}
            허위가입 시 민/형사상 법적 조치를 취할 수 있습니다.
          </CommonText>
        </SpaceView>

        <SpaceView mb={24} viewStyle={[_styles.container]}>
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
                callbackFn={(value: boolean) => { allAgreeBtn(value); }}
                isOn={allAgree}
                height={25} />
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
              <ToggleSwitch
                isOn={termsAgree}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => toggleActive('terms', isOn)}
                trackOffStyle={{width: 45 ,height: 25}}
              />
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
              <ToggleSwitch
                isOn={privacyAgree}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => toggleActive('privacy', isOn)}
                trackOffStyle={{width: 45 ,height: 25}}
              />
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
              <ToggleSwitch
                isOn={locationAgree}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => toggleActive('location', isOn)}
                trackOffStyle={{width: 45 ,height: 25}}
              />

              {/* <TouchableOpacity onPress={location_onOpen}>
                <CommonText type={'h6'} textStyle={commonStyle.fontSize13}>보기</CommonText>
              </TouchableOpacity> */}
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
              <ToggleSwitch
                isOn={mrktAgree}
                onColor={Color.primary}
                offColor={Color.grayDDDD}
                size="small"
                onToggle={(isOn) => toggleActive('marketing', isOn)}
                trackOffStyle={{width: 45 ,height: 25}}
              />

             {/*  <CommonSwich
                callbackFn={(value: boolean) => {
                  allAgreeBtn('MRKT', value);
                }}
                isOn={mrktAgree} /> */}
            </View>
          </SpaceView>
        </SpaceView>

        <SpaceView>
          <CommonBtn
            value={'다음'}
            type={'blue'}
            height={60}
            borderRadius={1}
            onPress={() => {
              if(!termsAgree) {
                show({
                  content: '이용약관에 동의해 주세요.' ,
                  confirmCallback: function() { }
                });
                return;
              }

              if(!privacyAgree) {
                show({
                  content: '개인정보처리방침에 동의해 주세요.' ,
                  confirmCallback: function() { }
                });
                return;
              }

              if(!locationAgree) {
                show({
                  content: '위치기반서비스 이용약관에 동의해 주세요.' ,
                  confirmCallback: function() { }
                });
                return;
              }

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
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView viewStyle={[styles.rowStyle]}>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  borderRadius={1}
                  onPress={() => {
                    setTermsAgree(false);
                    terms_onClose();
                  }}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  borderRadius={1}
                  onPress={() => {
                    setTermsAgree(true);
                    terms_onClose();
                  }}
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
              <TouchableOpacity onPress={terms_onClose} hitSlop={commonStyle.hipSlop15}>
                <Image source={ICON.xBtn2} style={styles.iconSize24} />
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
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView viewStyle={[styles.rowStyle]}>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  borderRadius={1}
                  onPress={() => {
                    setPrivacyAgree(false);
                    privacy_onClose();
                  }}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  borderRadius={1}
                  onPress={() => {
                    setPrivacyAgree(true);
                    privacy_onClose();
                  }}
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
              <TouchableOpacity onPress={privacy_onClose} hitSlop={commonStyle.hipSlop15}>
                <Image source={ICON.xBtn2} style={styles.iconSize24} />
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
        modalHeight={height - 150}
        FooterComponent={
          <>
            <SpaceView viewStyle={[styles.rowStyle]}>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'취소'}
                  type={'gray'}
                  borderRadius={1}
                  onPress={() => {
                    setLocationAgree(false);
                    location_onClose();
                  }}
                  width={195}
                />
              </View>
              <View style={[layoutStyle.flex1]}>
                <CommonBtn
                  value={'동의 후 닫기'}
                  type={'primary'}
                  borderRadius={1}
                  onPress={() => {
                    setLocationAgree(true);
                    location_onClose();
                  }}
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
                위치기반 서비스 이용약관
              </CommonText>
              <TouchableOpacity onPress={location_onClose} hitSlop={commonStyle.hipSlop15}>
                <Image source={ICON.xBtn2} style={styles.iconSize24} />
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
            <Privacy />
          </SpaceView>
        </View>
      </Modalize>

    </>
  );
};





const _styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flex: 1,
  },
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